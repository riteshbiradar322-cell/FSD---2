import { memo, useMemo } from "react";
import { FaEdit, FaPlus, FaCalendarCheck } from "react-icons/fa";
import useEvents from "../hooks/useEvents";

const Sidebar = ({ onAddEvent, onEditEvent, searchTerm = "" }) => {
  const { events } = useEvents();

  const upcomingEvents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );

    if (!query) {
      return sortedEvents.slice(0, 5);
    }

    return sortedEvents
      .filter((event) => {
        const haystack = `${event.title || ""} ${event.description || ""}`.toLowerCase();
        return haystack.includes(query);
      })
      .slice(0, 5);
  }, [events, searchTerm]);

  return (
    <aside className="sidebar">
      <button className="add-event-btn" onClick={onAddEvent}>
        <FaPlus />
        <span>Add Event</span>
      </button>

      <div className="sidebar-section">
        <h3>Upcoming Events</h3>

        {upcomingEvents.length === 0 ? (
          <p className="empty-text">No upcoming events</p>
        ) : (
          upcomingEvents.map((event) => (
            <div className="event-item" key={event.id}>
              <div
                className="event-color"
                style={{ backgroundColor: event.color }}
              ></div>

              <div className="event-details">
                <h4>{event.title}</h4>
                <p>{new Date(event.start).toLocaleString()}</p>
              </div>

              <button
                className="icon-btn"
                type="button"
                onClick={() => onEditEvent?.(event)}
                aria-label={`Edit ${event.title}`}
              >
                <FaEdit />
              </button>

              <FaCalendarCheck className="event-icon" />
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default memo(Sidebar);