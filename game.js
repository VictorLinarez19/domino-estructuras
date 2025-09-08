// Clase para representar una ficha de dominó
class DominoTile {
    constructor(top, bottom) {
        this.top = top;
        this.bottom = bottom;
        this.element = null;
        this.isPlaced = false;
        this.player = null;
        this.orientation = this.determineOrientation();
    }

    determineOrientation() {
        // Los dobles (mismo número arriba y abajo) van verticales
        // Los no dobles van horizontales
        return this.top === this.bottom ? 'vertical' : 'horizontal';
    }

    getValue() {
        return this.top + this.bottom;
    }

    canConnect(number) {
        return this.top === number || this.bottom === number;
    }

    rotate() {
        [this.top, this.bottom] = [this.bottom, this.top];
        return this;
    }

    createElement() {
        const tile = document.createElement('div');
        tile.className = 'domino-tile vertical'; // Todas las fichas se muestran verticales a los jugadores
        tile.dataset.top = this.top;
        tile.dataset.bottom = this.bottom;
        tile.id = `tile-${this.top}-${this.bottom}`;

        // Todas las fichas se muestran verticales a los jugadores
        tile.innerHTML = `
            <div class="domino-half top">${this.generateDots(this.top)}</div>
            <div class="domino-half bottom">${this.generateDots(this.bottom)}</div>
        `;

        // Configurar drag and drop
        tile.draggable = true;
        tile.addEventListener('dragstart', (e) => {
            // Solo permitir drag si la ficha no está colocada
            if (!this.isPlaced) {
                e.dataTransfer.setData('text/plain', `${this.top}-${this.bottom}`);
                tile.classList.add('dragging');
                console.log(`Iniciando drag de ficha ${this.top}-${this.bottom}`);
            } else {
                e.preventDefault();
                console.log(`No se puede arrastrar ficha colocada ${this.top}-${this.bottom}`);
            }
        });

        tile.addEventListener('dragend', () => {
            tile.classList.remove('dragging');
            console.log(`Terminando drag de ficha ${this.top}-${this.bottom}`);
        });

        // Mantener funcionalidad de selección por click (opcional)
        tile.addEventListener('click', () => this.select());
        this.element = tile;
        return tile;
    }

    generateDots(number) {
        if (number === 0) return ''; // Blanco - sin puntos

        const positions = {
            1: ['center'],
            2: ['top-left', 'bottom-right'],
            3: ['top-left', 'center', 'bottom-right'],
            4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
            6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
        };

        return positions[number].map(pos => `<div class="dot ${pos}"></div>`).join('');
    }

    select() {
        if (this.isPlaced) return;

        // Remover selección anterior
        document.querySelectorAll('.domino-tile.selected').forEach(tile => {
            tile.classList.remove('selected');
        });

        // Seleccionar esta ficha
        this.element.classList.add('selected');
        game.selectedTile = this;

        // Mostrar botón de jugar ficha
        const playButton = document.getElementById('play-tile');
        playButton.style.display = 'inline-block';

        game.logMessage(`Ficha ${this.top}-${this.bottom} seleccionada`);
    }
}

// Clase para el juego de dominó
class DominoGame {
    constructor() {
        this.tiles = [];
        this.players = [];
        this.currentPlayerIndex = 0;
        this.board = [];
        this.boardEnds = { left: null, right: null };
        this.selectedTile = null;
        this.gameStarted = false;
        this.scores = { teamA: 0, teamB: 0 };

        // Cargar preguntas desde el archivo
        this.questions = this.loadQuestions();

        console.log(`Preguntas cargadas: ${this.questions.length} preguntas disponibles`);

        this.initializeGame();
        this.setupEventListeners();
    }

