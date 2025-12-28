document.addEventListener("DOMContentLoaded", () => {
    // --- CONFIGURACIÓN ---
    const GAME_DURATION_MS = 5 * 60 * 1000;
    const EXECUTION_TIME_MS = 30 * 1000; // 30 segundos de espera
    const MISSIONS = [
        { id: "m1", title: "Energía Solar", text: "Instalar paneles en el tejado.", tag: "Renovables" },
        { id: "m2", title: "Reciclaje", text: "Organizar los contenedores.", tag: "Sostenibilidad" },
        { id: "m3", title: "Movilidad", text: "Fomentar el uso de bicicletas.", tag: "Transporte" },
        { id: "m4", title: "Residuos", text: "Reducir plásticos de un solo uso.", tag: "Sostenibilidad" }
    ];

    const TEAM_MEMBERS = [
        { id: "p1", name: "Luis Verde", img: "images/personaje1.png", tags: ["Sostenibilidad"] },
        { id: "p2", name: "Leo Ruta", img: "images/personaje2.png", tags: ["Transporte"] },
        { id: "p3", name: "Ángel Watt", img: "images/personaje3.png", tags: ["Renovables"] },
        { id: "p4", name: "Gael Eco", img: "images/personaje4.png", tags: ["Sostenibilidad"] },
        { id: "p5", name: "Mía Circular", img: "images/personaje5.png", tags: ["Reciclaje"] },
        { id: "p6", name: "Izan Movil", img: "images/personaje6.png", tags: ["Transporte"] },
        { id: "p7", name: "Mario Solar", img: "images/personaje7.png", tags: ["Renovables"] },
        { id: "p8", name: "Vera Clima", img: "images/personaje8.png", tags: ["Clima"] },
        { id: "p9", name: "Sara Reusa", img: "images/personaje9.png", tags: ["Reciclaje"] },
        { id: "p10", name: "María Ahorro", img: "images/personaje10.png", tags: ["Energía"] }
    ];

    let score = 0;
    let selectedTeamIds = new Set();
    let activePoints = new Map();
    let lockedCharIds = new Set();
    let availableCharacters = [];

    // --- SELECCIÓN DE PERSONAJES ---
    function renderTeamSelection() {
        const grid = document.getElementById("teamGrid");
        grid.innerHTML = "";
        TEAM_MEMBERS.forEach(p => {
            const isSelected = selectedTeamIds.has(p.id);
            const div = document.createElement("div");
            div.className = `char-card ${isSelected ? 'selected' : ''}`;
            div.innerHTML = `
                <img src="${p.img}">
                <span>${p.name}</span>
            `;
            div.onclick = () => {
                if (selectedTeamIds.has(p.id)) selectedTeamIds.delete(p.id);
                else if (selectedTeamIds.size < 6) selectedTeamIds.add(p.id);
                
                document.getElementById("teamCount").textContent = selectedTeamIds.size;
                document.getElementById("teamConfirmBtn").disabled = selectedTeamIds.size !== 6;
                renderTeamSelection();
            };
            grid.appendChild(div);
        });
    }

    // --- LÓGICA DE JUEGO ---
    function startGame() {
        document.getElementById("teamScreen").classList.add("hidden");
        document.getElementById("gameRoot").classList.remove("hidden");
        
        availableCharacters = [...selectedTeamIds].map(id => TEAM_MEMBERS.find(p => p.id === id));
        renderTeamDock();
        
        setInterval(updateLogic, 200);
        spawnMission();
        setTimeout(endGame, GAME_DURATION_MS);
    }

    function renderTeamDock() {
        const dock = document.getElementById("teamDock");
        dock.innerHTML = "";
        availableCharacters.forEach(p => {
            const div = document.createElement("div");
            div.className = "dock-item";
            div.id = `dock-${p.id}`;
            div.innerHTML = `<img src="${p.img}">`;
            dock.appendChild(div);
        });
    }

    function spawnMission() {
        const m = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
        const id = "m_" + Date.now();
        const point = document.createElement("div");
        point.className = "point";
        point.style.left = (15 + Math.random() * 70) + "%";
        point.style.top = (15 + Math.random() * 70) + "%";
        
        point.onclick = () => openMission(id);
        document.getElementById("map").appendChild(point);
        
        activePoints.set(id, { 
            mission: m, el: point, phase: "spawned", chars: new Set() 
        });
        
        setTimeout(spawnMission, 3000 + Math.random() * 2000);
    }

    function openMission(id) {
        const st = activePoints.get(id);
        if (st.phase === "ready") return completeMission(id);
        if (st.phase !== "spawned") return;

        document.getElementById("missionTitle").textContent = st.mission.title;
        document.getElementById("missionText").textContent = st.mission.text;
        
        const grid = document.getElementById("charactersGrid");
        grid.innerHTML = "";
        availableCharacters.forEach(p => {
            const isBusy = lockedCharIds.has(p.id);
            const div = document.createElement("div");
            div.className = `char-card ${isBusy ? 'locked' : ''}`;
            div.style.opacity = isBusy ? "0.3" : "1";
            div.innerHTML = `<img src="${p.img}"><span>${p.name}</span>`;
            
            if (!isBusy) {
                div.onclick = () => {
                    div.classList.toggle("selected");
                    if (div.classList.contains("selected")) st.chars.add(p.id);
                    else st.chars.delete(p.id);
                };
            }
            grid.appendChild(div);
        });

        document.getElementById("confirmBtn").onclick = () => {
            if (st.chars.size === 0) return;
            st.chars.forEach(cid => lockedCharIds.add(cid));
            st.phase = "executing";
            st.el.classList.add("assigned");
            setTimeout(() => {
                st.phase = "ready";
                st.el.classList.replace("assigned", "ready");
            }, EXECUTION_TIME_MS);
            document.getElementById("missionModal").classList.remove("show");
        };
        
        document.getElementById("missionModal").classList.add("show");
    }

    function completeMission(id) {
        const st = activePoints.get(id);
        st.chars.forEach(cid => lockedCharIds.delete(cid));
        st.el.remove();
        activePoints.delete(id);
        score++;
        document.getElementById("progress").textContent = score;
    }

    function updateLogic() {
        availableCharacters.forEach(p => {
            const dockEl = document.getElementById(`dock-${p.id}`);
            if (dockEl) dockEl.classList.toggle("busy", lockedCharIds.has(p.id));
        });
    }

    function endGame() {
        document.getElementById("finalScore").textContent = score;
        document.getElementById("finalModal").classList.add("show");
    }

    // --- EVENTOS ---
    document.getElementById("introStartBtn").onclick = () => {
        document.getElementById("introScreen").classList.add("hidden");
        document.getElementById("startScreen").classList.remove("hidden");
    };
    document.getElementById("startBtn").onclick = () => {
        document.getElementById("startScreen").classList.add("hidden");
        document.getElementById("teamScreen").classList.remove("hidden");
        renderTeamSelection();
    };
    document.getElementById("teamConfirmBtn").onclick = startGame;
    document.getElementById("closeModalBtn").onclick = () => document.getElementById("missionModal").classList.remove("show");
    document.getElementById("playAgainBtn").onclick = () => location.reload();
});
