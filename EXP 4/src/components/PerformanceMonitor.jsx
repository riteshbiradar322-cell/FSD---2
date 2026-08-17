import React, { useEffect, useRef, useState } from 'react';

/**
 * "Heavier" analytics-style panel, intentionally code-split via React.lazy
 * in App.jsx to demonstrate lazy loading + Suspense. It tracks its own
 * render count with a ref (so incrementing it doesn't itself cause extra
 * renders beyond the one already happening) and reports the numbers the
 * experiment asks for: render count, visible events, last update time and
 * filtered event count.
 */
function PerformanceMonitor({ visibleEventCount, filteredEventCount, totalEventCount }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const [lastUpdate, setLastUpdate] = useState(() => new Date());

  useEffect(() => {
    setLastUpdate(new Date());
  }, [visibleEventCount, filteredEventCount, totalEventCount]);

  return (
    <div className="performance-monitor">
      <h3>Performance Monitor</h3>
      <p className="performance-monitor__hint">
        Open React DevTools → Profiler to correlate these numbers with actual render timings.
      </p>
      <dl className="performance-monitor__stats">
        <dt>App render count</dt>
        <dd>{renderCount.current}</dd>

        <dt>Total events loaded</dt>
        <dd>{totalEventCount}</dd>

        <dt>Filtered event count</dt>
        <dd>{filteredEventCount}</dd>

        <dt>Visible events (this month)</dt>
        <dd>{visibleEventCount}</dd>

        <dt>Last update</dt>
        <dd>{lastUpdate.toLocaleTimeString()}</dd>
      </dl>
    </div>
  );
}

export default PerformanceMonitor;
