# Smart Interactive Calendar
### React Performance Optimization & Testing

**Unit 1 – Experiment 4: Interactive Calendar Optimization & Testing**

---

## Aim

To design and implement an interactive calendar application in React that displays
and manages scheduled events, supports drag-and-drop event rescheduling, and
demonstrates React performance optimization techniques (`React.memo`, `useMemo`,
`useCallback`, `React.lazy`/`Suspense`). The project also demonstrates automated
component/integration testing with **React Testing Library**, API mocking with
**Mock Service Worker (MSW)**, render-performance analysis using **React DevTools
Profiler**, and test coverage reporting using **Vitest**.

---

## Technologies Used

| Layer            | Technology                                              |
|-------------------|----------------------------------------------------------|
| UI Framework      | React 18                                                  |
| Build Tool        | Vite 5                                                     |
| Language          | JavaScript (JSX)                                           |
| Styling           | Plain CSS                                                  |
| Performance       | `React.memo`, `useMemo`, `useCallback`, `React.lazy`, `Suspense` |
| Testing           | Vitest, React Testing Library, `@testing-library/jest-dom`, `@testing-library/user-event` |
| API Mocking       | Mock Service Worker (MSW)                                  |
| Coverage          | `@vitest/coverage-v8`                                       |

Vitest was chosen over Jest because it shares Vite's config/transform pipeline,
so no extra Babel setup is needed — it is a drop-in, Jest-compatible API
(`describe`, `it`, `expect`, mocking, etc.) that "just works" with a Vite project.

---

## Features

- **Monthly calendar grid** with correct leading/trailing days from adjacent months.
- **Navigation**: Previous month, Next month, and Today buttons with a live month/year heading.
- **Event details modal**: view, create, edit and delete events.
- **Real drag-and-drop**: drag an event card onto a different date; the target date
  highlights while dragging over it, and dropping updates the event's date through
  the API layer and re-renders the calendar in the new location.
- **Search / filter bar**: filters events by title, category or description across
  both the calendar grid and the "Upcoming Events" sidebar list.
- **Upcoming Events sidebar** (`EventList`) showing the next events chronologically.
- **Performance Monitor panel** (code-split via `React.lazy` + `Suspense`) showing
  render count, total/filtered/visible event counts and last-update time.
- **Loading, error and empty states** for the API layer and for search results.
- **Mocked backend** via MSW — the UI never talks to a real server; MSW intercepts
  `fetch()` calls and returns realistic mock event data.

---

## Project Structure

```text
Experiment_4_Interactive_Calendar/
├── package.json            # dependencies, npm scripts, msw config
├── vite.config.js          # Vite + Vitest (test/coverage) configuration
├── index.html               # app entry HTML
│
├── public/                  # static assets (mockServiceWorker.js is generated here)
│
└── src/
    ├── main.jsx              # boots MSW worker, then renders <App />
    ├── App.jsx                # top-level layout, state wiring, lazy PerformanceMonitor
    ├── App.css                # all application styling
    │
    ├── components/
    │   ├── Calendar.jsx         # month grid, navigation, drag state (memo candidate)
    │   ├── CalendarDay.jsx      # single grid cell / drop target (React.memo)
    │   ├── EventCard.jsx        # single draggable event chip (React.memo)
    │   ├── EventList.jsx        # sidebar "Upcoming Events" list (React.memo)
    │   ├── EventModal.jsx       # view / create / edit dialog (React.memo)
    │   ├── EventForm.jsx        # controlled create/edit form
    │   ├── SearchBar.jsx        # search input (React.memo)
    │   ├── PerformanceMonitor.jsx  # lazy-loaded stats panel
    │   └── Loading.jsx           # shared loading spinner
    │
    ├── services/
    │   └── eventService.js      # fetch()-based API layer (GET/POST/PUT/DELETE)
    │
    ├── hooks/
    │   └── useEvents.js         # event state + CRUD orchestration (useCallback)
    │
    ├── utils/
    │   └── calendarUtils.js     # pure date/grid helpers, category colors
    │
    ├── mocks/
    │   ├── handlers.js          # MSW request handlers + in-memory mock "DB"
    │   ├── browser.js           # MSW worker setup (used by the running app)
    │   └── server.js             # MSW node server setup (used by tests)
    │
    └── tests/
        ├── setup.js               # Vitest setup: starts MSW server, jest-dom matchers
        ├── Calendar.test.jsx       # rendering + navigation + event placement
        ├── EventCard.test.jsx      # click / keyboard / drag-start behavior
        ├── EventForm.test.jsx      # validation + submit/cancel behavior
        ├── EventInteraction.test.jsx  # create/edit/delete/drag/search (integration)
        └── Api.test.jsx             # MSW-backed loading/success/error states
```

