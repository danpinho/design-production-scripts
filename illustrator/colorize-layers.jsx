/**
 * colorize-layers.jsx
 *
 * Copies all items from the Primary layer to the Black and White layers,
 * applying the respective fill color to each copy. Intended to run after
 * setup-layers.jsx, which creates the three-layer structure.
 *
 * Makes Primary the active layer when finished.
 */

var doc = app.activeDocument;

var primaryLayer = doc.layers.getByName("Primary");
var blackLayer = doc.layers.getByName("Black");
var whiteLayer = doc.layers.getByName("White");

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

// Make all layers visible and unlocked so we can manipulate them
var allLayers = [primaryLayer, blackLayer, whiteLayer];
for (var i = 0; i < allLayers.length; i++) {
    allLayers[i].visible = true;
    allLayers[i].locked = false;
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

duplicateAndColorize(primaryLayer, blackLayer, black);
duplicateAndColorize(primaryLayer, whiteLayer, white);

// Hide Black and White layers, keep only Primary visible and active
blackLayer.visible = false;
whiteLayer.visible = false;
primaryLayer.visible = true;
doc.activeLayer = primaryLayer;
