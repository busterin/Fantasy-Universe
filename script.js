document.addEventListener("DOMContentLoaded", () => {
    const EXECUTION_TIME_MS = 30000; // 30 segundos
    const AVATARS = ["images/avatar1.png", "images/avatar2.png"];
    let currentAvatarIdx = 0;
    
    // --- DATOS ---
    const TEAM_MEMBERS = [
        { id: "p1", name: "Luis Verde", img: "images/personaje1.png" },
        { id: "p2", name: "Leo Ruta", img: "images/personaje2.png" },
        { id: "p3", name: "Ángel Watt", img: "images/personaje3.png" },
        { id: "p4", name: "Gael Eco", img: "images/personaje4.png" },
        { id: "p5", name: "Mía Circular", img: "images/personaje5.png" },
        { id: "p6", name: "Izan Movil", img: "images/personaje6.png" },
        { id: "p7", name: "Mario Solar", img: "images/personaje7.png" },
        { id: "p8", name: "Vera Clima", img: "images/personaje8.png" },
        { id: "p9", name: "Sara Reusa", img: "images/personaje9.png" },
        { id: "p10", name: "María Ahorro", img: "images/personaje10.png" }
    ];

    let selectedTeamIds = new Set();
    let lockedCharIds = new Set();
    let score = 0;

    // --- NAVEGACIÓN AVATAR ---
    const avatarImg = document.getElementById("avatarPreviewImg");
    document.getElementById("prevAvatarBtn").onclick = () => {
        currentAvatarIdx = (currentAvatarIdx - 1 + AVATARS.length) % AVATARS.length;
        avatarImg.src = AVATARS[currentAvatarIdx];
    };
    document.getElementById("nextAvatarBtn").onclick = () => {
        currentAvatarIdx = (currentAvatarIdx + 1) % AVATARS.length;
        avatarImg.src = AVATARS[currentAvatarIdx];
    };

    // --- FLUJO PANTALLAS ---
    document.getElementById("introStartBtn").onclick = () => {
        document.getElementById("introScreen").classList.add("hidden");
        document.getElementById("startScreen").classList.remove("hidden");
    };

    document.getElementById("startBtn").onclick = () => {
        document.getElementById("playerImg").src = AVATARS[currentAvatarIdx];
        document.getElementById("startScreen").classList.add("hidden");
        document.getElementById("teamScreen").classList.remove("hidden");
        renderTeamSelection();
    };

    // --- SELECCIÓN EQUIPO ---
    function renderTeamSelection() {
        const grid = document.getElementById("teamGrid");
        grid.innerHTML = "";
        TEAM_MEMBERS.forEach(p => {
            const div = document.createElement("div");
            div.className = `char-card ${selectedTeamIds.has(p.id) ? 'selected' : ''}`;
            div.innerHTML = `<img src="${p.img}"><span>${p.name}</span>`;
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

    document.getElementById("teamConfirmBtn").onclick = () => {
        document.getElementById("teamScreen").classList.add("hidden");
        document.getElementById("gameRoot").classList.remove("hidden");
        renderTeamDock();
        spawnMission();
    };

    function renderTeamDock() {
        const dock = document.getElementById("teamDock");
        dock.innerHTML = "";
        [...selectedTeamIds].forEach(id => {
            const p = TEAM_MEMBERS.find(x => x.id === id);
            const div = document.createElement("div");
            div.className = "dock-item";
            div.id = `dock-${p.id}`;
            div.innerHTML = `<img src="${p.img}">`;
            dock.appendChild(div);
        });
    }

    // --- LÓGICA DE MISIONES ---
    function spawnMission() {
        const id = "m_" + Date.now();
        const point = document.createElement("div");
        point.className = "point";
        point.style.left = (20 + Math.random() * 60) + "%";
        point.style.top = (20 + Math.random() * 60) + "%";
        point.onclick = () => openMission(id);
        document.getElementById("map").appendChild(point);

        const state = { id, el: point, phase: "spawned", assigned: [] };
        window[id] = state; // Guardar estado simple

        setTimeout(spawnMission, 5000);
    }

    function openMission(id) {
        const st = window[id];
        if (st.phase === "ready") {
            st.assigned.forEach(cid => {
                lockedCharIds.delete(cid);
                document.getElementById(`dock-${cid}`).classList.remove("busy");
            });
            st.el.remove();
            score++;
            document.getElementById("progress").textContent = score;
            return;
        }

        const grid = document.getElementById("charactersGrid");
        grid.innerHTML = "";
        [...selectedTeamIds].forEach(cid => {
            const p = TEAM_MEMBERS.find(x => x.id === cid);
            const isBusy = lockedCharIds.has(cid);
            const div = document.createElement("div");
            div.className = `char-card ${isBusy ? 'busy' : ''}`;
            div.style.opacity = isBusy ? "0.3" : "1";
            div.innerHTML = `<img src="${p.img}"><span>${p.name}</span>`;
            if (!isBusy) {
                div.onclick = () => {
                    div.classList.toggle("selected");
                    if (div.classList.contains("selected")) st.assigned.push(cid);
                    else st.assigned = st.assigned.filter(x => x !== cid);
                };
            }
            grid.appendChild(div);
        });

        document.getElementById("confirmBtn").onclick = () => {
            if (st.assigned.length === 0) return;
            st.phase = "executing";
            st.el.classList.add("assigned");
            st.assigned.forEach(cid => {
                lockedCharIds.add(cid);
                document.getElementById(`dock-${cid}`).classList.add("busy");
            });
            document.getElementById("missionModal").classList.remove("show");
            setTimeout(() => {
                st.phase = "ready";
                st.el.classList.replace("assigned", "ready");
            }, EXECUTION_TIME_MS);
        };
        document.getElementById("missionModal").classList.add("show");
    }
});
