/**
 * export-web.jsx
 *
 * Exports the active Illustrator document in two web-ready formats at once:
 *   - SVG (uncompressed, SVG 1.1) → /SVG folder
 *   - PNG (300 DPI, transparent background) → /PNG folder
 *
 * Folders are created next to the source file if they don't exist.
 * Reopens the original document after export to prevent overwriting.
 */
var doc = app.activeDocument;

// Get the base filename (without extension) and original file path
var originalFileName = doc.name;
var originalFilePath = doc.fullName;
var baseName = originalFileName.replace(/\.[^\.]+$/, "");

// Extract folder path from the original document's full path
var folderPath = originalFilePath.path + "/";

// Define folder names for SVG and PNG
var svgFolder = new Folder(folderPath + "SVG");
var pngFolder = new Folder(folderPath + "PNG");

// Create the folders if they do not exist
if (!svgFolder.exists) svgFolder.create();
if (!pngFolder.exists) pngFolder.create();

// Define filenames for SVG and PNG
var svgFile = new File(svgFolder.fsName + "/" + baseName + ".svg");
var pngFile = new File(pngFolder.fsName + "/" + baseName + ".png");

// SVG Export Options
var svgSaveOptions = new ExportOptionsSVG();
svgSaveOptions.compressed = false; // Compress the SVG
svgSaveOptions.DTD = SVGDTDVersion.SVG1_1; // Use SVG 1.1

// Export as SVG
doc.exportFile(svgFile, ExportType.SVG, svgSaveOptions);

// PNG Export Options
var pngExportOptions = new ExportOptionsPNG24();
pngExportOptions.artBoardClipping = true; // Clip to Artboard
pngExportOptions.horizontalScale = (300 * 100) / 72; // Convert to 300 DPI
pngExportOptions.verticalScale = (300 * 100) / 72; // Convert to 300 DPI
pngExportOptions.transparency = true; // Enable transparency

// Export as PNG
doc.exportFile(pngFile, ExportType.PNG24, pngExportOptions);

// Reopen the original document to prevent overwriting
app.open(originalFilePath);

// Close the active document without saving changes
doc.close(SaveOptions.DONOTSAVECHANGES);
