Site Ledger: Civil Engineering Project Management Dashboard

A web-based dashboard to monitor and manage construction projects, built with plain HTML, CSS and JavaScript.
Live demo: https://majestic-mooncake-a70dd2.netlify.app/

Problem statement

Site data is scattered across paper registers, spreadsheets and chats. Delays, material shortages and budget overruns are noticed late, and enterprise tools such as MS Project and Primavera P6 are costly and complex for small teams. This project gives small construction teams a free, lightweight dashboard that runs in any browser.

Features
Module	What it does
Dashboard	Overall completion ring, tasks done, active alerts, budget spent, phase-wise progress bars, next deadline
Tasks	Add, edit, delete and assign tasks; update status (pending / in progress / done); search, filter by phase and status, sort by any column
Materials	Inventory with quantity, unit and low-stock level; automatic low-stock flag; add, edit, delete
Workforce	Worker records and daily attendance with days-present count
Budget	Budgeted vs actual spend in ₹ lakh, variance per category and totals
Timeline	Tasks ordered by due date with late / due-soon markers; configurable warning window
Reports	Chart.js charts (budget vs actual, task status, phase completion); CSV export; JSON backup and restore; print / save as PDF
Alerts engine	Flags overdue tasks, tasks due soon, low-stock materials and over-budget categories
Field use	Responsive layout, dark mode, works offline after first load
Roles (demo)	Manager, Engineer and Worker views that show or hide controls
Usability	Validation, duplicate checks, toast messages, keyboard and screen-reader support
Technologies
HTML5, CSS3 (custom properties, grid, flexbox, dark theme, print styles)
JavaScript (ES6, DOM manipulation, event delegation)
Browser localStorage (JSON) as the data layer
Chart.js 4.4.1 for charts (loaded from a CDN)
Architecture
Site manager (browser)
        |
Presentation layer:  index.html + style.css
        |
Application logic:   app.js (modules, alerts engine, reports)
        |
Data layer:          localStorage (JSON)

All records live in one state object saved under the key siteledger. Every change updates the state, saves it, and re-renders the views, so a change in one module (for example a task marked done) is reflected across the dashboard.

Project structure
civil-dashboard/
├── index.html   page structure, forms and tabs
├── style.css    theme, layout, dark mode, print styles
├── app.js       state, rendering, alerts, charts, import/export
└── README.md
How to run
Download or clone the repository.
Open index.html in a modern browser (Chrome, Edge, Firefox or Safari). No build step or server is needed.
The app starts with sample project data. Use Reports → Reset sample data (manager role) to restore it at any time.

To publish it, upload the three files to a GitHub repository and enable Settings → Pages on the main branch.

How to use
Dashboard: read the progress ring and any alerts.
Tasks: add a task with a due date, change its status from the dropdown, or use Edit to change its details.
Materials: update stock quantities directly in the table; items at or below their low-stock level turn red.
Workforce: tick the workers who are present today.
Budget: update actual spend to see variance and over-budget alerts.
Timeline: set how many days before a deadline you want a warning.
Reports: view charts, export CSV, or back up and restore your data as JSON.
Alert rules
Alert	Rule
Delayed	Task is not done and its due date is before today
Due soon	Task is not done and due within the warning window (default 3 days)
Low stock	Material quantity is at or below its low-stock level
Over budget	A category's actual spend is greater than its budgeted amount
Testing
Test	Expected result	Result
Add a task with a past due date	Delayed alert appears on the dashboard	fill in
Set a material below its low-stock level	Low-stock tag and alert appear	fill in
Reload the page	Records are still there	fill in
Export JSON, reset, then restore	Data returns exactly	fill in
Add a duplicate material	Error message, no new row	fill in
Open on a phone	Layout fits, tables scroll sideways	fill in
Toggle dark mode	Theme changes and persists	fill in

Browsers tested: list versions here

Limitations
Data is stored in each user's own browser. It is not shared between devices or people, and clearing browser data erases it. Use Back up (JSON) regularly.
The Manager / Engineer / Worker roles only change what the interface shows. There is no real login, so they are not a security feature.
Charts need an internet connection the first time because Chart.js loads from a CDN.
Future work
Node.js and database backend with real login, so roles are enforced on the server and data is shared by the whole team
Gantt-style timeline and task dependencies
Earned value metrics (CPI and SPI) in the budget module
Installable offline app (PWA) and deadline notifications
Multiple projects and site photo or notes log
References
MDN Web Docs, Web Storage API (localStorage), developer.mozilla.org
MDN Web Docs, HTML, CSS and JavaScript reference and guides, developer.mozilla.org
Chart.js documentation, chartjs.org/docs
Project Management Institute, A Guide to the Project Management Body of Knowledge (PMBOK Guide)
Microsoft Project and Oracle Primavera P6 documentation (existing tools studied for comparison)
