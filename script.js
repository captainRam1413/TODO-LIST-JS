const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTask");

document.addEventListener("DOMContentLoaded", function () {
    console.log("load event fired");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<span>${task}</span><button class="delete-btn">x</button>`;
        taskList.appendChild(listItem);

        listItem
            .querySelector(".delete-btn")
            .addEventListener("click", function () {
                listItem.remove();
                removeTask(task);
            });
    });
});

function addItem() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Input cannot be empty");
    } else {
        const listItem = document.createElement("li");

        listItem.innerHTML = `<span>${text}</span><button class="delete-btn">x</button>`;

        taskList.appendChild(listItem);

        saveTask(text);

        taskInput.value = "";

        listItem
            .querySelector(".delete-btn")
            .addEventListener("click", function () {
                listItem.remove();
                removeTask(text);
            });
    }
}

function removeTask(taskText) {
    console.log("remove task fired");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter((task) => task !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveTask(task) {
    log("save task fired");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
addTaskBtn.addEventListener("click", addItem);

taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addItem();
    }
});
