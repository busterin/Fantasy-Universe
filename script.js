// Variables de configuración
let grid = document.getElementById("grid");
let charactersContainer = document.getElementById("characters");
let missionPopup = document.getElementById("mission-popup");
let missionTitle = document.getElementById("mission-title");
let missionDescription = document.getElementById("mission-description");
let assignCharacterBtn = document.getElementById("assign-character");
let closePopupBtn = document.getElementById("close-popup");
let rouletteContainer = document.getElementById("roulette");
let rouletteResult = document.getElementById("roulette-result");
let timerDisplay = document.getElementById("timer");

const characters = ["Luis", "Ángel", "Mario", "Vera", "María"];
const points = [];
const missions = [
    { title: "Misión 1", description: "Recoge recursos de la zona A." },
    { title: "Misión 2", description: "Ayuda a los pobladores en la zona B." },
    { title: "Misión 3", description: "Protege la infraestructura en la zona C." },
    { title: "Misión 4", description: "Recoge suministros en la zona D." },
    { title: "Misión 5", description: "Repara las máquinas en la zona E." }
];

// Función para crear los puntos en la cuadrícula
function createGrid() {
    for (let i = 0; i < 20; i++) {
        let point = document.createElement("div");
        point.classList.add("grid-point");
        point.addEventListener("click", () => openMissionPopup(i));
        grid.appendChild(point);
        points.push(point);
    }

    // Hacer aparecer los puntos progresivamente
    let index = 0;
    const interval = setInterval(() => {
        if (index < points.length) {
            points[index].style.opacity = 1;
            index++;
        } else {
            clearInterval(interval);
        }
    }, 500); // Tiempo para que aparezcan los puntos
}

// Función para mostrar la ventana emergente de la misión
let currentMissionIndex = null;
function openMissionPopup(index) {
    currentMissionIndex = index;
    let mission = missions[index];

    missionTitle.textContent = mission.title;
    missionDescription.textContent = mission.description;
    
    missionPopup.style.display = "flex";
}

// Función para asignar personaje a la misión
let assignedCharacter = null;
assignCharacterBtn.addEventListener("click", () => {
    if (assignedCharacter) {
        // Empezar la ruleta
        activateRoulette();
    } else {
        alert("Primero selecciona un personaje.");
    }
});

// Función para seleccionar un personaje
function selectCharacter(character) {
    assignedCharacter = character;
    alert(`Personaje ${character} asignado a la misión.`);
}

// Función para activar la ruleta
function activateRoulette() {
    missionPopup.style.display = "none"; // Cerrar popup

    rouletteContainer.classList.remove("hidden");
    rouletteResult.innerText = "0%";
    
    setTimeout(() => {
        const successChance = Math.random() * 100;
        rouletteResult.innerText = `${Math.round(successChance)}%`;

        setTimeout(() => {
            if (successChance > 50) {
                alert("¡Misión completada con éxito!");
            } else {
                alert("La misión ha fallado.");
            }
        }, 1000); // Resultado de la misión después de 1 segundo
    }, 30000); // Ruleta tarda 30 segundos
}

// Función para cerrar el popup
closePopupBtn.addEventListener("click", () => {
    missionPopup.style.display = "none";
});

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