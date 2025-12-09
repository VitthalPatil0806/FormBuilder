// apps/form-builder/src/app/App.tsx
import React, { useState } from "react";
import { FormBuilderProvider } from "./contexts/FormBuilderContext";
import { FormHistoryProvider } from "./contexts/FormHistoryContext";
import FormLayoutBuilderPage from "./components/templates/FormLayoutBuilderPage";
import FormHistoryPage from "./components/templates/FormHistoryPage";
import "./index.css";

const App: React.FC = () => {
  const [page, setPage] = useState<"builder" | "history">("builder");

  return (
    <FormBuilderProvider>
      <FormHistoryProvider>
        {page === "builder" ? (
          <FormLayoutBuilderPage onGoToHistory={() => setPage("history")} />
        ) : (
          <FormHistoryPage onBackToBuilder={() => setPage("builder")} />
        )}
      </FormHistoryProvider>
    </FormBuilderProvider>
  );
};

export default App;
