import React, { useState } from "react";
import { FormBuilderProvider } from "./contexts/FormBuilderContext";
import { FormHistoryProvider } from "./contexts/FormHistoryContext";
import FormLayoutBuilderPage from "./Components/templates/FormLayoutBuilderPage";
import FormHistoryPage from "./Components/templates/FormHistoryPage";
import "./index.css";

const App: React.FC = () => {
  const [page, setPage] = useState<"builder" | "history">("builder");
  const [editingLayoutSubmissionId, setEditingLayoutSubmissionId] =
    useState<string | null>(null);

  return (
    <FormBuilderProvider>
      <FormHistoryProvider>
        {page === "builder" ? (
          <FormLayoutBuilderPage
            onGoToHistory={() => setPage("history")}
            editingSubmissionId={editingLayoutSubmissionId}
            onFinishLayoutEdit={() => setEditingLayoutSubmissionId(null)}
          />
        ) : (
          <FormHistoryPage
            onBackToBuilder={() => setPage("builder")}
            onEditLayoutFromHistory={(id) => {
              setEditingLayoutSubmissionId(id);
              setPage("builder");
            }}
          />
        )}
      </FormHistoryProvider>
    </FormBuilderProvider>
  );
};

export default App;
