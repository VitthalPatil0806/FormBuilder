// apps/form-builder/src/app/components/molecules/SectionHeader.tsx
import React from "react";
import Button from "../atoms/Button";

interface SectionHeaderProps {
  label: string;
  onLabelChange: (label: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onDelete: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  onLabelChange,
  collapsed,
  onToggleCollapse,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-md">
      <div className="flex items-center gap-2 flex-1">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="text-xs text-gray-600 hover:text-gray-900"
        >
          {collapsed ? "▶" : "▼"}
        </button>
        <input
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Section label"
          className="flex-1 bg-transparent text-sm border-b border-dashed border-gray-300 focus:outline-none"
        />
      </div>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="text-red-500"
        onClick={onDelete}
      >
        Delete
      </Button>
    </div>
  );
};

export default React.memo(SectionHeader);
