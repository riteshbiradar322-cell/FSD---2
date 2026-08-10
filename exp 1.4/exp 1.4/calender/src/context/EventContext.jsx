import { createContext, useContext, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([
    {
      id: uuid(),
      title: "Project Meeting",
      start: "2026-08-04T10:00:00",
      end: "2026-08-04T11:00:00",
      color: "#2563eb",
      description: "Discuss project progress",
    },
    {
      id: uuid(),
      title: "DSA Practice",
      start: "2026-08-05T18:00:00",
      end: "2026-08-05T19:30:00",
      color: "#16a34a",
      description: "LeetCode Problems",
    },
  ]);

  const addEvent = (event) => {
    setEvents((prev) => [...prev, { ...event, id: uuid() }]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const value = useMemo(
    () => ({
      events,
      addEvent,
      updateEvent,
      deleteEvent,
    }),
    [events]
  );

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);