    // Cargar preguntas desde el archivo Preguntas.txt
    loadQuestions() {
        try {
            // Para este ejemplo, devolveremos preguntas hardcodeadas
            // En una implementación real, se leería el archivo
            return [
                {
                    question: "¿Cuál es la principal diferencia entre una permutación y una combinación?",
                    options: [
                        "La permutación se calcula con factoriales y la combinación con logaritmos.",
                        "En una permutación, el orden de los elementos importa, mientras que en una combinación, el orden no importa.",
                        "La permutación se aplica a conjuntos de números y la combinación a conjuntos de letras.",
                        "La permutación se usa para eventos independientes y la combinación para eventos dependientes."
                    ],
                    correctIndex: 1
                },
                {
                    question: "¿Cuántos números de 4 dígitos se pueden formar con los dígitos 1, 2, 3, 4, 5, 6, si no se permite la repetición de los dígitos?",
                    options: [
                        "24",
                        "1296",
                        "15",
                        "360"
                    ],
                    correctIndex: 3
                },
                {
                    question: "En una caja hay 5 canicas rojas y 4 azules. ¿De cuántas maneras se pueden elegir 3 canicas de la caja?",
                    options: [
                        "3!=6",
                        "5³×4³=8000",
                        "C(9,3)=84",
                        "504"
                    ],
                    correctIndex: 2
                },
                {
                    question: "¿De cuántas maneras se pueden sentar 5 personas en una fila de 5 asientos?",
                    options: [
                        "C(5,5)=1",
                        "P(5,5)=120",
                        "5^5=3125",
                        "5×4=20"
                    ],
                    correctIndex: 1
                },
                {
                    question: "Una moneda se lanza 3 veces. ¿Cuántos resultados posibles hay si el orden de los resultados importa?",
                    options: [
                        "P(3,3)=6",
                        "C(3,2)=3",
                        "3!=6",
                        "2^3=8"
                    ],
                    correctIndex: 3
                }
            ];
        } catch (error) {
            console.error('Error cargando preguntas:', error);
            return [];
        }
    }

    // Crear exactamente las 28 fichas del dominó de manera correcta
    createTiles() {
        this.tiles = [];
        let tileCount = 0;

        console.log('=== CREACIÓN DE FICHAS ===');

        // Generar todas las combinaciones únicas de fichas del dominó (0-6)
        // Usando dos bucles para evitar duplicados: para cada par (i,j) donde i <= j
        for (let i = 0; i <= 6; i++) {
            for (let j = i; j <= 6; j++) {
                const tile = new DominoTile(i, j);
                this.tiles.push(tile);
                tileCount++;
                console.log(`Ficha ${tileCount}: ${i}-${j}`);
            }
        }

        console.log(`\nCreadas ${this.tiles.length} fichas de dominó`);

        // Verificar que tenemos exactamente 28 fichas
        if (this.tiles.length !== 28) {
            console.error(`ERROR CRÍTICO: Se esperaban 28 fichas pero se crearon ${this.tiles.length}`);
        } else {
            console.log('✓ Verificación: Se crearon exactamente 28 fichas únicas');
        }

        console.log('=== FIN CREACIÓN ===\n');
        this.shuffleTiles();
    }

    // Mezclar las fichas
    shuffleTiles() {
        for (let i = this.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
        }
    }

    // Crear jugadores
    createPlayers() {
        this.players = [
            { name: 'Jugador 1', team: 'A', tiles: [], element: document.getElementById('player1-tiles') },
            { name: 'Jugador 2', team: 'B', tiles: [], element: document.getElementById('player2-tiles') },
            { name: 'Jugador 3', team: 'A', tiles: [], element: document.getElementById('player3-tiles') },
            { name: 'Jugador 4', team: 'B', tiles: [], element: document.getElementById('player4-tiles') }
        ];
    }

    // Repartir fichas
    dealTiles() {
        console.log('=== REPARTIENDO FICHAS ===');
        console.log(`Total fichas disponibles: ${this.tiles.length}`);

        // Verificar que tenemos exactamente 28 fichas antes de repartir
        if (this.tiles.length !== 28) {
            console.error(`ERROR CRÍTICO: Se esperaban 28 fichas pero hay ${this.tiles.length}`);
            return;
        }

        // Mostrar todas las fichas disponibles antes del reparto
        console.log('Fichas disponibles antes del reparto:', this.tiles.map(t => `${t.top}-${t.bottom}`).sort());

        let tileIndex = 0;
        this.players.forEach((player, playerIndex) => {
            player.tiles = [];
            console.log(`\nRepartiendo a ${player.name}:`);

            for (let i = 0; i < 7; i++) {
                if (tileIndex >= this.tiles.length) {
                    console.error(`ERROR: No hay suficientes fichas! Solo quedan ${this.tiles.length - tileIndex} fichas`);
                    break;
                }

                const tile = this.tiles[tileIndex++];
                tile.player = player;
                player.tiles.push(tile);
                console.log(`  Ficha ${i+1}: ${tile.top}-${tile.bottom}`);
            }

            console.log(`  Total fichas para ${player.name}: ${player.tiles.length}`);
            // Mostrar todas las fichas del jugador para verificar duplicados
            console.log(`  Fichas de ${player.name}:`, player.tiles.map(t => `${t.top}-${t.bottom}`));
        });

        console.log(`\nFichas restantes en el montón: ${this.tiles.length - tileIndex}`);
        console.log('=== FIN REPARTO ===\n');

        this.updatePlayerDisplays();
    }

