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
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`http://82.223.130.155:6050/handicap_resul_mundial.aspx?sLic=${numeroFederado}`)}`;
        try {
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const html = data.contents;

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            console.log(html); // Imprimir el HTML recibido para depuración
            
            const nombreJugadorElement = doc.querySelector('span#lblLic');
            const handicapElement = doc.querySelector('table tbody tr:last-child td:last-child');

            if (!nombreJugadorElement || !handicapElement) {
                throw new Error('No se encontraron los datos necesarios en la respuesta');
            }

            const nombreJugador = nombreJugadorElement.textContent.trim();
            const nuevoHandicap = handicapElement.textContent.trim();

            return {
                nombre: nombreJugador,
                handicap: nuevoHandicap
            };
        } catch (error) {
            console.error("Error fetching player data:", error);
            alert("Error al obtener los datos del jugador. Por favor, intenta de nuevo.");
        }
    }

    function renderPlayers() {
        handicapList.innerHTML = '';
        jugadores.forEach((jugador, index) => {
            const row = document.createElement("tr");

            const nombreCell = document.createElement("td");
            nombreCell.textContent = jugador.nombre;
            row.appendChild(nombreCell);

            const handicapCell = document.createElement("td");
            handicapCell.textContent = jugador.handicap;
            row.appendChild(handicapCell);

            const deleteCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Borrar";
            deleteButton.style.backgroundColor = "#e74c3c";
            deleteButton.style.color = "#ffffff";
            deleteButton.style.border = "none";
            deleteButton.style.padding = "5px 10px";
            deleteButton.style.borderRadius = "4px";
            deleteButton.onclick = () => {
                jugadores.splice(index, 1);
                localStorage.setItem('jugadores', JSON.stringify(jugadores));
                renderPlayers();
            };
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

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
