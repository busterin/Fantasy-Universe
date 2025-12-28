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
    teamGrid.innerHTML = "";
    TEAM_MEMBERS.forEach(p => {
      const isSelected = selectedTeamIds.has(p.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "team-card" + (isSelected ? " selected" : "");
      btn.innerHTML = `
        <img src="${p.img}" alt="${p.name}" />
        <div class="team-card-name">${p.name}</div>
      `;

      btn.addEventListener("click", () => {
        if (isSelected) selectedTeamIds.delete(p.id);
        else {
          if (selectedTeamIds.size >= 6) return;
          selectedTeamIds.add(p.id);
        }
        renderTeamSelection();
        updateTeamUI();
      });

      teamGrid.appendChild(btn);
    });

    updateTeamUI();
  }

  // Actualizar la cantidad de personajes seleccionados
  function updateTeamUI() {
    const n = selectedTeamIds.size;
    teamCountEl.textContent = String(n);
    teamConfirmBtn.disabled = n !== 6;

    if (n < 6) teamHint.textContent = "Elige 6 personajes para continuar.";
    else teamHint.textContent = "Perfecto. Pulsa Confirmar para empezar.";
  }

  // Confirmar la selección de personajes y comenzar el juego
  teamConfirmBtn.addEventListener("click", () => {
    if (selectedTeamIds.size !== 6) return;
    // Aquí se puede agregar más lógica para comenzar el juego
    console.log("Equipo seleccionado: ", selectedTeamIds);
    // Ahora podemos iniciar el juego
    teamScreen.classList.add("hidden");
    gameRoot.classList.remove("hidden");
    startGame();
  });

  // Función para empezar el juego
  function startGame() {
    console.log("Iniciando el juego...");
    // Aquí puedes incluir la lógica para empezar con los puntos rojos, etc.
  }
});