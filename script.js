document.addEventListener("DOMContentLoaded", () => {
    const EXECUTION_TIME_MS = 30000; 
    const AVATARS = ["images/avatar1.png", "images/avatar2.png"];
    let currentAvatarIdx = 0;
    
    const MISSIONS_DATA = [
        { title: "Panel Solar", tag: "Prueba" },
        { title: "Limpieza Bosque", tag: "Prueba" },
        { title: "Reciclaje Urbano", tag: "Prueba" },
        { title: "Gestión Agua", tag: "Prueba" }
    ];

    const TEAM_MEMBERS = [
        { id: "p1", name: "Luis Verde", img: "images/personaje1.png", tags: ["Prueba"] },
        { id: "p2", name: "Leo Ruta", img: "images/personaje2.png", tags: ["Prueba"] },
        { id: "p3", name: "Ángel Watt", img: "images/personaje3.png", tags: ["Prueba"] },
        { id: "p4", name: "Gael Eco", img: "images/personaje4.png", tags: ["Prueba"] },
        { id: "p5", name: "Mía Circular", img: "images/personaje5.png", tags: ["Prueba"] },
        { id: "p6", name: "Izan Movil", img: "images/personaje6.png", tags: ["Prueba"] },
        { id: "p7", name: "Mario Solar", img: "images/personaje7.png", tags: ["Prueba"] },
        { id: "p8", name: "Vera Clima", img: "images/personaje8.png", tags: ["Prueba"] },
        { id: "p9", name: "Sara Reusa", img: "images/personaje9.png", tags: ["Prueba"] },
        { id: "p10", name: "María Ahorro", img: "images/personaje10.png", tags: ["Prueba"] }
    ];

    let selectedTeamIds = new Set();
    let lockedCharIds = new Set();
    let score = 0;

    // --- AVATAR SELECTOR ---
    const avatarImg = document.getElementById("avatarPreviewImg");
    document.getElementById("prevAvatarBtn").onclick = () => {
        currentAvatarIdx = (currentAvatarIdx - 1 + AVATARS.length) % AVATARS.length;
        avatarImg.src = AVATARS[currentAvatarIdx];
    };
    document.getElementById("nextAvatarBtn").onclick = () => {
        currentAvatarIdx = (currentAvatarIdx + 1) % AVATARS.length;
        avatarImg.src = AVATARS[currentAvatarIdx];
    };

    // --- NAVIGATION ---
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

    // --- GAME LOGIC ---
    function spawnMission() {
        const id = "m_" + Date.now();
        const data = MISSIONS_DATA[Math.floor(Math.random() * MISSIONS_DATA.length)];
        const point = document.createElement("div");
        point.className = "point spawned";
        point.style.left = (15 + Math.random() * 70) + "%";
        point.style.top = (15 + Math.random() * 70) + "%";
        point.onclick = () => openMission(id);
        document.getElementById("map").appendChild(point);

        window[id] = { id, el: point, data, phase: "spawned", assigned: [] };
        setTimeout(spawnMission, 6000);
    }

    function openMission(id) {
        const st = window[id];
        if (st.phase === "ready") return startRoulette(id);
        if (st.phase !== "spawned") return;

        document.getElementById("missionTitle").textContent = st.data.title;
        document.getElementById("missionText").textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.";

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
            st.el.className = "point assigned";
            st.assigned.forEach(cid => {
                lockedCharIds.add(cid);
                document.getElementById(`dock-${cid}`).classList.add("busy");
            });
            document.getElementById("missionModal").classList.remove("show");
            setTimeout(() => {
                st.phase = "ready";
                st.el.className = "point ready";
            }, EXECUTION_TIME_MS);
        };
        document.getElementById("missionModal").classList.add("show");
    }

    function startRoulette(id) {
        const st = window[id];
        const modal = document.getElementById("rouletteModal");
        const wheel = document.getElementById("rouletteWheel");
        const result = document.getElementById("rouletteResult");
        const closeBtn = document.getElementById("closeRouletteBtn");

        modal.classList.add("show");
        result.innerHTML = "";
        closeBtn.classList.add("hidden");

        // Calcular éxito: Etiquetas
        let totalChance = 0;
        st.assigned.forEach(cid => {
            const p = TEAM_MEMBERS.find(x => x.id === cid);
            totalChance += (p.tags.includes(st.data.tag)) ? 80 : 10;
        });
        const finalChance = Math.min(totalChance, 95);

        let ticks = 0;
        const interval = setInterval(() => {
            wheel.textContent = Math.floor(Math.random() * 100) + "%";
            ticks++;
            if (ticks > 20) {
                clearInterval(interval);
                const roll = Math.floor(Math.random() * 100);
                const isSuccess = roll <= finalChance;
                wheel.textContent = roll + "%";
                
                if (isSuccess) {
                    result.innerHTML = `<span class="success-msg">¡ÉXITO!</span><br><small>Objetivo: <${finalChance}%</small>`;
                    score++;
                    document.getElementById("progress").textContent = score;
                } else {
                    result.innerHTML = `<span class="fail-msg">FALLO</span><br><small>Objetivo: <${finalChance}%</small>`;
                }
                closeBtn.classList.remove("hidden");
            }
        }, 80);

        closeBtn.onclick = () => {
            st.assigned.forEach(cid => {
                lockedCharIds.delete(cid);
                document.getElementById(`dock-${cid}`).classList.remove("busy");
            });
            st.el.remove();
            modal.classList.remove("show");
        };
    }
});
