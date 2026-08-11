import { useEffect, useState } from "react";
import { getContent, saveContent } from "../services/content";

const PortalContent = ({ role }) => {
  const canEdit = role === "Admin" || role === "Editor";
  const canChangeImage = role === "Admin";

  const [content, setContent] = useState(getContent());
  const [draft, setDraft] = useState(getContent());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => {
      const latest = getContent();
      setContent(latest);
      setDraft(latest);
    };

    window.addEventListener("rbac-content-updated", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("rbac-content-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setDraft((prev) => ({ ...prev, image: reader.result }));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const next = {
      ...content,
      title: draft.title,
      body: draft.body,
      image: canChangeImage ? draft.image : content.image,
    };

    saveContent(next);
    setContent(next);
    setDraft(next);
    setSaved(true);
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Shared Portal Content</h2>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "#fff",
        }}
      >
        <img
          src={content.image}
          alt="Portal"
          style={{
            width: "100%",
            maxHeight: "300px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <h3>{content.title}</h3>
        <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}>
          {content.body}
        </p>
      </div>

      {canEdit ? (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#f8fafc",
          }}
        >
          <h3>
            {role} Editor
          </h3>
          <p style={{ color: "#555", marginBottom: "15px" }}>
            {role === "Admin"
              ? "Admin can change both the photo and the content."
              : "Editor can change the content. The photo can only be changed by Admin."}
          </p>

          <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>
            Title
          </label>
          <input
            value={draft.title}
            onChange={(e) => handleChange("title", e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
            }}
          />

          <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>
            Content
          </label>
          <textarea
            value={draft.body}
            onChange={(e) => handleChange("body", e.target.value)}
            rows="6"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />

          {canChangeImage && (
            <>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>
                Change Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  boxSizing: "border-box",
                  background: "#fff",
                }}
              />
              <p style={{ color: "#666", fontSize: "14px" }}>
                Select an image from your computer. The selected photo will be shared with the Editor and Viewer portals.
              </p>
            </>
          )}

          <button className="btn" onClick={handleSave}>
            Save Changes
          </button>

          {saved && (
            <span style={{ marginLeft: "15px", color: "green", fontWeight: "600" }}>
              Changes saved successfully!
            </span>
          )}
        </div>
      ) : (
        <div
          style={{
            marginTop: "20px",
            padding: "12px 15px",
            borderRadius: "8px",
            background: "#f1f5f9",
            color: "#475569",
          }}
        >
          <strong>Viewer mode:</strong> You can only view the content. Editing is disabled.
        </div>
      )}
    </div>
  );
};

export default PortalContent;
