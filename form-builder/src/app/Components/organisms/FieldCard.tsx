// apps/form-builder/src/app/components/organisms/FieldCard.tsx
import React, { useCallback } from "react";
import { FieldMeta } from "../../domain/formTypes";
import Button from "../atoms/Button";
import TextInput from "../atoms/TextInput";
import FieldSizeSelect from "../molecules/FieldSizeSelect";
import FieldTypeSelect from "../molecules/FieldTypeSelect";

interface FieldCardProps {
  field: FieldMeta;
  onChange: (patch: Partial<FieldMeta>) => void;
  onDelete: () => void;
}

const FieldCard: React.FC<FieldCardProps> = ({ field, onChange, onDelete }) => {
  const handleChange = useCallback(
    (patch: Partial<FieldMeta>) => onChange(patch),
    [onChange]
  );

  return (
    <div
      className="
        w-full 
        border rounded-md p-4 bg-white shadow 
        hover:shadow-md transition-shadow 
        flex flex-col gap-3
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">Field: {field.name}</span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-red-500 text-xs"
          onClick={onDelete}
        >
          Remove
        </Button>
      </div>

      {/* Label */}
      <TextInput
        label="Label"
        value={field.label}
        onChange={(e) => handleChange({ label: e.target.value })}
      />

      {/* Type + Size */}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <span className="block text-xs font-medium text-gray-600 mb-1">Type</span>
          <FieldTypeSelect
            value={field.type}
            onChange={(type) => handleChange({ type })}
          />
        </div>
        <div>
          <span className="block text-xs font-medium text-gray-600 mb-1">Size</span>
          <FieldSizeSelect
            value={field.size}
            onChange={(size) => handleChange({ size })}
          />
        </div>
        <div>
{field.type === "select" && (
  <div className="mt-2">
    <span className="block text-xs font-medium text-gray-600 mb-1">
      Options
    </span>

    {(field.options || []).map((opt, idx) => (
      <div key={idx} className="flex items-center gap-2 mb-1">
        <input
          type="text"
          className="flex-1 border-b border-gray-400 focus:outline-none text-sm px-1"
          value={opt}
          onChange={(e) => {
            const updated = [...(field.options || [])];
            updated[idx] = e.target.value;
            handleChange({ options: updated });  // 👈 NAME EDIT WORKS
          }}
        />
        <button
          className="text-red-500 text-xs"
          onClick={() => {
            const updated = (field.options || []).filter((_, i) => i !== idx);
            handleChange({ options: updated });  // 👈 DELETE WORKS
          }}
        >
          ✖
        </button>
      </div>
    ))}

    <button
      className="text-blue-600 text-xs mt-1"
      onClick={() => {
        const updated = [...(field.options ?? []), `Option ${(field.options?.length ?? 0) + 1}`];
        handleChange({ options: updated });
      }}
    >
      + Add Option
    </button>
  </div>
)}

        </div>
      </div>

      {/* Required */}
      <label className="flex items-center gap-2 text-xs text-gray-700">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => handleChange({ required: e.target.checked })}
          className="w-3 h-3"
        />
        Required
      </label>
    </div>
  );
};

export default React.memo(FieldCard);
