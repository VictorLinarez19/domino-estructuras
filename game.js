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

        // Todas las fichas se muestran verticales a los jugadores
        tile.innerHTML = `
            <div class="domino-half top">${this.generateDots(this.top)}</div>
            <div class="domino-half bottom">${this.generateDots(this.bottom)}</div>
        `;

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

        // Preguntas integradas directamente desde el archivo Preguntas.txt
        this.questions = [
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
            },
            {
                question: "¿Cuál es el valor del término C(n,0)?",
                options: [
                    "C(n,n)",
                    "0",
                    "1",
                    "n"
                ],
                correctIndex: 2
            },
            {
                question: "Un estudiante puede elegir un deporte de una lista de 5 deportes de equipo o un deporte de una lista de 3 deportes individuales. ¿Cuántos deportes distintos puede elegir en total?",
                options: [
                    "5×3=15",
                    "5+3=8",
                    "P(8,2)=56",
                    "C(8,2)=28"
                ],
                correctIndex: 1
            },
            {
                question: "En una carrera hay 8 corredores. ¿De cuántas maneras se pueden otorgar los tres primeros lugares (oro, plata y bronce)?",
                options: [
                    "8^3=512",
                    "P(8,3)=336",
                    "C(8,3)=56",
                    "3!=6"
                ],
                correctIndex: 1
            },
            {
                question: "Se lanza un dado de 6 caras y se lanza una moneda al aire. ¿Cuántos resultados posibles se pueden obtener?",
                options: [
                    "C(6,2)=15",
                    "6×2=12",
                    "P(8,2)=56",
                    "6+2=8"
                ],
                correctIndex: 1
            },
            {
                question: "¿Cuál es la diferencia entre el Principio de la Suma y el Principio de la Multiplicación?",
                options: [
                    "El Principio de la Suma se usa solo con números enteros, y la multiplicación con números racionales.",
                    "La suma se relaciona con combinaciones, y la multiplicación con permutaciones.",
                    "La suma se aplica a eventos mutuamente excluyentes ('o'), y la multiplicación a eventos consecutivos e independientes ('y').",
                    "La suma se usa para ordenar elementos, y la multiplicación para seleccionarlos."
                ],
                correctIndex: 2
            },
            {
                question: "Se desea formar un comité de 4 personas de un grupo de 10 hombres y 8 mujeres. ¿De cuántas maneras se puede formar el comité si debe haber exactamente 2 hombres y 2 mujeres?",
                options: [
                    "P(10,2)×P(8,2)=90×56=5040",
                    "C(18,4)=3060",
                    "C(10,2)+C(8,2)=45+28=73",
                    "C(10,2)×C(8,2)=45×28=1260"
                ],
                correctIndex: 3
            },
            {
                question: "En una caja hay 5 libros de matemáticas y 4 de física. ¿De cuántas maneras se puede elegir un libro de matemáticas o un libro de física?",
                options: [
                    "P(9,2)=72",
                    "5+4=9",
                    "C(9,2)=36",
                    "5×4=20"
                ],
                correctIndex: 1
            },
            {
                question: "¿De cuántas maneras pueden 6 personas sentarse alrededor de una mesa circular?",
                options: [
                    "P(6,6)=720",
                    "6×5=30",
                    "C(6,6)=1",
                    "(6−1)! = 5! = 120"
                ],
                correctIndex: 3
            },
            {
                question: "¿Qué propiedad define a un problema como una **permutación**?",
                options: [
                    "Se seleccionan todos los elementos del conjunto y el orden no importa.",
                    "El orden de los elementos seleccionados es crucial.",
                    "Se seleccionan subconjuntos de elementos sin considerar su posición.",
                    "Los elementos se pueden repetir infinitamente en cada selección."
                ],
                correctIndex: 1
            },
            {
                question: "En la fórmula de la permutación P(n,k), ¿qué representa 'n' y qué representa 'k'?",
                options: [
                    "n es el total de elementos y k es el número de elementos repetidos.",
                    "n es el número de elementos seleccionados y k es el total de elementos.",
                    "n es el total de elementos y k es el número de elementos que se toman para formar el arreglo.",
                    "n es el número de combinaciones y k es el número de permutaciones."
                ],
                correctIndex: 2
            },
            {
                question: "¿Cuál es la interpretación de C(n,n)?",
                options: [
                    "El número de arreglos posibles de los elementos de un conjunto de 'n'.",
                    "Cero, porque no tiene sentido elegir 'n' de 'n' elementos.",
                    "El número de maneras de elegir 'n' elementos de un conjunto de 'n', sin que el orden importe.",
                    "El número de maneras de elegir 'n' elementos de un conjunto de 'n', donde el orden importa."
                ],
                correctIndex: 2
            },
            {
                question: "¿Qué representa la expresión Pₖ(n) en el contexto de las permutaciones con repetición?",
                options: [
                    "El número de formas de elegir 'k' elementos de un conjunto de 'n' elementos con repetición, donde el orden no importa.",
                    "El número de permutaciones con elementos idénticos.",
                    "El número de permutaciones de 'n' elementos de un conjunto de 'k' elementos.",
                    "El número de arreglos ordenados de 'k' elementos tomados de un conjunto de 'n' elementos, donde la repetición está permitida."
                ],
                correctIndex: 3
            },
            {
                question: "¿Cómo se define conceptualmente el **Principio de la Multiplicación**?",
                options: [
                    "Como el producto de las opciones de una secuencia de eventos que ocurren de forma consecutiva o conjunta.",
                    "Como la suma de las opciones de eventos que no pueden ocurrir al mismo tiempo.",
                    "Como un método para encontrar la probabilidad de un evento.",
                    "Como una manera de encontrar las permutaciones de un conjunto de elementos."
                ],
                correctIndex: 0
            },
            {
                question: "Una **permutación circular** se diferencia de una lineal porque:",
                options: [
                    "El punto de partida o de referencia no importa, lo que reduce las posibles ordenaciones.",
                    "Se utiliza una fórmula diferente que no incluye factoriales.",
                    "El número de permutaciones es mayor en la forma circular.",
                    "En las circulares, se permite la repetición de elementos."
                ],
                correctIndex: 0
            },
            {
                question: "¿Qué es la 'selección con reemplazo' en un problema de conteo?",
                options: [
                    "Una selección donde se extraen todos los elementos del conjunto.",
                    "Una vez que un elemento es seleccionado, no puede ser seleccionado de nuevo.",
                    "Una selección donde el orden de los elementos no importa.",
                    "El elemento seleccionado se devuelve al conjunto original antes de la siguiente selección."
                ],
                correctIndex: 3
            },
            {
                question: "¿De cuántas maneras se puede elegir un equipo de 3 jugadores de un total de 10, si hay un capitán predeterminado?",
                options: [
                    "C(10,3)",
                    "P(9,2)",
                    "C(9,2)",
                    "P(10,3)"
                ],
                correctIndex: 2
            }
        ];

        console.log(`Preguntas integradas: ${this.questions.length} preguntas disponibles desde Preguntas.txt`);

        this.initializeGame();
        this.setupEventListeners();
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
                    const tileElement = tile.createElement();
                    player.element.appendChild(tileElement);
                });
            } else {
                // Mostrar fichas ocultas para los otros jugadores
                for (let i = 0; i < player.tiles.length; i++) {
                    const hiddenTile = document.createElement('div');
                    hiddenTile.className = 'domino-tile hidden-tile';
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
            
            boardElement.appendChild(boardTile);
        });
    }

    // Pasar al siguiente turno
    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
        this.selectedTile = null;
        document.getElementById('play-tile').style.display = 'none';
        this.updatePlayerDisplays();

        // Mostrar modal de turno
        this.showTurnModal();
    }

    // Terminar la mano
    endHand(winningTeam) {
        const losingTeam = winningTeam === 'A' ? 'B' : 'A';
        const points = this.calculatePoints();

        this.logMessage(`¡Equipo ${winningTeam} gana la mano! Puntos: ${points}`);

        // Mostrar pregunta al equipo perdedor
        this.showQuestion(losingTeam, points);
    }

    // Calcular puntos de la mano actual
    calculatePoints() {
        let points = 0;
        this.players.forEach(player => {
            player.tiles.forEach(tile => {
                points += tile.getValue();
            });
        });
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
        const modal = document.getElementById('question-modal');
        const isCorrect = selectedIndex === question.correctIndex;

        if (isCorrect) {
            // Respuesta correcta
            modal.style.display = 'none';
            const halfPoints = Math.floor(points / 2);
            this.addPoints(team === 'A' ? 'B' : 'A', halfPoints);
            this.logMessage(`✅ ¡Respuesta correcta! Equipo ${team === 'A' ? 'B' : 'A'} gana ${halfPoints} puntos (mitad)`);

            // Iniciar nueva mano después de un breve delay
            setTimeout(() => this.newHand(), 2000);
        } else {
            // Respuesta incorrecta - mostrar cuál es la correcta
            const correctLabel = ['A', 'B', 'C', 'D'][question.correctIndex];
            const correctAnswer = question.options[question.correctIndex];

            // Mostrar mensaje de respuesta incorrecta
            alert(`❌ Respuesta incorrecta.\n\nSeleccionaste: ${selectedLabel}. ${question.options[selectedIndex]}\n\n✅ La respuesta correcta es: ${correctLabel}. ${correctAnswer}`);

            // Cerrar modal y continuar con penalización completa
            modal.style.display = 'none';
            this.addPoints(team === 'A' ? 'B' : 'A', points);
            this.logMessage(`❌ Respuesta incorrecta. Equipo ${team === 'A' ? 'B' : 'A'} gana ${points} puntos completos`);

            // Iniciar nueva mano
            setTimeout(() => this.newHand(), 2000);
        }
    }

    // Añadir puntos a un equipo
    addPoints(team, points) {
        if (team === 'A') {
            this.scores.teamA += points;
            document.getElementById('score-team-a').textContent = this.scores.teamA;
        } else {
            this.scores.teamB += points;
            document.getElementById('score-team-b').textContent = this.scores.teamB;
        }
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
            this.nextTurn();
            this.logMessage('Turno pasado');
        });

        document.getElementById('play-tile').addEventListener('click', () => {
            this.showPlacementOptions();
        });

        document.getElementById('end-hand').addEventListener('click', () => {
            // Forzar fin de mano
            const currentPlayer = this.players[this.currentPlayerIndex];
            this.endHand(currentPlayer.team);
        });

        document.getElementById('reset-game').addEventListener('click', () => {
            this.resetGame();
        });

        // Ya no necesitamos event listener del tablero - ahora usamos botones
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
