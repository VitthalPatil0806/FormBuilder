// apps/form-builder/src/app/components/templates/FormLayoutBuilderPage.tsx
import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseConfigSchema, validateLayoutTree } from "../../validation/formSchema";
import { useFormBuilder } from "../../contexts/FormBuilderContext";
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
  onGoToHistory?: () => void;
}

const FormLayoutBuilderPage: React.FC<Props> = ({ onGoToHistory }) => {
  const { config, dispatch } = useFormBuilder();
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

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
        console.log("Form config:", { ...config, ...data });
        alert("Form configuration is valid. See console for JSON.");
      }
    },
    [config, dispatch]
  );

  const onAddSection = () => dispatch({ type: "ADD_SECTION" });

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
        patch: Partial<SectionMeta["rows"][number]["fields"][number]>
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
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-gray-200">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Dynamic Form Layout Builder
          </h1>
          <p className="text-xs text-gray-500">
            Configure form sections, rows, and fields using a metadata-driven layout system
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onGoToHistory && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onGoToHistory}
            >
              View History
            </Button>
          )}

          {/* Preview button */}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              // sync latest form values to context
              dispatch({ type: "SET_FORM_LABEL", label: watch("label") });
              dispatch({ type: "SET_VIEW_TYPE", viewType: currentViewType });
              dispatch({
                type: "SET_SECTIONS_ENABLED",
                enabled: watch("sectionsEnabled"),
              });
              setShowPreview(true);
            }}
          >
            Preview
          </Button>

          {/* Save / Validate button */}
          <Button
            type="submit"
            form="form-layout-builder"
            size="sm"
            className="shadow-md"
          >
            Validate & Save
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: configuration panel */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-auto shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 tracking-wide uppercase">
            Form Settings
          </h2>

          <form
            id="form-layout-builder"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <TextInput
              label="Form Label"
              {...register("label")}
              error={errors.label?.message}
            />

            <SelectInput
              label="View Type"
              {...register("viewType")}
              error={errors.viewType?.message}
            >
              <option value="">Select view type</option>
              <option value="create">Create</option>
              <option value="edit">Edit</option>
              <option value="view">View</option>
            </SelectInput>

            <Toggle
              label="Enable Sections"
              checked={sectionsEnabled}
              onChange={(checked) =>
                setValue("sectionsEnabled", checked, { shouldValidate: true })
              }
            />

            {validationMessages.length > 0 && (
              <div className="border border-red-300 bg-red-50 rounded-md p-3 space-y-1">
                <p className="text-xs font-semibold text-red-600">
                  Validation issues found:
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

        {/* Center: builder canvas */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-semibold tracking-wide text-gray-600 uppercase">
                Sections & Layout
              </h2>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={onAddSection}
                disabled={!sectionsEnabled}
                className="shadow-sm"
              >
                + Add Section
              </Button>
            </div>

            {!sectionsEnabled && (
              <p className="text-sm text-gray-500 italic">
                Sections are disabled. Enable from the left panel to start configuring layout.
              </p>
            )}

            {sectionsEnabled &&
              config.sections.map((section) => (
                <SectionAccordion
                  key={section.id}
                  section={section}
                  onUpdateLabel={(label) =>
                    onSectionOperations.updateLabel(section, label)
                  }
                  onToggleCollapse={() =>
                    onSectionOperations.toggleCollapse(section)
                  }
                  onDelete={() => onSectionOperations.delete(section)}
                  onAddRow={() => onSectionOperations.addRow(section)}
                  onDeleteRow={(rowId) =>
                    onSectionOperations.deleteRow(section, rowId)
                  }
                  onAddField={(rowId, type) =>
                    onSectionOperations.addField(section, rowId, type)
                  }
                  onDeleteField={(rowId, fieldId) =>
                    onSectionOperations.deleteField(section, rowId, fieldId)
                  }
                  onUpdateField={(rowId, fieldId, patch) =>
                    onSectionOperations.updateField(
                      section,
                      rowId,
                      fieldId,
                      patch
                    )
                  }
                />
              ))}
          </div>
        </main>
      </div>

      {/* Preview runtime modal */}
      {showPreview && (
        <FormPreviewModal
          config={config}
          mode={currentViewType} // "create" | "edit" | "view"
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default FormLayoutBuilderPage;
