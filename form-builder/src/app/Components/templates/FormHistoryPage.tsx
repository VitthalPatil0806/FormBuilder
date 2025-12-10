// apps/form-builder/src/app/components/templates/FormHistoryPage.tsx
import React, { useState } from "react";
import Button from "../atoms/Button";
import { useFormHistory } from "../../contexts/FormHistoryContext";
import FormPreviewModal from "../organisms/FormPreviewModal";
import { generatePDF } from "../../utils/pdfGenerator";

interface Props {
  onBackToBuilder: () => void;
  onEditLayoutFromHistory: (id: string) => void;
}

const FormHistoryPage: React.FC<Props> = ({
  onBackToBuilder,
  onEditLayoutFromHistory,
}) => {
  const { submissions, deleteSubmission, clearAll } = useFormHistory();

  // For preview modal (view / edit values)
  const [previewInfo, setPreviewInfo] = useState<{
    id: string;
    mode: "view" | "edit";
  } | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-700">
            Form Submission History
          </h1>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onBackToBuilder}
            >
              Back to Builder
            </Button>

            {submissions.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={clearAll}
              >
                Delete All
              </Button>
            )}
          </div>
        </header>

        {/* EMPTY STATE */}
        {submissions.length === 0 ? (
          <p className="text-center text-gray-500">
            No submissions yet. Create one from the Builder.
          </p>
        ) : (
          <div className="space-y-5">
            {submissions.map((s) => (
              <div
                key={s.id}
                className="border rounded-md bg-white shadow-sm p-5 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-lg">{s.config.label}</h2>
                  <span className="text-xs text-gray-500">
                    {new Date(s.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 pt-3 border-t">

                  {/* VIEW */}
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setPreviewInfo({ id: s.id, mode: "view" })}
                  >
                    View
                  </Button>

                  {/* EDIT VALUES */}
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setPreviewInfo({ id: s.id, mode: "edit" })}
                  >
                    Edit Values
                  </Button>

                  {/* EDIT FORM LAYOUT */}
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      onEditLayoutFromHistory(s.id); // pass existing submission id
                      onBackToBuilder();             // redirect to builder
                    }}
                  >
                    Edit Form Layout
                  </Button>

                  {/* PDF (placeholder) */}
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      generatePDF(s.config, s.values);
                    }}
                  >
                    PDF
                  </Button>



                  {/* DELETE */}
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
            ))}
          </div>
        )}

        {/* 🔥 PREVIEW MODAL FOR VIEW / EDIT VALUES */}
        {previewInfo && (
          <FormPreviewModal
            config={
              submissions.find((x) => x.id === previewInfo.id)!.config
            }
            mode={previewInfo.mode}
            submissionId={previewInfo.id}
            onClose={() => setPreviewInfo(null)}
          />
        )}
      </div>
    </div>
  );
};

export default FormHistoryPage;
