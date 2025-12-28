document.addEventListener("DOMContentLoaded", () => {
  // --- CONFIGURACIÓN ---
  const GAME_DURATION_MS = 5 * 60 * 1000;
  const EXECUTION_TIME_MS = 30 * 1000; // ¡Cambiado a 30s!
  const MAX_ACTIVE_POINTS = 8;
  const SPAWN_MIN_DELAY_MS = 1500;
  const SPAWN_MAX_DELAY_MS = 4000;

  // --- DATOS ---
  const MISSIONS = [
    { id: "m1", title: "Consumo Responsable", internalTag: "Sostenibilidad", text: "Optimiza los recursos del equipo." },
    { id: "m2", title: "Ruta Eficiente", internalTag: "Transporte sostenible", text: "Reduce emisiones en el transporte." },
    { id: "m3", title: "Ahorro Energético", internalTag: "Eficiencia energética", text: "Apaga equipos innecesarios." },
    { id: "m4", title: "Reciclaje Activo", internalTag: "Reciclaje", text: "Mejora la gestión de residuos." },
    { id: "m5", title: "Energía Limpia", internalTag: "Energías renovables", text: "Instala paneles solares." }
  ];

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

  // --- ESTADO ---
  let score = 0;
  let activePoints = new Map();
  let completedMissionIds = new Set();
  let lockedCharIds = new Set();
  let selectedTeamIds = new Set();
  let availableCharacters = [];
  let availableCards = [];
  let avatarIndex = 0;
  let specialUsed = false;
  let specialArmed = false;
  let gameClockTimer = null;
  let spawnTimer = null;
  let lifeTicker = null;

  const AVATARS = [
    { key: "a1", src: "images/avatar1.png" },
    { key: "a2", src: "images/avatar2.png" }
  ];

  // --- ELEMENTOS DOM ---
  const mapEl = document.getElementById("map");
  const playerImg = document.getElementById("playerImg");
  const teamDock = document.getElementById("teamDock");
  const missionModal = document.getElementById("missionModal");
  const charactersGrid = document.getElementById("charactersGrid");

  // --- LÓGICA DOCK (NUEVO) ---
  function renderTeamDock() {
    teamDock.innerHTML = "";
    availableCards.forEach(card => {
      const div = document.createElement("div");
      div.className = "dock-card";
      div.id = `dock-${card.id.replace('card_', '')}`;
      div.innerHTML = `
        <img src="${card.img}" alt="${card.name}">
        <div class="dock-card-name">${card.name.split(' ')[0]}</div>
      `;
      teamDock.appendChild(div);
    });
  }

  function updateDockStatus() {
    availableCharacters.forEach(ch => {
      const el = document.getElementById(`dock-${ch.id}`);
      if (el) el.classList.toggle("busy", lockedCharIds.has(ch.id));
    });
  }

  // --- FUNCIONES JUEGO ---
  function startGame() {
    document.getElementById("teamScreen").classList.add("hidden");
    document.getElementById("gameRoot").classList.remove("hidden");
    
    // Preparar equipo
    const selected = [...selectedTeamIds].map(id => TEAM_MEMBERS.find(p => p.id === id));
    availableCharacters = selected;
    availableCards = selected.map(p => ({ id: "card_"+p.id, name: p.name, img: p.img, text: p.tags.join(" · ") }));
    
    renderTeamDock();
    startLifeTicker();
    spawnMission();
    startGameClock();
  }

  function startLifeTicker() {
    lifeTicker = setInterval(() => {
      const now = performance.now();
      updateDockStatus(); // Actualiza visualmente el Dock

      for (const [mid, st] of activePoints.entries()) {
        if (st.isPaused) { st.lastTickAt = now; continue; }
        const dt = now - st.lastTickAt;
        st.lastTickAt = now;

        if (st.phase === "executing") {
          st.execRemainingMs -= dt;
          if (st.execRemainingMs <= 0) {
            st.phase = "ready";
            st.pointEl.classList.replace("assigned", "ready");
          }
        }
      }
    }, 200);
  }

  function spawnMission() {
    if (activePoints.size >= MAX_ACTIVE_POINTS) {
      setTimeout(spawnMission, 1000);
      return;
    }
    const m = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
    const id = m.id + "_" + Date.now();
    
    const point = document.createElement("div");
    point.className = "point";
    point.style.left = (10 + Math.random() * 80) + "%";
    point.style.top = (10 + Math.random() * 80) + "%";
    
    const state = { 
      mission: m, 
      pointEl: point, 
      phase: "spawned", 
      remainingMs: 60000, 
      lastTickAt: performance.now() 
    };

    point.onclick = () => handlePointClick(id);
    mapEl.appendChild(point);
    activePoints.set(id, state);

    spawnTimer = setTimeout(spawnMission, SPAWN_MIN_DELAY_MS + Math.random() * 2000);
  }

  function handlePointClick(id) {
    const st = activePoints.get(id);
    if (st.phase === "spawned") openMissionSelector(id);
    else if (st.phase === "ready") resolveMission(id);
  }

  function openMissionSelector(id) {
    const st = activePoints.get(id);
    document.getElementById("missionTitle").textContent = st.mission.title;
    document.getElementById("missionText").textContent = st.mission.text;
    
    charactersGrid.innerHTML = "";
    availableCharacters.forEach(ch => {
      const isLocked = lockedCharIds.has(ch.id);
      const div = document.createElement("div");
      div.className = `char ${isLocked ? 'locked' : ''}`;
      div.innerHTML = `<b>${ch.name}</b><br><small>${ch.tags.join(", ")}</small>`;
      
      if (!isLocked) {
        div.onclick = () => {
          div.classList.toggle("selected");
          st.tempSelected = st.tempSelected || new Set();
          if (div.classList.contains("selected")) st.tempSelected.add(ch.id);
          else st.tempSelected.delete(ch.id);
        };
      }
      charactersGrid.appendChild(div);
    });

    document.getElementById("confirmBtn").onclick = () => {
      if (!st.tempSelected || st.tempSelected.size === 0) return;
      st.assignedCharIds = new Set(st.tempSelected);
      st.assignedCharIds.forEach(cid => lockedCharIds.add(cid));
      st.phase = "executing";
      st.execRemainingMs = EXECUTION_TIME_MS;
      st.pointEl.classList.add("assigned");
      missionModal.classList.remove("show");
    };

    missionModal.classList.add("show");
  }

  function resolveMission(id) {
    const st = activePoints.get(id);
    score++;
    document.getElementById("progress").textContent = score;
    st.assignedCharIds.forEach(cid => lockedCharIds.delete(cid));
    st.pointEl.remove();
    activePoints.delete(id);
  }

  function startGameClock() {
    gameClockTimer = setTimeout(() => {
      document.getElementById("finalScore").textContent = score;
      document.getElementById("finalModal").classList.add("show");
    }, GAME_DURATION_MS);
  }

  // --- EVENTOS INICIALES ---
  document.getElementById("introStartBtn").onclick = () => {
    document.getElementById("introScreen").classList.add("hidden");
    document.getElementById("startScreen").classList.remove("hidden");
  };

  document.getElementById("startBtn").onclick = () => {
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("teamScreen").classList.remove("hidden");
    renderTeamSelection();
  };

  function renderTeamSelection() {
    const grid = document.getElementById("teamGrid");
    grid.innerHTML = "";
    TEAM_MEMBERS.forEach(p => {
      const div = document.createElement("div");
      div.className = `char ${selectedTeamIds.has(p.id) ? 'selected' : ''}`;
      div.innerHTML = `<img src="${p.img}" style="width:40px"><br>${p.name}`;
      div.onclick = () => {
        if (selectedTeamIds.has(p.id)) selectedTeamIds.delete(p.id);
        else if (selectedTeamIds.size < 6) selectedTeamIds.add(p.id);
        renderTeamSelection();
        document.getElementById("teamCount").textContent = selectedTeamIds.size;
        document.getElementById("teamConfirmBtn").disabled = selectedTeamIds.size !== 6;
      };
      grid.appendChild(div);
    });
  }

  document.getElementById("teamConfirmBtn").onclick = startGame;
  document.getElementById("playAgainBtn").onclick = () => location.reload();
  
  // Carousel logic simple
  document.getElementById("nextAvatarBtn").onclick = () => {
    avatarIndex = (avatarIndex + 1) % AVATARS.length;
    document.getElementById("avatarPreviewImg").src = AVATARS[avatarIndex].src;
    playerImg.src = AVATARS[avatarIndex].src;
  };
});