    // Actualizar la visualización de las fichas de los jugadores
    updatePlayerDisplays() {
        this.players.forEach((player, index) => {
            player.element.innerHTML = '';

            // Solo mostrar fichas del jugador en turno
            if (index === this.currentPlayerIndex) {
                player.tiles.forEach(tile => {
                    // Reutilizar elemento existente o crear uno nuevo
                    if (tile.element && tile.element.parentNode) {
                        // La ficha ya está en el DOM, no hacer nada
                        return;
                    }
                    const tileElement = tile.createElement();
                    // Asegurar que el drag and drop esté habilitado
                    tileElement.draggable = true;
                    tileElement.style.cursor = 'grab';
                    player.element.appendChild(tileElement);
                });
            } else {
                // Mostrar fichas ocultas para los otros jugadores
                for (let i = 0; i < player.tiles.length; i++) {
                    const hiddenTile = document.createElement('div');
                    hiddenTile.className = 'domino-tile hidden-tile';
                    hiddenTile.draggable = false; // No permitir drag en fichas ocultas
                    hiddenTile.style.cursor = 'default';
                    hiddenTile.innerHTML = `
                        <div class="domino-half top"></div>
                        <div class="domino-half bottom"></div>
                    `;
                    player.element.appendChild(hiddenTile);
                }
            }

            // Actualizar información del turno
            const infoElement = document.getElementById(`player${index + 1}-info`);
            if (index === this.currentPlayerIndex) {
                infoElement.textContent = 'Turno actual';
                infoElement.style.color = '#e74c3c';
            } else {
                infoElement.textContent = '';
            }
        });
    }

    // Verificar si un movimiento es válido
    canPlaceTile(tile, position) {
        if (!tile) return false;

        if (this.board.length === 0) {
            // Primera ficha siempre puede colocarse
            console.log(`✓ Primera ficha ${tile.top}-${tile.bottom} puede colocarse`);
            return true;
        }

        let targetNumber;
        if (position === 'left') {
            targetNumber = this.boardEnds.left;
        } else if (position === 'right') {
            targetNumber = this.boardEnds.right;
        } else {
            return false;
        }

        // Si no hay número objetivo (caso especial), permitir cualquier ficha
        if (targetNumber === null) {
            console.log(`✓ Ficha ${tile.top}-${tile.bottom} puede colocarse (sin restricción)`);
            return true;
        }

        // Verificar si alguno de los números de la ficha coincide con el número objetivo
        const canConnect = tile.top === targetNumber || tile.bottom === targetNumber;

        if (canConnect) {
            console.log(`✓ Ficha ${tile.top}-${tile.bottom} puede conectarse con ${targetNumber} en ${position}`);
        } else {
            console.log(`✗ Ficha ${tile.top}-${tile.bottom} NO puede conectarse con ${targetNumber} en ${position}`);
        }

        return canConnect;
    }

