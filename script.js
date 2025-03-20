
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const showAllBtn = document.getElementById("showAll");
const showCompletedBtn = document.getElementById("showCompleted");
const showPendingBtn = document.getElementById("showPending");
const clearAllBtn = document.getElementById("clearAll");

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
    if (taskText === "") {
        alert("Task cannot be empty!");
        return;
    }

    const taskObj = { text: taskText, completed: false };

    createTaskElement(taskObj);
    saveTask(taskObj);

    taskInput.value = "";
}

function createTaskElement(taskObj) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="${taskObj.completed ? "completed" : ""}">${taskObj.text}</span>
        <button class="delete-btn">X</button>
    `;

    taskList.appendChild(li);


    li.querySelector("span").addEventListener("click", function () {
        taskObj.completed = !taskObj.completed;
        this.classList.toggle("completed", taskObj.completed);
        updateTaskStatus(taskObj.text, taskObj.completed);
    });


    li.querySelector(".delete-btn").addEventListener("click", function () {
        li.remove();
        removeTask(taskObj.text);
    });

    li.dataset.completed = taskObj.completed;
}

function saveTask(taskObj) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


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
