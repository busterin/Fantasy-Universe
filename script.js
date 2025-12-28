document.addEventListener("DOMContentLoaded", () => {
  const introScreen = document.getElementById("introScreen");
  const startScreen = document.getElementById("startScreen");
  const teamScreen = document.getElementById("teamScreen");
  const gameRoot = document.getElementById("gameRoot");

  // Muestra la pantalla de selección de avatar
  function goToStartScreen(){
    introScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
  }

  // Muestra la pantalla de selección de personajes
  function goToTeamScreen(){
    startScreen.classList.add("hidden");
    teamScreen.classList.remove("hidden");
    gameRoot.classList.add("hidden");
  }

  // Muestra el juego
  function startGame(){
    teamScreen.classList.add("hidden");
    gameRoot.classList.remove("hidden");
  }

  // Inicializar pantalla
  const introStartBtn = document.getElementById("introStartBtn");
  introStartBtn.addEventListener("click", goToStartScreen);
});