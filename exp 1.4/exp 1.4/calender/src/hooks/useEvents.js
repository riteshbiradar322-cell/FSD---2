import { useEventContext } from "../context/EventContext";

const useEvents = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEventContext();

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};

export default useEvents;