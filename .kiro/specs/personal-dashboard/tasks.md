# Implementation Plan: Personal Dashboard

## Overview

Build a single-page personal dashboard as three files: `index.html`, `css/style.css`, and `js/app.js`. Each widget is an isolated module inside `app.js`. Implementation proceeds widget by widget, wiring everything together at the end.

## Tasks

- [x] 1. Scaffold project files and base HTML structure
  - Create `index.html` with semantic sections for all four widgets (greeting, timer, todo, quick links)
  - Create `css/style.css` with a CSS reset and CSS custom properties (colour tokens, spacing)
  - Create `js/app.js` with a `DOMContentLoaded` listener and empty module stubs for `StorageService`, `GreetingWidget`, `FocusTimerWidget`, `TodoWidget`, `QuickLinksWidget`
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 2. Implement StorageService
  - [x] 2.1 Write `StorageService.get(key)` and `StorageService.set(key, value)` with try/catch error handling
    - `get` returns parsed JSON or `null`; `set` serialises to JSON
    - Wrap both in try/catch; log a console warning on failure so the app continues in-memory
    - _Requirements: 3.5, 3.6, 6.3, 7.6_

- [ ] 3. Implement GreetingWidget
  - [x] 3.1 Implement `getGreeting(hour)` helper and the `setInterval` clock tick
    - Map hour 0–23 to one of "Good morning", "Good afternoon", "Good evening", "Good night" using the `GREETINGS` table from the design
    - Update time (`HH:MM`), date ("Monday, July 14 2025"), and greeting text every 1000 ms
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 3.2 Write property test for greeting coverage (Property 1)
    - **Property 1: Greeting is always defined**
    - Generate random integers 0–23; assert result is one of the four valid strings, never `undefined` or `""`
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**

- [ ] 4. Implement FocusTimerWidget
  - [x] 4.1 Implement `formatTime(seconds)` and timer state (`remaining`, `running`)
    - `formatTime` zero-pads minutes and seconds to produce `MM:SS`
    - Initialise state to `{ remaining: 1500, running: false }`
    - _Requirements: 2.1, 2.3_

  - [ ]* 4.2 Write property test for timer display format (Property 2)
    - **Property 2: Timer display format invariant**
    - Generate random integers 0–1500; assert output matches `/^\d{2}:\d{2}$/`
    - **Validates: Requirements 2.3**

  - [x] 4.3 Implement start, stop, and reset controls with button enable/disable logic
    - Start: create interval, disable start button, enable stop button
    - Stop: clear interval, enable start button, disable stop button
    - Reset: clear interval, set `remaining` to 1500, re-render, disable stop button
    - Auto-stop when `remaining` reaches 0 and display `00:00`
    - _Requirements: 2.2, 2.4, 2.5, 2.6, 2.7, 2.8_

- [ ] 5. Implement TodoWidget — add and display
  - [x] 5.1 Implement `addTask(description)` with validation and `renderTasks()`
    - Trim input; reject empty/whitespace-only strings and retain focus on the input field
    - Generate id via `crypto.randomUUID()` with fallback to `Date.now() + Math.random()`
    - Append task `{ id, description, completed: false }`, persist via `StorageService`, re-render
    - `renderTasks` produces one list item per task with description text, completion toggle, edit button, and delete button
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 5.2 Write property test for task addition round-trip (Property 3)
    - **Property 3: Task addition round-trip**
    - Generate random non-empty strings; assert `localStorage` contains a task with the trimmed description and `completed: false`
    - **Validates: Requirements 3.2, 3.5, 3.6**

  - [ ]* 5.3 Write property test for whitespace task rejection (Property 4)
    - **Property 4: Whitespace task rejection**
    - Generate strings of spaces/tabs/newlines; assert list length is unchanged after attempted add
    - **Validates: Requirements 3.3**

  - [x] 5.4 Restore tasks from `localStorage` on widget init
    - Call `StorageService.get("dashboard_todos")` and populate in-memory array before first render
    - _Requirements: 3.6_

