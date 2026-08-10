import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar";
import Modal from "../components/Modal";
import { useEventContext } from "../context/EventContext";

const Dashboard = () => {
  const { events } = useEventContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return events;

    return events.filter((event) => {
      const haystack = `${event.title || ""} ${event.description || ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [events, searchTerm]);

  const openModal = (event = null) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard">
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="dashboard-content">
        <Sidebar
          searchTerm={searchTerm}
          onAddEvent={() => openModal()}
          onEditEvent={(event) => openModal(event)}
        />

        <main className="calendar-section">
          <Calendar
            searchTerm={searchTerm}
            events={filteredEvents}
            onSelectEvent={(event) => openModal(event)}
          />
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedEvent={selectedEvent}
      />
    </div>
  );
};

export default Dashboard;