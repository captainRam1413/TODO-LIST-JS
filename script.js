const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTask");

function addItem() {
  const text = taskInput.value.trim();

  if (text === "") {
    alert("Input cannot be empty");
  } else {
    const listItem = document.createElement("li");

    listItem.innerHTML = `<span>${text}</span><button class="delete-btn">x</button>`;

    taskList.appendChild(listItem);
    taskInput.value = "";

    listItem
      .querySelector(".delete-btn")
      .addEventListener("click", function () {
        listItem.remove();
      });
  }
}
addTaskBtn.addEventListener("click", addItem);

taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addItem();
  }
});
