/**
 * export-layers-svg.jsx
 *
 * Exports each layer in the active Illustrator document as a separate SVG file,
 * named after the document and layer (e.g. "logo-company-white.svg").
 * Files are saved in an SVG subfolder next to the source document.
 * Original layer visibility is restored after export.
 */
#target illustrator

function main() {
    var doc = app.activeDocument;
    var originalFilePath = doc.fullName;
    var baseName = doc.name.replace(/\.[^\.]+$/, "");
    var folderPath = originalFilePath.path + "/";

    // Create SVG folder if it doesn't exist
    var svgFolder = new Folder(folderPath + "SVG");
    if (!svgFolder.exists) svgFolder.create();

    // Store original visibility state of each layer
    var originalVisibility = [];
    for (var i = 0; i < doc.layers.length; i++) {
        originalVisibility[i] = doc.layers[i].visible;
    }

    // SVG Export Options
    var svgOpts = new ExportOptionsSVG();
    svgOpts.compressed = false;
    svgOpts.DTD = SVGDTDVersion.SVG1_1;

    // Export each layer as a separate SVG
    for (var i = 0; i < doc.layers.length; i++) {
        // Make all layers invisible
        for (var j = 0; j < doc.layers.length; j++) {
            doc.layers[j].visible = false;
        }

        // Make only the current layer visible
        var layer = doc.layers[i];
        layer.visible = true;

        // Export SVG with lowercase layer name
        var svgFile = new File(svgFolder.fsName + "/" + baseName + "-" + layer.name.toLowerCase() + ".svg");
        doc.exportFile(svgFile, ExportType.SVG, svgOpts);
    }

    // Restore original visibility
    for (var k = 0; k < doc.layers.length; k++) {
        doc.layers[k].visible = originalVisibility[k];
    }

    // Reopen original document to prevent overwriting
    app.open(originalFilePath);
    doc.close(SaveOptions.DONOTSAVECHANGES);
}

main();
