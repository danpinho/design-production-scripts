// Batch export all .indd files in a chosen folder to PDF
// Run from InDesign: Window > Utilities > Scripts, double-click this file

var defaultFolder = Folder.desktop;

// Ask user to select a folder, defaulting to the Desktop
var sourceFolder = Folder.selectDialog(
  "Select folder containing .indd files",
  defaultFolder,
);

if (sourceFolder === null) {
  // User cancelled
} else {
  var pdfFolder = Folder(sourceFolder + "/PDF");
  if (!pdfFolder.exists) pdfFolder.create();

  var inddFiles = sourceFolder.getFiles("*.indd");

  if (inddFiles.length === 0) {
    alert("No .indd files found in:\n" + sourceFolder.fsName);
  } else {
    var pdfPreset = app.pdfExportPresets.item("[High Quality Print]"); // change preset if needed

    var errors = [];
    for (var i = 0; i < inddFiles.length; i++) {
      var inddFile = inddFiles[i];
      var doc;
      try {
        doc = app.open(inddFile, false);
        var pdfFile = File(
          pdfFolder + "/" + inddFile.name.replace(/\.indd$/i, ".pdf"),
        );
        doc.exportFile(ExportFormat.PDF_TYPE, pdfFile, false, pdfPreset);
        doc.close(SaveOptions.NO);
      } catch (e) {
        errors.push(inddFile.name + ": " + e.message);
        if (doc && doc.isValid) doc.close(SaveOptions.NO);
      }
    }

    var msg =
      "Exported " +
      (inddFiles.length - errors.length) +
      "/" +
      inddFiles.length +
      " files to:\n" +
      pdfFolder.fsName;
    if (errors.length > 0) msg += "\n\nErrors:\n" + errors.join("\n");
    alert(msg);
  }
}
