import { memo } from "react";
import { FaClock, FaTrash, FaEdit } from "react-icons/fa";

const EventCard = ({ event, onEdit, onDelete }) => {
  return (
    <div
      className="event-card"
      style={{
        borderLeft: `6px solid ${event.color}`,
      }}
    >
      <div className="event-card-header">
        <h3>{event.title}</h3>

        <div className="event-actions">
          <button
            className="icon-btn"
            onClick={() => onEdit(event)}
          >
            <FaEdit />
          </button>

          <button
            className="icon-btn delete-btn"
            onClick={() => onDelete(event.id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <p>{event.description}</p>

      <div className="event-time">
        <FaClock />
        <span>
          {new Date(event.start).toLocaleString()} -{" "}
          {new Date(event.end).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default memo(EventCard);