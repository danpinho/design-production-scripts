/**
 * setup-layers-de.jsx
 *
 * Creates the layer structure for brand/logo master documents in Illustrator,
 * using German layer names. Panel order top to bottom: Anmerkungen ... Hintergrund
 * The three top layers (Anmerkungen, Schutzzone, Konstruktion) are set to
 * non-printing and locked. Logo-Farbig is left active.
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
    "Anmerkungen",
    "Schutzzone",
    "Konstruktion",
    "Logo-Positiv",
    "Logo-Negativ",
    "Logo-Farbig",
    "Text-Live",
    "Text-Vektorisiert",
    "Hintergrund"
];

// Layers that should not print and start locked
var nonPrintLayers = ["Anmerkungen", "Schutzzone", "Konstruktion"];

// The layer that should be active when the script finishes
var activeLayerName = "Logo-Farbig";

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
