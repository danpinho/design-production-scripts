/**
 * export-web-print.jsx
 *
 * Exports two PDF versions of the active document in one go:
 *   - Web  (-web.pdf) — optimized for screen and client delivery
 *   - Print (-print.pdf) — high-res, suitable for print and mockup placements
 *
 * Both files are saved into a "30 Export" subfolder next to the source document
 * (JD Template D layout structure), created automatically if it doesn't exist.
 *
 * Requires two PDF export presets defined in InDesign named "web" and "print".
 */
var presetWeb = "web";
var presetPrint = "print";

function exportWithPreset(presetName, preset) {
    if (preset.isValid) {
        var originalFilename = app.activeDocument.name.replace(/\.[^.]+$/, '');
        var originalFilePath = app.activeDocument.filePath;

        var exportFolder = new Folder(originalFilePath + "/30 Export");
        if (!exportFolder.exists) {
            exportFolder.create();
        }

        var exportFilename = originalFilename + "-" + presetName + ".pdf";
        var exportPath = new File(exportFolder + "/" + exportFilename);

        app.activeDocument.exportFile(ExportFormat.PDF_TYPE, exportPath, false, preset);

        alert("PDF exported: " + exportFilename);
    } else {
        alert("PDF export preset '" + presetName + "' not found.");
    }
}

var preset1 = app.pdfExportPresets.itemByName(presetWeb);
var preset2 = app.pdfExportPresets.itemByName(presetPrint);

exportWithPreset(presetWeb, preset1);
exportWithPreset(presetPrint, preset2);
