import { useEffect, useState } from "react";
import useEvents from "../hooks/useEvents";
import { generateRandomColor } from "../utils/helpers";

const Modal = ({ isOpen, onClose, selectedEvent }) => {
  const { addEvent, updateEvent } = useEvents();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    color: "#2563eb",
  });

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title,
        description: selectedEvent.description || "",
        start: selectedEvent.start.slice(0, 16),
        end: selectedEvent.end.slice(0, 16),
        color: selectedEvent.color,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        start: "",
        end: "",
        color: generateRandomColor(),
      });
    }
  }, [selectedEvent]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.start || !formData.end) return;

    if (selectedEvent) {
      updateEvent({
        ...selectedEvent,
        ...formData,
      });
    } else {
      addEvent(formData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{selectedEvent ? "Edit Event" : "Add Event"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Start</label>
          <input
            type="datetime-local"
            name="start"
            value={formData.start}
            onChange={handleChange}
            required
          />

          <label>End</label>
          <input
            type="datetime-local"
            name="end"
            value={formData.end}
            onChange={handleChange}
            required
          />

          <label>Color</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />

          <div className="modal-buttons">
            <button type="submit">
              {selectedEvent ? "Update" : "Add"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;