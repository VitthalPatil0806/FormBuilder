// apps/form-builder/src/app/components/organisms/RowEditor.tsx
import React, { useMemo } from "react";
import { FIELD_SIZE_TO_PERCENT, FieldMeta, FieldSize } from "../../domain/formTypes";
import Button from "../atoms/Button";
import FieldCard from "./FieldCard";

interface RowEditorProps {
  rowId: string;
  fields: FieldMeta[];
  sectionId: string;
  onChangeField: (fieldId: string, patch: Partial<FieldMeta>) => void;
  onDeleteField: (fieldId: string) => void;
  onAddField: () => void;
  onDeleteRow: () => void;
}

const colMap: Record<FieldSize, string> = {
  sm: "col-span-4",  // 33%
  md: "col-span-6",  // 50%
  lg: "col-span-8",  // 66%
  xl: "col-span-12", // 100%
};

const RowEditor: React.FC<RowEditorProps> = ({
  rowId,
  fields,
  onChangeField,
  onDeleteField,
  onAddField,
  onDeleteRow,
}) => {
  const totalWidth = useMemo(
    () =>
      fields.reduce(
        (sum, f) => sum + FIELD_SIZE_TO_PERCENT[f.size],
        0
      ),
    [fields]
  );

  return (
    <div className="border border-gray-200 rounded-md p-4 bg-gray-50 space-y-3 mb-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Row {rowId.slice(0, 4)} • Width total: {totalWidth}%
        </span>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={onAddField}>
            + Field
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onDeleteRow}>
            Remove Row
          </Button>
        </div>
      </div>

      {/* Warning when width exceeds */}
      {totalWidth > 100 && (
        <p className="text-xs text-red-500 font-medium">
          {/* ⚠ Total width exceeds 100%. Resize fields to fix layout. */}
        </p>
      )}

      {/* Fields Grid */}
      <div className="grid grid-cols-12 gap-4">
        {fields.map((field) => (
          <div key={field.id} className={colMap[field.size]}>
            <FieldCard
              field={field}
              onChange={(patch) => onChangeField(field.id, patch)}
              onDelete={() => onDeleteField(field.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(RowEditor);
