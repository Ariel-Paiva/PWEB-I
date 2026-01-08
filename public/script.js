const input = document.querySelector("input");
const botao = document.querySelector(".input-area button");

const lista = document.createElement("ul");
lista.id = "taskList";
document.querySelector(".card").appendChild(lista);

let currentFilter = "all";

/* FILTRO */
document.querySelectorAll(".filters button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".filters button")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    loadTasks();
  };
});

/* CARREGAR TAREFAS */
async function loadTasks() {
  const response = await fetch('/tarefas');
  let tasks = await response.json();

  if (currentFilter === "pending") {
    tasks = tasks.filter(t => !t.completed);
  }

  if (currentFilter === "completed") {
    tasks = tasks.filter(t => t.completed);
  }

  lista.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = task.texto;

    if (task.completed) {
      span.classList.add('completed');
    }

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'task-buttons';

    // BOTÃO CONCLUIR
    const btnDone = document.createElement('button');
    btnDone.textContent = '☑';
    btnDone.onclick = async () => {
      await fetch(`/tarefas/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      loadTasks();
    };

    // BOTÃO EXCLUIR
    const btnDelete = document.createElement('button');
    btnDelete.textContent = '🗑';
    btnDelete.onclick = async () => {
      await fetch(`/tarefas/${task._id}`, { method: 'DELETE' });
      loadTasks();
    };

    buttonsDiv.appendChild(btnDone);
    buttonsDiv.appendChild(btnDelete);

    li.appendChild(span);
    li.appendChild(buttonsDiv);
    lista.appendChild(li);
  });
}

/* ADICIONAR TAREFA */
botao.onclick = async () => {
  if (input.value.trim() === '') return;

  await fetch('/tarefas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto: input.value })
  });

  input.value = '';
  loadTasks();
};

loadTasks();