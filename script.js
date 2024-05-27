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
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const nombreJugadorElement = doc.querySelector('#lblLic');
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
        jugadores.forEach((jugador, ind<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #121212;
            color: #ffffff;
            margin: 0;
            padding: 0;
        }
        .login-container {
            width: 300px;
            margin: 100px auto;
            padding: 20px;
            background: #1e1e1e;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            border-radius: 8px;
            text-align: center;
        }
        input, button {
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #333;
            border-radius: 4px;
            background-color: #333;
            color: #ffffff;
            width: 90%;
        }
        button {
            background-color: #007bff;
            color: #ffffff;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h2>Iniciar Sesión</h2>
        <input type="text" id="username" placeholder="Nombre de UsuarioB" required>
        <button onclick="login()">Entrar</button>
    </div>

    <script>
        function login() {
            const username = document.getElementById('username').value;
            if (username) {
                localStorage.setItem('username', username);
                window.location.href = 'index.html';
            } else {
                alert('Por favor, ingrese un nombre de usuario');
            }
        }
    </script>
</body>
</html>
ex) => {
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
