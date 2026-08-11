const STORAGE_KEY = "rbac_portal_content";

const DEFAULT_CONTENT = {
  title: "Welcome to the RBAC Content Portal",
  body: "This content is shared between the Admin, Editor, and Viewer portals. Admins can update the photo and content. Editors can update the content. Viewers have read-only access.",
  image:
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
};

export const getContent = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_CONTENT, ...JSON.parse(saved) } : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
};

export const saveContent = (content) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event("rbac-content-updated"));
  return content;
};

export const resetContent = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("rbac-content-updated"));
  return DEFAULT_CONTENT;
};

export { DEFAULT_CONTENT };
