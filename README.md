# nodeweb_line Full-Stack Example

This workspace contains a single HTML front-end (`EliteHub.html`) and a simple Node.js/Express backend (`server.js`). The backend exposes an API to read and write JSON data, and serves the front-end as a static file.

## Project structure

```
nodeweb_line/
├─ EliteHub.html         # front-end application (includes GAS editor)
├─ dashboard_codes.json  # initial template data (used by other tooling)
├─ app_data.json         # persistent JSON store for API data (starts empty)
├─ server.js             # Express server providing REST API + static files
├─ package.json          # npm metadata and scripts
└─ README.md             # this file
```

> **Note:** `EliteHub.html` now includes a short snippet at the bottom demonstrating a call to `/api/dashboard`.

## Getting started

1. Open a terminal in this folder.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```
   or during development:
   ```sh
   npm run dev
   ```
4. Browse to [http://localhost:3000](http://localhost:3000) to open `EliteHub.html`.

## API endpoints

- **GET** `/api/dashboard` – returns JSON stored in `app_data.json`.
- **POST** `/api/dashboard` – accepts `{ cat, sub, note }` and appends the note under the given category/subgroup.

The `app_data.json` file is manipulated automatically when the POST endpoint is called.

## Making it full stack

This basic setup shows how the existing workspace can be treated as a full-stack project. You can modify `EliteHub.html` (or create new pages) to fetch from the local API endpoints and display or manipulate data. The backend code can be extended with authentication, additional routes, or integration with a real database as needed.

---

Feel free to expand the server logic or reorganize the front-end; the current state provides a minimal working example of a Node/Express-backed application with static HTML/CSS/JS served from the same project.
