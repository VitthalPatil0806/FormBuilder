// apps/form-builder/src/app/components/templates/FormLayoutBuilderPage.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseConfigSchema, validateLayoutTree } from "../../validation/formSchema";
import { useFormBuilder } from "../../contexts/FormBuilderContext";
import { useFormHistory } from "../../contexts/FormHistoryContext";
import { FormViewType, SectionMeta, FieldType } from "../../domain/formTypes";
import TextInput from "../atoms/TextInput";
import SelectInput from "../atoms/SelectInput";
import Toggle from "../atoms/Toggle";
import Button from "../atoms/Button";
import SectionAccordion from "../organisms/SectionAccordion";
import FormPreviewModal from "../organisms/FormPreviewModal";

type BaseConfigInputs = {
  label: string;
  viewType: FormViewType;
  sectionsEnabled: boolean;
};

interface Props {
  onGoToHistory: () => void;
  editingSubmissionId: string | null;
  onFinishLayoutEdit: () => void;
}

const FormLayoutBuilderPage: React.FC<Props> = ({
  onGoToHistory,
  editingSubmissionId,
  onFinishLayoutEdit,
}) => {
  const { config, dispatch, loadConfig } = useFormBuilder();
  const { submissions } = useFormHistory();

  const [showPreview, setShowPreview] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BaseConfigInputs>({
    resolver: zodResolver(baseConfigSchema),
    defaultValues: {
      label: config.label,
      viewType: config.viewType,
      sectionsEnabled: config.sectionsEnabled,
    },
  });

  const sectionsEnabled = watch("sectionsEnabled");
  const currentViewType = watch("viewType") || "create";

  const isEditingExistingLayout = Boolean(editingSubmissionId);

  // find the submission being edited (if any)
  const editingSubmission = editingSubmissionId
    ? submissions.find((s) => s.id === editingSubmissionId)
    : undefined;

  /**
   * Load saved layout into builder when entering Edit Form Layout mode
   * and force builder to allow layout editing.
   */
  useEffect(() => {
    if (editingSubmissionId) {
      const sub = submissions.find((s) => s.id === editingSubmissionId);
      if (sub) {
        // Load config AND unlock layout editing
        dispatch({
          type: "LOAD_CONFIG",
          config: {
            ...sub.config,
            viewType: "create", // unlock editing
            sectionsEnabled: true,
          },
        });

        // Sync left settings panel
        setValue("label", sub.config.label);
        setValue("viewType", sub.config.viewType);
        setValue("sectionsEnabled", sub.config.sectionsEnabled);
      }
    }
  }, [editingSubmissionId, submissions, dispatch, setValue]);

  /**
   * Save config panel settings (Validate & Save)
   */
  const onSubmit = useCallback(
    (data: BaseConfigInputs) => {
      dispatch({ type: "SET_FORM_LABEL", label: data.label });
      dispatch({ type: "SET_VIEW_TYPE", viewType: data.viewType });
      dispatch({ type: "SET_SECTIONS_ENABLED", enabled: data.sectionsEnabled });

      const layoutErrors = validateLayoutTree({
        sectionsEnabled: data.sectionsEnabled,
        sections: config.sections.map((s) => ({
          id: s.id,
          label: s.label,
          rows: s.rows.map((r) => ({
            id: r.id,
            fields: r.fields.map((f) => ({
              size: f.size,
              label: f.label,
            })),
          })),
        })),
      });

      if (layoutErrors.length > 0) {
        setValidationMessages(layoutErrors.map((e) => e.message));
      } else {
        setValidationMessages([]);
        alert("✔ Form layout validated successfully.");
      }
    },
    [config, dispatch]
  );

  /**
   * Section + Field operations
   */
  const onSectionOperations = useMemo(
    () => ({
      updateLabel: (section: SectionMeta, label: string) =>
        dispatch({ type: "UPDATE_SECTION_LABEL", sectionId: section.id, label }),
      toggleCollapse: (section: SectionMeta) =>
        dispatch({ type: "TOGGLE_SECTION_COLLAPSE", sectionId: section.id }),
      delete: (section: SectionMeta) =>
        dispatch({ type: "DELETE_SECTION", sectionId: section.id }),
      addRow: (section: SectionMeta) =>
        dispatch({ type: "ADD_ROW", sectionId: section.id }),
      deleteRow: (section: SectionMeta, rowId: string) =>
        dispatch({ type: "DELETE_ROW", sectionId: section.id, rowId }),
      addField: (section: SectionMeta, rowId: string, fieldType: FieldType) =>
        dispatch({ type: "ADD_FIELD", sectionId: section.id, rowId, fieldType }),
      deleteField: (section: SectionMeta, rowId: string, fieldId: string) =>
        dispatch({ type: "DELETE_FIELD", sectionId: section.id, rowId, fieldId }),
      updateField: (
        section: SectionMeta,
        rowId: string,
        fieldId: string,
        patch: any
      ) =>
        dispatch({
          type: "UPDATE_FIELD",
          sectionId: section.id,
          rowId,
          fieldId,
          patch,
        }),
    }),
    [dispatch]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-gray-200">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Dynamic Form Layout Builder
          </h1>
          <p className="text-xs text-gray-500">
            Add, remove and configure form sections, rows and fields.
          </p>

          {isEditingExistingLayout && (
            <p className="text-xs text-blue-600 mt-1">
              ✨ Editing layout of a submitted form — values will NOT change.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onGoToHistory}
          >
            View History
          </Button>

          {/* Open preview */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              // if editing a saved submission layout, show preview in layout-edit mode
              if (isEditingExistingLayout && editingSubmission) {
                // preview will receive existing values via prop below
                setShowPreview(true);
                return;
              }

              // normal preview behaviour
              setShowPreview(true);
            }}
          >
            Preview
          </Button>

          <Button type="submit" form="form-layout-builder" size="sm">
            Validate & Save
          </Button>
        </div>
      </header>

      {/* MAIN BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-auto shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
            Form Settings
          </h2>
          <form
            id="form-layout-builder"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <TextInput label="Form Label" {...register("label")} error={errors.label?.message} />

            <SelectInput label="View Type" {...register("viewType")} error={errors.viewType?.message}>
              <option value="">Select view type</option>
              <option value="create">Create</option>
              <option value="edit">Edit</option>
              <option value="view">View</option>
            </SelectInput>

            <Toggle
              label="Enable Sections"
              checked={sectionsEnabled}
              onChange={(checked) => setValue("sectionsEnabled", checked)}
            />

            {validationMessages.length > 0 && (
              <div className="border border-red-300 bg-red-50 rounded-md p-3 space-y-1">
                <p className="text-xs font-semibold text-red-600">
                  Validation Issues:
                </p>
                <ul className="list-disc list-inside text-xs text-red-600 space-y-1">
                  {validationMessages.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>

        {/* LAYOUT BUILDER CANVAS */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Sections & Layout
              </h2>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => dispatch({ type: "ADD_SECTION" })}
                disabled={!sectionsEnabled}
              >
                + Add Section
              </Button>
            </div>

            {!sectionsEnabled && (
              <p className="text-sm text-gray-500">
                Sections disabled — enable them from form settings.
              </p>
            )}

            {sectionsEnabled &&
              config.sections.map((section) => (
                <SectionAccordion
                  key={section.id}
                  section={section}
                  onUpdateLabel={(label) => onSectionOperations.updateLabel(section, label)}
                  onToggleCollapse={() => onSectionOperations.toggleCollapse(section)}
                  onDelete={() => onSectionOperations.delete(section)}
                  onAddRow={() => onSectionOperations.addRow(section)}
                  onDeleteRow={(rowId) => onSectionOperations.deleteRow(section, rowId)}
                  onAddField={(rowId, type) => onSectionOperations.addField(section, rowId, type)}
                  onDeleteField={(rowId, fieldId) =>
                    onSectionOperations.deleteField(section, rowId, fieldId)
                  }
                  onUpdateField={(rowId, fieldId, patch) =>
                    onSectionOperations.updateField(section, rowId, fieldId, patch)
                  }
                />
              ))}
          </div>
        </main>
      </div>

      {/* PREVIEW MODAL */}
      {showPreview && (
        <FormPreviewModal
          config={config}
          mode={isEditingExistingLayout ? "layout-edit-builder" : currentViewType}
          submissionId={isEditingExistingLayout ? editingSubmissionId || undefined : undefined}
          existingValues={isEditingExistingLayout ? editingSubmission?.values : undefined}
          onClose={() => setShowPreview(false)}
          onLayoutSaved={() => {
            // return to history after saving layout
            onFinishLayoutEdit();
            onGoToHistory();
          }}
        />
      )}
    </div>
  );
};

export default FormLayoutBuilderPage;
