document.addEventListener('DOMContentLoaded', function() {
  // Variables globales
  let puntos = 0;
  let personajesSeleccionados = [];
  let avatarSeleccionado = null;
  let puntosDeMision = [];
  let tiempoLimite = 5 * 60 * 1000; // 5 minutos en milisegundos
  let timer;

  // Funciones de transición entre pantallas
  document.getElementById('historiaBtn').addEventListener('click', () => {
    document.getElementById('inicio').classList.add('hidden');
    document.getElementById('historia').classList.remove('hidden');
  });

  document.getElementById('arcadeBtn').addEventListener('click', () => {
    document.getElementById('inicio').classList.add('hidden');
    document.getElementById('arcade').classList.remove('hidden');
  });

  document.getElementById('continuarAvatarBtn').addEventListener('click', () => {
    document.getElementById('arcade').classList.add('hidden');
    document.getElementById('personajes').classList.remove('hidden');
  });

  // Avatar selector
  document.querySelectorAll('.avatar').forEach(avatar => {
    avatar.addEventListener('click', () => {
      avatarSeleccionado = avatar.src;
      document.getElementById('continuarAvatarBtn').classList.remove('hidden');
    });
  });

  // Generación de personajes para seleccionar
  const personajes = ['Personaje 1', 'Personaje 2', 'Personaje 3', 'Personaje 4', 'Personaje 5', 'Personaje 6', 'Personaje 7', 'Personaje 8', 'Personaje 9', 'Personaje 10'];
  const personajeSelector = document.getElementById('personajeSelector');

  personajes.forEach((nombre, index) => {
    const div = document.createElement('div');
    div.textContent = nombre;
    div.classList.add('personaje');
    div.addEventListener('click', () => seleccionarPersonaje(index));
    personajeSelector.appendChild(div);
  });

  function seleccionarPersonaje(index) {
    if (personajesSeleccionados.length < 6 && !personajesSeleccionados.includes(index)) {
      personajesSeleccionados.push(index);
    }
    if (personajesSeleccionados.length === 6) {
      document.getElementById('continuarPersonajesBtn').classList.remove('hidden');
    }
  }

  // Continuar desde la selección de personajes
  document.getElementById('continuarPersonajesBtn').addEventListener('click', () => {
    document.getElementById('personajes').classList.add('hidden');
    document.getElementById('juego').classList.remove('hidden');
    iniciarJuego();
  });

  // Función para iniciar el juego
  function iniciarJuego() {
    // Crear puntos rojos en la cuadrícula
    for (let i = 0; i < 10; i++) {
      const punto = document.createElement('div');
      punto.addEventListener('click', () => activarMision(i));
      document.getElementById('cuadricula').appendChild(punto);
    }
    // Iniciar el cronómetro
    timer = setInterval(() => {
      tiempoLimite -= 1000;
      if (tiempoLimite <= 0) {
        clearInterval(timer);
        alert("¡El tiempo ha terminado!");
      }
    }, 1000);
  }

  function activarMision(index) {
    // Crear misión y asignar personajes
    const mision = {
      titulo: 'Misión ' + (index + 1),
      descripcion: 'Descripción de la misión',
      personajesAsignados: []
    };
    const misionPopup = prompt(`${mision.titulo}\n${mision.descripcion}\nElige 1 o 2 personajes`);
    if (misionPopup) {
      mision.personajesAsignados = misionPopup.split(',').map(Number);
      if (mision.personajesAsignados.length > 2) {
        alert('Puedes seleccionar un máximo de dos personajes.');
      } else {
        puntosDeMision.push(mision);
        // El punto pasa a ser amarillo
        document.getElementById('cuadricula').children[index].style.backgroundColor = 'yellow';
      }
    }
  }
});