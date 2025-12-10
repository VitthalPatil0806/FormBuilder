// apps/form-builder/src/app/context/FormBuilderContext.tsx
import React, { createContext, useContext, useReducer } from "react";
import { FormConfig, SectionMeta, FieldType } from "../domain/formTypes";

// -------------------------
// TYPES
// -------------------------
interface FormBuilderState {
  config: FormConfig;

  // NEW: Layout editing mode flags
  editingLayoutSubmissionId?: string | null;
  editingLayoutValues?: Record<string, any> | null;
}

type Action =
  | { type: "SET_FORM_LABEL"; label: string }
  | { type: "SET_VIEW_TYPE"; viewType: "create" | "edit" | "view" }
  | { type: "SET_SECTIONS_ENABLED"; enabled: boolean }
  | { type: "ADD_SECTION" }
  | { type: "UPDATE_SECTION_LABEL"; sectionId: string; label: string }
  | { type: "TOGGLE_SECTION_COLLAPSE"; sectionId: string }
  | { type: "DELETE_SECTION"; sectionId: string }
  | { type: "ADD_ROW"; sectionId: string }
  | { type: "DELETE_ROW"; sectionId: string; rowId: string }
  | {
      type: "ADD_FIELD";
      sectionId: string;
      rowId: string;
      fieldType: FieldType;
    }
  | {
      type: "UPDATE_FIELD";
      sectionId: string;
      rowId: string;
      fieldId: string;
      patch: any;
    }
  | {
      type: "DELETE_FIELD";
      sectionId: string;
      rowId: string;
      fieldId: string;
    }
  // NEW ACTIONS
  | {
      type: "START_EDIT_LAYOUT";
      submissionId: string;
      values: Record<string, any>;
    }
  | {
      type: "END_EDIT_LAYOUT";
    };

// -------------------------
// INITIAL STATE
// -------------------------
const initialState: FormBuilderState = {
  config: {
    label: "Untitled Form",
    viewType: "create",
    sectionsEnabled: true,
    sections: [],
  },

  editingLayoutSubmissionId: null,
  editingLayoutValues: null,
};

// -------------------------
// REDUCER
// -------------------------
function reducer(state: FormBuilderState, action: Action): FormBuilderState {
  switch (action.type) {
    case "SET_FORM_LABEL":
      return {
        ...state,
        config: { ...state.config, label: action.label },
      };

    case "SET_VIEW_TYPE":
      return {
        ...state,
        config: { ...state.config, viewType: action.viewType },
      };

    case "SET_SECTIONS_ENABLED":
      return {
        ...state,
        config: { ...state.config, sectionsEnabled: action.enabled },
      };

    // -------------------------
    // SECTIONS
    // -------------------------
    case "ADD_SECTION":
      return {
        ...state,
        config: {
          ...state.config,
          sections: [
            ...state.config.sections,
            {
              id: crypto.randomUUID(),
              label: "New Section",
              collapsed: false,
              rows: [],
            },
          ],
        },
      };

    case "UPDATE_SECTION_LABEL":
      return {
        ...state,
        config: {
          ...state.config,
          sections: state.config.sections.map((s) =>
            s.id === action.sectionId ? { ...s, label: action.label } : s
          ),
        },
      };

    case "TOGGLE_SECTION_COLLAPSE":
      return {
        ...state,
        config: {
          ...state.config,
          sections: state.config.sections.map((s) =>
            s.id === action.sectionId ? { ...s, collapsed: !s.collapsed } : s
          ),
        },
      };

    case "DELETE_SECTION":
      return {
        ...state,
        config: {
          ...state.config,
          sections: state.config.sections.filter(
            (s) => s.id !== action.sectionId
          ),
        },
      };

    // -------------------------
    // ROWS
    // -------------------------
    case "ADD_ROW":
      return {
        ...state,
        config: {
          ...state.config,
          sections: state.config.sections.map((s) =>
            s.id === action.sectionId
              ? {
                  ...s,
                  rows: [
                    ...s.rows,
                    { id: crypto.randomUUID(), fields: [] },
                  ],
                }
              : s
          ),
        },
      };

    case "DELETE_ROW":
      return {
        ...state,
        config: {
          ...state.config,
          sections: state.config.sections.map((s) =>
            s.id === action.sectionId
              ? {
                  ...s,
                  rows: s.rows.filter((r) => r.id !== action.rowId),
                }
              : s
          ),
        },
      };

    // -------------------------
    // FIELDS
    // -------------------------
    case "ADD_FIELD":
      return {
        ...state,
        config: {
          ...state.config,
          sections: state.config.sections.map((s) =>
            s.id === action.sectionId
              ? {
                  ...s,
                  rows: s.rows.map((r) =>
                    r.id === action.rowId
                      ? {
                          ...r,
                          fields: [
                            ...r.fields,
                            {
                              id: crypto.randomUUID(),
                              name: "field_" + crypto.randomUUID().slice(0, 6),
                              label: "New Field",
                              type: action.fieldType,
                              required: false,
                              size: "sm",
                              options: [],
                            },
                          ],
                        }
                      : r
                  ),
                }
              : s
          ),
        },
      };

    case "UPDATE_FIELD":
      return {
        ...state,
        config: {
          ...state.config,
          sections: state.config.sections.map((s) =>
            s.id === action.sectionId
              ? {
                  ...s,
                  rows: s.rows.map((r) =>
                    r.id === action.rowId
                      ? {
                          ...r,
                          fields: r.fields.map((f) =>
                            f.id === action.fieldId
                              ? { ...f, ...action.patch }
                              : f
                          ),
                        }
                      : r
                  ),
                }
              : s
          ),
        },
      };

    case "DELETE_FIELD":
      return {
        ...state,
        config: {
          ...state.config,
          sections: state.config.sections.map((s) =>
            s.id === action.sectionId
              ? {
                  ...s,
                  rows: s.rows.map((r) => ({
                    ...r,
                    fields: r.fields.filter((f) => f.id !== action.fieldId),
                  })),
                }
              : s
          ),
        },
      };

    // -------------------------
    // NEW: START EDIT LAYOUT
    // -------------------------
    case "START_EDIT_LAYOUT":
      return {
        ...state,
        editingLayoutSubmissionId: action.submissionId,
        editingLayoutValues: action.values,
      };

    case "END_EDIT_LAYOUT":
      return {
        ...state,
        editingLayoutSubmissionId: null,
        editingLayoutValues: null,
      };

    default:
      return state;
  }
}

// -------------------------
// CONTEXT
// -------------------------
const FormBuilderContext = createContext<any>(null);

export const FormBuilderProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FormBuilderContext.Provider value={{ ...state, dispatch }}>
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilder = () => useContext(FormBuilderContext);
