import React, { memo } from 'react';

/**
 * Wrapped in React.memo because it only depends on `value` and the
 * `onChange` callback. As long as App.jsx passes a stable onChange
 * (see useCallback in App.jsx), typing elsewhere in the app or the
 * PerformanceMonitor's live render count won't re-render this input.
 */
function SearchBar({ value, onChange, resultCount, totalCount }) {
  console.log('SearchBar rendered');

  return (
    <div className="search-bar">
      <input
        type="search"
        aria-label="Search events"
        placeholder="Search events by title, category or description…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value ? (
        <span className="search-count">
          {resultCount} of {totalCount} events match
        </span>
      ) : (
        <span className="search-count search-count--muted">{totalCount} events this month</span>
      )}
    </div>
  );
}

export default memo(SearchBar);
