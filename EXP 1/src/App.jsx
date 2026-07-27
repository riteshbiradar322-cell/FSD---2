import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDrafts } from "./hooks/useDrafts";
import PostComposer from "./components/PostComposer";
import DraftList from "./components/DraftList";
import "./App.css";

export default function App() {
  const { drafts, addDraft, updateDraft, deleteDraft, getDraft } = useDrafts();
  const [editingId, setEditingId] = useState(null);

  const editingDraft = editingId ? getDraft(editingId) : null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Post Composer</h1>
        <p>Compose, validate, and manage drafts across platforms.</p>
      </header>

      <main className="app-main">
        <PostComposer
          addDraft={addDraft}
          updateDraft={updateDraft}
          editingDraft={editingDraft}
          clearEditing={() => setEditingId(null)}
        />
        <DraftList drafts={drafts} onEdit={setEditingId} deleteDraft={deleteDraft} />
      </main>

      <ToastContainer position="bottom-right" autoClose={2500} />
    </div>
  );
}
