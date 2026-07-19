/**
 * save-version.jsx
 *
 * Freezes the current state of the active document as the next numbered
 * version, in one action:
 *   1. Saves the document.
 *   2. Copies it to "Versionen/<name>-vNN.indd" (next free number, e.g. v03).
 *   3. Exports "PDFs/<name>-vNN.pdf" with a selectable PDF export preset
 *      ("Web" preselected if it exists — same presets as export-web-print.jsx).
 *
 * Expects the standard project structure (see SOP "Projektordner anlegen"):
 * the working document lives in the project root and is named after the
 * project number (e.g. 0001-26001.indd); "Versionen" and "PDFs" sit next to
 * it and are created automatically if missing.
 *
 * The working document itself is never renamed — it stays the file you keep
 * working in. Choosing "No PDF" in the preset dialog saves the version
 * snapshot without exporting.
 */

(function () {
    if (app.documents.length === 0) {
        alert("No document open.");
        return;
    }

    var doc = app.activeDocument;

    if (!doc.saved) {
        alert("Save the document into the project root first, then run this script.");
        return;
    }

    var rootFolder = doc.filePath;
    if (decodeURI(rootFolder.name) === "Versionen") {
        alert("This document is a version snapshot inside \"Versionen\".\n" +
              "Snapshots are never edited or re-versioned — open the working file in the project root instead.");
        return;
    }

    var baseName = decodeURI(doc.name).replace(/\.[^.]+$/, "");
    if (!/^\d{4}-\d{3,5}$/.test(baseName)) {
        if (!confirm("\"" + decodeURI(doc.name) + "\" does not look like a project-number filename " +
                     "(expected e.g. 0001-26001.indd).\nSave a version anyway?")) {
            return;
        }
    }

    if (doc.modified) {
        doc.save();
    }

    var versionFolder = new Folder(rootFolder + "/Versionen");
    if (!versionFolder.exists) {
        versionFolder.create();
    }

    // Find the highest existing version number for this document
    var pattern = new RegExp("^" + baseName + "-v(\\d+)\\.indd$", "i");
    var existing = versionFolder.getFiles("*.indd");
    var highest = 0;
    for (var i = 0; i < existing.length; i++) {
        var match = decodeURI(existing[i].name).match(pattern);
        if (match) {
            var num = parseInt(match[1], 10);
            if (num > highest) {
                highest = num;
            }
        }
    }

    var next = highest + 1;
    var label = "v" + (next < 10 ? "0" + next : next);

    var snapshot = new File(versionFolder + "/" + baseName + "-" + label + ".indd");
    if (snapshot.exists) {
        alert(snapshot.displayName + " already exists — aborting.");
        return;
    }
    if (!File(doc.fullName).copy(snapshot)) {
        alert("Could not copy the document to " + snapshot.displayName + ".");
        return;
    }

    var presetName = choosePreset(label);
    var summary = "Version " + label + " saved:\n\nVersionen/" + baseName + "-" + label + ".indd";

    if (presetName !== null) {
        var preset = app.pdfExportPresets.itemByName(presetName);
        var pdfFolder = new Folder(rootFolder + "/PDFs");
        if (!pdfFolder.exists) {
            pdfFolder.create();
        }
        var pdfFile = new File(pdfFolder + "/" + baseName + "-" + label + ".pdf");
        doc.exportFile(ExportFormat.PDF_TYPE, pdfFile, false, preset);
        summary += "\nPDFs/" + baseName + "-" + label + ".pdf  (" + presetName + ")";
    } else {
        summary += "\n\nNo PDF exported.";
    }

    alert(summary);

    // Dropdown of all PDF export presets, "Web" preselected if present
    // (matched case-insensitively). Returns the chosen preset name, or
    // null for "No PDF".
    function choosePreset(versionLabel) {
        var names = [];
        for (var p = 0; p < app.pdfExportPresets.length; p++) {
            names.push(app.pdfExportPresets[p].name);
        }
        if (names.length === 0) {
            return null;
        }

        var dlg = new Window("dialog", "Save Version " + versionLabel);
        dlg.orientation = "column";
        dlg.alignChildren = "fill";
        dlg.add("statictext", undefined, "Export PDF with preset:");
        var dropdown = dlg.add("dropdownlist", undefined, names);
        var preselect = 0;
        for (var n = 0; n < names.length; n++) {
            if (names[n].toLowerCase() === "web") {
                preselect = n;
            }
        }
        dropdown.selection = preselect;
        var buttons = dlg.add("group");
        buttons.alignment = "right";
        buttons.add("button", undefined, "No PDF", { name: "cancel" });
        buttons.add("button", undefined, "Export", { name: "ok" });

        if (dlg.show() !== 1) {
            return null;
        }
        return dropdown.selection.text;
    }
})();
