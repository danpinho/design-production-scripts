/**
 * clean-up-layers.jsx
 * Sorts all page items into three layers:
 *   Text    — text frames (threaded, single, table frames)
 *   Images  — frames containing placed graphics (images, PDFs, EPS)
 *   Vectors — everything else (shapes, lines, groups, empty frames)
 *
 * Layers are created if they don't exist.
 * Anchored frames are skipped (they inherit their parent's layer).
 */

#target indesign

(function () {
    var doc = app.activeDocument;

    var LAYER_TEXT    = "Text";
    var LAYER_IMAGES  = "Images";
    var LAYER_VECTORS = "Vectors";

    function getOrCreateLayer(name) {
        var layer = doc.layers.itemByName(name);
        if (!layer.isValid) {
            layer = doc.layers.add({ name: name });
        }
        return layer;
    }

    var textLayer    = getOrCreateLayer(LAYER_TEXT);
    var imagesLayer  = getOrCreateLayer(LAYER_IMAGES);
    var vectorsLayer = getOrCreateLayer(LAYER_VECTORS);

    // Save and unlock all layers
    var layerStates = [];
    for (var i = 0; i < doc.layers.length; i++) {
        layerStates.push(doc.layers[i].locked);
        doc.layers[i].locked = false;
    }

    var counts = { text: 0, images: 0, vectors: 0, anchored: 0, skipped: 0, errors: [] };

    function isAnchored(item) {
        if (!item.parent) return false;
        var pn = item.parent.constructor.name;
        return (pn !== "Page" && pn !== "Spread" && pn !== "MasterSpread");
    }

    function moveItem(item, targetLayer, countKey) {
        try {
            if (isAnchored(item)) { counts.anchored++; return; }
            if (item.itemLayer.name === targetLayer.name) return;
            if (item.locked) item.locked = false;
            item.itemLayer = targetLayer;
            counts[countKey]++;
        } catch (e) {
            counts.skipped++;
            if (counts.errors.length < 3) counts.errors.push(e.message || e.toString());
        }
    }

    // --- Text frames ---
    var textFrames = [];
    for (var i = 0; i < doc.textFrames.length; i++) {
        textFrames.push(doc.textFrames[i]);
    }
    for (var k = 0; k < textFrames.length; k++) {
        moveItem(textFrames[k], textLayer, "text");
    }

    // --- Frames that can hold graphics (rectangles, ovals, polygons) ---
    // contentType tells us if a placed graphic is inside or if it's a plain shape
    var frameCollections = [doc.rectangles, doc.ovals, doc.polygons];
    for (var c = 0; c < frameCollections.length; c++) {
        var coll = [];
        for (var i = 0; i < frameCollections[c].length; i++) {
            coll.push(frameCollections[c][i]);
        }
        for (var k = 0; k < coll.length; k++) {
            var item = coll[k];
            var hasGraphic = false;
            try { hasGraphic = (item.contentType === ContentType.GRAPHIC_TYPE); } catch (e) {}
            moveItem(item, hasGraphic ? imagesLayer : vectorsLayer, hasGraphic ? "images" : "vectors");
        }
    }

    // --- Lines and groups always go to Vectors ---
    var vectorCollections = [doc.graphicLines, doc.groups];
    for (var c = 0; c < vectorCollections.length; c++) {
        var coll = [];
        for (var i = 0; i < vectorCollections[c].length; i++) {
            coll.push(vectorCollections[c][i]);
        }
        for (var k = 0; k < coll.length; k++) {
            moveItem(coll[k], vectorsLayer, "vectors");
        }
    }

    // Restore layer lock states
    for (var i = 0; i < doc.layers.length; i++) {
        if (i < layerStates.length) doc.layers[i].locked = layerStates[i];
    }

    var msg = "Done!\n\n";
    msg += "\u201c" + LAYER_TEXT    + "\u201d:    " + counts.text    + " text frame(s)\n";
    msg += "\u201c" + LAYER_IMAGES  + "\u201d:  " + counts.images  + " image frame(s)\n";
    msg += "\u201c" + LAYER_VECTORS + "\u201d: "  + counts.vectors + " vector/shape(s)\n";
    if (counts.anchored > 0) msg += "\nAnchored (skipped): " + counts.anchored;
    if (counts.skipped  > 0) {
        msg += "\nErrors: " + counts.skipped;
        if (counts.errors.length > 0) msg += "\n\u2192 " + counts.errors[0];
    }
    alert(msg);

}());
