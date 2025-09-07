# Dominó - Estructuras Discretas

Un juego completo de dominó implementado en HTML, CSS y JavaScript, especialmente diseñado para la materia de Estructuras Discretas con mecánicas educativas.

## Características

### 🎯 Mecánicas de Juego Tradicionales
- Juego de dominó completo con fichas del 0-6
- 4 jugadores divididos en 2 equipos (A y B)
- Sistema de turnos automático
- Validación de movimientos
- Sistema de puntuación tradicional

### 🎓 Mecánica Educativa Especial
- **Preguntas de Estructuras Discretas**: Cuando un equipo pierde una mano, debe responder una pregunta
- **Sistema de puntos reducido**: Si responde correctamente, el equipo ganador obtiene solo la mitad de los puntos
- **Preguntas de prueba incluidas**: Sobre grafos, teoría de conjuntos, combinatoria, etc.

### 🎮 Controles del Juego
- **Iniciar Partida**: Comienza una nueva mano repartiendo fichas
- **Seleccionar ficha**: Haz clic en una ficha para seleccionarla (solo las tuyas son visibles)
- **Jugar Ficha**: Aparece cuando seleccionas una ficha - elige dónde colocarla (izquierda/derecha)
- **Robar Ficha**: Toma una ficha del montón cuando no puedes jugar
- **Pasar Turno**: Salta al siguiente jugador
- **Terminar Mano**: Fuerza el fin de la mano actual (para pruebas)
- **Reiniciar Juego**: Reinicia completamente el juego y las puntuaciones

### 🎯 Sistema de Fichas
- **28 fichas tradicionales**: Del 0-0 hasta el 6-6
- **Dobles verticales**: 1-1, 2-2, 3-3, 4-4, 5-5, 6-6 se muestran verticales
- **No dobles horizontales**: Todas las demás fichas se muestran horizontales
- **Sin duplicados**: Cada ficha existe solo una vez

## Cómo Jugar

1. **Inicio**: Haz clic en "Iniciar Partida" para repartir las fichas
2. **Tu turno**: Solo verás tus fichas, las de otros jugadores estarán ocultas
3. **Seleccionar ficha**: Haz clic en una de tus fichas para seleccionarla (se resalta)
4. **Jugar ficha**: Haz clic en "Jugar Ficha" y elige dónde colocarla (izquierda/derecha)
5. **Robar**: Si no puedes jugar, usa "Robar Ficha"
6. **Turnos**: El juego pasa automáticamente al siguiente jugador
7. **Preguntas**: Si pierdes una mano, respondes una pregunta de estructuras discretas

### Reglas Especiales
- **Fichas**: Se usan exactamente las 28 fichas tradicionales del dominó (0-0 hasta 6-6)
- **Orientación visual**: Los dobles (1-1, 2-2, etc.) se muestran verticales, las demás horizontales
- **Lógica mejorada**: Las fichas se pueden jugar si cualquiera de sus números coincide con los extremos del tablero
- Cuando un equipo se queda sin fichas, gana la mano
- El equipo perdedor debe responder una pregunta
- Si responde correctamente: gana solo la mitad de los puntos
- Si responde incorrectamente: gana todos los puntos

## Preguntas Incluidas

El juego incluye preguntas de prueba sobre:
- Teoría de grafos (vértices, aristas, grados)
- Grafos completos y conexiones
- Combinatoria y fórmulas matemáticas
- Estructuras básicas de matemática discreta

## Archivos del Proyecto

- `index.html` - Estructura principal del juego
- `styles.css` - Estilos y diseño visual
- `game.js` - Lógica completa del juego
- `README.md` - Este archivo de documentación

## Tecnologías Utilizadas

- **HTML5** - Estructura y elementos del juego
- **CSS3** - Estilos, animaciones y diseño responsivo
- **JavaScript (ES6+)** - Lógica del juego, clases y eventos

## Características Técnicas

- Diseño responsivo que funciona en diferentes tamaños de pantalla
- Sistema de clases JavaScript para organizar el código
- Validación completa de movimientos
- Interfaz intuitiva con retroalimentación visual
- Sistema de logging para seguimiento del juego

## Personalización

Para añadir tus propias preguntas, modifica la función `loadQuestions()` en `game.js`:

```javascript
{
    question: "¿Tu pregunta aquí?",
    options: ["Opción A", "Opción B", "Opción C", "Opción D"],
    correctIndex: 0 // Índice de la respuesta correcta (0-3)
}
```

¡Disfruta aprendiendo estructuras discretas mientras juegas dominó!
