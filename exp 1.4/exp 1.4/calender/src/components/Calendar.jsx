import { memo, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import useEvents from "../hooks/useEvents";

const Calendar = ({ searchTerm = "", events: externalEvents, onSelectEvent }) => {
  const { events, updateEvent } = useEvents();
  const visibleEvents = useMemo(() => {
    const sourceEvents = externalEvents ?? events;
    const query = searchTerm.trim().toLowerCase();

    if (!query) return sourceEvents;

    return sourceEvents.filter((event) => {
      const haystack = `${event.title || ""} ${event.description || ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [events, externalEvents, searchTerm]);

  const handleEventDrop = useCallback(
    (info) => {
      updateEvent({
        id: info.event.id,
        title: info.event.title,
        start: info.event.start.toISOString(),
        end: info.event.end
          ? info.event.end.toISOString()
          : info.event.start.toISOString(),
        color: info.event.backgroundColor,
        description: info.event.extendedProps.description || "",
      });
    },
    [updateEvent]
  );

  const handleEventResize = useCallback(
    (info) => {
      updateEvent({
        id: info.event.id,
        title: info.event.title,
        start: info.event.start.toISOString(),
        end: info.event.end.toISOString(),
        color: info.event.backgroundColor,
        description: info.event.extendedProps.description || "",
      });
    },
    [updateEvent]
  );

  const handleEventClick = useCallback(
    (info) => {
      onSelectEvent?.({
        id: info.event.id,
        title: info.event.title,
        description: info.event.extendedProps.description || "",
        start: info.event.start?.toISOString() || "",
        end: info.event.end?.toISOString() || "",
        color: info.event.backgroundColor || "#2563eb",
      });
    },
    [onSelectEvent]
  );

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        editable={true}
        selectable={true}
        droppable={true}
        weekends={true}
        height="80vh"
        events={visibleEvents}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventClick={handleEventClick}
      />
    </div>
  );
};

export default memo(Calendar);