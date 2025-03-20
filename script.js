
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const showAllBtn = document.getElementById("showAll");
const showCompletedBtn = document.getElementById("showCompleted");
const showPendingBtn = document.getElementById("showPending");
const clearAllBtn = document.getElementById("clearAll");
const dueDateInput = document.getElementById("dueDate");
const searchTaskInput = document.getElementById("searchTask");
const sortTasksDropdown = document.getElementById("sortTasks");


function clearAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        taskList.innerHTML = "";
        localStorage.removeItem("tasks"); 
    }
}

clearAllBtn.addEventListener("click", clearAllTasks);

document.addEventListener("DOMContentLoaded", loadTasks);


function addTask() {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText === "") {
        alert("Task cannot be empty!");
        return;
    }

    const taskObj = { text: taskText, completed: false, dueDate };

    createTaskElement(taskObj);
    saveTask(taskObj);

    taskInput.value = "";
    dueDateInput.value = ""; 
}

function createTaskElement(taskObj) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="${taskObj.completed ? "completed" : ""}">${taskObj.text}</span>
        <span class="due-date">${taskObj.dueDate ? `Due: ${taskObj.dueDate}` : ""}</span>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">X</button>
    `;

    taskList.appendChild(li);

    // Mark as completed on click
    li.querySelector("span").addEventListener("click", function () {
        taskObj.completed = !taskObj.completed;
        this.classList.toggle("completed", taskObj.completed);
        updateTaskStatus(taskObj.text, taskObj.completed);
    });

    // Edit task
    li.querySelector(".edit-btn").addEventListener("click", function () {
        editTask(taskObj.text);
    });

    // Delete task
    li.querySelector(".delete-btn").addEventListener("click", function () {
        li.remove();
        removeTask(taskObj.text);
    });

    li.dataset.completed = taskObj.completed; // Add dataset for filtering
}

function checkDueDates() {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    document.querySelectorAll(".due-date").forEach(dueDateEl => {
        if (dueDateEl.textContent.includes("Due:")) {
            const taskDueDate = dueDateEl.textContent.replace("Due: ", "").trim();
            if (taskDueDate < today) {
                dueDateEl.classList.add("overdue");
            } else {
                dueDateEl.classList.remove("overdue");
            }
        }
    });
}

// Function to sort tasks
function sortTasks() {
    const sortBy = sortTasksDropdown.value;
    let tasks = Array.from(document.querySelectorAll("#taskList li"));

    if (sortBy === "dueDate") {
        tasks.sort((a, b) => {
            const dateA = a.querySelector(".due-date").textContent.replace("Due: ", "").trim();
            const dateB = b.querySelector(".due-date").textContent.replace("Due: ", "").trim();
            return new Date(dateA) - new Date(dateB);
        });
    } else if (sortBy === "completed") {
        tasks.sort((a, b) => {
            const completedA = a.dataset.completed === "true" ? 1 : 0;
            const completedB = b.dataset.completed === "true" ? 1 : 0;
            return completedA - completedB; // Sort uncompleted tasks first
        });
    }

    // Clear and re-add sorted tasks
    taskList.innerHTML = "";
    tasks.forEach(task => taskList.appendChild(task));
}

// Event Listener for sorting
sortTasksDropdown.addEventListener("change", sortTasks);

// Call checkDueDates when page loads
document.addEventListener("DOMContentLoaded", checkDueDates);

function saveTask(taskObj) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function editTask(oldText) {
    const newText = prompt("Edit your task:", oldText);
    if (newText === null || newText.trim() === "") return;

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(task =>
        task.text === oldText ? { ...task, text: newText } : task
    );
    localStorage.setItem("tasks", JSON.stringify(tasks));

    loadTasks();
}

function searchTasks() {
    const query = searchTaskInput.value.toLowerCase();
    const tasks = document.querySelectorAll("li");

    tasks.forEach(task => {
        const taskText = task.querySelector("span").textContent.toLowerCase();
        task.style.display = taskText.includes(query) ? "flex" : "none";
    });
}
searchTaskInput.addEventListener("input", searchTasks);
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskList.innerHTML = "";
    tasks.forEach(createTaskElement);
}


function updateTaskStatus(taskText, completed) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(task =>
        task.text === taskText ? { ...task, completed } : task
    );
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function filterTasks(filterType) {
    const tasks = document.querySelectorAll("li");
    tasks.forEach(task => {
        const isCompleted = task.dataset.completed === "true";

        if (filterType === "all") {
            task.style.display = "flex";
        } else if (filterType === "completed" && isCompleted) {
            task.style.display = "flex";
        } else if (filterType === "pending" && !isCompleted) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    });
}

showAllBtn.addEventListener("click", () => filterTasks("all"));
showCompletedBtn.addEventListener("click", () => filterTasks("completed"));
showPendingBtn.addEventListener("click", () => filterTasks("pending"));

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});
