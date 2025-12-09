// apps/form-builder/src/app/components/molecules/FieldTypeSelect.tsx
import React, { useMemo, useState } from "react";
import { FieldType } from "../../domain/formTypes";

const ALL_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Textarea" },
  { value: "checkbox", label: "Checkbox" },
  { value: "select", label: "Select" },
  { value: "date", label: "Date" },
];

interface FieldTypeSelectProps {
  value: FieldType;
  onChange: (type: FieldType) => void;
}

const FieldTypeSelect: React.FC<FieldTypeSelectProps> = ({ value, onChange }) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return ALL_TYPES.filter((t) => t.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="border rounded-md px-2 py-1 text-xs bg-white flex flex-col gap-1">
      <input
        type="text"
        placeholder="Search field type"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-200 rounded px-1 py-0.5 text-xs focus:outline-none"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FieldType)}
        className="text-xs bg-white focus:outline-none"
      >
        {filtered.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default React.memo(FieldTypeSelect);
