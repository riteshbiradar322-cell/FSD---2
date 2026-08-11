export const formatDateTimeLocal = (date) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

export const isSameDay = (date1, date2) => {
  return (
    new Date(date1).toDateString() ===
    new Date(date2).toDateString()
  );
};

export const sortEvents = (events) => {
  return [...events].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );
};

export const generateRandomColor = () => {
  const colors = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#f59e0b",
    "#9333ea",
    "#0891b2",
    "#e11d48",
    "#0f766e",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

export const getDuration = (start, end) => {
  const diff = new Date(end) - new Date(start);
  const minutes = Math.floor(diff / 60000);

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;

  return `${hours} hr ${mins} min`;
};