/**
 * export-layers.jsx
 *
 * Saves each layer in the active Illustrator document as a separate .ai file,
 * named after the original document and layer (e.g. "logo-Black.ai").
 * Files are saved in the same folder as the source document.
 * Original layer visibility is restored after export.
 */
#target illustrator

function main() {
    // Get the active document
    var doc = app.activeDocument;

    // Store the original document name without the extension
    var originalDocName = doc.name.replace('.ai', '');

    // Array to store the original visibility state of each layer
    var originalVisibility = [];

    // Loop through all layers and store their original visibility state
    for (var i = 0; i < doc.layers.length; i++) {
        originalVisibility[i] = doc.layers[i].visible;
    }

    // Loop through all layers in the document
    for (var i = 0; i < doc.layers.length; i++) {
        // Make all layers invisible first
        for (var j = 0; j < doc.layers.length; j++) {
            doc.layers[j].visible = false;
        }

        // Make only the current layer visible
        var layer = doc.layers[i];
        layer.visible = true;

        // Construct the file name with the original document name and the layer name
        var filePath = doc.fullName.path + '/' + originalDocName + '-' + layer.name + '.ai';

        // Save the document with the new name
        var saveOptions = new IllustratorSaveOptions();
        var newFile = new File(filePath);
        doc.saveAs(newFile, saveOptions);
    }

    // Restore the original visibility state of all layers
    for (var k = 0; k < doc.layers.length; k++) {
        doc.layers[k].visible = originalVisibility[k];
    }
}

main();
