// apps/form-builder/src/app/components/organisms/FormPreviewModal.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../atoms/Button";
import { useFormHistory } from "../../contexts/FormHistoryContext";
import { FormConfig } from "../../domain/formTypes";

interface Props {
  config: FormConfig;
  mode: "create" | "edit" | "view" | "layout-edit-builder";
  submissionId?: string;
  existingValues?: Record<string, any>;
  onClose: () => void;
  onLayoutSaved?: () => void;
}

const FormPreviewModal: React.FC<Props> = ({
  config,
  mode,
  submissionId,
  existingValues,
  onClose,
  onLayoutSaved,
}) => {
  const {
    submissions,
    addSubmission,
    updateSubmission,
    updateSubmissionLayout,
  } = useFormHistory();

  const submission = submissions.find((s) => s.id === submissionId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Record<string, any>>({ defaultValues: {} });

  const isView = mode === "view";
  const isEditValues = mode === "edit";
  const isLayoutEdit = mode === "layout-edit-builder";
  const disableInputs = isView || isLayoutEdit;

  // Load values depending on mode
  useEffect(() => {
    if (isEditValues && submission) {
      reset(submission.values);
    } else if (isView && submission) {
      reset(submission.values);
    } else if (isLayoutEdit && existingValues) {
      reset(existingValues);
    }
  }, [submission, existingValues, mode, reset, isEditValues, isView, isLayoutEdit]);

  const onSubmit = (values: Record<string, any>) => {
    if (mode === "create") {
      addSubmission(config, values);
      alert("✔ Form submitted");
      onClose();
      return;
    }

    if (isEditValues && submissionId) {
      updateSubmission(submissionId, values);
      alert("✔ Values updated");
      onClose();
      return;
    }

    if (isLayoutEdit && submissionId) {
      updateSubmissionLayout(submissionId, config);
      alert("✔ Layout updated");
      onLayoutSaved?.();
      onClose();
      return;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✖
        </button>

        <h1 className="text-2xl font-semibold mb-1">{config.label}</h1>
        <p className="text-xs text-gray-500 mb-4">
          {mode === "create" && "Mode: Create — Submit new form"}
          {mode === "edit" && "Mode: Edit — Modify existing form values"}
          {mode === "view" && "Mode: View — Read only"}
          {mode === "layout-edit-builder" &&
            "Mode: Edit Layout — Only form structure can be changed; values are visible but locked"}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {config.sectionsEnabled &&
            config.sections.map((section) => (
              <div
                key={section.id}
                className="border rounded-md p-4 bg-gray-50 shadow-sm"
              >
                <h2 className="text-md font-semibold mb-3">{section.label}</h2>

                {section.rows.map((row) => (
                  <div
                    key={row.id}
                    className="grid mb-4"
                    style={{
                      gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                      gap: "14px",
                    }}
                  >
                    {row.fields.map((field) => {
                      const colSpan =
                        field.size === "sm"
                          ? "span 4"
                          : field.size === "md"
                          ? "span 6"
                          : field.size === "lg"
                          ? "span 8"
                          : "span 12";

                      return (
                        <div key={field.id} style={{ gridColumn: colSpan }}>
                          {/* LABEL */}
                          {field.type !== "checkbox" && (
                            <label className="block text-sm font-medium mb-1">
                              {field.label}
                              {field.required && <span className="text-red-500">*</span>}
                            </label>
                          )}

                          {/* TEXT */}
                          {field.type === "text" && (
                            <input
                              {...register(field.name, {
                                required: !isLayoutEdit && field.required,
                              })}
                              disabled={disableInputs}
                              readOnly={isLayoutEdit}
                              className={`w-full border rounded px-2 py-1 ${
                                errors[field.name] && "border-red-500"
                              }`}
                            />
                          )}

                          {/* NUMBER */}
                          {field.type === "number" && (
                            <input
                              type="number"
                              {...register(field.name, {
                                required: !isLayoutEdit && field.required,
                              })}
                              disabled={disableInputs}
                              readOnly={isLayoutEdit}
                              className={`w-full border rounded px-2 py-1 ${
                                errors[field.name] && "border-red-500"
                              }`}
                            />
                          )}

                          {/* DATE */}
                          {field.type === "date" && (
                            <input
                              type="date"
                              {...register(field.name, {
                                required: !isLayoutEdit && field.required,
                              })}
                              disabled={disableInputs}
                              readOnly={isLayoutEdit}
                              className={`w-full border rounded px-2 py-1 ${
                                errors[field.name] && "border-red-500"
                              }`}
                            />
                          )}

                          {/* TEXTAREA */}
                          {field.type === "textarea" && (
                            <textarea
                              {...register(field.name, {
                                required: !isLayoutEdit && field.required,
                              })}
                              disabled={disableInputs}
                              readOnly={isLayoutEdit}
                              rows={3}
                              className={`w-full border rounded px-2 py-1 resize-y ${
                                errors[field.name] && "border-red-500"
                              }`}
                            />
                          )}

                          {/* CHECKBOX */}
                          {field.type === "checkbox" && (
                            <label className="inline-flex items-center gap-2 mt-5 text-sm">
                              <input
                                type="checkbox"
                                {...register(field.name)}
                                disabled={disableInputs}
                                readOnly={isLayoutEdit}
                                className="w-4 h-4"
                              />
                              {field.label}
                              {field.required && <span className="text-red-500">*</span>}
                            </label>
                          )}

                          {/* SELECT */}
                          {field.type === "select" && (
                            <select
                              {...register(field.name, {
                                required: !isLayoutEdit && field.required,
                              })}
                              disabled={disableInputs}
                              readOnly={isLayoutEdit}
                              className={`w-full border rounded px-2 py-1 ${
                                errors[field.name] && "border-red-500"
                              }`}
                            >
                              <option value="">Select</option>
                              {field.options?.map((op, idx) => (
                                <option key={idx} value={op}>
                                  {op}
                                </option>
                              ))}
                            </select>
                          )}

                          {/* ERROR */}
                          {errors[field.name] && !disableInputs && (
                            <p className="text-xs text-red-500 mt-1">
                              {field.label} is required
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}

          {/* FOOTER BUTTONS */}
          <div className="flex justify-end gap-4 border-t pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Close
            </Button>

            {mode === "create" && <Button type="submit">Submit</Button>}
            {mode === "edit" && <Button type="submit">Save</Button>}
            {mode === "layout-edit-builder" && (
              <Button type="submit">Save Edited Layout</Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPreviewModal;
