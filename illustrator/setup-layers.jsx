/**
 * setup-layers.jsx
 *
 * Sets up a two-layer structure for brand/logo documents in Illustrator.
 * Creates Black and White layers, removes the default "Layer 1",
 * and sets Black as the active visible layer to start working.
 *
 * Creates a new document if none is open.
 */

// Create a new document if there isn't one already
if (app.documents.length == 0) {
    app.documents.add();
}

// Get the active document
var doc = app.activeDocument;

// Array of layer names you want to create
var layerNames = ["Black", "White"];

// Loop through the array and create layers with the given names
for (var i = 0; i < layerNames.length; i++) {
    var newLayer = doc.layers.add();
    newLayer.name = layerNames[i];
}

// Remove the default "Layer 1" if it exists
try {
    var defaultLayer = doc.layers.getByName("Layer 1");
    defaultLayer.remove();
} catch (e) {
    // "Layer 1" doesn't exist, so we do nothing
}

// Make "Black" the active layer and set all others to invisible
for (var j = 0; j < doc.layers.length; j++) {
    var currentLayer = doc.layers[j];
    if (currentLayer.name === "Black") {
        doc.activeLayer = currentLayer;
        currentLayer.visible = true;
    } else {
        currentLayer.visible = false;
    }
}