    // Colocar ficha en el tablero
    placeTile(tile, position) {
        if (!this.canPlaceTile(tile, position)) {
            this.logMessage(`No se puede colocar la ficha ${tile.top}-${tile.bottom} en ${position}`);
            return false;
        }

        // Determinar el número objetivo
        let targetNumber;
        if (position === 'left') {
            targetNumber = this.boardEnds.left;
        } else {
            targetNumber = this.boardEnds.right;
        }

        // Para la primera ficha, no hay rotación necesaria
        if (this.board.length > 0) {
            // Rotar la ficha para que el número correcto quede en el extremo correcto
            if (position === 'left') {
                // Para colocar a la izquierda, el número objetivo debe estar en la parte superior de la ficha
                if (tile.bottom === targetNumber) {
                    tile.rotate(); // Rotar para que el número objetivo quede arriba
                }
                // Actualizar el extremo izquierdo con el número que queda en la parte superior
                this.boardEnds.left = tile.top;
            } else {
                // Para colocar a la derecha, el número objetivo debe estar en la parte inferior de la ficha
                if (tile.top === targetNumber) {
                    tile.rotate(); // Rotar para que el número objetivo quede abajo
                }
                // Actualizar el extremo derecho con el número que queda en la parte inferior
                this.boardEnds.right = tile.bottom;
            }
        } else {
            // Primera ficha: establecer ambos extremos
            this.boardEnds.left = tile.top;
            this.boardEnds.right = tile.bottom;
        }

        // Agregar al tablero
        if (position === 'left') {
            this.board.unshift(tile);
        } else {
            this.board.push(tile);
        }

        tile.isPlaced = true;

        // Remover de las fichas del jugador
        const player = tile.player;
        player.tiles = player.tiles.filter(t => t !== tile);

        // Remover el elemento de la mano del jugador si existe
        if (tile.element && tile.element.parentNode) {
            tile.element.parentNode.removeChild(tile.element);
        }

        this.updateBoard();
        this.updatePlayerDisplays();

        // Reproducir sonido de colocar ficha
        this.playAudio();

        this.logMessage(`${player.name} colocó ${tile.top}-${tile.bottom} en ${position}. Extremos: ${this.boardEnds.left}-${this.boardEnds.right}`);

        // Verificar si el jugador se quedó sin fichas
        if (player.tiles.length === 0) {
            this.endHand(player.team);
            return true;
        }

        this.nextTurn();
        return true;
    }

    // Actualizar visualización del tablero
    updateBoard() {
        const boardElement = document.getElementById('game-board');
        boardElement.innerHTML = '';

        this.board.forEach(tile => {
            // Crear un nuevo elemento para el tablero
            const boardTile = document.createElement('div');

            // En el tablero, aplicar la orientación correcta según el tipo de ficha
            if (tile.top === tile.bottom) {
                // Dobles van verticales en el tablero
                boardTile.className = 'domino-tile vertical';
                boardTile.innerHTML = `
                    <div class="domino-half top">${tile.generateDots(tile.top)}</div>
                    <div class="domino-half bottom">${tile.generateDots(tile.bottom)}</div>
                `;
            } else {
                // No dobles van horizontales en el tablero
                boardTile.className = 'domino-tile horizontal';
                boardTile.innerHTML = `
                    <div class="domino-half left">${tile.generateDots(tile.top)}</div>
                    <div class="domino-half right">${tile.generateDots(tile.bottom)}</div>
                `;
            }

            // Las fichas en el tablero no son arrastrables
            boardTile.draggable = false;
            boardTile.style.cursor = 'default';

            boardElement.appendChild(boardTile);
        });
    }

    // Pasar al siguiente turno (sentido contrario a las agujas del reloj)
    nextTurn() {
        // Cambiar al siguiente jugador en sentido contrario a las agujas del reloj
        this.currentPlayerIndex = (this.currentPlayerIndex - 1 + 4) % 4;
        this.selectedTile = null;

        console.log(`Turno pasa a ${this.players[this.currentPlayerIndex].name} (Jugador ${this.currentPlayerIndex + 1})`);

        // Ocultar botón de jugar ficha (por si acaso)
        const playTileBtn = document.getElementById('play-tile');
        if (playTileBtn) {
            playTileBtn.style.display = 'none';
        }

        this.updatePlayerDisplays();

        // Mostrar modal de turno
        this.showTurnModal();
    }

    // Pasar turno cuando no se puede jugar
    passTurn() {
        this.logMessage(`${this.players[this.currentPlayerIndex].name} pasa el turno`);
        this.nextTurn();
    }

