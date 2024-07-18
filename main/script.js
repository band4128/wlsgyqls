const URL = "./my_model/";
let model, webcam, labelContainer, maxPredictions;
let webcamStarted = false;

document.addEventListener('DOMContentLoaded', loadTodosFromLocalStorage);

async function toggleWebcam() {
    webcamStarted ? stopWebcam() : await startWebcam();
}

async function startWebcam() {
    const modelURL = `${URL}model.json`;
    const metadataURL = `${URL}metadata.json`;

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(200, 200, true);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    document.getElementById('webcam-button').textContent = 'Stop Webcam';
    webcamStarted = true;
}

function stopWebcam() {
    webcam.stop();
    document.getElementById("webcam-container").innerHTML = '';
    document.getElementById("label-container").innerHTML = '';
    document.getElementById('link-container').innerHTML = '';
    document.getElementById('webcam-button').textContent = 'Start Webcam';
    webcamStarted = false;
}

async function loop() {
    webcam.update();
    await predict(webcam.canvas);
    if (webcamStarted) {
        window.requestAnimationFrame(loop);
    }
}

async function predict(image) {
    const prediction = await model.predict(image);
    let highestProbability = 0;
    let bestClass = -1;

    prediction.forEach((pred, i) => {
        const classPrediction = `${pred.className}: ${pred.probability.toFixed(2)}`;
        labelContainer.childNodes[i].innerHTML = classPrediction;

        if (pred.probability > highestProbability) {
            highestProbability = pred.probability;
            bestClass = i;
        }
    });

    updateLinks(bestClass);
}

function updateLinks(classIndex) {
    const linkContainer = document.getElementById('link-container');
    linkContainer.innerHTML = '';

    const links = classIndex === 0 ? [
        { text: '페트병 리폼 간단하게 간접 조명 만들기', url: 'https://m.blog.naver.com/rkal2010/221058047531' },
        { text: '페트병으로 화분만들기', url: 'https://m.blog.naver.com/gomusin76/220337235993' },
        { text: '페트병으로 양말 서랍장 만들기', url: 'https://pgs1071.tistory.com/2730' }
    ] : [
        { text: 'Gmail', url: 'https://www.gmail.com' },
        { text: 'Naver Blog', url: 'https://blog.naver.com' },
        { text: 'Naver Map', url: 'https://map.naver.com' }
    ];

    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.text;
        a.target = '_blank';
        linkContainer.appendChild(a);
    });
}

// Todo list functionality
document.getElementById('todo-input').addEventListener('keypress', event => {
    if (event.key === 'Enter') addTodo();
});

function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    if (todoInput.value.trim() !== '') {
        const li = createTodoElement(todoInput.value);
        todoList.appendChild(li);
        saveTodosToLocalStorage();
        todoInput.value = '';
    }
}

function createTodoElement(text) {
    const li = document.createElement('li');
    li.textContent = text;
    li.addEventListener('click', toggleTodoCompleted);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.addEventListener('click', deleteTodo);

    li.appendChild(deleteButton);
    return li;
}

function deleteTodo(event) {
    event.stopPropagation();
    event.target.parentElement.remove();
    saveTodosToLocalStorage();
}

function toggleTodoCompleted(event) {
    if (event.target.tagName !== 'BUTTON') {
        event.target.classList.toggle('completed');
        saveTodosToLocalStorage();
    }
}

function saveTodosToLocalStorage() {
    const todos = Array.from(document.querySelectorAll('#todo-list li')).map(li => ({
        text: li.firstChild.textContent,
        completed: li.classList.contains('completed')
    }));
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodosFromLocalStorage() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const li = createTodoElement(todo.text);
        if (todo.completed) li.classList.add('completed');
        document.getElementById('todo-list').appendChild(li);
    });
}
