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
  const teamConfirmBtn = document.getElementById("teamConfirmBtn");

  // Ir a la pantalla de selección de avatar al hacer clic en "Comenzar"
  introStartBtn.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  });

  // Ir a la pantalla de selección de personajes
  startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    teamScreen.classList.remove("hidden");
    renderTeamSelection(); // Renderizamos los personajes
  });

  let selectedTeamIds = new Set();
  const teamGrid = document.getElementById("teamGrid");
  const teamCountEl = document.getElementById("teamCount");
  const teamHint = document.getElementById("teamHint");

  // Renderizar los personajes en la selección
  function renderTeamSelection() {
    teamGrid.innerHTML = ""; // Limpiamos el grid antes de renderizar

    // Asegurándonos de que los personajes están disponibles en el array TEAM_MEMBERS
    TEAM_MEMBERS.forEach(p => {
      const isSelected = selectedTeamIds.has(p.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "team-card" + (isSelected ? " selected" : "");

      btn.innerHTML = `
        <img src="${p.img}" alt="${p.name}" />
        <div class="team-card-name">${p.name}</div>
      `;

      // Añadimos la acción para seleccionar/deseleccionar los personajes
      btn.addEventListener("click", () => {
        if (isSelected) {
          selectedTeamIds.delete(p.id);
        } else {
          if (selectedTeamIds.size >= 6) return; // No permitir más de 6 seleccionados
          selectedTeamIds.add(p.id);
        }
        renderTeamSelection(); // Vuelvo a renderizar la selección de personajes
        updateTeamUI();
      });

      teamGrid.appendChild(btn); // Añadimos el botón con el personaje al grid
    });

    updateTeamUI(); // Actualizamos la interfaz del equipo seleccionado
  }

  // Actualizar la cantidad de personajes seleccionados
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

  // Confirmar la selección de personajes y comenzar el juego
  teamConfirmBtn.addEventListener("click", () => {
    if (selectedTeamIds.size !== 6) return; // Asegurarse de que se seleccionaron exactamente 6 personajes

    console.log("Equipo seleccionado: ", selectedTeamIds);
    // Pasamos a la pantalla de juego
    teamScreen.classList.add("hidden");
    gameRoot.classList.remove("hidden");
    startGame(); // Iniciamos el juego
  });

  // Función para empezar el juego (solo para la demostración, más lógica se agregará aquí)
  function startGame() {
    console.log("Iniciando el juego...");
    // Aquí puedes incluir la lógica para comenzar con los puntos rojos, etc.
    spawnMissionPoints(); // Función para crear puntos de misión
  }

  // Función para crear los puntos rojos en el mapa (solo para la demostración)
  function spawnMissionPoints() {
    // Generamos algunos puntos de misión en el mapa
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