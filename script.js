const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTask");
const searchTaskInput = document.getElementById("searchTask");
const sortTasksDropdown = document.getElementById("sortTasks");
const filterTasksDropdown = document.getElementById("filterTasks");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const toggleDarkModeBtn = document.getElementById("toggleDarkMode");

// Load stored theme and tasks
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  checkDarkMode();
});

// 🌙 Toggle Dark Mode
toggleDarkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// 📌 Save tasks to Local Storage
function saveTasksToLocalStorage() {
  const tasks = getAllTasks();
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateProgressBar();
}

// 📌 Get all tasks
// 📌 Get all tasks (Fully Fixed)
function getAllTasks() {
  return Array.from(document.querySelectorAll(".task-card")).map(task => ({
    text: task.querySelector(".task-text").textContent,
    completed: task.classList.contains("completed"), // Get correct completion status
    dueDate: task.querySelector(".due-date").textContent.replace("Due: ", "").trim(),
    category: task.querySelector(".category-tag").textContent,
    priority: task.querySelector(".priority-tag").textContent
  }));
}


// ➕ Add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const category = taskCategory.value;
  const priority = taskPriority.value;

  if (taskText === "") {
    alert("Task cannot be empty!");
    return;
  }

  const taskObj = { text: taskText, completed: false, dueDate, category, priority };
  createTaskElement(taskObj);
  saveTasksToLocalStorage();

  taskInput.value = "";
  dueDateInput.value = "";
}

// 🎨 Create task element
function createTaskElement(taskObj) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.dataset.completed = taskObj.completed;
  li.innerHTML = `
    
    <div class="task-card ${taskObj.completed ? "completed" : "card"}" data-id="${taskObj.id}">
    <div class="task-header">
        <span class="task-text">${taskObj.text}</span>
        <span class="priority-tag ${taskObj.priority.toLowerCase()}-priority">${taskObj.priority}</span>
    </div>
    
    <div class="task-details">
        <span class="category-tag">${taskObj.category}</span>
        <span class="due-date ${checkOverdue(taskObj.dueDate) ? "overdue" : ""}">
            ${taskObj.dueDate ? `📅 Due: ${taskObj.dueDate}` : "No Due Date"}
        </span>
    </div>

    <div class="task-actions">
        <button class="edit-btn">
            <i class="fas fa-edit"></i> ✏️ Edit
        </button>
        <button class="delete-btn">
            <i class="fas fa-trash-alt"></i> 🗑️ Delete
        </button>
    </div>
</div>

`;

  taskList.appendChild(li);

  li.querySelector(".task-text").addEventListener("click", () => {
    taskObj.completed = !taskObj.completed;
    li.dataset.completed = taskObj.completed;
    li.querySelector(".task-card").classList.toggle("completed", taskObj.completed);
    saveTasksToLocalStorage();
  });

  li.querySelector(".edit-btn").addEventListener("click", () => {
    const newText = prompt("Edit your task:", taskObj.text);
    if (newText) {
      taskObj.text = newText;
      li.querySelector(".task-text").textContent = newText;
      saveTasksToLocalStorage();
    }
  });

  li.querySelector(".delete-btn").addEventListener("click", () => {
    li.style.opacity = "0";
    li.style.transform = "scale(0.9)";
    setTimeout(() => {
      li.remove();
      saveTasksToLocalStorage();
    }, 300);
  });

  updateProgressBar();
}

// 🚨 Check for Overdue Tasks
function checkOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

// 📊 Update Progress Bar (Fully Fixed)
function updateProgressBar() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Load tasks from storage
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  progressBar.value = percentage; // Set the progress bar value
  progressBar.style.width = `${percentage}%`; // Set width dynamically
  progressText.textContent = `${Math.round(percentage)}% Completed`;
}



// 🛠️ Load tasks from Local Storage
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(createTaskElement);
  updateProgressBar();
}

// 🔍 Search Tasks
searchTaskInput.addEventListener("input", function () {
  const searchText = searchTaskInput.value.toLowerCase();
  document.querySelectorAll(".task-item").forEach(task => {
    const taskText = task.querySelector(".task-text").textContent.toLowerCase();
    task.style.display = taskText.includes(searchText) ? "" : "none";
  });
});

// 🔃 Sort Tasks
sortTasksDropdown.addEventListener("change", function () {
  const sortBy = sortTasksDropdown.value;
  let tasks = getAllTasks();

  if (sortBy === "dueDate") {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sortBy === "priority") {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  taskList.innerHTML = "";
  tasks.forEach(createTaskElement);
  saveTasksToLocalStorage();
});

// 🛠️ Event Listeners
addTaskBtn.addEventListener("click", addTask);
sortTasksDropdown.addEventListener("change", sortTasks);
searchTaskInput.addEventListener("input", searchTasks);