    // Terminar la mano
    endHand(winningTeam) {
        console.log(`🏁 Terminada la mano - Equipo ganador: ${winningTeam}`);
        const losingTeam = winningTeam === 'A' ? 'B' : 'A';
        console.log(`👎 Equipo perdedor: ${losingTeam}`);

        const points = this.calculatePoints();
        console.log(`💰 Puntos a disputar: ${points}`);

        this.logMessage(`¡Equipo ${winningTeam} gana la mano! Puntos: ${points}`);

        // Mostrar pregunta al equipo perdedor
        console.log(`❓ Mostrando pregunta al equipo perdedor ${losingTeam} por ${points} puntos`);
        this.showQuestion(losingTeam, points);
    }

    // Verificar si el juego ha terminado
    checkGameEnd() {
        if (this.scores.teamA >= 100 || this.scores.teamB >= 100) {
            const winner = this.scores.teamA >= 100 ? 'A' : 'B';
            this.showGameEndModal(winner);
            return true;
        }
        return false;
    }

    // Mostrar modal de fin de juego
    showGameEndModal(winner) {
        const modal = document.createElement('div');
        modal.className = 'modal game-end-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>¡Juego Terminado!</h2>
                <div class="game-end-info">
                    <p class="winner-message">¡El Equipo ${winner} ha ganado!</p>
                    <div class="final-scores">
                        <div class="final-score">
                            <h3>Equipo A</h3>
                            <span>${this.scores.teamA} puntos</span>
                        </div>
                        <div class="final-score">
                            <h3>Equipo B</h3>
                            <span>${this.scores.teamB} puntos</span>
                        </div>
                    </div>
                    <button id="play-again-btn" class="play-again-btn">Jugar de Nuevo</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        // Configurar botón de jugar de nuevo
        document.getElementById('play-again-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.resetGame();
        });
    }

    // Calcular puntos de la mano actual
    calculatePoints() {
        let points = 0;
        console.log('🔢 Calculando puntos de la mano actual...');

        this.players.forEach(player => {
            let playerPoints = 0;
            player.tiles.forEach(tile => {
                const tileValue = tile.getValue();
                playerPoints += tileValue;
                console.log(`  ${player.name}: ${tile.top}-${tile.bottom} = ${tileValue} puntos`);
            });
            points += playerPoints;
            console.log(`  ${player.name} total: ${playerPoints} puntos`);
        });

        console.log(`📊 Total de puntos calculados: ${points}`);
        return points;
    }

    // Mostrar pregunta
    showQuestion(team, points) {
        const modal = document.getElementById('question-modal');

        const question = this.questions[Math.floor(Math.random() * this.questions.length)];
        console.log(`Mostrando pregunta aleatoria: ${question.question.substring(0, 50)}...`);

        document.getElementById('question-text').textContent = question.question;

        const answersDiv = document.querySelector('.answers');
        answersDiv.innerHTML = '';

        // Crear botones con etiquetas A, B, C, D
        const labels = ['A', 'B', 'C', 'D'];
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = `${labels[index]}. ${option}`;
            button.dataset.index = index;
            button.dataset.correct = index === question.correctIndex;

            // Agregar evento click para verificar respuesta
            button.addEventListener('click', () => this.checkAnswer(team, points, question, index, labels[index]));
            answersDiv.appendChild(button);
        });

        modal.style.display = 'flex';
    }

    // Verificar respuesta
    checkAnswer(team, points, question, selectedIndex, selectedLabel) {
        console.log(`🔍 Verificando respuesta - Equipo: ${team}, Puntos: ${points}, Selección: ${selectedIndex}, Correcta: ${question.correctIndex}`);

        const modal = document.getElementById('question-modal');
        const isCorrect = selectedIndex === question.correctIndex;

        if (isCorrect) {
            // Respuesta correcta - Equipo PERDEDOR gana la MITAD de los puntos
            console.log(`✅ Respuesta correcta del equipo perdedor ${team}`);
            modal.style.display = 'none';
            const halfPoints = Math.floor(points / 2);
            console.log(`Calculando mitad: ${points} / 2 = ${halfPoints}`);
            this.addPoints(team, halfPoints); // team es el equipo perdedor
            this.logMessage(`✅ ¡Respuesta correcta! Equipo ${team} (perdedor) gana ${halfPoints} puntos (mitad)`);

            // Verificar si el juego termina
            if (!this.checkGameEnd()) {
                // Iniciar nueva mano después de un breve delay
                setTimeout(() => this.newHand(), 2000);
            }
        } else {
            // Respuesta incorrecta - Equipo GANADOR gana TODOS los puntos
            console.log(`❌ Respuesta incorrecta del equipo perdedor ${team}`);
            const correctLabel = ['A', 'B', 'C', 'D'][question.correctIndex];
            const correctAnswer = question.options[question.correctIndex];

            // Mostrar mensaje de respuesta incorrecta
            alert(`❌ Respuesta incorrecta.\n\nSeleccionaste: ${selectedLabel}. ${question.options[selectedIndex]}\n\n✅ La respuesta correcta es: ${correctLabel}. ${correctAnswer}`);

            // Cerrar modal y continuar con penalización completa
            modal.style.display = 'none';
            const winningTeam = team === 'A' ? 'B' : 'A'; // El equipo contrario es el ganador
            console.log(`Equipo ganador calculado: ${team} → ${winningTeam}`);
            this.addPoints(winningTeam, points);
            this.logMessage(`❌ Respuesta incorrecta. Equipo ${winningTeam} (ganador) gana ${points} puntos completos`);

            // Verificar si el juego termina
            if (!this.checkGameEnd()) {
                // Iniciar nueva mano
                setTimeout(() => this.newHand(), 2000);
            }
        }
    }

    // Añadir puntos a un equipo
    addPoints(team, points) {
        console.log(`Añadiendo ${points} puntos al equipo ${team}. Puntuación anterior: A=${this.scores.teamA}, B=${this.scores.teamB}`);

        if (team === 'A') {
            this.scores.teamA += points;
            const scoreElement = document.getElementById('score-team-a');
            if (scoreElement) {
                scoreElement.textContent = this.scores.teamA;
                console.log(`✅ Equipo A actualizado a ${this.scores.teamA} puntos`);
            } else {
                console.error('❌ No se encontró el elemento score-team-a');
            }
        } else if (team === 'B') {
            this.scores.teamB += points;
            const scoreElement = document.getElementById('score-team-b');
            if (scoreElement) {
                scoreElement.textContent = this.scores.teamB;
                console.log(`✅ Equipo B actualizado a ${this.scores.teamB} puntos`);
            } else {
                console.error('❌ No se encontró el elemento score-team-b');
            }
        } else {
            console.error(`❌ Equipo inválido: ${team}`);
        }

        console.log(`Puntuación actual: A=${this.scores.teamA}, B=${this.scores.teamB}`);
    }

    // Iniciar nueva mano
    newHand() {
        this.board = [];
        this.boardEnds = { left: null, right: null };
        this.currentPlayerIndex = 0;
        this.selectedTile = null;

        // Devolver todas las fichas de los jugadores al montón
        this.players.forEach(player => {
            player.tiles.forEach(tile => {
                tile.player = null;
                tile.isPlaced = false;
                tile.element = null; // Limpiar referencia al elemento
            });
            player.tiles = [];
        });

        // Asegurar que tenemos exactamente 28 fichas
        if (this.tiles.length !== 28) {
            console.error(`ERROR: Se esperaban 28 fichas pero hay ${this.tiles.length}. Recreando fichas...`);
            this.createTiles();
        } else {
            // Mezclar todas las fichas nuevamente
            this.shuffleTiles();
        }
        
        this.dealTiles();
        this.updateBoard();

        this.logMessage('Nueva mano iniciada');
    }

    // Inicializar el juego
    initializeGame() {
        this.createPlayers();
        // NO crear fichas aquí - se crean cuando se inicia la partida
        this.updateBoard();
    }

    // Configurar event listeners
    setupEventListeners() {
        document.getElementById('start-game').addEventListener('click', () => {
            if (!this.gameStarted) {
                this.gameStarted = true;
                this.createTiles(); // Crear fichas solo cuando se inicia la partida
                this.dealTiles();
                this.logMessage('Juego iniciado');

                // Mostrar modal del primer turno
                this.showTurnModal();
            }
        });

        document.getElementById('draw-tile').addEventListener('click', () => {
            this.drawTile();
        });

        document.getElementById('pass-turn').addEventListener('click', () => {
            this.passTurn();
        });

        document.getElementById('end-hand').addEventListener('click', () => {
            // Forzar fin de mano
            const currentPlayer = this.players[this.currentPlayerIndex];
            this.endHand(currentPlayer.team);
        });

        document.getElementById('reset-game').addEventListener('click', () => {
            this.resetGame();
        });

        // Configurar drag and drop en el tablero
        this.setupDragAndDrop();
    }

    // Verificar si las preguntas están listas
    areQuestionsReady() {
        return this.questions && this.questions.length > 0;
    }

    // Robar una ficha del montón
    drawTile() {
        const currentPlayer = this.players[this.currentPlayerIndex];

        // Verificar si quedan fichas para robar
        if (this.tiles.length === 0) {
            this.logMessage('No quedan fichas para robar');
            this.nextTurn();
            return;
        }

        // Robar la primera ficha disponible
        const drawnTile = this.tiles.pop();
        drawnTile.player = currentPlayer;
        currentPlayer.tiles.push(drawnTile);

        this.updatePlayerDisplays();
        this.logMessage(`${currentPlayer.name} robó una ficha: ${drawnTile.top}-${drawnTile.bottom}`);

        // Pasar al siguiente turno después de robar
        this.nextTurn();
    }

    // Reiniciar el juego completamente
    resetGame() {
        this.board = [];
        this.boardEnds = { left: null, right: null };
        this.currentPlayerIndex = 0;
        this.selectedTile = null;
        this.gameStarted = false;
        this.scores = { teamA: 0, teamB: 0 };

        // Limpiar las fichas existentes
        this.tiles = [];

        // Limpiar fichas de jugadores
        this.players.forEach(player => {
            player.tiles = [];
        });

        // Limpiar tablero y actualizar puntuaciones
        this.updateBoard();
        this.updatePlayerDisplays();
        document.getElementById('score-team-a').textContent = '0';
        document.getElementById('score-team-b').textContent = '0';

        // Ocultar botón de jugar ficha
        document.getElementById('play-tile').style.display = 'none';

        // Limpiar log
        document.getElementById('log-content').innerHTML = '';

        this.logMessage('Juego reiniciado');
    }

    // Mostrar opciones de colocación de ficha
    showPlacementOptions() {
        if (!this.selectedTile) return;

        // Verificar qué posiciones son válidas
        const canPlaceLeft = this.canPlaceTile(this.selectedTile, 'left');
        const canPlaceRight = this.canPlaceTile(this.selectedTile, 'right');

        // Si no se puede colocar en ningún lado, mostrar mensaje
        if (!canPlaceLeft && !canPlaceRight) {
            this.logMessage(`No se puede colocar la ficha ${this.selectedTile.top}-${this.selectedTile.bottom} en ningún extremo`);
            this.selectedTile.element.classList.remove('selected');
            this.selectedTile = null;
            document.getElementById('play-tile').style.display = 'none';
            return;
        }

        // Crear modal de opciones
        const modal = document.createElement('div');
        modal.className = 'placement-modal';
        
        let optionsHTML = '';
        if (canPlaceLeft) {
            optionsHTML += '<button class="placement-btn" data-position="left">Izquierda</button>';
        }
        if (canPlaceRight) {
            optionsHTML += '<button class="placement-btn" data-position="right">Derecha</button>';
        }
        optionsHTML += '<button class="placement-btn cancel" data-position="cancel">Cancelar</button>';

        modal.innerHTML = `
            <div class="placement-modal-content">
                <h3>¿Dónde colocar la ficha ${this.selectedTile.top}-${this.selectedTile.bottom}?</h3>
                <div class="placement-options">
                    ${optionsHTML}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners para las opciones
        modal.querySelectorAll('.placement-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const position = e.target.dataset.position;

                if (position === 'cancel') {
                    // Cancelar selección
                    this.selectedTile.element.classList.remove('selected');
                    this.selectedTile = null;
                    document.getElementById('play-tile').style.display = 'none';
                    this.logMessage('Selección cancelada');
                } else {
                    // Intentar colocar la ficha
                    if (this.placeTile(this.selectedTile, position)) {
                        // Éxito - limpiar selección
                        document.getElementById('play-tile').style.display = 'none';
                    }
                }

                // Remover modal
                document.body.removeChild(modal);
            });
        });
    }

    // Reproducir sonido de colocar ficha
    playAudio() {
        const audioElement = document.getElementById('put-piece-sound');
        if (audioElement) {
            // Reiniciar el audio al principio por si ya se está reproduciendo
            audioElement.currentTime = 0;
            audioElement.play().catch(error => {
                console.log('Error reproduciendo audio:', error);
            });
        }
    }

    // Mostrar modal de turno
    showTurnModal() {
        const currentPlayer = this.players[this.currentPlayerIndex];

        // Actualizar información del modal
        document.getElementById('turn-player-number').textContent = this.currentPlayerIndex + 1;
        document.getElementById('turn-player-name').textContent = currentPlayer.name;
        document.getElementById('turn-player-team').textContent = `Equipo ${currentPlayer.team}`;

        // Cambiar color del avatar según el equipo
        const avatar = document.querySelector('.player-avatar');
        if (currentPlayer.team === 'A') {
            avatar.style.background = 'linear-gradient(45deg, #3498db, #2ecc71)';
        } else {
            avatar.style.background = 'linear-gradient(45deg, #e74c3c, #f39c12)';
        }

        // Mostrar modal
        const modal = document.getElementById('turn-modal');
        modal.style.display = 'flex';

        // Configurar botón de continuar
        const continueBtn = document.getElementById('continue-turn-btn');
        continueBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }

    // Configurar funcionalidad de drag and drop
    setupDragAndDrop() {
        const gameBoard = document.getElementById('game-board');

        // Permitir drop en el tablero
        gameBoard.addEventListener('dragover', (e) => {
            e.preventDefault();
            // Solo mostrar drag-over si estamos arrastrando una ficha válida
            if (e.dataTransfer.types.includes('text/plain')) {
                gameBoard.classList.add('drag-over');
            }
        });

        gameBoard.addEventListener('dragleave', (e) => {
            e.preventDefault();
            gameBoard.classList.remove('drag-over');
        });

        gameBoard.addEventListener('drop', (e) => {
            e.preventDefault();
            gameBoard.classList.remove('drag-over');

            const tileId = e.dataTransfer.getData('text/plain');
            if (!tileId) return;

            const tile = this.findTileById(tileId);

            if (tile && this.isCurrentPlayerTile(tile)) {
                console.log(`Drop válido de ficha ${tile.top}-${tile.bottom}`);
                this.handleTileDrop(tile, e);
            } else {
                console.log(`Drop inválido: ficha ${tileId} no pertenece al jugador actual`);
            }
        });
    }

    // Buscar ficha por ID
    findTileById(tileId) {
        const [top, bottom] = tileId.split('-').map(Number);

        for (const player of this.players) {
            for (const tile of player.tiles) {
                if (tile.top === top && tile.bottom === bottom) {
                    return tile;
                }
            }
        }
        return null;
    }

    // Verificar si la ficha pertenece al jugador actual
    isCurrentPlayerTile(tile) {
        const currentPlayer = this.players[this.currentPlayerIndex];
        return currentPlayer.tiles.includes(tile);
    }

    // Manejar el drop de una ficha
    handleTileDrop(tile, event) {
        const gameBoard = document.getElementById('game-board');
        const rect = gameBoard.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const boardWidth = rect.width;

        // Determinar posición basada en la coordenada X
        let position;
        if (x < boardWidth / 2) {
            position = 'left';
        } else {
            position = 'right';
        }

        // Intentar colocar la ficha
        if (this.placeTile(tile, position)) {
            this.logMessage(`${this.players[this.currentPlayerIndex].name} colocó ${tile.top}-${tile.bottom} a la ${position === 'left' ? 'izquierda' : 'derecha'}`);
        } else {
            this.logMessage(`No se puede colocar la ficha ${tile.top}-${tile.bottom} en esa posición`);
        }
    }

    // Añadir mensaje al log
    logMessage(message) {
        const logContent = document.getElementById('log-content');
        const timestamp = new Date().toLocaleTimeString();
        logContent.innerHTML += `<div>[${timestamp}] ${message}</div>`;
        logContent.scrollTop = logContent.scrollHeight;
    }
}

// Inicializar el juego cuando se carga la página
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new DominoGame();
});
