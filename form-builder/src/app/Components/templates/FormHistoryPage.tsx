import React, { useState } from "react";
import Button from "../atoms/Button";
import { useFormHistory, FormSubmission } from "../../contexts/FormHistoryContext";
import FormPreviewModal from "../organisms/FormPreviewModal";
import jsPDF from "jspdf";

interface Props {
  onBackToBuilder?: () => void;
}

type RuntimeMode = "view" | "edit";

const FormHistoryPage: React.FC<Props> = ({ onBackToBuilder }) => {
  const { submissions, deleteSubmission, clearAll } = useFormHistory();
  const [active, setActive] = useState<{ submission: FormSubmission; mode: RuntimeMode } | null>(null);

  const handleExportPdf = (submission: FormSubmission) => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(14);
    doc.text(`Form: ${submission.config.label}`, 10, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`Submitted: ${new Date(submission.createdAt).toLocaleString()}`, 10, y);
    y += 10;

    doc.setFontSize(12);
    Object.entries(submission.values).forEach(([key, value]) => {
      const line = `${key}: ${String(value ?? "")}`;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 10, y);
      y += 8;
    });

    doc.save(`form-${submission.id}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-gray-200">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Form Submission History</h1>
          <p className="text-xs text-gray-500">
            View, edit, delete, and export submitted forms.
          </p>
        </div>

        <div className="flex gap-2">
          {submissions.length > 0 && (
            <Button
              type="button"
              size="sm"
              variant="danger"
              onClick={() => {
                if (window.confirm("Delete ALL submissions? This cannot be undone.")) {
                  clearAll();
                }
              }}
            >
              Delete All
            </Button>
          )}

          {onBackToBuilder && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onBackToBuilder}
            >
              Back to Builder
            </Button>
          )}
        </div>
      </header>

      {/* List */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {submissions.length === 0 && (
            <p className="text-sm text-gray-500">
              No submissions yet. Go to the builder, open Preview, fill the form and submit.
            </p>
          )}

          <div className="space-y-4">
            {submissions.map((s) => (
              <div
                key={s.id}
                className="border rounded-md bg-white shadow-sm p-4 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                      {s.config.label || "Untitled Form"}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(s.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setActive({ submission: s, mode: "view" })}
                    >
                      View
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setActive({ submission: s, mode: "edit" })}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => handleExportPdf(s)}
                    >
                      PDF
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => deleteSubmission(s.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {active && (
        <FormPreviewModal
          config={active.submission.config}
          mode={active.mode}
          initialValues={active.submission.values}
          submissionId={active.submission.id}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
};

export default FormHistoryPage;
