# Implementation Plan: Dashboard Enhancements

## Overview

Extend the existing single-file dashboard (`index.html`, `css/style.css`, `js/app.js`) with three features: a light/dark theme toggle, a custom name in the greeting, and a configurable Pomodoro duration. All changes are confined to those three files.

## Tasks

- [x] 1. Add ThemeService to js/app.js and wire FOUC-prevention into index.html
  - Add `ThemeService` object to `js/app.js` with `STORAGE_KEY`, `DEFAULT`, `apply()`, `toggle()`, and `current()` methods
  - `apply()` reads `StorageService.get('dashboard_theme')`, falls back to `'dark'`; sets `data-theme="light"` on `<html>` for light, removes/omits attribute for dark
  - `toggle()` flips the current theme, calls `StorageService.set`, then `apply()`
  - Add an inline `<script>` block in `<head>` of `index.html` (before the stylesheet link) that calls `ThemeService.apply()` synchronously to prevent FOUC
  - _Requirements: 1.6, 1.7_

  - [ ]* 1.1 Write property test for theme toggle involution (Property 1)
    - **Property 1: Theme toggle is an involution**
    - **Validates: Requirements 1.2**

  - [ ]* 1.2 Write property test for theme persistence round-trip (Property 2)
    - **Property 2: Theme persistence round-trip**
    - **Validates: Requirements 1.5**

- [x] 2. Add theme toggle button to index.html and connect it to ThemeService
  - Add a `<button id="theme-toggle">` element to `index.html` that is always visible (e.g. fixed position or in a top bar)
  - In `DOMContentLoaded` bootstrap, call `ThemeService.apply()` to sync the button label, then attach a `click` listener that calls `ThemeService.toggle()` and updates the button label to reflect the now-inactive theme
  - Button label should read `"Switch to Light"` when dark is active and `"Switch to Dark"` when light is active
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.8_

- [x] 3. Add light theme CSS overrides to css/style.css
  - Add a `[data-theme="light"]` block on `:root` (or `html`) that overrides the colour custom properties: light background, dark text, adjusted surface and border colours
  - Ensure all four widgets render correctly under both themes using the existing CSS custom property references
  - _Requirements: 1.3, 1.4_

- [x] 4. Checkpoint — theme feature complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Extend GreetingWidget with name state and _buildGreeting
  - Add `_name` state (string, default `''`) and `_elNameInput` element reference to `GreetingWidget`
  - Add `_buildGreeting(hour)` method that returns `"[greeting], [name]"` when `_name` is set, or just `"[greeting]"` when empty
  - Update `_tick()` to call `this._buildGreeting(hour)` instead of `getGreeting(hour)` directly
  - Add `_saveName(value)` that trims the value, rejects empty/whitespace-only strings, persists via `StorageService.set('dashboard_username', trimmed)`, updates `_name`, and re-renders
  - In `init()`, load `StorageService.get('dashboard_username')` into `_name`
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 5.1 Write property test for valid name updates greeting (Property 3)
    - **Property 3: Valid name updates the greeting**
    - **Validates: Requirements 2.2, 2.7**

  - [ ]* 5.2 Write property test for whitespace-only name rejection (Property 4)
    - **Property 4: Whitespace-only name is rejected**
    - **Validates: Requirements 2.3**

  - [ ]* 5.3 Write property test for name persistence round-trip (Property 5)
    - **Property 5: Name persistence round-trip**
    - **Validates: Requirements 2.4**

- [x] 6. Add name input control to the greeting section in index.html
  - Add a `<form id="name-form">` with `<input id="name-input" class="input">` and a submit button inside `#greeting`
  - In `GreetingWidget.init()`, wire `_elNameInput` to `#name-input` and attach a `submit` listener on the form that calls `this._saveName(this._elNameInput.value)`
  - Pre-populate the input with the stored name on load
  - _Requirements: 2.1, 2.5_

- [x] 7. Checkpoint — greeting name feature complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Extend FocusTimerWidget with configurable duration state
  - Add `state.duration` (integer minutes, default `25`) to `FocusTimerWidget.state`
  - In `init()`, load `StorageService.get('dashboard_timer_duration')` and set `state.duration`; initialise `state.remaining` to `state.duration * 60`
  - Add `_setDuration(value)` that parses the value with `parseInt`, validates the range [1, 60], rejects anything outside (including floats, empty, non-numeric), updates `state.duration` and `state.remaining`, persists via `StorageService.set('dashboard_timer_duration', d)`, and calls `_render()`
  - Update `_reset()` to use `state.duration * 60` instead of the hard-coded `1500`
  - _Requirements: 3.2, 3.3, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 8.1 Write property test for valid duration updates display and state (Property 6)
    - **Property 6: Valid duration updates display and state**
    - **Validates: Requirements 3.2**

  - [ ]* 8.2 Write property test for invalid duration rejection (Property 7)
    - **Property 7: Invalid duration is rejected**
    - **Validates: Requirements 3.3**

  - [ ]* 8.3 Write property test for reset restores configured duration (Property 8)
    - **Property 8: Reset restores configured duration**
    - **Validates: Requirements 3.5**

  - [ ]* 8.4 Write property test for duration persistence round-trip (Property 9)
    - **Property 9: Duration persistence round-trip**
    - **Validates: Requirements 3.6**

- [x] 9. Add duration input control to the timer section in index.html and wire disable logic
  - Add `<input id="duration-input" class="input" type="number" min="1" max="60">` and a "Set" button inside `#focus-timer` in `index.html`
  - In `FocusTimerWidget.init()`, wire `_elDurationInput` to `#duration-input` and attach a `click` listener on the Set button that calls `this._setDuration(this._elDurationInput.value)`
  - In `_start()`, disable `_elDurationInput`; in `_stop()` and `_reset()`, re-enable it
  - Pre-populate the input with the stored (or default) duration on load
  - _Requirements: 3.1, 3.4_

- [x] 10. Final checkpoint — all features complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use **fast-check** with a minimum of 100 iterations per property
- Each property test is tagged: `Feature: dashboard-enhancements, Property N: <property text>`
- The inline `<script>` in `<head>` for FOUC prevention must reference `ThemeService` before `app.js` loads — either inline the minimal apply logic or ensure the script tag order is correct
- `parseInt` (not `parseFloat`) is used for duration validation so decimals are treated as invalid per the design
