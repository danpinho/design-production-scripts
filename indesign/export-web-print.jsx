/**
 * export-web-print.jsx
 *
 * Exports two PDF versions of the active document in one go:
 *   - Web  (-web.pdf) — optimized for screen and client delivery
 *   - Print (-print.pdf) — high-res, suitable for print and mockup placements
 *
 * Both files are saved into the "PDFs" subfolder next to the source document
 * (standard project structure — see SOP "Projektordner anlegen"), created
 * automatically if it doesn't exist.
 *
 * Requires two PDF export presets defined in InDesign named "Web" and "Print"
 * (matched case-insensitively). The filename suffix is always lowercase.
 */
var presetWeb = "Web";
var presetPrint = "Print";

function findPreset(presetName) {
    for (var i = 0; i < app.pdfExportPresets.length; i++) {
        if (app.pdfExportPresets[i].name.toLowerCase() === presetName.toLowerCase()) {
            return app.pdfExportPresets[i];
        }
    }
    return null;
}

function exportWithPreset(presetName) {
    var preset = findPreset(presetName);
    if (preset !== null) {
        var originalFilename = app.activeDocument.name.replace(/\.[^.]+$/, '');
        var originalFilePath = app.activeDocument.filePath;

        var exportFolder = new Folder(originalFilePath + "/PDFs");
        if (!exportFolder.exists) {
            exportFolder.create();
        }

        var exportFilename = originalFilename + "-" + presetName.toLowerCase() + ".pdf";
        var exportPath = new File(exportFolder + "/" + exportFilename);

        app.activeDocument.exportFile(ExportFormat.PDF_TYPE, exportPath, false, preset);

        alert("PDF exported: " + exportFilename);
    } else {
        alert("PDF export preset '" + presetName + "' not found.");
    }
}

exportWithPreset(presetWeb);
exportWithPreset(presetPrint);
