import jsPDF from "jspdf";
import { FormConfig } from "../domain/formTypes";
import { runPdf } from "./pdfGeneratorBase";

export function generatePDF(config: FormConfig, values: Record<string, any> = {}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // Header bar
  doc.setFillColor(0, 84, 166);
  doc.rect(0, 0, pageWidth, 24, "F");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text(config.label || "Form", margin, 15);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 22);
  doc.setTextColor(0, 0, 0);

  runPdf(doc, config, values, (doc, label, value, x, y, width) => {
    // label
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.text(label, x, y);

    // value
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    const wrapped = doc.splitTextToSize(value, width - 2);
    let py = y + 5;
    wrapped.forEach((line) => {
      doc.text(line, x, py);
      py += 5;
    });

    return py - y;
  });
}
