import * as Plot from "@observablehq/plot";
import { JSDOM } from "jsdom";
import { csvParse } from "d3-dsv";
import { readdirSync, readFileSync, writeFileSync } from "fs";

const files = readdirSync(".").filter(f => f.endsWith(".csv"));

if (files.length === 0) {
  console.log("No CSV files found in current folder.");
  process.exit(0);
}

for (const file of files) {
  const data = csvParse(readFileSync(file, "utf8"), d => ({
    category: d.category,
    value: +d.value
  }));

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

  const outputFile = file.replace(".csv", ".svg");
  writeFileSync(outputFile, chart.outerHTML);
  console.log(`${outputFile} written`);
}
