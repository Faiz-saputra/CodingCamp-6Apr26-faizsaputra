# Requirements Document

## Introduction

A personal dashboard web app built with HTML, CSS, and vanilla JavaScript. The app runs entirely in the browser with no backend server. It provides a greeting with the current time and date, a focus timer, a to-do list, and a quick links panel. All user data is persisted using the browser's Local Storage API.

## Glossary

- **Dashboard**: The single-page web application that hosts all widgets.
- **Greeting_Widget**: The UI component that displays the current time, date, and a time-based greeting message.
- **Focus_Timer**: The UI component that counts down from 25 minutes and provides start, stop, and reset controls.
- **Todo_List**: The UI component that manages a list of user-defined tasks.
- **Task**: A single to-do item with a text description and a completion state.
- **Quick_Links**: The UI component that displays a set of user-defined shortcut buttons to external URLs.
- **Link**: A single quick-link entry with a label and a URL.
- **Local_Storage**: The browser's `localStorage` API used to persist all user data client-side.
- **Modern_Browser**: Chrome, Firefox, Edge, or Safari at a current or recent major version.

---

## Requirements

### Requirement 1: Time and Date Display

**User Story:** As a user, I want to see the current time and date when I open the dashboard, so that I always have an at-a-glance reference without checking another app.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current time in HH:MM format, updated every second.
2. THE Greeting_Widget SHALL display the current date in a human-readable format (e.g., "Monday, July 14 2025").
3. WHEN the local time is between 05:00 and 11:59, THE Greeting_Widget SHALL display the message "Good morning".
4. WHEN the local time is between 12:00 and 17:59, THE Greeting_Widget SHALL display the message "Good afternoon".
5. WHEN the local time is between 18:00 and 21:59, THE Greeting_Widget SHALL display the message "Good evening".
6. WHEN the local time is between 22:00 and 04:59, THE Greeting_Widget SHALL display the message "Good night".

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer, so that I can use the Pomodoro technique to stay focused during work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialise with a countdown value of 25 minutes (1500 seconds).
2. WHEN the user activates the start control, THE Focus_Timer SHALL begin counting down one second per real-world second.
3. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL display the remaining time in MM:SS format.
4. WHEN the user activates the stop control, THE Focus_Timer SHALL pause the countdown and retain the current remaining time.
5. WHEN the user activates the reset control, THE Focus_Timer SHALL stop any active countdown and restore the display to 25:00.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and display 00:00.
7. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL disable the start control to prevent duplicate intervals.
8. WHILE the Focus_Timer is paused or reset, THE Focus_Timer SHALL disable the stop control.

---

### Requirement 3: To-Do List — Add and Display Tasks

**User Story:** As a user, I want to add tasks to a list, so that I can track what I need to accomplish.

#### Acceptance Criteria

1. THE Todo_List SHALL provide a text input field and an add control for creating new tasks.
2. WHEN the user submits a non-empty task description via the add control or the Enter key, THE Todo_List SHALL append the new Task to the list.
3. IF the user attempts to submit an empty or whitespace-only task description, THEN THE Todo_List SHALL not create a Task and SHALL retain focus on the input field.
4. THE Todo_List SHALL display each Task with its description text, a completion toggle, an edit control, and a delete control.
5. THE Todo_List SHALL persist all tasks to Local_Storage after every add, edit, delete, or completion-state change.
6. WHEN the Dashboard loads, THE Todo_List SHALL restore all previously saved tasks from Local_Storage.

---

### Requirement 4: To-Do List — Edit Tasks

**User Story:** As a user, I want to edit existing tasks, so that I can correct or update task descriptions without deleting and re-adding them.

#### Acceptance Criteria

1. WHEN the user activates the edit control on a Task, THE Todo_List SHALL replace the Task's display text with an editable input field pre-filled with the current description.
2. WHEN the user confirms the edit (via a save control or the Enter key) with a non-empty value, THE Todo_List SHALL update the Task description and return to display mode.
3. IF the user confirms the edit with an empty or whitespace-only value, THEN THE Todo_List SHALL not update the Task and SHALL return to display mode with the original description.
4. WHEN the user cancels the edit (via an Escape key press), THE Todo_List SHALL discard changes and return to display mode with the original description.

---

### Requirement 5: To-Do List — Complete and Delete Tasks

**User Story:** As a user, I want to mark tasks as done and delete tasks, so that I can manage my list as I make progress.

#### Acceptance Criteria

1. WHEN the user activates the completion toggle on a Task, THE Todo_List SHALL toggle the Task's completion state between complete and incomplete.
2. WHILE a Task is in the complete state, THE Todo_List SHALL render the Task description with a visual struck-through style.
3. WHEN the user activates the delete control on a Task, THE Todo_List SHALL remove the Task from the list permanently.
4. THE Todo_List SHALL persist the updated task list to Local_Storage after every completion-state change or deletion.

---

### Requirement 6: Quick Links — Display and Navigate

**User Story:** As a user, I want to see shortcut buttons to my favourite websites, so that I can navigate to them quickly from the dashboard.

#### Acceptance Criteria

1. THE Quick_Links SHALL display each saved Link as a labelled button.
2. WHEN the user activates a Link button, THE Quick_Links SHALL open the associated URL in a new browser tab.
3. WHEN the Dashboard loads, THE Quick_Links SHALL restore all previously saved links from Local_Storage.

---

### Requirement 7: Quick Links — Add and Delete Links

**User Story:** As a user, I want to add and remove quick links, so that I can customise the shortcuts to match my current needs.

#### Acceptance Criteria

1. THE Quick_Links SHALL provide input fields for a link label and a link URL, and an add control.
2. WHEN the user submits a non-empty label and a non-empty URL via the add control, THE Quick_Links SHALL append the new Link to the panel.
3. IF the user attempts to submit with an empty label or an empty URL, THEN THE Quick_Links SHALL not create a Link.
4. THE Quick_Links SHALL provide a delete control on each Link button.
5. WHEN the user activates the delete control on a Link, THE Quick_Links SHALL remove the Link from the panel permanently.
6. THE Quick_Links SHALL persist all links to Local_Storage after every add or delete operation.

---

### Requirement 8: Layout and Responsiveness

**User Story:** As a user, I want the dashboard to be readable and usable on different screen sizes, so that I can use it on both desktop and laptop screens.

#### Acceptance Criteria

1. THE Dashboard SHALL render all four widgets (Greeting_Widget, Focus_Timer, Todo_List, Quick_Links) in a single HTML file.
2. THE Dashboard SHALL apply all styles from exactly one external CSS file located in the `css/` directory.
3. THE Dashboard SHALL apply all behaviour from exactly one external JavaScript file located in the `js/` directory.
4. WHEN the viewport width is 768px or wider, THE Dashboard SHALL display widgets in a multi-column grid layout.
5. WHEN the viewport width is below 768px, THE Dashboard SHALL display widgets in a single-column stacked layout.
6. THE Dashboard SHALL load and render all widgets within 2 seconds on a Modern_Browser with a standard broadband connection.
