import * as Plot from "@observablehq/plot";
import { JSDOM } from "jsdom";
import { csvParse } from "d3-dsv";
import { readFileSync, writeFileSync } from "fs";

// Load data
const data = csvParse(readFileSync("data.csv", "utf8"), d => ({
  category: d.category,
  value: +d.value
}));

// Build chart (pass jsdom document so it works outside a browser)
const { document } = new JSDOM("").window;

const chart = Plot.plot({
  document,
  width: 800,
  style: { fontFamily: "Helvetica, Arial, sans-serif" },
  marks: [
    Plot.barY(data, { x: "category", y: "value", fill: "#2563eb" })
  ]
});

// Save SVG
writeFileSync("chart.svg", chart.outerHTML);
console.log("chart.svg written");
