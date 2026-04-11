# chart-pipeline

Generate SVG charts from CSV data using Observable Plot. SVGs are vector and can be placed directly in InDesign.

## Requirements

- Node.js
- Dependencies installed at `~/node_modules` (`@observablehq/plot`, `jsdom`, `d3-dsv`)
- Aliases in `~/.zshrc`:
  - `chart` — single file
  - `charts` — batch mode

## CSV format

All CSV files must have two columns:

```
category,value
Jan,120
Feb,95
Mar,140
```

## Usage

### Single file

```bash
chart data.csv chart.svg
```

### Batch — all CSVs in current folder

```bash
charts
```

Each `filename.csv` produces a `filename.svg` in the same folder.

## Chart script

`chart.js` — single chart, accepts input and output as arguments.

`batch.js` — loops over all `.csv` files in the current directory.

## Customizing the chart

Open `chart.js` or `batch.js` and edit the `Plot.plot()` block.

Common changes:

| What | Where | Example |
|------|-------|---------|
| Chart width | `width` | `width: 1200` |
| Bar color | `fill` | `fill: "#e63946"` |
| Y-axis label | `y: { label }` | `y: { label: "Revenue" }` |
| Chart type | `marks` | `Plot.lineY(...)` for a line chart |

Available chart types: observablehq.com/plot/marks
