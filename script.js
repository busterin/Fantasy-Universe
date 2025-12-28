document.addEventListener("DOMContentLoaded", () => {
  function setAppHeightVar() {
    const h = window.innerHeight;
    document.documentElement.style.setProperty("--appH", `${h}px`);
  }
  setAppHeightVar();
  window.addEventListener("resize", setAppHeightVar);
  window.addEventListener("orientationchange", setAppHeightVar);

  const introScreen = document.getElementById("introScreen");
  const introStartBtn = document.getElementById("introStartBtn");
  const startScreen = document.getElementById("startScreen");
  const startBtn = document.getElementById("startBtn");
  const teamScreen = document.getElementById("teamScreen");
  const teamGrid = document.getElementById("teamGrid");
  const teamCountEl = document.getElementById("teamCount");
  const teamHint = document.getElementById("teamHint");
  const teamConfirmBtn = document.getElementById("teamConfirmBtn");
  const gameRoot = document.getElementById("gameRoot");

  let selectedTeamIds = new Set();

  // Pantalla de inicio
  introStartBtn.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  });

  // Pantalla de selección de avatar
  startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    teamScreen.classList.remove("hidden");
    renderTeamSelection();  // Renderiza los personajes
  });

  // Renderización de los personajes seleccionables
  function renderTeamSelection() {
    teamGrid.innerHTML = ""; // Limpiar el grid de personajes
    TEAM_MEMBERS.forEach(p => {
      const isSelected = selectedTeamIds.has(p.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "team-card" + (isSelected ? " selected" : "");

      btn.innerHTML = `
        <img src="${p.img}" alt="${p.name}" />
        <div class="team-card-name">${p.name}</div>
      `;

      // Agregar la acción para seleccionar o deseleccionar el personaje
      btn.addEventListener("click", () => {
        if (isSelected) {
          selectedTeamIds.delete(p.id);
        } else {
          if (selectedTeamIds.size >= 6) return; // No permitir más de 6 seleccionados
          selectedTeamIds.add(p.id);
        }
        renderTeamSelection();  // Volver a renderizar los personajes
        updateTeamUI();
      });

      teamGrid.appendChild(btn); // Añadir el botón con el personaje al grid
    });

    updateTeamUI(); // Actualizar la interfaz de usuario
  }

  // Actualiza el conteo de personajes seleccionados y habilita el botón de confirmación
  function updateTeamUI() {
    const n = selectedTeamIds.size;
    teamCountEl.textContent = String(n);
    teamConfirmBtn.disabled = n !== 6;

    if (n < 6) {
      teamHint.textContent = "Elige 6 personajes para continuar.";
    } else {
      teamHint.textContent = "Perfecto. Pulsa Confirmar para empezar.";
    }
  }

  // Confirmación de la selección de personajes y transición al juego
  teamConfirmBtn.addEventListener("click", () => {
    if (selectedTeamIds.size !== 6) return; // Asegurarse de que se seleccionaron 6 personajes

    console.log("Equipo seleccionado: ", selectedTeamIds);
    teamScreen.classList.add("hidden");
    gameRoot.classList.remove("hidden");
    startGame(); // Comienza el juego
  });

  // Función para empezar el juego
  function startGame() {
    console.log("Iniciando el juego...");
    spawnMissionPoints(); // Crear puntos de misión (para que aparezcan los puntos rojos)
  }

  // Función para crear los puntos rojos en el mapa
  function spawnMissionPoints() {
    const map = document.getElementById("map");
    for (let i = 0; i < 5; i++) {
      const point = document.createElement("div");
      point.classList.add("point");
      point.style.left = `${Math.random() * 80 + 10}%`; // Posiiones aleatorias
      point.style.top = `${Math.random() * 80 + 10}%`; // Posiiones aleatorias
      map.appendChild(point);
    }
  }
});