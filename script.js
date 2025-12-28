document.addEventListener("DOMContentLoaded", () => {
  function setAppHeightVar() {
    const h = window.innerHeight;
    document.documentElement.style.setProperty("--appH", `${h}px`);
  }
  setAppHeightVar();
  window.addEventListener("resize", setAppHeightVar);
  window.addEventListener("orientationchange", setAppHeightVar);

  const GAME_DURATION_MS = 5 * 60 * 1000;
  let gameEndAt = null;
  let gameClockTimer = null;

  const MAX_ACTIVE_POINTS = 10;

  const TEAM_MEMBERS = [
    { id: "p1", name: "Luis Verde", img: "images/personaje1.png", tags: ["Sostenibilidad", "Reciclaje"] },
    { id: "p2", name: "Leo Ruta", img: "images/personaje2.png", tags: ["Transporte sostenible", "Cambio climático"] },
    { id: "p3", name: "Ángel Watt", img: "images/personaje3.png", tags: ["Eficiencia energética", "Energías renovables"] },
    { id: "p4", name: "Gael Eco", img: "images/personaje4.png", tags: ["Sostenibilidad", "Eficiencia energética"] },
    { id: "p5", name: "Mía Circular", img: "images/personaje5.png", tags: ["Reciclaje", "Cambio climático"] },
    { id: "p6", name: "Izan Movil", img: "images/personaje6.png", tags: ["Transporte sostenible", "Eficiencia energética"] },
    { id: "p7", name: "Mario Solar", img: "images/personaje7.png", tags: ["Energías renovables", "Sostenibilidad"] },
    { id: "p8", name: "Vera Clima", img: "images/personaje8.png", tags: ["Cambio climático", "Energías renovables"] },
    { id: "p9", name: "Sara Reusa", img: "images/personaje9.png", tags: ["Reciclaje", "Transporte sostenible"] },
    { id: "p10", name: "María Ahorro", img: "images/personaje10.png", tags: ["Eficiencia energética", "Sostenibilidad"] }
  ];

  let selectedTeamIds = new Set();  // IDs de personajes seleccionados

  const introScreen = document.getElementById("introScreen");
  const introStartBtn = document.getElementById("introStartBtn");
  const startScreen = document.getElementById("startScreen");
  const teamScreen = document.getElementById("teamScreen");
  const teamGrid = document.getElementById("teamGrid");
  const teamCountEl = document.getElementById("teamCount");
  const teamHint = document.getElementById("teamHint");
  const teamConfirmBtn = document.getElementById("teamConfirmBtn");
  const gameRoot = document.getElementById("gameRoot");

  // Función para renderizar la selección de personajes
  function renderTeamSelection() {
    teamGrid.innerHTML = ""; // Limpiar la cuadrícula

    TEAM_MEMBERS.forEach(p => {
      const isSelected = selectedTeamIds.has(p.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "team-card" + (isSelected ? " selected" : "");

      const tag1 = p.tags?.[0] ?? "";
      const tag2 = p.tags?.[1] ?? "";

      btn.innerHTML = `
        <img src="${p.img}" alt="${p.name}" />
        <div class="team-tags" aria-label="Etiquetas">
          <span class="tag-pill">${tag1}</span>
          <span class="tag-pill">${tag2}</span>
        </div>
        <div class="team-card-name">
          <div class="team-card-row">
            <span>${p.name}</span>
            <span class="pill">${isSelected ? "Elegido" : "Elegir"}</span>
          </div>
        </div>
      `;

      // Evento para seleccionar/desmarcar un personaje
      btn.addEventListener("click", () => {
        if (isSelected) {
          selectedTeamIds.delete(p.id);  // Deseleccionar
        } else {
          if (selectedTeamIds.size >= 6) return;  // Solo permitir seleccionar hasta 6 personajes
          selectedTeamIds.add(p.id);  // Seleccionar
        }
        renderTeamSelection();  // Volver a renderizar la selección
        updateTeamUI();  // Actualizar la interfaz con la cantidad de personajes seleccionados
      });

      teamGrid.appendChild(btn);  // Añadir el botón del personaje a la cuadrícula
    });

    updateTeamUI();  // Actualizar la interfaz
  }

  // Función para actualizar la UI de la selección de equipo
  function updateTeamUI() {
    const n = selectedTeamIds.size;
    teamCountEl.textContent = String(n);
    teamConfirmBtn.disabled = n !== 6;  // El botón de confirmar solo estará habilitado si se han seleccionado 6 personajes

    if (n < 6) {
      teamHint.textContent = "Elige 6 personajes para continuar.";
    } else {
      teamHint.textContent = "Perfecto. Pulsa Confirmar para empezar.";
    }
  }

  // Función para confirmar la selección del equipo
  function commitTeam() {
    const selected = [...selectedTeamIds]
      .map(id => TEAM_MEMBERS.find(p => p.id === id))
      .filter(Boolean);

    availableCharacters = selected.map(p => ({ id: p.id, name: p.name, tags: p.tags }));
    availableCards = selected.map(p => ({
      id: "card_" + p.id,
      name: p.name,
      img: p.img,
      text: `Etiquetas: ${p.tags.join(" · ")}`
    }));

    if (availableCharacters.length !== 6 || availableCards.length !== 6) return false;
    return true;
  }

  // Función para avanzar al juego
  function startGame() {
    teamScreen.classList.add("hidden");
    gameRoot.classList.remove("hidden");
    // Aquí agregamos la lógica para iniciar el juego...
  }

  // Evento de inicio
  introStartBtn.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
  });

  // Evento para avanzar a la selección de equipo
  startBtn.addEventListener("click", () => {
    selectedTeamIds = new Set();
    teamConfirmBtn.disabled = true;
    teamCountEl.textContent = "0";
    teamHint.textContent = "Elige 6 personajes para continuar.";
    startScreen.classList.add("hidden");
    teamScreen.classList.remove("hidden");
    renderTeamSelection();  // Renderizamos los personajes
  });

  // Evento para confirmar la selección de personajes y avanzar al juego
  teamConfirmBtn.addEventListener("click", () => {
    if (selectedTeamIds.size !== 6) return;  // Asegurarse de que se seleccionen 6 personajes
    if (!commitTeam()) return;  // Validar si la selección del equipo es correcta
    startGame();  // Iniciar el juego
  });

  // Inicialización
  introStartBtn.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  });

  window.addEventListener("resize", () => {
    setAppHeightVar();
  });

  // Inicialización de la app
  setAppHeightVar();
});