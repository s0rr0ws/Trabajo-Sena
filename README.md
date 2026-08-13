# PrismaShift — juego educativo original

Abra `index.html` con Live Server, cree un perfil y juegue con flechas, WASD o botones.

## Reglas

- El bloque puede estar de pie, horizontal o vertical.
- Deben existir todas las casillas ocupadas después del movimiento.
- Si una parte queda fuera de la plataforma, el nivel se reinicia.
- Se gana únicamente al quedar de pie sobre el objetivo amarillo.
- El progreso y las mejores marcas se guardan en `localStorage`.

## Demostración técnica

Explique las funciones `occupied`, `nextState`, `isValid`, `isWin`, `renderBoard` y `move`. El script SQL no está conectado y representa la futura persistencia de jugadores, niveles, partidas y resultados.

El proyecto toma como referencia el género de rompecabezas de bloques rodantes, pero usa nombre, interfaz, niveles, código y recursos visuales originales.
