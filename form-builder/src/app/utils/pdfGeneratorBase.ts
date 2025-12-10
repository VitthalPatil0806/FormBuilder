// pdfGeneratorBase.ts (internal logic referenced by A/B/C versions)
import jsPDF from "jspdf";
import { FormConfig } from "../domain/formTypes";

export const runPdf = (
  doc: jsPDF,
  config: FormConfig,
  values: Record<string, any>,
  drawField: (
    doc: jsPDF,
    label: string,
    value: string,
    x: number,
    y: number,
    width: number
  ) => number /* returns height */
) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const colUnit = contentWidth / 12;
  let y = 32;

  // Outer border
  doc.setLineWidth(0.8);
  doc.rect(margin - 4, y - 4, contentWidth + 8, 250);

  const ensurePage = () => {
    if (y > 255) {
      doc.addPage();
      y = 26;
      doc.rect(margin - 4, y - 4, contentWidth + 8, 250);
    }
  };

  config.sections.forEach((section) => {
    ensurePage();

    // Section title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(20, 54, 99);
    doc.text(section.label || "Section", margin, y);
    y += 6;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, margin + contentWidth, y);
    y += 6;
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    // ROWS
    section.rows.forEach((row) => {
      ensurePage();

      let x = margin;
      let rowMaxHeight = 0;

      row.fields.forEach((field) => {
        const span =
          field.size === "sm" ? 4 :
          field.size === "md" ? 6 :
          field.size === "lg" ? 8 : 12;

        const width = colUnit * span;
        const rawValue = values[field.name];
        const value =
          rawValue === undefined || rawValue === null || rawValue === ""
            ? "-"
            : String(rawValue);
        const label = field.label || "Field";

        const fieldHeight = drawField(doc, label, value, x, y, width);
        rowMaxHeight = Math.max(rowMaxHeight, fieldHeight);
        x += width + 6;
      });

      y += rowMaxHeight + 10;
    });

    y += 4;
  });

  doc.save(
    `${(config.label || "form").toLowerCase().replace(/\s+/g, "_")}.pdf`
  );
};
