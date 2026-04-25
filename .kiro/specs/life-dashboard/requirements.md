# Requirements Document

## Introduction

The Life Dashboard is a single-page browser application built with vanilla HTML, CSS, and JavaScript (no frameworks). It serves as a personal productivity hub that displays the current time and date, greets the user by name, provides a configurable focus/Pomodoro timer, manages a to-do list, and offers a quick-access bookmarks panel. All user data is persisted locally via the browser's `localStorage` API. The application supports both a light and a dark visual theme.

---

## Glossary

- **Dashboard**: The single-page application described in this document.
- **Theme_Toggle**: The button that switches the Dashboard between dark and light visual themes.
- **Clock**: The live digital clock widget that displays the current local time.
- **Greeting**: The time-sensitive salutation displayed alongside the user's name.
- **Name_Input**: The text field and save button used to set the user's display name.
- **Focus_Timer**: The countdown timer widget used for focused work sessions (Pomodoro-style).
- **Task**: A single to-do item stored in the task list.
- **Task_List**: The ordered collection of Tasks managed by the Dashboard.
- **Task_Input**: The text field and button used to add new Tasks.
- **Quick_Links**: The collection of user-defined bookmark chips displayed in the links panel.
- **Link_Chip**: A single clickable bookmark entry within Quick_Links.
- **localStorage**: The browser-native key-value storage used to persist all Dashboard data between sessions.

---

## Requirements

### Requirement 1: Theme Management

**User Story:** As a user, I want to toggle between dark and light themes, so that I can use the Dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL default to the dark theme on first load when no theme preference is stored in localStorage.
2. WHEN the Theme_Toggle button is activated, THE Dashboard SHALL switch to the opposite theme immediately.
3. WHEN the theme changes, THE Theme_Toggle SHALL display `🌙` while the dark theme is active and `☀️` while the light theme is active.
4. WHEN the theme changes, THE Dashboard SHALL persist the selected theme to localStorage under the key `theme`.
5. WHEN the Dashboard loads, THE Dashboard SHALL restore the previously persisted theme from localStorage before rendering any visible content.

---

### Requirement 2: Live Clock and Date Display

**User Story:** As a user, I want to see the current time and date at a glance, so that I can stay oriented throughout my day without switching applications.

#### Acceptance Criteria

1. THE Clock SHALL display the current local time in `HH:MM:SS` 24-hour format, updating every second.
2. THE Dashboard SHALL display the current local date in the format `DayName, MonthName D, YYYY` (e.g. `Wednesday, July 9, 2025`).
3. WHEN the displayed second changes, THE Clock SHALL update its value within 1 second of the actual system clock tick.

---

### Requirement 3: Personalised Greeting

**User Story:** As a user, I want the Dashboard to greet me by name with a time-appropriate salutation, so that the experience feels personal and contextually relevant.

#### Acceptance Criteria

1. THE Greeting SHALL display one of four salutations based on the current local hour:
   - `Good Morning` for hours 05:00–11:59
   - `Good Afternoon` for hours 12:00–16:59
   - `Good Evening` for hours 17:00–20:59
   - `Good Night` for hours 21:00–04:59
2. WHEN a user name is stored, THE Greeting SHALL append `, {name}` to the salutation (e.g. `Good Morning, Alex`).
3. WHEN no user name is stored, THE Greeting SHALL display the salutation followed by `!` (e.g. `Good Morning!`).
4. WHEN the user enters a name in Name_Input and activates the save action (button click or Enter key), THE Dashboard SHALL trim whitespace from the input, persist the name to localStorage under the key `userName`, and update the Greeting immediately.
5. IF the Name_Input value is empty or whitespace-only when the save action is activated, THEN THE Dashboard SHALL not update the stored name or the Greeting.
6. WHEN the Dashboard loads, THE Dashboard SHALL restore the previously persisted user name from localStorage and pre-populate Name_Input with that value.

---

### Requirement 4: Focus Timer

**User Story:** As a user, I want a configurable countdown timer, so that I can structure my work into focused sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL default to a 25-minute duration on first load when no duration preference is stored in localStorage.
2. THE Focus_Timer SHALL accept integer duration values between 1 and 120 minutes (inclusive).
3. WHEN the user sets a new duration and activates the set action, THE Focus_Timer SHALL update the displayed countdown to the new duration, persist the value to localStorage under the key `pomodoroDuration`, and display a confirmation status message for 2 seconds.
4. IF the entered duration value is outside the range 1–120, THEN THE Focus_Timer SHALL not update the duration or the countdown display.
5. WHEN the Start button is activated and the timer is not already running, THE Focus_Timer SHALL begin counting down one second per second and display the status `🎯 Focus mode ON!`.
6. WHILE the Focus_Timer is running, THE Focus_Timer SHALL update the countdown display every second in `MM:SS` format.
7. WHEN the countdown reaches zero, THE Focus_Timer SHALL stop counting, display the status `🎉 Session complete!`, and remain at `00:00`.
8. WHEN the Stop button is activated and the timer is running, THE Focus_Timer SHALL pause the countdown and display the status `⏸ Paused`.
9. WHEN the Reset button is activated, THE Focus_Timer SHALL stop any running countdown and reset the display to the current configured duration with no status message.
10. WHEN the Dashboard loads, THE Focus_Timer SHALL restore the previously persisted duration from localStorage and initialise the countdown display to that duration.

---

### Requirement 5: To-Do List

