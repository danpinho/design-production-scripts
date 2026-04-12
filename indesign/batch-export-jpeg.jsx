// Batch export all .indd files in a chosen folder to JPEG (one file per page)
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
    var jpegFolder = Folder(sourceFolder + "/JPEG");
    if (!jpegFolder.exists) jpegFolder.create();

    var prefs = app.jpegExportPreferences;
    prefs.antiAlias       = true;
    prefs.exportingSpread = false;
    prefs.jpegQuality     = JPEGOptionsQuality.HIGH; // MINIMUM, LOW, MEDIUM, HIGH, MAXIMUM
    prefs.jpegRenderingStyle = JPEGOptionsFormat.BASELINE_ENCODING;

    var errors = [];
    for (var i = 0; i < inddFiles.length; i++) {
      var inddFile = inddFiles[i];
      var doc;
      try {
        doc = app.open(inddFile, false);
        var baseName = inddFile.name.replace(/\.indd$/i, "");
        var jpegFile = File(jpegFolder + "/" + baseName + ".jpg");
        // InDesign automatically appends page numbers when exporting multi-page docs
        // e.g. filename_1.jpg, filename_2.jpg, etc.
        doc.exportFile(ExportFormat.JPG, jpegFile, false);
        doc.close(SaveOptions.NO);
      } catch (e) {
        errors.push(inddFile.name + ": " + e.message);
        if (doc && doc.isValid) doc.close(SaveOptions.NO);
      }
    }

    var msg =
      "Exported " + (inddFiles.length - errors.length) + "/" +
      inddFiles.length + " files to:\n" + jpegFolder.fsName;
    if (errors.length > 0) msg += "\n\nErrors:\n" + errors.join("\n");
    alert(msg);
  }
}
