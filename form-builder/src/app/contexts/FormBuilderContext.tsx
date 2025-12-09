// apps/form-builder/src/app/context/FormBuilderContext.tsx
import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  FieldMeta,
  FieldSize,
  FieldType,
  FormConfig,
  FormViewType,
  RowMeta,
  SectionMeta,
} from "../domain/formTypes";

type Action =
  | { type: "SET_FORM_LABEL"; label: string }
  | { type: "SET_VIEW_TYPE"; viewType: FormViewType }
  | { type: "SET_SECTIONS_ENABLED"; enabled: boolean }
  | { type: "ADD_SECTION" }
  | { type: "DELETE_SECTION"; sectionId: string }
  | { type: "TOGGLE_SECTION_COLLAPSE"; sectionId: string }
  | { type: "UPDATE_SECTION_LABEL"; sectionId: string; label: string }
  | { type: "ADD_ROW"; sectionId: string }
  | { type: "DELETE_ROW"; sectionId: string; rowId: string }
  | { type: "ADD_FIELD"; sectionId: string; rowId: string; fieldType: FieldType }
  | { type: "DELETE_FIELD"; sectionId: string; rowId: string; fieldId: string }
  | {
      type: "UPDATE_FIELD";
      sectionId: string;
      rowId: string;
      fieldId: string;
      patch: Partial<FieldMeta>;
    };

interface FormBuilderContextValue {
  config: FormConfig;
  dispatch: React.Dispatch<Action>;
}

const FormBuilderContext = createContext<FormBuilderContextValue | null>(null);

const createId = () => Math.random().toString(36).slice(2);

const createDefaultField = (fieldType: FieldType): FieldMeta => ({
  id: createId(),
  name: `field_${Math.random().toString(36).slice(2, 7)}`,
  label: "Field label",
  type: fieldType,
  size: "sm",
  required: false,
  options: fieldType === "select" ? ["Option 1"] : undefined,
});

const createDefaultRow = (): RowMeta => ({
  id: createId(),
  fields: [createDefaultField("text"), createDefaultField("text"), createDefaultField("text")],
});

const createDefaultSection = (): SectionMeta => ({
  id: createId(),
  label: "New Section",
  collapsed: false,
  rows: [createDefaultRow()],
});

const initialConfig: FormConfig = {
  id: "form-1",
  label: "",
  viewType: "create",
  sectionsEnabled: true,
  sections: [createDefaultSection()],
};

function reducer(state: FormConfig, action: Action): FormConfig {
  switch (action.type) {
    case "SET_FORM_LABEL":
      return { ...state, label: action.label };
    case "SET_VIEW_TYPE":
      return { ...state, viewType: action.viewType };
    case "SET_SECTIONS_ENABLED":
      return { ...state, sectionsEnabled: action.enabled };
    case "ADD_SECTION":
      return { ...state, sections: [...state.sections, createDefaultSection()] };
    case "DELETE_SECTION":
      return {
        ...state,
        sections: state.sections.filter((s) => s.id !== action.sectionId),
      };
    case "TOGGLE_SECTION_COLLAPSE":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId ? { ...s, collapsed: !s.collapsed } : s
        ),
      };
    case "UPDATE_SECTION_LABEL":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId ? { ...s, label: action.label } : s
        ),
      };
    case "ADD_ROW":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? { ...s, rows: [...s.rows, createDefaultRow()] }
            : s
        ),
      };
    case "DELETE_ROW":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? { ...s, rows: s.rows.filter((r) => r.id !== action.rowId) }
            : s
        ),
      };
    case "ADD_FIELD":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                rows: s.rows.map((r) =>
                  r.id === action.rowId
                    ? {
                        ...r,
                        fields: [...r.fields, createDefaultField(action.fieldType)],
                      }
                    : r
                ),
              }
            : s
        ),
      };
    case "DELETE_FIELD":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                rows: s.rows.map((r) =>
                  r.id === action.rowId
                    ? {
                        ...r,
                        fields: r.fields.filter((f) => f.id !== action.fieldId),
                      }
                    : r
                ),
              }
            : s
        ),
      };
case "UPDATE_FIELD":
  return {
    ...state,
    sections: state.sections.map((section) =>
      section.id === action.sectionId
        ? {
            ...section,
            rows: section.rows.map((row) =>
              row.id === action.rowId
                ? {
                    ...row,
                    fields: row.fields.map((field) =>
                      field.id === action.fieldId
                        ? { ...field, ...action.patch }  // 👈 ENSURES options are updated
                        : field
                    ),
                  }
                : row
            ),
          }
        : section
    ),
  };

    default:
      return state;
  }
}

export const FormBuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, dispatch] = useReducer(reducer, initialConfig);

  const value = useMemo(() => ({ config, dispatch }), [config]);

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilder = () => {
  const ctx = useContext(FormBuilderContext);
  if (!ctx) {
    throw new Error("useFormBuilder must be used within FormBuilderProvider");
  }
  return ctx;
};
