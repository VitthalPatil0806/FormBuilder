import React, { createContext, useContext, useMemo, useReducer } from "react";
import { FormConfig } from "../domain/formTypes";

export interface FormSubmission {
  id: string;
  config: FormConfig;
  values: Record<string, any>;
  createdAt: number;
}

type Action =
  | { type: "ADD_SUBMISSION"; config: FormConfig; values: Record<string, any> }
  | { type: "UPDATE_SUBMISSION"; id: string; values: Record<string, any> }
  | { type: "UPDATE_LAYOUT"; id: string; config: FormConfig }
  | { type: "DELETE_SUBMISSION"; id: string }
  | { type: "CLEAR_ALL" };

const FormHistoryContext = createContext<any>(null);
const randomId = () => Math.random().toString(36).slice(2);

function reducer(state: FormSubmission[], action: Action): FormSubmission[] {
  switch (action.type) {
    case "ADD_SUBMISSION":
      return [
        {
          id: randomId(),
          config: action.config,
          values: action.values,
          createdAt: Date.now(),
        },
        ...state,
      ];

    case "UPDATE_SUBMISSION":
      return state.map((s) =>
        s.id === action.id ? { ...s, values: action.values } : s
      );

    case "UPDATE_LAYOUT":
      return state.map((s) =>
        s.id === action.id ? { ...s, config: action.config } : s
      );

    case "DELETE_SUBMISSION":
      return state.filter((s) => s.id !== action.id);

    case "CLEAR_ALL":
      return [];

    default:
      return state;
  }
}

export const FormHistoryProvider = ({ children }: { children: any }) => {
  const [submissions, dispatch] = useReducer(reducer, []);

  const value = useMemo(
    () => ({
      submissions,
      addSubmission: (config: FormConfig, values: Record<string, any>) =>
        dispatch({ type: "ADD_SUBMISSION", config, values }),
      updateSubmission: (id: string, values: Record<string, any>) =>
        dispatch({ type: "UPDATE_SUBMISSION", id, values }),
      updateSubmissionLayout: (id: string, config: FormConfig) =>
        dispatch({ type: "UPDATE_LAYOUT", id, config }),
      deleteSubmission: (id: string) =>
        dispatch({ type: "DELETE_SUBMISSION", id }),
      clearAll: () => dispatch({ type: "CLEAR_ALL" }),
    }),
    [submissions]
  );

  return (
    <FormHistoryContext.Provider value={value}>
      {children}
    </FormHistoryContext.Provider>
  );
};

export const useFormHistory = () => useContext(FormHistoryContext);
