/**
 * export-web-print.jsx
 *
 * Exports two PDF versions of the active document in one go:
 *   - Web  (_w.pdf) — optimized for screen and client delivery
 *   - Print (_m.pdf) — high-res, suitable for print and mockup placements
 *
 * Both files are saved into a "PDFs" subfolder next to the source document,
 * named after the original file (e.g. "brochure_w.pdf", "brochure_m.pdf").
 *
 * Requires two PDF export presets defined in InDesign named "w" and "m".
 */
// Define export presets
var presetName1 = "w";
var presetName2 = "m";

// Function to handle individual PDF exports
function exportWithPreset(presetName, preset) {
    if (preset.isValid) {
        // Get the InDesign document's original name
        var originalFilename = app.activeDocument.name.replace(/\.[^.]+$/, '');

        // Get the path of the original InDesign file
        var originalFilePath = app.activeDocument.filePath;

        // Create the "PDFs" subfolder if it doesn't exist
        var pdfFolder = new Folder(originalFilePath + "/PDFs");
        if (!pdfFolder.exists) {
            pdfFolder.create();
        }

        // Construct the export filename
        var exportFilename = originalFilename + "_" + presetName + ".pdf";

        // Construct the full export path inside the "PDFs" folder
        var exportPath = new File(pdfFolder + "/" + exportFilename);

        // Export the document
        app.activeDocument.exportFile(ExportFormat.PDF_TYPE, exportPath, false, preset);

        alert("PDF exported successfully: " + exportFilename);
    } else {
        alert("PDF export preset '" + presetName + "' not found.");
    }
}

// Get PDF export presets
var preset1 = app.pdfExportPresets.itemByName(presetName1);
var preset2 = app.pdfExportPresets.itemByName(presetName2);

// Export using the defined presets
exportWithPreset(presetName1, preset1);
exportWithPreset(presetName2, preset2);