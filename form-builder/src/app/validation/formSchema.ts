// apps/form-builder/src/app/validation/formSchema.ts
import { z } from "zod";
import { FIELD_SIZE_TO_PERCENT } from "../domain/formTypes";

export const baseConfigSchema = z.object({
  label: z.string().min(1, "Form label is required"),
  viewType: z.enum(["create", "edit", "view"], {
    required_error: "View type is required",
  }),
  sectionsEnabled: z.boolean(),
});

/**
 * Additional business-rule validation done on metadata tree (sections/rows/fields).
 */

export interface SizeValidationError {
  message: string;
  sectionId?: string;
  rowId?: string;
}

export function validateLayoutTree(config: {
  sectionsEnabled: boolean;
  sections: {
    id: string;
    label: string;
    rows: { id: string; fields: { size: string; label: string }[] }[];
  }[];
}): SizeValidationError[] {
  const errors: SizeValidationError[] = [];

  if (config.sectionsEnabled) {
    if (config.sections.length === 0) {
      errors.push({ message: "At least one section is required." });
    }

    config.sections.forEach((section) => {
      if (!section.label.trim()) {
        errors.push({
          message: "Section label is required.",
          sectionId: section.id,
        });
      }

      if (section.rows.length === 0) {
        errors.push({
          message: `Section "${section.label || "Untitled"}" must have at least one row.`,
          sectionId: section.id,
        });
      }

      section.rows.forEach((row) => {
        if (row.fields.length === 0) {
          errors.push({
            message: `Each row must contain at least one field (section "${section.label}").`,
            sectionId: section.id,
            rowId: row.id,
          });
        }

        const totalWidth = row.fields.reduce((sum, f) => {
          const pct = FIELD_SIZE_TO_PERCENT[f.size as keyof typeof FIELD_SIZE_TO_PERCENT] || 0;
          return sum + pct;
        }, 0);

        if (totalWidth > 100) {
          errors.push({
            message: `Row in section "${section.label}" exceeds 100% width (currently ${totalWidth}%).`,
            sectionId: section.id,
            rowId: row.id,
          });
        }

        row.fields.forEach((field) => {
          if (!field.label.trim()) {
            errors.push({
              message: "All fields must have a label.",
              sectionId: section.id,
              rowId: row.id,
            });
          }
        });
      });
    });
  }

  return errors;
}
