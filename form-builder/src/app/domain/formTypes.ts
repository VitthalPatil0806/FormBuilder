// apps/form-builder/src/app/domain/formTypes.ts

export type FormViewType = "create" | "edit" | "view";

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "checkbox"
  | "select"
  | "date";

export type FieldSize = "sm" | "md" | "lg" | "xl";

export interface FieldMeta {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  size: FieldSize;
  required: boolean;
  options?: string[];   // for select dropdown values
}

export interface RowMeta {
  id: string;
  fields: FieldMeta[];
}

export interface SectionMeta {
  id: string;
  label: string;
  collapsed: boolean;
  rows: RowMeta[];
}

export interface FormConfig {
  id: string;
  label: string;
  viewType: FormViewType;
  sectionsEnabled: boolean;
  sections: SectionMeta[];
}

export const FIELD_SIZE_TO_PERCENT: Record<FieldSize, number> = {
  sm: 33,
  md: 50,
  lg: 66,
  xl: 100,
};

export const FIELD_SIZE_LABEL: Record<FieldSize, string> = {
  sm: "Small (33%)",
  md: "Medium (50%)",
  lg: "Large (66%)",
  xl: "Extra-large (100%)",
};