**User Story:** As a user, I want to manage a personal task list, so that I can track what I need to do and mark items as complete.

#### Acceptance Criteria

1. WHEN the user enters text in Task_Input and activates the add action (button click or Enter key), THE Task_List SHALL add a new Task with the trimmed text and a `done: false` state, then clear Task_Input and return focus to it.
2. IF the Task_Input value is empty or whitespace-only when the add action is activated, THEN THE Task_List SHALL not add a Task.
3. IF the trimmed text of a new Task matches the trimmed text of any existing Task (case-insensitive), THEN THE Task_List SHALL not add the Task and SHALL display a duplicate warning message for 2.5 seconds.
4. WHEN the user activates the checkbox of a Task, THE Task_List SHALL toggle the `done` state of that Task and persist the updated list to localStorage.
5. WHEN a Task's `done` state is `true`, THE Task_List SHALL render that Task's text with a strikethrough style.
6. WHEN the user activates the delete button of a Task, THE Task_List SHALL remove that Task from the list and persist the updated list to localStorage.
7. WHEN the user activates the edit button of a Task, THE Task_List SHALL replace the Task's text display with an inline text input pre-populated with the current text, and replace the edit button with a save button.
8. WHEN the user activates the save button during an inline edit (button click or Enter key), THE Task_List SHALL trim the new text, validate it is non-empty and not a duplicate of any other Task (case-insensitive), update the Task's text, and persist the updated list to localStorage.
9. IF the trimmed text during an inline edit is empty, THEN THE Task_List SHALL not save the change.
10. IF the trimmed text during an inline edit matches the text of any other Task (case-insensitive, excluding the Task being edited), THEN THE Task_List SHALL not save the change and SHALL display a duplicate warning message for 2.5 seconds.
11. THE Task_List SHALL display a count in the format `{done} / {total} tasks completed` that updates whenever the list changes.
12. WHEN the Dashboard loads, THE Task_List SHALL restore all previously persisted Tasks from localStorage, including their `done` states.
13. THE Dashboard SHALL persist the Task_List to localStorage under the key `tasks` as a JSON array of objects with `text` (string) and `done` (boolean) properties.

---

### Requirement 6: Quick Links

**User Story:** As a user, I want to save and access frequently visited URLs as bookmark chips, so that I can navigate to important sites quickly from the Dashboard.

#### Acceptance Criteria

1. THE Dashboard SHALL initialise Quick_Links with three default entries (`Google`, `Gmail`, `GitHub`) when no links are stored in localStorage.
2. WHEN the user provides a link name and URL and activates the add action, THE Dashboard SHALL add a new Link_Chip to Quick_Links and persist the updated list to localStorage under the key `quickLinks`.
3. IF the link name or URL field is empty when the add action is activated, THEN THE Dashboard SHALL not add a Link_Chip.
4. WHEN the provided URL does not begin with `http://` or `https://`, THE Dashboard SHALL prepend `https://` to the URL before storing and displaying it.
5. WHEN a Link_Chip is clicked, THE Dashboard SHALL open the associated URL in a new browser tab without exposing the opener's browsing context (`rel="noopener"`).
6. WHEN the remove button on a Link_Chip is activated, THE Dashboard SHALL remove that Link_Chip from Quick_Links and persist the updated list to localStorage.
7. WHEN the Dashboard loads, THE Dashboard SHALL restore all previously persisted Quick_Links from localStorage.

---

### Requirement 7: Data Persistence

**User Story:** As a user, I want my settings and data to survive page reloads, so that I do not have to re-enter information every time I open the Dashboard.

#### Acceptance Criteria

1. THE Dashboard SHALL persist all mutable state — theme, user name, Pomodoro duration, Task_List, and Quick_Links — to localStorage using the keys `theme`, `userName`, `pomodoroDuration`, `tasks`, and `quickLinks` respectively.
2. WHEN the Dashboard loads, THE Dashboard SHALL read each persisted value from localStorage and restore the corresponding UI state before the page becomes interactive.
3. IF a localStorage key is absent (e.g. first load or cleared storage), THEN THE Dashboard SHALL apply the documented default value for that setting.
4. THE Dashboard SHALL store Task_List data as a JSON-serialisable array so that `JSON.parse(JSON.stringify(tasks))` produces an equivalent array.

---

### Requirement 8: Responsive Layout

**User Story:** As a user, I want the Dashboard to be usable on both desktop and mobile screen sizes, so that I can access it from any device.

#### Acceptance Criteria

1. THE Dashboard SHALL display the Focus Timer and To-Do List in a two-column grid layout on viewports wider than 640 px.
2. WHEN the viewport width is 640 px or narrower, THE Dashboard SHALL collapse the two-column grid to a single-column layout.
3. THE Dashboard SHALL constrain the main content area to a maximum width of 900 px and centre it horizontally on wider viewports.

---

### Requirement 9: Input Safety

**User Story:** As a developer, I want all user-supplied text to be safely rendered, so that the Dashboard is not vulnerable to cross-site scripting (XSS) via task text or link names.

#### Acceptance Criteria

1. WHEN rendering Task text or Link_Chip names supplied by the user, THE Dashboard SHALL escape HTML special characters (`&`, `<`, `>`, `"`, `'`) before inserting the text into the DOM.
2. THE Dashboard SHALL use `textContent` or an equivalent HTML-escaping function rather than direct `innerHTML` assignment for any user-supplied string values.
