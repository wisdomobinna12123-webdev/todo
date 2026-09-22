
const input = document.getElementById("todo-input");
const btn = document.querySelector(".btn");
const list = document.querySelector(".list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editingId = null;

todos.forEach(todo => renderTodo(todo));

btn.addEventListener("click", () => {
  if (editingId) {
    updateTodo();
  } else {
    createList();
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (editingId) {
      updateTodo();
    } else {
      createList();
    }
  }
});

function createList() {
  let val = input.value.trim();
  if (!val) return;
  const todo = { id: Date.now(), text: val, done: false };
  todos.push(todo);
  saveTodos();
  renderTodo(todo);
  input.value = "";
}

function renderTodo(todo) {
  const li = document.createElement("li");
  li.id = `todo-${todo.id}`;

  const span = document.createElement("span");
  span.innerText = todo.text;
  if (todo.done) li.classList.add("active");

  const editBtn = document.createElement("button");
  const deleteBtn = document.createElement("button");
  const completeBtn = document.createElement("button");

  editBtn.innerText = "Edit";
  editBtn.className = "edit-btn";
  completeBtn.innerText = "Complete";
  deleteBtn.innerText = "Delete";

  editBtn.addEventListener("click", () => {
    input.value = todo.text;
    input.focus();
    editingId = todo.id;
    btn.innerText = "Update";
    editBtn.disabled = true;
  });

  deleteBtn.addEventListener("click", () => {
    todos = todos.filter(t => t.id !== todo.id);
    saveTodos();
    li.remove();
    if (editingId === todo.id) {
      editingId = null;
      input.value = "";
      btn.innerText = "Add";
    }
  });

  completeBtn.addEventListener("click", () => {
    todo.done = !todo.done;
    li.classList.toggle("active");
    saveTodos();
  });

  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);
  list.appendChild(li);
}

function updateTodo() {
  let val = input.value.trim();
  if (!val) return;

  const todo = todos.find(t => t.id === editingId);
  if (todo) {
    todo.text = val;
    const li = document.getElementById(`todo-${editingId}`);
    li.querySelector("span").innerText = val;
    
    // FIX: find the edit button inside that li
    const editBtn = li.querySelector(".edit-btn");
    editBtn.disabled = false;
    
    saveTodos();
  }

  input.value = "";
  btn.innerText = "Add";
  editingId = null;
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
