import React, { useCallback, useMemo, useState } from 'react';
import CalendarDay from './CalendarDay.jsx';
import {
  MONTH_NAMES,
  WEEKDAY_LABELS,
  buildMonthGrid,
  groupEventsByDate,
  todayKey
} from '../utils/calendarUtils.js';

/**
 * Top-level calendar grid. Owns which month is being viewed and which event
 * (if any) is currently being dragged.
 *
 * Performance notes:
 * - `grid` and `eventsByDate` are derived data computed with useMemo, since
 *   rebuilding a 42-cell grid or re-grouping every event on every keystroke
 *   in the search box (which only changes the `events` prop) would be
 *   wasted work whenever `year`/`month` haven't changed.
 * - All handlers passed down to CalendarDay/EventCard are wrapped in
 *   useCallback so those React.memo'd children don't re-render just because
 *   Calendar re-rendered.
 */
function Calendar({ events, onEventClick, onDayClick, onMoveEvent }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [draggingEventId, setDraggingEventId] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);
  const today = useMemo(() => todayKey(), []);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleDragStart = useCallback((e, event) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', event.id);
    setDraggingEventId(event.id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingEventId(null);
  }, []);

  const handleDrop = useCallback(
    (targetDateKey) => {
      if (draggingEventId) {
        onMoveEvent(draggingEventId, targetDateKey);
      }
      setDraggingEventId(null);
    },
    [draggingEventId, onMoveEvent]
  );

  return (
    <div className="calendar">
      <div className="calendar__toolbar">
        <div className="calendar__nav">
          <button type="button" onClick={goToPrevMonth} aria-label="Previous month">
            ‹
          </button>
          <button type="button" className="calendar__today-btn" onClick={goToToday}>
            Today
          </button>
          <button type="button" onClick={goToNextMonth} aria-label="Next month">
            ›
          </button>
        </div>
        <h2 className="calendar__heading">
          {MONTH_NAMES[month]} {year}
        </h2>
      </div>

      <div className="calendar__weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="calendar__weekday">
            {label}
          </div>
        ))}
      </div>

      <div className="calendar__grid">
        {grid.map((cell) => (
          <CalendarDay
            key={cell.dateKey + cell.isCurrentMonth}
            dateKey={cell.dateKey}
            day={cell.day}
            isCurrentMonth={cell.isCurrentMonth}
            isToday={cell.dateKey === today}
            events={eventsByDate.get(cell.dateKey) || []}
            onEventClick={onEventClick}
            onDayClick={onDayClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            draggingEventId={draggingEventId}
          />
        ))}
      </div>
    </div>
  );
}

export default Calendar;
