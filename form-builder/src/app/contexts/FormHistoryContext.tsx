import React, { createContext, useContext, useReducer, useMemo } from "react";
import { FormConfig } from "../domain/formTypes";

export interface FormSubmission {
  id: string;
  config: FormConfig;
  values: Record<string, any>;
  createdAt: number;
}

type HistoryAction =
  | { type: "ADD_SUBMISSION"; payload: { config: FormConfig; values: Record<string, any> } }
  | { type: "UPDATE_SUBMISSION"; id: string; values: Record<string, any> }
  | { type: "DELETE_SUBMISSION"; id: string }
  | { type: "CLEAR_ALL" };

interface FormHistoryContextValue {
  submissions: FormSubmission[];
  addSubmission: (config: FormConfig, values: Record<string, any>) => void;
  updateSubmission: (id: string, values: Record<string, any>) => void;
  deleteSubmission: (id: string) => void;
  clearAll: () => void;
}

const FormHistoryContext = createContext<FormHistoryContextValue | null>(null);

const createId = () => Math.random().toString(36).slice(2);

function reducer(state: FormSubmission[], action: HistoryAction): FormSubmission[] {
  switch (action.type) {
    case "ADD_SUBMISSION":
      return [
        {
          id: createId(),
          config: action.payload.config,
          values: action.payload.values,
          createdAt: Date.now(),
        },
        ...state,
      ];
    case "UPDATE_SUBMISSION":
      return state.map((s) =>
        s.id === action.id ? { ...s, values: action.values } : s
      );
    case "DELETE_SUBMISSION":
      return state.filter((s) => s.id !== action.id);
    case "CLEAR_ALL":
      return [];
    default:
      return state;
  }
}

export const FormHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, dispatch] = useReducer(reducer, []);

  const addSubmission = (config: FormConfig, values: Record<string, any>) =>
    dispatch({ type: "ADD_SUBMISSION", payload: { config, values } });

  const updateSubmission = (id: string, values: Record<string, any>) =>
    dispatch({ type: "UPDATE_SUBMISSION", id, values });

  const deleteSubmission = (id: string) =>
    dispatch({ type: "DELETE_SUBMISSION", id });

  const clearAll = () => dispatch({ type: "CLEAR_ALL" });

  const value = useMemo(
    () => ({
      submissions,
      addSubmission,
      updateSubmission,
      deleteSubmission,
      clearAll,
    }),
    [submissions]
  );

  return (
    <FormHistoryContext.Provider value={value}>
      {children}
    </FormHistoryContext.Provider>
  );
};

export const useFormHistory = () => {
  const ctx = useContext(FormHistoryContext);
  if (!ctx) throw new Error("useFormHistory must be used within FormHistoryProvider");
  return ctx;
};
