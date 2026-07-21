/**
 * colorize-layers-de.jsx
 *
 * Copies all items from the Logo-Farbig layer to the Logo-Positiv (100% black)
 * and Logo-Negativ (white) layers, applying the respective fill color to each
 * copy. Intended to run after setup-layers-de.jsx.
 *
 * Makes Logo-Farbig the active layer when finished.
 */

// Layer names this script expects (German layer set)
var sourceName = "Logo-Farbig";
var positiveName = "Logo-Positiv";
var negativeName = "Logo-Negativ";

if (app.documents.length == 0) {
    alert("No document open.");
} else {
    colorizeLayers();
}

function colorizeLayers() {
    var doc = app.activeDocument;

    var sourceLayer, positiveLayer, negativeLayer;
    try {
        sourceLayer = doc.layers.getByName(sourceName);
        positiveLayer = doc.layers.getByName(positiveName);
        negativeLayer = doc.layers.getByName(negativeName);
    } catch (e) {
        alert("Missing layers. Run setup-layers-de.jsx first.");
        return;
    }

    var black = new CMYKColor();
    black.cyan = 0;
    black.magenta = 0;
    black.yellow = 0;
    black.black = 100;

    var white = new CMYKColor();
    white.cyan = 0;
    white.magenta = 0;
    white.yellow = 0;
    white.black = 0;

    // Make the layers we touch visible and unlocked
    var allLayers = [sourceLayer, positiveLayer, negativeLayer];
    for (var i = 0; i < allLayers.length; i++) {
        allLayers[i].visible = true;
        allLayers[i].locked = false;
    }

    duplicateAndColorize(sourceLayer, positiveLayer, black);
    duplicateAndColorize(sourceLayer, negativeLayer, white);

    // Hide the derived layers, keep only the color master visible and active
    positiveLayer.visible = false;
    negativeLayer.visible = false;
    sourceLayer.visible = true;
    doc.activeLayer = sourceLayer;
}

/**
 * Recursively set fill color on a page item and its children.
 */
function setFillColor(item, color) {
    if (item.typename === "GroupItem") {
        for (var i = 0; i < item.pageItems.length; i++) {
            setFillColor(item.pageItems[i], color);
        }
    } else if (item.typename === "CompoundPathItem") {
        for (var j = 0; j < item.pathItems.length; j++) {
            item.pathItems[j].fillColor = color;
        }
    } else if (item.filled !== undefined) {
        item.fillColor = color;
    }
}

/**
 * Duplicate all items from source layer to target layer, then colorize.
 */
function duplicateAndColorize(sourceLayer, targetLayer, color) {
    for (var i = sourceLayer.pageItems.length - 1; i >= 0; i--) {
        var copy = sourceLayer.pageItems[i].duplicate(targetLayer, ElementPlacement.PLACEATBEGINNING);
        setFillColor(copy, color);
    }
}
