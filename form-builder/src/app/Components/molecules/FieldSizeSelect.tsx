// apps/form-builder/src/app/components/molecules/FieldSizeSelect.tsx
import React from "react";
import { FieldSize, FIELD_SIZE_LABEL } from "../../domain/formTypes";

interface FieldSizeSelectProps {
  value: FieldSize;
  onChange: (size: FieldSize) => void;
}

const FieldSizeSelect: React.FC<FieldSizeSelectProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as FieldSize)}
      className="border rounded-md px-2 py-1 text-xs bg-white"
    >
      {(Object.keys(FIELD_SIZE_LABEL) as FieldSize[]).map((size) => (
        <option key={size} value={size}>
          {FIELD_SIZE_LABEL[size]}
        </option>
      ))}
    </select>
  );
};

export default React.memo(FieldSizeSelect);
