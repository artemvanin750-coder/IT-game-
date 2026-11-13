const errorLine = document.getElementById('error-line');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const missesEl = document.getElementById('misses');
const keyboard = document.querySelector('.keyboard');

let score = 0;
let level = 1;
let misses = 0;
let currentCorrectKey = '';
let gameInterval;

// Список возможных ошибок и правильных клавиш
const errors = [
    { text: "SyntaxError: unexpected token '<'", key: '<' },
    { text: "SyntaxError: unexpected token '>'", key: '>' },
    { text: "SyntaxError: missing ) after argument list", key: ')' },
    { text: "SyntaxError: missing ( before condition", key: '(' },
    { text: "SyntaxError: Unexpected end of JSON input", key: '}' },
    { text: "ReferenceError: isNitDefined is not defined", key: ';' }, // опечатка для ;
    { text: "TypeError: Cannot read properties of undefined", key: '.' }, // добавим точку
    { text: "SyntaxError: missing } after function body", key: '}' },
    { text: "SyntaxError: missing ] after element list", key: ']' },
    { text: "Uncaught TypeError: Cannot set property '&' of null", key: '&' },
    { text: "SyntaxError: Unexpected token ':'", key: ':' },
    { text: "SyntaxError: Unexpected token '='", key: '=' }
];

function getRandomError() {
    return errors[Math.floor(Math.random() * errors.length)];
}

function spawnError() {
    // Сбрасываем стили с кнопок
    keyboard.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
    });

    const errorData = getRandomError();
    currentCorrectKey = errorData.key;
    errorLine.textContent = errorData.text;

    // Подсвечиваем правильную кнопку
    const correctBtn = keyboard.querySelector(`[data-key="${currentCorrectKey}"]`);
    if (correctBtn) {
        correctBtn.classList.add('correct');
    }
}

function checkKey(pressedKey) {
    if (pressedKey === currentCorrectKey) {
        score += 10 * level;
        level = Math.floor(score / 100) + 1; // Новый уровень каждые 100 очков
        updateUI();
        spawnError();
    } else {
        misses++;
        // Подсвечиваем нажатую неправильную кнопку
        const wrongBtn = keyboard.querySelector(`[data-key="${pressedKey}"]`);
        if (wrongBtn) {
            wrongBtn.classList.add('wrong');
            setTimeout(() => wrongBtn.classList.remove('wrong'), 200);
        }
        updateUI();
    }
}

function updateUI() {
    scoreEl.textContent = score;
    levelEl.textContent = level;
    missesEl.textContent = misses;
}

function endGame() {
    clearInterval(gameInterval);
    errorLine.textContent = 'GAME OVER. Сессия сохранена.';
    keyboard.querySelectorAll('button').forEach(btn => btn.disabled = true);
}

// --- Инициализация ---
document.addEventListener('keydown', (e) => {
    // Игнорируем служебные клавиши
    if (e.key.length > 1 && e.key !== 'Backspace') return;
    checkKey(e.key);
});

keyboard.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        checkKey(e.target.dataset.key);
    }
});

// Меняем скорость появления (сложность) со временем
function startGame() {
    spawnError();
    let speed = 8000; // начальная задержка 8 секунд
    gameInterval = setInterval(() => {
        spawnError();
        // Ускоряем игру
        speed = Math.max(1500, speed - 50); 
        clearInterval(gameInterval);
        gameInterval = setInterval(() => spawnError(), speed);
    }, speed);

    // Автогеймовер через 3 минуты, чтобы не палиться
    setTimeout(endGame, 180000); 
}

updateUI();
startGame();
