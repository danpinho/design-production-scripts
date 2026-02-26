/**
 * setup-layers.jsx
 *
 * Sets up a standardized layer structure in the active InDesign document.
 * Renames the default Layer 1/2/3 if present, or creates the layers if missing.
 *
 * Layers created:
 *   - Images  (red)
 *   - Vectors (green)
 *   - Text    (light blue)
 */
main();

function main() {
  if (app.documents.length === 0 || app.layoutWindows.length === 0) {
    alert("A document must be open to execute the script.");
    return false;
  }

  var doc = app.activeDocument;

  var layerLabel = "Layer";

  var layerDefinitions = [
    { defaultName: layerLabel + " 1", userName: "Images", color: UIColors.RED },
    {
      defaultName: layerLabel + " 2",
      userName: "Vectors",
      color: UIColors.GREEN,
    },
    {
      defaultName: layerLabel + " 3",
      userName: "Text",
      color: UIColors.LIGHT_BLUE,
    },
  ];

  for (var i = 0; i < layerDefinitions.length; i++) {
    var layerDef = layerDefinitions[i];
    var defaultLayer = doc.layers.itemByName(layerDef.defaultName);
    var userLayer = doc.layers.itemByName(layerDef.userName);

    if (userLayer.isValid) {
      // use existing user layer
    } else if (defaultLayer.isValid) {
      userLayer = defaultLayer;
      userLayer.name = layerDef.userName;
    } else {
      userLayer = doc.layers.add({ name: layerDef.userName });
    }

    userLayer.layerColor = layerDef.color;
    userLayer.move(LocationOptions.AT_BEGINNING);
  }

  return true;
}
