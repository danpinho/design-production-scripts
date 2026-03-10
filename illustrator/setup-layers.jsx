/**
 * setup-layers.jsx
 *
 * Sets up a three-layer structure for brand/logo documents in Illustrator.
 * Creates White, Black, and Primary layers (top to bottom), removes the
 * default "Layer 1", and sets Primary as the active visible layer.
 *
 * Creates a new document if none is open.
 */

// Create a new document if there isn't one already
if (app.documents.length == 0) {
    app.documents.add();
}

// Get the active document
var doc = app.activeDocument;

// Layer names: add in reverse panel order (layers.add() always inserts at top)
// Desired panel order: White (top), Black, Primary (bottom)
var layerNames = ["Primary", "Black", "White"];

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

// Make "Primary" the active layer and set all others to invisible
for (var j = 0; j < doc.layers.length; j++) {
    var currentLayer = doc.layers[j];
    if (currentLayer.name === "Primary") {
        doc.activeLayer = currentLayer;
        currentLayer.visible = true;
    } else {
        currentLayer.visible = false;
    }
}