// apps/form-builder/src/app/components/atoms/SelectInput.tsx
import React from "react";

interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  error,
  className = "",
  children,
  ...rest
}) => {
  return (
    <div className="mb-2">
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
          error ? "border-red-400" : "border-gray-300"
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
};

export default React.memo(SelectInput);
