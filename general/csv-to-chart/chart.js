import * as Plot from "@observablehq/plot";
import { JSDOM } from "jsdom";
import { csvParse } from "d3-dsv";
import { readFileSync, writeFileSync } from "fs";

// Accept optional arguments: node chart.js [input.csv] [output.svg]
const inputFile = process.argv[2] ?? "data.csv";
const outputFile = process.argv[3] ?? "chart.svg";

// Load data
const data = csvParse(readFileSync(inputFile, "utf8"), d => ({
  category: d.category,
  value: +d.value
}));

// Build chart (pass jsdom document so it works outside a browser)
const { document } = new JSDOM("").window;

const chart = Plot.plot({
  document,
  width: 800,
  style: { fontFamily: "Helvetica, Arial, sans-serif" },
  y: { label: "Value" },
  marks: [
    Plot.barY(data, { x: "category", y: "value", fill: "#2563eb" })
  ]
});

// Save SVG
writeFileSync(outputFile, chart.outerHTML);
console.log(`${outputFile} written`);