---

## Installation

```bash
npm install
```

`npm install` also runs a `postinstall` script (`msw init public/ --save`) that
generates `public/mockServiceWorker.js`, which MSW needs to intercept requests
in the browser. If it does not run automatically, execute it manually:

```bash
npm run msw:init
```

## Run

```bash
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`). The calendar
loads with realistic sample events for the current month, served by MSW.

## Testing

```bash
npm run test
```

Runs the full Vitest suite once (Calendar rendering, event CRUD, drag-and-drop,
search/filter, and MSW-backed API states).

## Coverage

```bash
npm run test:coverage
```

Generates a statements/branches/functions/lines coverage report in the terminal
and an HTML report under `coverage/index.html`.

---

## React DevTools Profiling

1. Run `npm run dev` and open the app in Chrome.
2. Open browser DevTools (F12) and switch to the **React DevTools** tab
   (install the "React Developer Tools" browser extension if not already installed).
3. Select the **⚛ Profiler** tab.
4. Click the record (●) button to start recording.
5. Interact with the calendar: click "Next month", open an event, drag an event
   to a new date, or type in the search box.
6. Click the record button again to stop.
7. Inspect the **Flamegraph** and **Ranked** views:
   - Each bar represents a component; width/color roughly indicates render duration.
   - Components that re-rendered but are shown in **grey** did not actually
     re-render — React DevTools highlights components that *did* re-commit.
   - Hover a bar to see **"Why did this render?"** (if that setting is enabled)
     to see which prop/state change triggered it.
8. Compare behavior with and without the memoization in this project: try
   temporarily removing `memo()` from `EventCard` (or `React.memo` wrapper) and
   re-profile typing in the search box — you should see many more `EventCard`
   commits per keystroke, because every card in the grid re-renders instead of
   only the ones affected.

**Why memoization reduces unnecessary work:** without `React.memo`, every
`EventCard`/`CalendarDay` re-renders whenever their parent (`Calendar`/`App`)
re-renders, even if that specific card's props are unchanged (e.g. typing in
the search box, toggling the Performance Monitor, or the modal opening).
`React.memo` performs a shallow prop comparison and skips re-rendering when
props are referentially equal. That equality check only holds if callback
props are stable across renders — which is why every handler passed into a
memoized child (`onEventClick`, `onDragStart`, `moveEvent`, etc.) is wrapped in
`useCallback`. `useMemo` is used for the derived data (the month grid, the
events-by-date grouping, the filtered event list) so those (mildly) expensive
computations aren't redone on renders where their inputs haven't changed.

---

## MSW (Mock Service Worker)

`src/services/eventService.js` calls plain `fetch('/api/events', …)` — it has
no knowledge that the API is mocked. Two MSW setups intercept those calls:

- **`src/mocks/browser.js`** — used only in the running app (`src/main.jsx`
  calls `worker.start()` before rendering). It relies on the generated
  `public/mockServiceWorker.js` service worker file.
- **`src/mocks/server.js`** — used only in tests (`src/tests/setup.js` starts
  it in `beforeAll`/stops it in `afterAll`), using MSW's Node interceptor so no
  browser/service worker is needed.

Both share the same request handlers in **`src/mocks/handlers.js`**, which keep
an in-memory array of events and implement:

- `GET /api/events` → returns all events.
- `POST /api/events` → validates `title`/`date`, creates and returns a new event.
- `PUT /api/events/:id` → updates and returns the event (used for edits *and*
  for drag-and-drop date moves).
