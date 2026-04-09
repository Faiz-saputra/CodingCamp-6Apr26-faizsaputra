# Requirements Document

## Introduction

This document covers three enhancements to the existing personal dashboard web app (vanilla HTML/CSS/JS):

1. **Light/Dark mode toggle** — the user can switch between a light and a dark colour theme; the chosen theme is persisted across sessions.
2. **Custom name in greeting** — the user can set their name so the greeting reads e.g. "Good morning, Alex"; the name is persisted across sessions.
3. **Configurable Pomodoro duration** — the user can change the focus timer duration from the fixed 25-minute default to any value between 1 and 60 minutes; the chosen duration is persisted across sessions.

All three features extend the existing `StorageService`, `GreetingWidget`, and `FocusTimerWidget` modules and add no new external dependencies.

---

## Glossary

- **Dashboard**: The single-page web application that hosts all widgets.
- **Theme_Toggle**: The UI control that switches the Dashboard between light and dark colour themes.
- **Light_Theme**: The colour scheme where the page background is light and text is dark.
- **Dark_Theme**: The colour scheme where the page background is dark and text is light (the current default).
- **Active_Theme**: The colour theme currently applied to the Dashboard.
- **Greeting_Widget**: The UI component that displays the current time, date, and a time-based greeting message.
- **User_Name**: A non-empty string entered by the user to personalise the greeting message.
- **Name_Input**: The UI control inside the Greeting_Widget that allows the user to enter or update their User_Name.
- **Focus_Timer**: The UI component that counts down from a user-configured duration and provides start, stop, and reset controls.
- **Timer_Duration**: The number of minutes the Focus_Timer counts down from, configurable between 1 and 60 minutes inclusive.
- **Duration_Input**: The UI control inside the Focus_Timer widget that allows the user to set the Timer_Duration.
- **Local_Storage**: The browser's `localStorage` API used to persist all user data client-side.
- **StorageService**: The existing thin wrapper around Local_Storage used by all widgets.

---

## Requirements

### Requirement 1: Light/Dark Mode Toggle

**User Story:** As a user, I want to switch between a light and a dark colour theme, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a Theme_Toggle control that is visible and reachable from the main page at all times.
2. WHEN the user activates the Theme_Toggle, THE Dashboard SHALL switch the Active_Theme from Dark_Theme to Light_Theme, or from Light_Theme to Dark_Theme.
3. WHILE the Light_Theme is active, THE Dashboard SHALL apply a light background colour and a dark text colour to all widgets using the existing CSS custom properties.
4. WHILE the Dark_Theme is active, THE Dashboard SHALL apply a dark background colour and a light text colour to all widgets using the existing CSS custom properties.
5. THE Dashboard SHALL persist the Active_Theme to Local_Storage via StorageService after every theme change.
6. WHEN the Dashboard loads, THE Dashboard SHALL restore the Active_Theme from Local_Storage and apply it before the first paint.
7. IF no theme preference is found in Local_Storage, THEN THE Dashboard SHALL apply the Dark_Theme as the default.
8. THE Theme_Toggle SHALL display a label or icon that reflects the currently inactive theme (i.e. indicates what the next activation will switch to).

---

### Requirement 2: Custom Name in Greeting

**User Story:** As a user, I want to set my name so that the greeting says "Good morning, Alex" instead of just "Good morning", so that the dashboard feels more personal.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL provide a Name_Input control that allows the user to enter or update their User_Name.
2. WHEN the user submits a non-empty, non-whitespace-only User_Name via the Name_Input, THE Greeting_Widget SHALL update the greeting message to the format "[time-based greeting], [User_Name]" (e.g. "Good morning, Alex").
3. IF the user submits an empty or whitespace-only value via the Name_Input, THEN THE Greeting_Widget SHALL not update the User_Name and SHALL retain the current greeting format.
4. THE Greeting_Widget SHALL persist the User_Name to Local_Storage via StorageService after every successful update.
5. WHEN the Dashboard loads, THE Greeting_Widget SHALL restore the User_Name from Local_Storage and apply it to the greeting message immediately.
6. IF no User_Name is found in Local_Storage, THEN THE Greeting_Widget SHALL display the greeting without a name (e.g. "Good morning").
7. THE Greeting_Widget SHALL trim leading and trailing whitespace from the User_Name before persisting or displaying it.

---

### Requirement 3: Configurable Pomodoro Duration

**User Story:** As a user, I want to customise the focus timer duration, so that I can adapt the timer to work sessions shorter or longer than 25 minutes.

#### Acceptance Criteria

1. THE Focus_Timer SHALL provide a Duration_Input control that allows the user to set the Timer_Duration to any whole number of minutes between 1 and 60 inclusive.
2. WHEN the user confirms a valid Timer_Duration via the Duration_Input, THE Focus_Timer SHALL update the countdown start value to the specified number of minutes and reset the display to the new duration in MM:00 format.
3. IF the user enters a value outside the range 1–60 or a non-numeric value via the Duration_Input, THEN THE Focus_Timer SHALL not update the Timer_Duration and SHALL retain the current Timer_Duration.
4. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL disable the Duration_Input to prevent mid-session changes.
5. WHEN the user activates the reset control, THE Focus_Timer SHALL restore the display to the current Timer_Duration (not necessarily 25:00).
6. THE Focus_Timer SHALL persist the Timer_Duration to Local_Storage via StorageService after every successful update.
7. WHEN the Dashboard loads, THE Focus_Timer SHALL restore the Timer_Duration from Local_Storage and initialise the countdown start value accordingly.
8. IF no Timer_Duration is found in Local_Storage, THEN THE Focus_Timer SHALL use 25 minutes as the default Timer_Duration.
