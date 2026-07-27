import { toast } from "react-toastify";
import { platformStrategies } from "../strategies/validationStrategies";

export default function DraftList({ drafts, onEdit, deleteDraft }) {
  const handleDelete = (id) => {
    deleteDraft(id);
    toast.success("Draft deleted");
  };

  if (drafts.length === 0) {
    return (
      <div className="card">
        <h2>Saved Drafts</h2>
        <p className="empty-state">No drafts yet. Compose a post and save it above.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Saved Drafts ({drafts.length})</h2>
      <ul className="draft-list">
        {drafts.map((draft) => (
          <li key={draft.id} className="draft-item">
            <div className="draft-meta">
              <span className="platform-tag">{platformStrategies[draft.platform]?.label}</span>
              <span className="draft-date">
                {new Date(draft.updatedAt || draft.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="draft-content">{draft.content}</p>
            <div className="draft-actions">
              <button onClick={() => onEdit(draft.id)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(draft.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
