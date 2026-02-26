// InDesign Markdown to Styles Script - Updated Order and GREP
(function () {
  var doc = app.activeDocument;
  if (!doc) {
    alert("No active document found.");
    return;
  }

  // --- CONFIGURATION ---
  var grepChanges = [
    // 1. Headings (Stripping markers first)
    { find: "^#{6}\\s+(.+)$", replace: "$1", style: "heading-6", type: "para" },
    { find: "^#{5}\\s+(.+)$", replace: "$1", style: "heading-5", type: "para" },
    { find: "^#{4}\\s+(.+)$", replace: "$1", style: "heading-4", type: "para" },
    { find: "^#{3}\\s+(.+)$", replace: "$1", style: "heading-3", type: "para" },
    { find: "^#{2}\\s+(.+)$", replace: "$1", style: "heading-2", type: "para" },
    { find: "^#{1}\\s+(.+)$", replace: "$1", style: "heading-1", type: "para" },

    // 2. Lists
    {
      find: "^\\s{6}(\\d+\\.)\\s+(.+)$",
      replace: "$2",
      style: "numbered-list-level-3",
      type: "para",
    },
    {
      find: "^\\s{4}-\\s+(.+)$",
      replace: "$1",
      style: "bullet-list-level-3",
      type: "para",
    },
    {
      find: "^\\s{3}(\\d+\\.)\\s+(.+)$",
      replace: "$2",
      style: "numbered-list-level-2",
      type: "para",
    },
    {
      find: "^\\s{2}-\\s+(.+)$",
      replace: "$1",
      style: "bullet-list-level-2",
      type: "para",
    },
    {
      find: "^(\\d+\\.)\\s+(.+)$",
      replace: "$2",
      style: "numbered-list-level-1",
      type: "para",
    },
    {
      find: "^-\\s+(.+)$",
      replace: "$1",
      style: "bullet-list-level-1",
      type: "para",
    },

    // 2.5 Mark table rows (DON'T remove pipes yet)
    {
      find: "^\\|.+\\|$",
      replace: "$0",
      style: "table-marker",
      type: "para",
    },

    // 3. Character Styles LAST
    { find: "\\*{2}(.+?)\\*{2}", replace: "$1", style: "bold", type: "char" },
    { find: "_{2}(.+?)_{2}", replace: "$1", style: "bold", type: "char" },
    { find: "\\*(.+?)\\*", replace: "$1", style: "italic", type: "char" },
    { find: "_(.+?)_", replace: "$1", style: "italic", type: "char" },
  ];

  app.findGrepPreferences = NothingEnum.nothing;
  app.changeGrepPreferences = NothingEnum.nothing;

  // Apply GREP changes
  for (var i = 0; i < grepChanges.length; i++) {
    var rule = grepChanges[i];

    app.findGrepPreferences.findWhat = rule.find;
    app.changeGrepPreferences.changeTo = rule.replace;

    if (rule.type === "char") {
      var cStyle = doc.characterStyles.itemByName(rule.style);
      if (cStyle.isValid) {
        app.changeGrepPreferences.appliedCharacterStyle = cStyle;
      }
    } else {
      var pStyle = doc.paragraphStyles.itemByName(rule.style);
      if (pStyle.isValid) {
        app.changeGrepPreferences.appliedParagraphStyle = pStyle;
      }
    }

    doc.changeGrep();

    app.findGrepPreferences = NothingEnum.nothing;
    app.changeGrepPreferences = NothingEnum.nothing;
  }

  // --- CONVERT TABLE MARKERS TO REAL TABLES ---
  convertMarkdownTables(doc);

  alert("Markdown formatting applied successfully.");

  // --- TABLE CONVERSION FUNCTION ---
  function convertMarkdownTables(doc) {
    // Find all text frames in document
    var stories = doc.stories;

    for (var s = 0; s < stories.length; s++) {
      var story = stories[s];
      var paras = story.paragraphs;

      var tableGroups = [];
      var currentGroup = [];

      // Group consecutive table-marker paragraphs
      for (var p = 0; p < paras.length; p++) {
        if (paras[p].appliedParagraphStyle.name === "table-marker") {
          currentGroup.push(paras[p]);
        } else {
          if (currentGroup.length > 0) {
            tableGroups.push(currentGroup.slice());
            currentGroup = [];
          }
        }
      }
      if (currentGroup.length > 0) {
        tableGroups.push(currentGroup);
      }

      // Convert each group to a table (process backwards to preserve indices)
      for (var g = tableGroups.length - 1; g >= 0; g--) {
        var group = tableGroups[g];
        createTableFromGroup(doc, group);
      }
    }
  }

  function createTableFromGroup(doc, paragraphs) {
    if (paragraphs.length === 0) return;

    // Parse first row to determine column count
    var firstRowText = paragraphs[0].contents;
    var cells = firstRowText.split("|");

    // Remove empty first/last if they exist (from leading/trailing pipes)
    if (cells[0].replace(/^\s+|\s+$/g, "") === "") cells.shift();
    if (cells[cells.length - 1].replace(/^\s+|\s+$/g, "") === "") cells.pop();

    var numCols = cells.length;

    // Filter out separator rows (those with only |, -, :, and whitespace)
    var dataRows = [];
    for (var i = 0; i < paragraphs.length; i++) {
      var rowText = paragraphs[i].contents;
      if (!/^[\|\s\-:]+$/.test(rowText)) {
        dataRows.push(paragraphs[i]);
      }
    }

    if (dataRows.length === 0) return;

    var numRows = dataRows.length;
    var hasHeader = numRows > 0; // First row is header

    // Get insertion point before first paragraph
    var insertionPoint = dataRows[0].insertionPoints[0];

    // Create table
    var table = insertionPoint.tables.add({
      bodyRowCount: hasHeader ? numRows - 1 : numRows,
      headerRowCount: hasHeader ? 1 : 0,
      columnCount: numCols,
    });

    // Make table span text frame width
    try {
      var textFrame = table.parent.parentTextFrames[0];
      if (textFrame && textFrame.isValid) {
        // Get the actual text column width
        var bounds = textFrame.geometricBounds;
        var frameWidth = bounds[3] - bounds[1]; // right - left

        // Set table width to match frame
        table.width = frameWidth;

        // Distribute columns evenly with the correct width
        var colWidth = frameWidth / numCols;
        for (var col = 0; col < table.columns.length; col++) {
          table.columns[col].width = colWidth;
        }
      }
    } catch (e) {
      // Fallback: set reasonable column widths (120pt per column)
      for (var col = 0; col < table.columns.length; col++) {
        table.columns[col].width = 120;
      }
    }

    // Fill table cells
    for (var r = 0; r < dataRows.length; r++) {
      var rowText = dataRows[r].contents;
      var rowCells = rowText.split("|");

      // Clean up
      if (rowCells[0].replace(/^\s+|\s+$/g, "") === "") rowCells.shift();
      if (rowCells[rowCells.length - 1].replace(/^\s+|\s+$/g, "") === "")
        rowCells.pop();

      for (var c = 0; c < Math.min(rowCells.length, numCols); c++) {
        var cellText = rowCells[c].replace(/^\s+|\s+$/g, ""); // trim
        table.cells.item(r * numCols + c).contents = cellText;
      }
    }

    // Apply paragraph styles to table cells
    var headerStyle = doc.paragraphStyles.itemByName("table-header");
    var cellStyle = doc.paragraphStyles.itemByName("table-cell");

    // Apply header style to first row if it exists
    if (hasHeader && headerStyle.isValid) {
      var headerRow = table.rows[0];
      for (var hc = 0; hc < headerRow.cells.length; hc++) {
        if (headerRow.cells[hc].paragraphs.length > 0) {
          headerRow.cells[hc].paragraphs[0].appliedParagraphStyle = headerStyle;
        }
      }
    }

    // Apply cell style to body rows if it exists
    if (cellStyle.isValid) {
      var startRow = hasHeader ? 1 : 0;
      for (var br = startRow; br < table.rows.length; br++) {
        var bodyRow = table.rows[br];
        for (var bc = 0; bc < bodyRow.cells.length; bc++) {
          if (bodyRow.cells[bc].paragraphs.length > 0) {
            bodyRow.cells[bc].paragraphs[0].appliedParagraphStyle = cellStyle;
          }
        }
      }
    }

    // Delete original paragraphs
    for (var d = paragraphs.length - 1; d >= 0; d--) {
      paragraphs[d].remove();
    }
  }
})();