- `DELETE /api/events/:id` → removes the event.

Because the UI always goes through `eventService.js` → `fetch()`, this is a
faithful simulation of a frontend talking to a real backend, and individual
tests can override a handler (e.g. `server.use(http.get('/api/events', () =>
HttpResponse.json({...}, { status: 500 })))`) to test error states.

---

## Performance Optimization

- **`React.memo`** — applied to `EventCard`, `CalendarDay`, `EventList`,
  `SearchBar` and `EventModal`, all of which render frequently or in bulk
  (up to 42 `CalendarDay` cells and dozens of `EventCard`s per month). Each
  file has a comment explaining why it was memoized.
- **`useMemo`** — used in `Calendar.jsx` for `buildMonthGrid` (building the
  42-cell month grid) and `groupEventsByDate` (grouping events by date key),
  and in `App.jsx` for the filtered event list and the "upcoming events" list —
  all derived computations that shouldn't re-run unless their actual inputs
  change.
- **`useCallback`** — used throughout `App.jsx`, `Calendar.jsx` and
  `useEvents.js` for every handler passed down into a memoized child
  (event click, day click, drag start/end/drop, create/edit/delete/move,
  search change), so those children's `React.memo` checks actually succeed.
- **`React.lazy` + `Suspense`** — `PerformanceMonitor` is imported with
  `lazy(() => import('./components/PerformanceMonitor.jsx'))` in `App.jsx` and
  rendered inside a `<Suspense fallback={<Loading />}>` boundary, only when the
  user opts to show it — a simple, real example of code-splitting a
  non-critical panel out of the main bundle.

---

## Experiment Assignments

**Assignment 1 — Render Optimization.** Implemented via `React.memo` on
`EventCard`/`CalendarDay`/`EventList`/`SearchBar`/`EventModal`, `useMemo` for
the month grid/event grouping/filtering, and `useCallback` for all handlers
passed to memoized children. `console.log` statements in `EventCard`,
`EventList` and `SearchBar` make re-renders observable in the browser console
for before/after comparison.

**Assignment 2 — Drag-and-Drop Feature.** Implemented with native HTML5 drag
events (`draggable`, `onDragStart`/`onDragEnd` on `EventCard`,
`onDragOver`/`onDragLeave`/`onDrop` on `CalendarDay`). Dropping an event calls
`moveEvent(id, newDate)` from `useEvents.js`, which `PUT`s the change through
MSW and updates state, so the calendar immediately re-renders the event in its
new cell.

**Assignment 3 — Profiling Analysis.** See the "React DevTools Profiling"
section above for the exact steps and what to look for in the
Flamegraph/Ranked views for `Calendar`, `CalendarDay` and `EventCard`.

**Assignment 4 — Component Testing.** `Calendar.test.jsx`, `EventCard.test.jsx`
and `EventForm.test.jsx` use React Testing Library to test observable behavior
(rendering, clicks, keyboard activation, drag-start, validation, navigation) —
not implementation details.

**Assignment 5 — Advanced API Mocking + Coverage.** `Api.test.jsx` exercises
the MSW-mocked API directly (`getEvents`/`createEvent`) and through the UI
(loading state, successful render, a `server.use()`-overridden 500 error and
retry). `EventInteraction.test.jsx` covers create/edit/delete/drag/search as
integration tests. `npm run test:coverage` reports statement/branch/function/line
coverage via `@vitest/coverage-v8`.

---

## Expected Result

Running `npm run dev` and opening the app shows the **Smart Interactive
Calendar** header, a search bar, the current month's calendar grid populated
with sample events (color-coded by category), and a sidebar with an "Upcoming
Events" list and a toggleable Performance Monitor panel. Clicking an event
opens a details dialog with Edit/Delete actions; clicking an empty day or "+
Add Event" opens a create form. Dragging an event onto another date moves it
there. Typing in the search box filters both the grid and the sidebar list in
real time. Running `npm run test` executes 20+ passing tests covering
rendering, CRUD, drag-and-drop, search and API/error states, and `npm run
test:coverage` produces a coverage report.
