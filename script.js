// Variables de configuración
let grid = document.getElementById("grid");
let charactersContainer = document.getElementById("characters");
let missionStatus = document.getElementById("mission-status");
let missionProgress = document.getElementById("mission-progress");
let timerDisplay = document.getElementById("timer");
let rouletteContainer = document.getElementById("roulette");
let rouletteResult = document.getElementById("roulette-result");

const characters = ["Luis", "Ángel", "Mario", "Vera", "María"];
const points = [];

// Función para generar los puntos en la cuadrícula
function createGrid() {
    for (let i = 0; i < 20; i++) {
        let point = document.createElement("div");
        point.classList.add("grid-point");
        point.addEventListener("click", () => assignMission(i));
        grid.appendChild(point);
        points.push(point);
    }
}

// Función para crear los personajes disponibles
function createCharacters() {
    characters.forEach(character => {
        let charDiv = document.createElement("div");
        charDiv.classList.add("character");
        charDiv.innerHTML = character;
        charDiv.addEventListener("click", () => selectCharacter(character));
        charactersContainer.appendChild(charDiv);
    });
}

// Función para asignar una misión
let currentMission = null;
let assignedCharacter = null;
let missionTimeout;

function assignMission(index) {
    if (currentMission) return; // Si ya hay una misión en progreso, no hacer nada

    currentMission = index;
    missionStatus.innerText = `Misión asignada a punto ${index + 1}.`;

    // Contar el tiempo de la misión
    missionTimeout = setTimeout(() => {
        missionStatus.innerText = "La misión ha fracasado. ¡Sigue intentándolo!";
        missionProgress.innerHTML = "";
        currentMission = null;
    }, 120000); // Misión dura 2 minutos

    // Activar la ruleta si hay personaje asignado
    rouletteContainer.classList.remove("hidden");
}

// Función para seleccionar personaje
function selectCharacter(character) {
    if (!currentMission) return;

    assignedCharacter = character;
    missionStatus.innerText = `Asignando ${character} a la misión...`;
    clearTimeout(missionTimeout);

    // Empezar ruleta
    activateRoulette();
}

// Función para activar la ruleta
function activateRoulette() {
    rouletteResult.innerText = "0%";
    setTimeout(() => {
        const successChance = Math.random() * 100;
        rouletteResult.innerText = `${Math.round(successChance)}%`;

        missionProgress.innerHTML = successChance > 50 ? "¡Misión completada con éxito!" : "Misión fallida.";
        currentMission = null;
        rouletteContainer.classList.add("hidden");
    }, 30000); // Tarda 30 segundos en resolver la misión
}

// Función para actualizar el temporizador
function startTimer() {
    let timeLeft = 120; // 2 minutos
    setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timerDisplay.innerText = `Tiempo Restante: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        }
    }, 1000);
}

// Iniciar el juego
createGrid();
createCharacters();
startTimer();