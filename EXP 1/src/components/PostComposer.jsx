import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "../hooks/useForm";
import { getStrategy, validateForPlatform } from "../strategies/validationStrategies";
import { saveDraftMock, updateDraftMock, retry } from "../api/mockApi";
import PlatformSelector from "./PlatformSelector";

export default function PostComposer({ addDraft, updateDraft, editingDraft, clearEditing }) {
  const [platform, setPlatform] = useState(editingDraft?.platform || "twitter");
  const content = useForm(editingDraft?.content || "");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const strategy = getStrategy(platform);

  // Re-sync the form when the user picks a different draft to edit.
  useEffect(() => {
    setPlatform(editingDraft?.platform || "twitter");
    content.reset(editingDraft?.content || "");
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingDraft]);

  // Real-time validation on every keystroke / platform change.
  useEffect(() => {
    setError(validateForPlatform(platform, content.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, content.value]);

  const remaining = strategy.limit - content.value.length;

  const handleSave = async () => {
    const validationError = validateForPlatform(platform, content.value);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = { content: content.value, platform, id: editingDraft?.id };
      const apiCall = editingDraft
        ? () => updateDraftMock(payload)
        : () => saveDraftMock(payload);

      // Retry logic: attempt up to 2 retries (3 total tries) before giving up.
      await retry(apiCall, 2);

      if (editingDraft) {
        updateDraft(editingDraft.id, { content: content.value, platform });
        toast.success("Draft updated successfully!");
        clearEditing();
      } else {
        addDraft({ content: content.value, platform });
        toast.success("Draft saved successfully!");
      }
      content.reset("");
      setPlatform("twitter");
    } catch (err) {
      toast.error(err?.error || "Failed to save draft after retries");
      setError("Failed to save draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    clearEditing();
    content.reset("");
    setPlatform("twitter");
    setError(null);
  };

  return (
    <div className="card">
      <h2>{editingDraft ? "Edit Draft" : "Compose Post"}</h2>

      <PlatformSelector platform={platform} onChange={setPlatform} />

      <div className="field-group">
        <label htmlFor="post-content">Content</label>
        <textarea
          id="post-content"
          value={content.value}
          onChange={content.handleChange}
          placeholder={
            strategy.hashtags ? "Write your caption... #hashtags welcome" : "Write your post..."
          }
          rows={6}
        />
        <div className={`char-counter ${remaining < 0 ? "over-limit" : ""}`}>
          {content.value.length} / {strategy.limit} characters
          {strategy.hashtags && (
            <span className="hashtag-note"> · hashtags counted toward caption</span>
          )}
        </div>
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}

      <div className="actions">
        <button onClick={handleSave} disabled={loading || !!error}>
          {loading ? "Saving..." : editingDraft ? "Update Draft" : "Save Draft"}
        </button>
        {editingDraft && (
          <button className="secondary" onClick={handleCancelEdit} disabled={loading}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
