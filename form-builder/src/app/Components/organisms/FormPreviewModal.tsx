// apps/form-builder/src/app/components/organisms/FormPreviewModal.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FieldSize, FormConfig } from "../../domain/formTypes";
import { useFormHistory } from "../../contexts/FormHistoryContext";

interface FormPreviewModalProps {
  config: FormConfig;
  mode?: "create" | "edit" | "view";
  initialValues?: Record<string, any>;
  submissionId?: string; // for edit
  onClose: () => void;
}

const sizeToCol: Record<FieldSize, string> = {
  sm: "col-span-4",
  md: "col-span-6",
  lg: "col-span-8",
  xl: "col-span-12",
};

const FormPreviewModal: React.FC<FormPreviewModalProps> = ({
  config,
  mode = "create",
  initialValues,
  submissionId,
  onClose,
}) => {
  const readonly = mode === "view";
  const { addSubmission, updateSubmission } = useFormHistory();

const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm({
  defaultValues: initialValues || {}
});

  useEffect(() => {
    reset(initialValues || {});
  }, [initialValues, reset]);

  const onSubmit = (values: any) => {
    if (readonly) {
      onClose();
      return;
    }
    if (submissionId) {
      updateSubmission(submissionId, values);
    } else {
      addSubmission(config, values);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-8 relative">
        {/* Close */}
        <button
          className="absolute top-4 right-5 text-gray-600 hover:text-black text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {config.label || "Untitled Form"}
        </h1>
        <p className="text-xs text-gray-500 mb-4">
          Mode:{" "}
          <span className="font-semibold">
            {mode === "create" && "Create"}
            {mode === "edit" && "Edit"}
            {mode === "view" && "View (read-only)"}
          </span>
        </p>
        <hr className="mb-6" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sections */}
          {config.sections.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              No sections configured yet.
            </p>
          )}

          {config.sections.map((section) => (
            <div key={section.id} className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {section.label || "Untitled Section"}
              </h2>

              {section.rows.map((row) => (
                <div key={row.id} className="grid grid-cols-12 gap-4 mb-4">
                  {row.fields.map((field) => (
                    <div key={field.id} className={sizeToCol[field.size]}>
                      {/* Label */}
                      {field.type !== "checkbox" && (
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label || "Field"}
                          {field.required && (
                            <span className="text-red-500 ml-0.5">*</span>
                          )}
                        </label>
                      )}

                      {/* Type-specific inputs */}
                      {field.type === "text" && (
                        <input
                          type="text"
                          {...register(field.name, {
                          required: field.required ? "This field is required" : false,
                          })}

                          className="w-full border rounded-md px-2 py-1 text-sm"
                          disabled={readonly}
                        />
                        
                      )}

                      {field.type === "number" && (
                        <input
                          type="number"
                          {...register(field.name, {
                          required: field.required ? "This field is required" : false,
                          })}
                          className="w-full border rounded-md px-2 py-1 text-sm"
                          disabled={readonly}
                        />
                      )}

                      {field.type === "textarea" && (
                        <textarea
                          {...register(field.name, {
                          required: field.required ? "This field is required" : false,
                          })}
                          className="w-full border rounded-md px-2 py-1 text-sm"
                          rows={3}
                          disabled={readonly}
                        />
                      )}

                      {field.type === "date" && (
                        <input
                          type="date"
                          {...register(field.name, {
                          required: field.required ? "This field is required" : false,
                          })}
                          className="w-full border rounded-md px-2 py-1 text-sm"
                          disabled={readonly}
                        />
                      )}

                      {field.type === "checkbox" && (
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            {...register(field.name, {
                            required: field.required ? "This field is required" : false,
                            })}
                            className="w-4 h-4"
                            disabled={readonly}
                          />
                          <span>
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-0.5">*</span>
                            )}
                          </span>
                        </label>
                      )}

                      {field.type === "select" && (
                    <select
                      {...register(field.name, {
                      required: field.required ? "This field is required" : false,
                      })}
                      className="w-full border rounded-md px-2 py-1 text-sm"
                      disabled={readonly}
                    >
                      <option value="">Select...</option>
                      {field.options?.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                      )}

                      {errors[field.name] && !readonly && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors[field.name]?.message as string}
                      </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {!readonly && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormPreviewModal;
