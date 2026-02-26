/**
 * export-print.jsx
 *
 * Exports the active Illustrator document in three print-ready formats at once:
 *   - EPS → /EPS folder
 *   - SVG → /SVG folder
 *   - PDF → /PDF folder
 *
 * Folders are created next to the source file if they don't exist.
 * Reopens the original document after export to prevent overwriting.
 */
var doc = app.activeDocument;

// Get the base filename without extension and the path of the original document
var originalFileName = doc.name;
var originalFilePath = doc.fullName;
var baseName = originalFileName.replace(/\.[^\.]+$/, "");

// Extract the folder path from the full path of the original document
var folderPath = originalFilePath.path + "/";

// Define folder names for EPS, SVG, and PDF
var epsFolder = new Folder(folderPath + "EPS");
var svgFolder = new Folder(folderPath + "SVG");
var pdfFolder = new Folder(folderPath + "PDF");

// Create the folders if they do not exist
if (!epsFolder.exists) epsFolder.create();
if (!svgFolder.exists) svgFolder.create();
if (!pdfFolder.exists) pdfFolder.create();

// Define filenames for EPS, SVG, and PDF in the respective folders
var epsFile = new File(epsFolder.fsName + "/" + baseName + ".eps");
var svgFile = new File(svgFolder.fsName + "/" + baseName + ".svg");
var pdfFile = new File(pdfFolder.fsName + "/" + baseName + ".pdf");

// Save options for each format
var epsSaveOptions = new EPSSaveOptions();
var svgSaveOptions = new ExportOptionsSVG();
var pdfSaveOptions = new PDFSaveOptions();

// Save as EPS
doc.saveAs(epsFile, epsSaveOptions);

// Export as SVG
doc.exportFile(svgFile, ExportType.SVG, svgSaveOptions);

// Save as PDF
doc.saveAs(pdfFile, pdfSaveOptions);

// Reopen the original file after saving to ensure it is not overwritten
app.open(originalFilePath);

// Close the active document without saving
doc.close(SaveOptions.DONOTSAVECHANGES);
