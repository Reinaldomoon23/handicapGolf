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
        const pdfUrl = `https://api.rfeg.es/files/summaryhandicap/${numeroFederado}.pdf`; // URL del PDF
        try {
            const response = await fetch(pdfUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const arrayBuffer = await response.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            let text = '';

            for (const page of pages) {
                const { textItems } = await page.getTextContent();
                for (const textItem of textItems) {
                    text += textItem.str + ' ';
                }
            }

            // Imprimir el texto extraído para depuración
            console.log("Texto Extraído:", text);

            // Procesar el texto para obtener nombre y handicap
            const nombreJugador = extractNameFromText(text);
            const nuevoHandicap = extractHandicapFromText(text);

            return {
                nombre: nombreJugador,
                handicap: nuevoHandicap
            };
        } catch (error) {
            console.error("Error fetching player data:", error);
            alert("Error al obtener los datos del jugador. Por favor, intenta de nuevo.");
        }
    }

    function extractNameFromText(text) {
        // Lógica para extraer el nombre del jugador del texto
        // Esto dependerá del formato específico del PDF
        const regex = /(?:Nombre|Jugador):\s*(.*)/i;
        const match = regex.exec(text);
        return match ? match[1].trim() : "Nombre del Jugador";
    }

    function extractHandicapFromText(text) {
        // Lógica para extraer el nuevo handicap del texto
        // Esto dependerá del formato específico del PDF
        const regex = /(?:Handicap|Nuevo Handicap):\s*(\d+(\.\d+)?)/i;
        const match = regex.exec(text);
        return match ? match[1].trim() : "Nuevo Handicap";
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
