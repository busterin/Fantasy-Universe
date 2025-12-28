document.addEventListener("DOMContentLoaded", () => {
  // Aquí va el código JavaScript original que ya tienes, pero con la modificación
  // de la función renderTeamSelection que ahora agrega los personajes en la fila.

  function renderTeamSelection() {
    teamGrid.innerHTML = "";
    document.getElementById("characterRow").innerHTML = "";  // Limpiar la fila antes de agregar nuevos personajes

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
      document.getElementById("characterRow").appendChild(btn);
    });

    updateTeamUI();
  }

  // Función adicional o cambios que necesites seguir usando
});