// Batch export all .indd files in a chosen folder to Interactive PDF
// Run from InDesign: Window > Utilities > Scripts, double-click this file

var sourceFolder = Folder.selectDialog(
  "Select folder containing .indd files",
  Folder.desktop
);

if (sourceFolder !== null) {
  var inddFiles = sourceFolder.getFiles("*.indd");

  if (inddFiles.length === 0) {
    alert("No .indd files found in:\n" + sourceFolder.fsName);
  } else {
    var pdfFolder = Folder(sourceFolder + "/PDF_Interactive");
    if (!pdfFolder.exists) pdfFolder.create();

    var prefs = app.interactivePDFExportPreferences;
    prefs.pageRange            = PageRange.ALL_PAGES;
    prefs.generateThumbnails   = false;
    prefs.openInFullScreen     = false;
    // prefs.pageTransitionOverride = PageTransitionOverrideOptions.USE_DOCUMENT_SETTINGS;
    // prefs.includeStructure = true;  // tagged PDF / accessibility

    var errors = [];
    for (var i = 0; i < inddFiles.length; i++) {
      var inddFile = inddFiles[i];
      var doc;
      try {
        doc = app.open(inddFile, false);
        var pdfFile = File(
          pdfFolder + "/" + inddFile.name.replace(/\.indd$/i, ".pdf")
        );
        doc.exportFile(ExportFormat.INTERACTIVE_PDF, pdfFile, false);
        doc.close(SaveOptions.NO);
      } catch (e) {
        errors.push(inddFile.name + ": " + e.message);
        if (doc && doc.isValid) doc.close(SaveOptions.NO);
      }
    }

    var msg =
      "Exported " + (inddFiles.length - errors.length) + "/" +
      inddFiles.length + " files to:\n" + pdfFolder.fsName;
    if (errors.length > 0) msg += "\n\nErrors:\n" + errors.join("\n");
    alert(msg);
  }
}
