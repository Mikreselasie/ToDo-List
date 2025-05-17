// Wait for the entire HTML document to load before running the function
document.addEventListener("DOMContentLoaded", loadTasks);

// Handle the task form submission
document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission

  const taskInput = document.getElementById("task-input");
  const taskText = taskInput.value.trim(); // Get input and remove whitespace

  if (taskText !== "") {
    addTask(taskText);   // Add task to list
    saveTasks();         // Save to localStorage
    taskInput.value = ""; // Clear input
  }
});

const themeIcon =document.querySelector('.themeIcon');
document.getElementById('themeToggle').addEventListener("click",()=>{
  document.body.classList.toggle('lightTheme');
  document.body.classList.toggle('darkTheme');

  if (themeIcon.classList.contains('fa-moon')) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
  } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
  }
})

// Function to add a task to the list
function addTask(taskText, completed = false) {
  const taskList = document.getElementById("task-list");

  const li = document.createElement("li");

  const checkbox = document.createElement('div');
  checkbox.classList.add("checkBox");
  checkbox.innerHTML = `<i class="fa-solid fa-circle-check check-icon" style="${completed ? 'display:inline;' : 'display:none;'}"></i>`;

  const span = document.createElement("span");
  span.textContent = taskText;
  span.classList.add("notes");
  if (completed) span.classList.add("completed");

  // Toggle completion on span click
  span.addEventListener('click', () => {
    const isCompleted = span.classList.toggle("completed");
    const icon = li.querySelector(".check-icon");
    if (icon) icon.style.display = isCompleted ? "inline" : "none";
    saveTasks();
  });

  // Or toggle on checkbox click
  checkbox.addEventListener('click', () => {
    const isCompleted = span.classList.toggle("completed");
    const icon = li.querySelector(".check-icon");
    if (icon) icon.style.display = isCompleted ? "inline" : "none";
    saveTasks();
  });

  // Edit button
  const editAndDelete = document.createElement('div');
  editAndDelete.classList.add('editAndDelete');

  const editBtn = document.createElement("button");
  editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
  editBtn.classList.add('changers');

  editBtn.addEventListener("click", function () {
    if (editBtn.dataset.mode !== "edit") {
      const input = document.createElement("input");
      input.type = "text";
      input.classList.add('editable')
      input.value = span.textContent;
      li.replaceChild(input, span);
      editBtn.innerHTML = `<i class="fas fa-save"></i>`;
      editBtn.dataset.mode = "edit";
    } else {
      const input = li.querySelector("input[type='text']");
      const newText = input.value.trim();
      if (newText !== "") {
        span.textContent = newText;
        li.replaceChild(span, input);
        editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
        editBtn.dataset.mode = "";
        saveTasks();
      }
    }
  });

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
  deleteBtn.classList.add('changers');
  deleteBtn.addEventListener("click", function () {
    li.remove();
    saveTasks();
  });

  editAndDelete.appendChild(editBtn);
  editAndDelete.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(editAndDelete);

  taskList.appendChild(li);
}

// Save all tasks to localStorage
function saveTasks() {
  const taskList = document.querySelectorAll("#task-list li");
  const tasks = [];

  taskList.forEach(li => {
    const text = li.querySelector("span")?.textContent || "";
    const completed = li.querySelector("span")?.classList.contains("completed") || false;
    tasks.push({ text, completed });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage when the page loads
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    const tasks = JSON.parse(saved);
    tasks.forEach(task => addTask(task.text, task.completed));
  }
}
