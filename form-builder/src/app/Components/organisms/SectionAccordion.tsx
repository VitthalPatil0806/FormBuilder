// apps/form-builder/src/app/components/organisms/SectionAccordion.tsx
import React from "react";
import { SectionMeta, FieldMeta, FieldType } from "../../domain/formTypes";
import SectionHeader from "../molecules/SectionHeader";
import Button from "../atoms/Button";
import RowEditor from "./RowEditor";

interface SectionAccordionProps {
  section: SectionMeta;
  onUpdateLabel: (label: string) => void;
  onToggleCollapse: () => void;
  onDelete: () => void;
  onAddRow: () => void;
  onDeleteRow: (rowId: string) => void;
  onAddField: (rowId: string, type: FieldType) => void;
  onDeleteField: (rowId: string, fieldId: string) => void;
  onUpdateField: (rowId: string, fieldId: string, patch: Partial<FieldMeta>) => void;
}

const SectionAccordion: React.FC<SectionAccordionProps> = ({
  section,
  onUpdateLabel,
  onToggleCollapse,
  onDelete,
  onAddRow,
  onDeleteRow,
  onAddField,
  onDeleteField,
  onUpdateField,
}) => {
  return (
    <div className="border rounded-md overflow-hidden bg-white shadow-sm mb-4">
      <SectionHeader
        label={section.label}
        collapsed={section.collapsed}
        onLabelChange={onUpdateLabel}
        onToggleCollapse={onToggleCollapse}
        onDelete={onDelete}
      />
      {!section.collapsed && (
        <div className="p-3">
          {section.rows.map((row) => (
            <RowEditor
              key={row.id}
              rowId={row.id}
              fields={row.fields}
              sectionId={section.id}
              onChangeField={(fieldId, patch) =>
                onUpdateField(row.id, fieldId, patch)
              }
              onDeleteField={(fieldId) => onDeleteField(row.id, fieldId)}
              onAddField={() => onAddField(row.id, "text")}
              onDeleteRow={() => onDeleteRow(row.id)}
            />
          ))}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onAddRow}
            className="mt-2"
          >
            + Add Row
          </Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(SectionAccordion);
