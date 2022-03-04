const tasks = []; //almacenar cada una de las tareas
let time = 0 //cuenta regresiva
let timer = null; //va a tener asignado una función que nos permitirá ejecutar un pedazo de código cada determinado tiempo
let timerBreak = null;
let current = null; //nos dice cuál es la tarea actual que se está ejecutando
const taskName = document.querySelector('#time #taskName');

const bAdd = document.querySelector('#bAdd');
const itTask = document.querySelector('#itTask');
const form = document.querySelector('#form');

renderTime();
renderTask();

form.addEventListener('submit',  e => {
    e.preventDefault(); 
    if (itTask.value != '') {
        createTask(itTask.value);
        itTask.value = '';
        renderTask();
    }
});

function createTask(value) {
    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3),
        title: value,
        completed: false
    };

    tasks.unshift(newTask);
}

function renderTask() {
    const html = tasks.map(task => {
        return `
            <div class="task">
                <div class="title">${task.title}</div>
                <div class="completed">${task.completed ? `<span class="done" ><i class="fa-solid fa-check"></i></span>` : `<button class="start-btn" data-id="${task.id}"><i class="fa-solid fa-circle-play"></i></button>`}</div>
            </div>
        `;
    });

    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.innerHTML =  html.join('');

    const startBTN = document.querySelectorAll('.task .start-btn');
    startBTN.forEach(button => {
        button.addEventListener('click', e => {
            if(!timer) {
                const id = button.getAttribute('data-id')
                startButtonHandler(id);
                button.textContent = 'En progreso ...';
            }
        })
    })
}

function startButtonHandler(id) {
    time = 25 * 60;
    current = id;
    const taskIndex = tasks.findIndex(task => task.id === id);

    taskName.textContent = tasks[taskIndex].title;
    renderTime();

    timer = setInterval(() => {
        timeHandler(id);
    }, 1000);
}

function timeHandler(id) {
    time--;
    renderTime();

    if (time === 0) {
        clearInterval(timer);
        markCompleted(id);
        timer = null;
        renderTask();
        startBreak();

    }
}

function renderTime() {
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    timeDiv.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function markCompleted(id) {
    const taskIndex= tasks.findIndex((task) => task.id === id);
    tasks[taskIndex].completed = true;
}

function startBreak() {
    time = 5 * 60;
    taskName.textContent = 'Descanso';
    renderTime();
    timerBreak = setInterval(() => {
        timerBreakHandler();
    }, 1000);
}

function timerBreakHandler() {
    time--;
    renderTime();

    if (time === 0) {
        clearInterval(timerBreak);
        current = null;
        timerBreak = null;
        taskName.textContent = '';
        renderTask();
    }
}