/**
 * xml-tags-to-styles.jsx
 *
 * Reads all XML tags in the active InDesign document and automatically
 * creates matching paragraph styles for each tag. Useful when setting up
 * an XML import workflow — run this once to generate the full style list
 * from the tag structure before mapping or styling.
 *
 * - Skips the default Root tag
 * - Skips styles that already exist
 * - Reports created, skipped, and failed styles on completion
 */
// InDesign Script: Create Paragraph Styles from XML Tags
// This script reads all XML tags in the document and creates matching paragraph styles

(function() {
    // Check if a document is open
    if (app.documents.length === 0) {
        alert("Please open a document first.");
        return;
    }
    
    var doc = app.activeDocument;
    var xmlTags = doc.xmlTags;
    var createdStyles = [];
    var skippedStyles = [];
    var existingStyles = [];
    
    // Start undo group
    app.doScript(function() {
        // Loop through all XML tags
        for (var i = 0; i < xmlTags.length; i++) {
            var tagName = xmlTags[i].name;
            
            // Skip the default Root tag
            if (tagName === "Root") {
                continue;
            }
            
            // Check if paragraph style already exists
            try {
                var existingStyle = doc.paragraphStyles.item(tagName);
                if (existingStyle.isValid) {
                    existingStyles.push(tagName);
                    continue;
                }
            } catch (e) {
                // Style doesn't exist, we'll create it
            }
            
            // Create new paragraph style with the tag name
            try {
                var newStyle = doc.paragraphStyles.add({name: tagName});
                createdStyles.push(tagName);
            } catch (e) {
                skippedStyles.push(tagName + " (Error: " + e.message + ")");
            }
        }
        
        // Build result message
        var message = "XML Tags to Paragraph Styles - Results:\n\n";
        
        if (createdStyles.length > 0) {
            message += "✓ Created " + createdStyles.length + " new paragraph style(s):\n";
            for (var j = 0; j < createdStyles.length; j++) {
                message += "  • " + createdStyles[j] + "\n";
            }
            message += "\n";
        }
        
        if (existingStyles.length > 0) {
            message += "○ Skipped " + existingStyles.length + " existing style(s):\n";
            for (var k = 0; k < existingStyles.length; k++) {
                message += "  • " + existingStyles[k] + "\n";
            }
            message += "\n";
        }
        
        if (skippedStyles.length > 0) {
            message += "✗ Failed to create " + skippedStyles.length + " style(s):\n";
            for (var m = 0; m < skippedStyles.length; m++) {
                message += "  • " + skippedStyles[m] + "\n";
            }
            message += "\n";
        }
        
        if (createdStyles.length === 0 && existingStyles.length === 0 && skippedStyles.length === 0) {
            message += "No XML tags found (other than Root).\n";
            message += "Import XML first to create tags.";
        }
        
        alert(message);
        
    }, ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "Create Paragraph Styles from XML Tags");
    
})();