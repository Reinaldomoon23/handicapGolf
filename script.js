document.addEventListener("DOMContentLoaded", function() {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('welcome-message').textContent = `Bienvenido, ${username}`;
    }

    const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
    const handicapList = document.getElementById("handicap-list");
    const addPlayerForm = document.getElementById("add-player-form");
    const numeroFederadoInput = document.getElementById("numeroFederado");

    async function fetchPlayerData(numeroFederado) {
        const proxyUrl = `https://cors-anywhere.herokuapp.com/http://82.223.130.155:6050/handicap_resul_mundial.aspx?sLic=${numeroFederado}`;
        try {
            const response = await fetch(proxyUrl);
            const data = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const nuevoHandicap = doc.querySelector('td:last-child').textContent.trim();
            return {
                nombre: "Nombre del Jugador",  // Reemplaza esto con la lógica para extraer el nombre
                handicap: nuevoHandicap
            };
        } catch (error) {
            console.error("Error fetching player data:", error);
        }
    }

    function renderPlayers() {
        handicapList.innerHTML = '';
        jugadores.forEach(jugador => {
            const row = document.createElement("tr");

            const nombreCell = document.createElement("td");
            nombreCell.textContent = jugador.nombre;
            row.appendChild(nombreCell);

            const handicapCell = document.createElement("td");
            handicapCell.textContent = jugador.handicap;
            row.appendChild(handicapCell);

            handicapList.appendChild(row);
        });
    }

    addPlayerForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        const numeroFederado = numeroFederadoInput.value;
        const nuevoJugador = await fetchPlayerData(numeroFederado);
        if (nuevoJugador) {
            jugadores.push(nuevoJugador);
            localStorage.setItem('jugadores', JSON.stringify(jugadores));
            renderPlayers();
        }
        numeroFederadoInput.value = '';
    });

    renderPlayers();
});
