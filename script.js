'use strict';

// !!! IMPORTANT !!!
// PASTE THE WEB APP URL YOU COPIED FROM GOOGLE APPS SCRIPT HERE
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwmE55kqXddWLl944VW7LGFfHIohvGo3khYsjwyNgSDsREz2B_HygMGIdMTE7oKhKto-A/exec'; 

window.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const taskList = document.getElementById('task-list');
    const loader = document.getElementById('loader');
    const taskDropdown = document.getElementById('task-dropdown');
    const saveTimeBtn = document.getElementById('saveTimeBtn');

    // --- TIME TRACKER LOGIC (Identical) ---
    const stopwatchDisplay = document.getElementById('stopwatch');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    let startTime = 0, elapsedTime = 0, timerInterval;
    const formatTime = (time) => new Date(time).toISOString().substr(11, 8);
    const updateStopwatch = () => {
        elapsedTime = Date.now() - startTime;
        stopwatchDisplay.textContent = formatTime(elapsedTime);
    };
    startBtn.addEventListener('click', () => {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateStopwatch, 100);
    });
    stopBtn.addEventListener('click', () => clearInterval(timerInterval));
    resetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        elapsedTime = 0;
        stopwatchDisplay.textContent = "00:00:00";
    });

    // --- TO-DO LIST LOGIC (Updated) ---
    
    const showLoader = (show) => {
        loader.style.display = show ? 'block' : 'none';
    };

    // Render tasks and create the new status dropdown for each
    function renderTasks(tasks) {
        taskList.innerHTML = '';
        taskDropdown.innerHTML = '<option value="">-- Select a task --</option>';

        tasks.forEach(task => {
            const li = document.createElement('li');
            // Add a class based on the status for CSS styling
            li.className = 'status-' + task.Status.toLowerCase().replace(' ', '-');
            
            // Task Text
            const taskTextSpan = document.createElement('span');
            taskTextSpan.className = 'task-text';
            taskTextSpan.textContent = task.Task;
            li.appendChild(taskTextSpan);

            // --- CREATE STATUS DROPDOWN (The Edit Option) ---
            const statusSelect = document.createElement('select');
            statusSelect.className = 'status-select';
            const statuses = ["In Progress", "Completed", "Not Required"];
            statuses.forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                if (task.Status === status) {
                    option.selected = true;
                }
                statusSelect.appendChild(option);
            });
            // Add event listener to update status on change
            statusSelect.addEventListener('change', (e) => {
                updateTaskStatus(task.ID, e.target.value);
            });
            li.appendChild(statusSelect);
            // --------------------------------------------------

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '&times;';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(task.ID);
            });
            li.appendChild(deleteBtn);

            taskList.appendChild(li);
            
            // Populate dropdown only with "In Progress" tasks
            if (task.Status === 'In Progress') {
                const option = document.createElement('option');
                option.value = task.ID;
                option.textContent = task.Task;
                taskDropdown.appendChild(option);
            }
        });
    }

    // Fetch all tasks
    async function loadTasks() {
        showLoader(true);
        try {
            const response = await fetch(SCRIPT_URL);
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
            alert('Could not load tasks.');
        } finally {
            showLoader(false);
        }
    }

    // Add a new task (defaults to 'In Progress')
    async function addTask(event) {
        event.preventDefault();
        const taskText = todoInput.value.trim();
        if (taskText) {
            showLoader(true);
            try {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'create', task: taskText }),
                });
                todoInput.value = '';
                loadTasks();
            } catch (error) {
                console.error('Error adding task:', error);
                alert('Could not add the task.');
                showLoader(false);
            }
        }
    }

    // NEW: Update a task's status
    async function updateTaskStatus(id, newStatus) {
        showLoader(true);
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'update', id: id, status: newStatus }),
            });
            loadTasks(); // Reload to reflect changes
        } catch (error) {
            console.error('Error updating task status:', error);
            alert('Could not update the task.');
            showLoader(false);
        }
    }

    // Delete a task
    async function deleteTask(id) {
        showLoader(true);
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'delete', id: id }),
            });
            loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Could not delete the task.');
            showLoader(false);
        }
    }

    // Save tracked time to a selected task
    async function saveTimeToTask() {
        const taskId = taskDropdown.value;
        const timeToSave = stopwatchDisplay.textContent;

        if (!taskId) {
            alert('Please select a task from the dropdown first.');
            return;
        }
         if (elapsedTime === 0) {
            alert('Timer has not run. Please track some time first.');
            return;
        }

        showLoader(true);
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'update', id: taskId, timeSpent: timeToSave }),
            });
            alert(`Time (${timeToSave}) saved!`);
            resetTimer(); // Reset timer after saving
            loadTasks(); // Reload to see updated time if you were to display it
        } catch (error) {
             console.error('Error saving time:', error);
             alert('Could not save time.');
        } finally {
            showLoader(false);
        }
    }

    // --- EVENT LISTENERS ---
    todoForm.addEventListener('submit', addTask);
    saveTimeBtn.addEventListener('click', saveTimeToTask);

    // --- INITIAL LOAD ---
    loadTasks();
});