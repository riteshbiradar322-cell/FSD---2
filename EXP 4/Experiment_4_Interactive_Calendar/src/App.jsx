import React, { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import Calendar from './components/Calendar.jsx';
import EventList from './components/EventList.jsx';
import EventModal from './components/EventModal.jsx';
import SearchBar from './components/SearchBar.jsx';
import Loading from './components/Loading.jsx';
import { useEvents } from './hooks/useEvents.js';
import { todayKey } from './utils/calendarUtils.js';
import './App.css';

// Code-split the performance panel: it isn't needed for the calendar's core
// job (viewing/editing events) so there's no reason to ship it in the main
// bundle or block first paint on it.
const PerformanceMonitor = lazy(() => import('./components/PerformanceMonitor.jsx'));

function App() {
  const { events, loading, error, reloadEvents, addEvent, editEvent, removeEvent, moveEvent } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ mode: null, event: null, defaultDate: null });
  const [actionError, setActionError] = useState(null);
  const [showPerformancePanel, setShowPerformancePanel] = useState(false);

  // Derived, filtered event list. useMemo avoids re-filtering the full
  // events array on renders that don't touch `events` or `searchTerm`
  // (e.g. when only the modal's open/closed state changes).
  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return events;
    return events.filter((event) =>
      [event.title, event.category, event.description]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [events, searchTerm]);

  // How many filtered events fall in the current calendar month is computed
  // for the Performance Monitor; grouping by date is reused for that count.
  const visibleThisMonthCount = useMemo(() => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return filteredEvents.filter((e) => e.date.startsWith(prefix)).length;
  }, [filteredEvents]);

  const upcomingEvents = useMemo(() => {
    const today = todayKey();
    return [...filteredEvents]
      .filter((e) => e.date >= today)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 8);
  }, [filteredEvents]);

  // Stable callbacks passed down into memoized children (Calendar,
  // CalendarDay, EventCard, EventList) so those components can skip
  // re-rendering on unrelated App state changes.
  const handleEventClick = useCallback((event) => {
    setModalState({ mode: 'view', event, defaultDate: null });
  }, []);

  const handleDayClick = useCallback((dateKey) => {
    setModalState({ mode: 'create', event: null, defaultDate: dateKey });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({ mode: null, event: null, defaultDate: null });
  }, []);

  const handleCreate = useCallback(
    async (formValues) => {
      try {
        await addEvent(formValues);
        setActionError(null);
        handleCloseModal();
      } catch (err) {
        setActionError(err.message || 'Failed to create event');
      }
    },
    [addEvent, handleCloseModal]
  );

  const handleEdit = useCallback(
    async (id, formValues) => {
      try {
        await editEvent(id, formValues);
        setActionError(null);
        handleCloseModal();
      } catch (err) {
        setActionError(err.message || 'Failed to update event');
      }
    },
    [editEvent, handleCloseModal]
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        await removeEvent(id);
        setActionError(null);
        handleCloseModal();
      } catch (err) {
        setActionError(err.message || 'Failed to delete event');
      }
    },
    [removeEvent, handleCloseModal]
  );

  const handleMoveEvent = useCallback(
    async (id, newDate) => {
      try {
        await moveEvent(id, newDate);
        setActionError(null);
      } catch (err) {
        setActionError(err.message || 'Failed to move event');
      }
    },
    [moveEvent]
  );

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Smart Interactive Calendar</h1>
          <p className="app__subtitle">React Performance Optimization &amp; Testing</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => handleDayClick(todayKey())}>
          + Add Event
        </button>
      </header>

      {error && (
        <div className="banner banner--error">
          <span>Couldn&apos;t load events: {error}</span>
          <button type="button" onClick={reloadEvents}>
            Retry
          </button>
        </div>
      )}

      {actionError && (
        <div className="banner banner--error">
          <span>{actionError}</span>
          <button type="button" onClick={() => setActionError(null)}>
            Dismiss
          </button>
        </div>
      )}

      <SearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        resultCount={filteredEvents.length}
        totalCount={events.length}
      />

      {loading ? (
        <Loading label="Loading events…" />
      ) : (
        <div className="app__layout">
          <main>
            <Calendar
              events={filteredEvents}
              onEventClick={handleEventClick}
              onDayClick={handleDayClick}
              onMoveEvent={handleMoveEvent}
            />
          </main>

          <aside className="app__sidebar">
            <section>
              <h3>Upcoming Events</h3>
              <EventList events={upcomingEvents} onEventClick={handleEventClick} />
            </section>

            <section>
              <button
                type="button"
                className="btn btn--ghost btn--full"
                onClick={() => setShowPerformancePanel((v) => !v)}
              >
                {showPerformancePanel ? 'Hide' : 'Show'} Performance Monitor
              </button>
              {showPerformancePanel && (
                <Suspense fallback={<Loading label="Loading performance panel…" />}>
                  <PerformanceMonitor
                    visibleEventCount={visibleThisMonthCount}
                    filteredEventCount={filteredEvents.length}
                    totalEventCount={events.length}
                  />
                </Suspense>
              )}
            </section>
          </aside>
        </div>
      )}

      <EventModal
        mode={modalState.mode}
        event={modalState.event}
        defaultDate={modalState.defaultDate}
        onClose={handleCloseModal}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
