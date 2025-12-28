document.addEventListener("DOMContentLoaded", () => {
  // Función que genera los puntos rojos en el mapa
  function createMissionPoint(mission) {
    const point = document.createElement("div");
    point.className = "point";
    point.setAttribute("role", "button");
    point.setAttribute("tabindex", "0");
    point.setAttribute("aria-label", `Misión: ${mission.title}`);

    const mapRect = mapEl.getBoundingClientRect();
    let xPct = 50, yPct = 50;
    for (let i = 0; i < 40; i++) {
      xPct = rand(8, 92);
      yPct = rand(10, 86);
      const xPx = (xPct / 100) * mapRect.width;
      const yPx = (yPct / 100) * mapRect.height;
      if (!pointWouldOverlapNoSpawn(xPx, yPx)) break;
    }

    point.style.left = `${xPct}%`;
    point.style.top = `${yPct}%`;

    const state = {
      mission,
      pointEl: point,
      remainingMs: 2 * 60 * 1000,
      lastTickAt: performance.now(),
      phase: "spawned",
      isPaused: false,
      assignedCharIds: new Set(),
      chance: null,
      execRemainingMs: null
    };

    point.addEventListener("click", () => onPointClick(mission.id));
    point.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPointClick(mission.id);
      }
    });

    mapEl.appendChild(point);
    activePoints.set(mission.id, state);
  }

  // Función que se llama cuando se hace clic en un punto de misión
  function onPointClick(missionId) {
    const st = activePoints.get(missionId);
    if (!st) return;
    if (completedMissionIds.has(missionId)) return;

    if (specialArmed && !specialUsed) {
      specialUsed = true;
      specialArmed = false;
      setSpecialArmedUI(false);
      openForcedWinRoulette(missionId);
      return;
    }

    if (st.phase === "spawned") return openMission(missionId);
    if (st.phase === "executing") return;
    if (st.phase === "ready") return openRouletteForMission(missionId);
  }

  // Mostrar la habilidad especial del avatar cuando se hace clic en él
  playerImg.addEventListener("click", openSpecialModal);

  // Función para abrir la habilidad especial
  function openSpecialModal() {
    if (specialUsed) return;
    setGlobalPause(true);
    showModal(specialModal);
  }

  // Resto de la lógica para el juego, incluyendo la ruleta y las misiones
  // Código de ruleta, baraja y otras interacciones aquí

});