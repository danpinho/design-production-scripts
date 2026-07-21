/**
 * setup-layers-en.jsx
 *
 * Creates the layer structure for brand/logo master documents in Illustrator,
 * using English layer names. Panel order top to bottom: Notes ... Background
 * The three top layers (Notes, Clear-Space, Construction) are set to
 * non-printing and locked. Logo-Color is left active.
 *
 * Creates a new document if none is open.
 */

// Create a new document if there isn't one already
if (app.documents.length == 0) {
    app.documents.add();
}

var doc = app.activeDocument;

// Desired panel order, top to bottom
var layerNames = [
    "Notes",
    "Clear-Space",
    "Construction",
    "Logo-Positive",
    "Logo-Negative",
    "Logo-Color",
    "Text-Live",
    "Text-Outlined",
    "Background"
];

// Layers that should not print and start locked
var nonPrintLayers = ["Notes", "Clear-Space", "Construction"];

// The layer that should be active when the script finishes
var activeLayerName = "Logo-Color";

// layers.add() always inserts at top, so iterate in reverse
for (var i = layerNames.length - 1; i >= 0; i--) {
    var newLayer = doc.layers.add();
    newLayer.name = layerNames[i];
}

// Remove the default empty layer (name is localised: EN "Layer 1", DE "Ebene 1")
var defaultNames = ["Layer 1", "Ebene 1", "Calque 1", "Livello 1", "Capa 1"];
for (var d = 0; d < defaultNames.length; d++) {
    try {
        doc.layers.getByName(defaultNames[d]).remove();
    } catch (e) {
        // not present, ignore
    }
}

// Apply printing / locking flags
for (var j = 0; j < doc.layers.length; j++) {
    var currentLayer = doc.layers[j];
    currentLayer.visible = true;

    for (var k = 0; k < nonPrintLayers.length; k++) {
        if (currentLayer.name === nonPrintLayers[k]) {
            currentLayer.printable = false;
            currentLayer.locked = true;
        }
    }
}

// Set the active layer (must be unlocked and visible)
try {
    doc.activeLayer = doc.layers.getByName(activeLayerName);
} catch (e) {
    doc.activeLayer = doc.layers[0];
}
