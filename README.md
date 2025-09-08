# Dominó - Estructuras Discretas

Un juego completo de dominó implementado en HTML, CSS y JavaScript, especialmente diseñado para la materia de Estructuras Discretas con mecánicas educativas.

## 🆕 **ACTUALIZACIÓN IMPORTANTE - Versión con Drag & Drop**

Esta versión incluye **drag and drop nativo** para una experiencia de usuario mejorada. ¡Ya no necesitas botones para colocar fichas!

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

#### 🖱️ **Nueva Mecánica - Drag & Drop**
- **Arrastrar ficha**: Mantén presionado el botón izquierdo del mouse sobre una ficha
- **Colocar ficha**: Suelta la ficha sobre el tablero en la posición deseada
- **Posiciones**: El lado izquierdo del tablero es "izquierda", el derecho es "derecha"
- **Feedback visual**: El tablero se resalta cuando arrastras una ficha válida

#### 🎮 Controles Tradicionales
- **Iniciar Partida**: Comienza una nueva mano repartiendo fichas
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

### 🎯 **Instrucciones con Drag & Drop**

1. **Inicio**: Haz clic en "Iniciar Partida" para repartir las fichas
2. **Tu turno**: Solo verás tus fichas, las de otros jugadores estarán ocultas
3. **Seleccionar ficha**: Mantén presionado el mouse sobre una ficha válida
4. **Arrastrar ficha**: Mueve el mouse mientras mantienes presionado para arrastrar la ficha
5. **Colocar ficha**: Suelta la ficha sobre el tablero:
   - **Lado izquierdo**: Para colocar en la posición izquierda
   - **Lado derecho**: Para colocar en la posición derecha
6. **Validación automática**: El juego verifica automáticamente si la ficha puede colocarse
7. **Robar**: Si no puedes jugar, usa el botón "Robar Ficha"
8. **Turnos**: El juego pasa automáticamente al siguiente jugador
9. **Preguntas**: Si pierdes una mano, respondes una pregunta de estructuras discretas

### ⚠️ **Consejos para Drag & Drop**
- Solo puedes arrastrar tus propias fichas (las visibles)
- El tablero se resalta en verde cuando arrastras una ficha válida
- Si la ficha no puede colocarse, volverá automáticamente a tu mano
- Usa el botón "Pasar Turno" si no tienes movimientos válidos

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

## 🔧 **Debugging y Troubleshooting**

### 🐛 **Herramientas de Debug Incluidas**
- **Consola del navegador**: Abre F12 → Console para ver mensajes de debug
- **Función debugGame()**: Ejecuta `debugGame()` en la consola para ver el estado del juego
- **Logs detallados**: El juego registra todas las acciones en el panel de "Registro del Juego"

### ⚠️ **Problemas Comunes y Soluciones**

#### **El drag & drop no funciona**
- **Verifica**: ¿Estás usando un navegador moderno? (Chrome, Firefox, Edge)
- **Solución**: Actualiza tu navegador o usa uno compatible con HTML5 Drag & Drop

#### **Las fichas no se colocan correctamente**
- **Verifica**: ¿Estás arrastrando una ficha que te pertenece?
- **Solución**: Solo puedes arrastrar las fichas visibles (las tuyas)

#### **El tablero no se resalta**
- **Verifica**: ¿La ficha que arrastras puede colocarse en alguna posición?
- **Solución**: Intenta con otra ficha que coincida con los extremos del tablero

#### **Los turnos no avanzan correctamente**
- **Verifica**: ¿Has colocado una ficha válida?
- **Solución**: El turno solo avanza cuando colocas una ficha o usas "Pasar Turno"

### 🎯 **Códigos de Debug**
```javascript
// Ver estado completo del juego
debugGame()

// Probar el sistema de puntuación
testScoring()

// Verificar elementos del DOM
document.getElementById('game-board')
document.getElementById('player1-tiles')

// Verificar soporte de drag and drop
'draggable' in document.createElement('div')
```

## 🏆 **Sistema de Puntuación Corregido**

### ✅ **Problema Solucionado**
El acumulador de puntos **ya funciona correctamente**. Los cambios realizados incluyen:

1. **Lógica corregida**: Ahora cuando el equipo perdedor responde correctamente, ¡EL MISMO EQUIPO gana la mitad de los puntos!
2. **Debugging avanzado**: Se agregó logging detallado para rastrear todos los cambios de puntuación
3. **Validación de elementos DOM**: Verificación de que los elementos HTML existen antes de actualizarlos

### 📊 **Cómo Funciona Ahora**
- **Respuesta correcta del perdedor**: Equipo perdedor gana la MITAD de los puntos
- **Respuesta incorrecta del perdedor**: Equipo ganador gana TODOS los puntos
- **Acumulación automática**: Los puntos se suman correctamente a las puntuaciones totales
- **Fin de partida**: El juego termina cuando un equipo llega a 100 puntos

### 🧪 **Pruebas Disponibles**
```javascript
// Probar el sistema de puntuación directamente
testScoring()

// Ver todas las actualizaciones en la consola
// Abre F12 → Console para ver los logs detallados
```

¡Disfruta aprendiendo estructuras discretas mientras juegas dominó!