- [ ] 6. Implement TodoWidget — edit, complete, and delete
  - [x] 6.1 Implement `toggleTask(id)` and `deleteTask(id)`
    - `toggleTask`: flip `completed` flag, persist, re-render
    - `deleteTask`: filter task out by id, persist, re-render
    - Apply `text-decoration: line-through` style to completed task descriptions
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 6.2 Write property test for completion toggle involution (Property 5)
    - **Property 5: Task completion toggle is an involution**
    - Generate random task objects; assert toggling twice returns original `completed` value
    - **Validates: Requirements 5.1**

  - [ ]* 6.3 Write property test for task deletion (Property 8 — tasks)
    - **Property 8: Deletion removes exactly one item**
    - Generate random task arrays with at least one item; assert list length decreases by exactly 1 and only the targeted id is removed
    - **Validates: Requirements 5.3**

  - [x] 6.4 Implement inline edit mode for tasks
    - On edit button click: replace description span with a pre-filled `<input>`, show save/cancel controls
    - On Enter or save: trim value; if non-empty update description and exit edit mode; if empty restore original and exit edit mode
    - On Escape or cancel: discard changes and exit edit mode
    - Persist and re-render after a successful save
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 6.5 Write property test for task edit round-trip (Property 6)
    - **Property 6: Task edit round-trip**
    - Generate random task + non-empty replacement description pairs; assert description is updated to trimmed value and all other fields are unchanged
    - **Validates: Requirements 4.2**

- [ ] 7. Checkpoint — verify todo widget behaviour
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement QuickLinksWidget
  - [x] 8.1 Implement `addLink(label, url)` with validation and `renderLinks()`
    - Trim both fields; reject if either is empty
    - Generate id, append link `{ id, label, url }`, persist via `StorageService`, re-render
    - `renderLinks` renders each link as a button that opens `url` in a new tab, plus a delete button
    - _Requirements: 6.1, 6.2, 7.1, 7.2, 7.3_

  - [ ]* 8.2 Write property test for link addition round-trip (Property 7)
    - **Property 7: Link addition round-trip**
    - Generate random non-empty label + URL pairs; assert `localStorage` contains a link with the trimmed label and URL
    - **Validates: Requirements 7.2, 7.6**

  - [x] 8.3 Implement `deleteLink(id)` and restore links on init
    - `deleteLink`: filter by id, persist, re-render
    - On init: call `StorageService.get("dashboard_links")` and populate before first render
    - _Requirements: 6.3, 7.4, 7.5, 7.6_

  - [ ]* 8.4 Write property test for link deletion (Property 8 — links)
    - **Property 8: Deletion removes exactly one item**
    - Generate random link arrays with at least one item; assert list length decreases by exactly 1 and only the targeted id is removed
    - **Validates: Requirements 7.5**

- [x] 9. Apply responsive CSS layout
  - Implement a multi-column CSS Grid layout for viewports ≥ 768 px
  - Add a `@media (max-width: 767px)` block that switches to a single-column stacked layout
  - Style all four widgets, buttons, inputs, and the completed-task strikethrough
  - _Requirements: 8.4, 8.5_

- [x] 10. Wire everything together and final integration
  - [x] 10.1 Call each widget's `init()` from the `DOMContentLoaded` handler in `app.js`
    - Ensure `GreetingWidget`, `FocusTimerWidget`, `TodoWidget`, and `QuickLinksWidget` all initialise in order
    - _Requirements: 8.1, 8.6_

  - [x] 10.2 Verify Enter-key submission works for the todo add input and the quick-links add form
    - Attach `keydown` listeners for Enter on the task input and the link label/URL inputs
    - _Requirements: 3.2_

- [ ] 11. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP (NFR-1: no test setup required)
- Each task references specific requirements for traceability
- Property tests use fast-check with a minimum of 100 iterations per property
- Timer state is intentionally not persisted to `localStorage` — it resets on page reload by design
