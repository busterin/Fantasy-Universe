document.addEventListener("DOMContentLoaded", () => {
  function setAppHeightVar() {
    const h = window.innerHeight;
    document.documentElement.style.setProperty("--appH", `${h}px`);
  }
  setAppHeightVar();
  window.addEventListener("resize", setAppHeightVar);
  window.addEventListener("orientationchange", setAppHeightVar);

  const introStartBtn = document.getElementById("introStartBtn");
  const startScreen = document.getElementById("startScreen");
  const teamScreen = document.getElementById("teamScreen");
  const teamGrid = document.getElementById("teamGrid");
  const teamCountEl = document.getElementById("teamCount");
  const teamHint = document.getElementById("teamHint");
  const teamConfirmBtn = document.getElementById("teamConfirmBtn");
  const characterRow = document.getElementById("characterRow");

  let selectedTeamIds = new Set();
  
  const TEAM_MEMBERS = [
    { id: "p1",  name: "Luis Verde",     img: "images/personaje1.png",  tags: ["Sostenibilidad", "Reciclaje"] },
    { id: "p2",  name: "Leo Ruta",       img: "images/personaje2.png",  tags: ["Transporte sostenible", "Cambio climático"] },
    { id: "p3",  name: "Ángel Watt",     img: "images/personaje3.png",  tags: ["Eficiencia energética", "Energías renovables"] },
    { id: "p4",  name: "Gael Eco",       img: "images/personaje4.png",  tags: ["Sostenibilidad", "Eficiencia energética"] },
    { id: "p5",  name: "Mía Circular",   img: "images/personaje5.png",  tags: ["Reciclaje", "Cambio climático"] },
    { id: "p6",  name: "Izan Movil",     img: "images/personaje6.png",  tags: ["Transporte sostenible", "Eficiencia energética"] },
    { id: "p7",  name: "Mario Solar",    img: "images/personaje7.png",  tags: ["Energías renovables", "Sostenibilidad"] },
    { id: "p8",  name: "Vera Clima",     img: "images/personaje8.png",  tags: ["Cambio climático", "Energías renovables"] },
    { id: "p9",  name: "Sara Reusa",     img: "images/personaje9.png",  tags: ["Reciclaje", "Transporte sostenible"] },
    { id: "p10", name: "María Ahorro",   img: "images/personaje10.png", tags: ["Eficiencia energética", "Sostenibilidad"] }
  ];

  // Función para renderizar la selección de personajes
  function renderTeamSelection() {
    teamGrid.innerHTML = "";
    characterRow.innerHTML = "";  // Limpiar la fila antes de agregar nuevos personajes

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

      btn.addEventListener("click", () => {
        if (isSelected) selectedTeamIds.delete(p.id);
        else {
          if (selectedTeamIds.size >= 6) return;
          selectedTeamIds.add(p.id);
        }
        renderTeamSelection();
        updateTeamUI();
      });

      // En lugar de agregar a teamGrid, lo agregamos a la fila de personajes
      characterRow.appendChild(btn);
    });

    updateTeamUI();
  }

  // Actualizar la UI del equipo seleccionado
  function updateTeamUI() {
    const n = selectedTeamIds.size;
    teamCountEl.textContent = String(n);
    teamConfirmBtn.disabled = n !== 6;

    if (n < 6) teamHint.textContent = "Elige 6 personajes para continuar.";
    else teamHint.textContent = "Perfecto. Pulsa Confirmar para empezar.";
  }

  // Función para ir a la pantalla de selección de equipo
  function goToTeamScreen() {
    startScreen.classList.add("hidden");
    teamScreen.classList.remove("hidden");
    renderTeamSelection();
  }

  // Iniciar juego
  function startGame() {
    teamScreen.classList.add("hidden");
    // Lógica para iniciar el juego
  }

  introStartBtn.addEventListener("click", () => {
    goToTeamScreen();
  });

  teamConfirmBtn.addEventListener("click", () => {
    if (selectedTeamIds.size !== 6) return;
    startGame();
  });

  renderTeamSelection();
});