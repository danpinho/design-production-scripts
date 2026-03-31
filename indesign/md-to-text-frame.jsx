// MD to InDesign — file picker + place in selected text frame
var f = File.openDialog("Select a Markdown file", "Markdown:*.md,*.txt");
if (!f) exit();

f.open("r");
var content = f.read();
f.close();

var doc = app.activeDocument;
var sel = app.selection;

if (!sel || sel.length === 0 || !(sel[0] instanceof TextFrame)) {
    alert("Please select a text frame first.");
    exit();
}

var frame = sel[0];
frame.contents = content;