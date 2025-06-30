# Productivity Hub: To-Do List & Time Tracker

A simple and clean web application that combines a time tracker with a to-do list. All data is stored and retrieved in real-time from a personal Google Sheet, which acts as a free and simple database.

This project was built to learn how to connect a front-end webpage to a back-end API and to understand the fundamentals of CRUD (Create, Read, Update, Delete) operations.

---

### Live Demo

You can view the live deployed project on GitHub Pages here:

**[https://devWorldDivey.github.io/my-todo-app/](https://devWorldDivey.github.io/my-todo-app/)**

*(Remember to replace this with your actual GitHub Pages URL!)*

---

### Key Features

* **Dynamic To-Do List:** Add, delete, and update tasks.
* **Multiple Task Statuses:** Each task can be marked as `In Progress`, `Completed`, or `Not Required`.
* **Persistent Storage:** All tasks are saved to a personal Google Sheet via a Google Apps Script API, acting as a secure back-end.
* **Integrated Time Tracker:** A simple stopwatch to start, stop, and reset time.
* **Time Logging:** Save the tracked time directly from the stopwatch to any task that is currently "In Progress".

---

### How It Works: Architecture

This project uses a simple but powerful serverless architecture:

1.  **Front-End (This Repository):** The user interface is built with standard `HTML`, `CSS`, and `JavaScript`. It makes API calls using the `fetch` function.
2.  **Back-End (Google Apps Script):** A script attached to the Google Sheet acts as a secure REST API. It listens for `GET` and `POST` requests from the front-end. It is the only thing with permission to modify the spreadsheet.
3.  **Database (Google Sheet):** A simple Google Sheet stores all the task data, with each row representing a unique to-do item.

This setup ensures that no private keys or credentials are ever exposed in the front-end code.

---

### Technology Stack

* **Front-End:** HTML5, CSS3, JavaScript (ES6+)
* **Back-End:** Google Apps Script
* **Database:** Google Sheets
* **Hosting:** GitHub Pages
* **Version Control:** Git

---

### How to Set Up a New Copy

To replicate this project, you will need to:

1.  **Create a Google Sheet:** Set up a sheet with the headers: `ID`, `Task`, `Status`, `Timestamp`, `TimeSpent`.
2.  **Create a Google Apps Script:** Attach a script to the sheet, paste the code from `Code.gs` (not included in this repo), and deploy it as a Web App with access given to "Anyone".
3.  **Update the Script URL:** Copy the deployed Web App URL.
4.  **Clone this Repository:** `git clone https://github.com/devWorldDivey/my-todo-app.git`
5.  **Add URL to `script.js`:** Paste your unique Web App URL into the `SCRIPT_URL` constant in the `script.js` file.
6.  **Run Locally:** Open the `index.html` file in your browser.
