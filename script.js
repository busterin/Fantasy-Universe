document.addEventListener("DOMContentLoaded", () => {
  function setAppHeightVar() {
    const h = window.innerHeight;
    document.documentElement.style.setProperty("--appH", `${h}px`);
  }
  setAppHeightVar();
  window.addEventListener("resize", setAppHeightVar);
  window.addEventListener("orientationchange", setAppHeightVar);

  // Definición de pantallas
  const introScreen = document.getElementById("introScreen");
  const startScreen = document.getElementById("startScreen");
  const teamScreen = document.getElementById("teamScreen");
  const gameRoot = document.getElementById("gameRoot");

  const introStartBtn = document.getElementById("introStartBtn");
  introStartBtn.addEventListener("click", goToStartScreen);

  const startBtn = document.getElementById("startBtn");
  startBtn.addEventListener("click", goToTeamScreen);

  // Flujo de pantallas
  function goToStartScreen(){
    introScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
  }

  function goToTeamScreen(){
    startScreen.classList.add("hidden");
    teamScreen.classList.remove("hidden");
    gameRoot.classList.add("hidden");
  }

  function startGame(){
    teamScreen.classList.add("hidden");
    gameRoot.classList.remove("hidden");
  }
});