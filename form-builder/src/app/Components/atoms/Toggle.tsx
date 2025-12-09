// apps/form-builder/src/app/components/atoms/Toggle.tsx
import React from "react";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
      <span className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
            checked ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
              checked ? "translate-x-4" : ""
            }`}
          />
        </span>
      </span>
      <span>{label}</span>
    </label>
  );
};

export default React.memo(Toggle);
