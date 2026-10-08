# Estatus actual del proyecto

**Fecha de revisión:** 2026-10-08  
**Alcance:** revisión acumulada del repositorio + implementación de Día 2 + ronda de
arreglos, verificación guiada de todos los flujos del Día 2 y documentación
(`guion-taller.md`, `README.md`).

## Resumen

El proyecto es un taller de KAPLAY organizado en una presentación interactiva, un starter para completar y soluciones por día.

| Área | Estado | Observaciones |
|---|---|---|
| `presentacion/` | Implementada | Hub y cinco salas con teoría, retos, snippets y micro-demos. Smoke test sin errores y revisión visual. Favicon inline añadido. |
| `starter/` | Incompleta intencionalmente | Plantilla de participantes con los 4 TODOs. En esta ronda se **ajustó la redacción** de varios pasos para que no pidieran lo que ya está escrito; sigue sin completarse. |
| `solucion-dia1/` | Implementada como MVP | Smoke test OK y comprobación del pisotón/puntuación. Favicon inline añadido. |
| `solucion-dia2/` | **Implementada y verificada** | 21/21 comprobaciones guiadas de juego (pisotón, daño, i-frames, curación, proyectiles, jefe, victoria, game over, récord, reinicio) sin errores de consola/red, más verificación numérica del parallax y revisión visual. |
| `assets/` | Recursos presentes | Fuente, sonidos y sprites (KAPLAY Crew y Kenney, CC0). |
| `guion-taller.md` | **Nuevo** | Guion del instructor: agendas por franja, checkpoints, escribir vs. pegar, escaleras, modo emergencia y troubleshooting. |
| `README.md` | **Nuevo** | Cómo ejecutarlo (Live Server, sin Node), estructura, controles y licencias. |
| Prueba `smoke.cjs` | Opcional; **ejecutada** | 4/4 páginas OK (sin errores de consola ni HTTP ≥ 400). Requiere Node.js y Playwright; no es requisito para impartir el taller. |

## Estado por carpeta y archivo

### Raíz

- `smoke.cjs` — **Prueba de humo, ejecutada en esta revisión: 4/4 páginas OK.** Automatiza navegación, interacción por teclado, errores de consola/red y capturas. Requiere Node.js y una instalación de Playwright en la ruta absoluta `/tmp/pwtest/node_modules/playwright` (adaptar al entorno propio); no forma parte de la ejecución browser-only del taller. El comentario de uso habla de `smoke.mjs` aunque el archivo se llama `smoke.cjs`, y guarda capturas bajo `/tmp/shots/`.
- `guion-taller.md` — **Guion del taller (nuevo).** Agendas por franja de los dos días, talking points, checkpoints, bloques a escribir vs. a pegar, escaleras, modo emergencia, errores típicos, verificación final y licencias.
- `README.md` — **Documentación raíz (nuevo).** Qué es el taller, requisitos (VS Code + Live Server, sin Node.js), estructura de carpetas, controles, ejecución opcional de `smoke.cjs` y licencias.
- `ESTATUS-PROYECTO.md` — **Informe de estado del proyecto.**
- No hay `package.json` **a propósito**: el taller no usa dependencias locales; KAPLAY llega por CDN.

### `presentacion/`

- `index.html` — **Implementado.** Página en español, muestra un velo de carga y carga `./main.js` como módulo.
- `main.js` — **Implementado.** Inicializa KAPLAY, carga recursos, define el mapa/hub, navegación, escenas de sala, presentación de teoría y snippets, resaltado de código y control del velo de carga.
- `salas.js` — **Implementado.** Define paleta y cinco salas con teoría, retos, snippets y demos: game loop, físicas, colisiones/estados, puntuación y cierre.

### `starter/`

- `index.html` — **Implementado como página del taller.** Carga `./main.js` como módulo y presenta un loader.
- `main.js` — **Plantilla de taller, intencionalmente incompleta.** Ya configura KAPLAY, recursos, escenario, jugador, HUD inicial, escenas de victoria/derrota, reinicio y loader. Conserva los ejercicios y pistas:
  - **TODO 1:** movimiento y salto del jugador (incluidos handlers de teclado).
  - **TODO 2:** creación/patrulla de enemigos y lógica de colisión.
  - **TODO 3:** contador de enemigos y actualización de puntuación al derrotarlos.
  - **TODO 4:** sonidos de acciones y flujo de victoria/derrota al colisionar.

  El límite horizontal, la recuperación si el jugador cae fuera del mapa y el reinicio con `R` están escritos. No completar estos TODOs forma parte del diseño pedagógico.

  **Ajustes de esta ronda (redacción, no solución):** el paso 3 del TODO 1 ya no
  pide los límites laterales (están escritos) y pasa a ser un reto de *feel* del
  salto; el TODO 3 fija el formato final del HUD
  (`"PUNTOS: " + puntos + "   META: 1000"`) y `play("pickup")`;
  el paso 4 del TODO 2 usa la variable `jugando` que el archivo ya declara; y el
  bloque de límites/red de seguridad se marca como YA HECHO.

  **Meta del día (Día 1):** victoria con `puntos >= 1000` (10 pisotones de 100);
  el enemigo pisoteado reaparece a los 2 s por el extremo más alejado del jugador
  (`wait(2, …)` + `crearEnemigo(...)`), así que la pantalla nunca se vacía.

### `solucion-dia1/`

- `index.html` — **Implementado.** Carga `./main.js` como módulo y presenta un loader.
- `main.js` — **Implementado como solución MVP del Día 1.** Contiene mundo y plataformas, movimiento, salto, límites del jugador, cuatro enemigos patrullando, distinción entre pisotón y choque lateral, puntos/HUD, sonidos, reinicio, victoria y game over. Esta implementación corresponde al alcance descrito en sus comentarios: no pretende incluir los sprites, vida, jefe o mejoras de Día 2.

### `solucion-dia2/`

- `index.html` — **Implementado.** Carga el módulo `./main.js`, presenta el loader y evita una solicitud de favicon inexistente.
- `main.js` — **Implementado y verificado.** Carga KAPLAY 3001.0.19 desde CDN y los recursos locales; incluye mundo de 2560 px, cámara y capas parallax, personaje con salto y tres puntos de vida, invulnerabilidad/knockback, cuatro enemigos, corazón curativo, puntuación y récord persistido con `getData`/`setData`, partículas, jefe con seis puntos de vida y proyectiles, sonidos, y escenas de victoria/derrota.
- **Mapa de bloques:** la cabecera del archivo lista la agenda del Día 2 y cada
  sección lleva su etiqueta `▸ D2-n` con franja horaria y modo (**PEGAR** o
  **escribir**), de modo que el archivo funciona como kit de bloques guiado.
- **Arreglos aplicados en esta ronda:**
  1. El callback de cámara se registra **antes** que los de las capas parallax
     (antes iba después de `cielo`/`capa()`, con un fotograma de retraso).
  2. El proyectil se lanza a `jefe.pos.y - 45` en lugar de `-96` (pasaba ~21 px
     por encima de la cabeza del jugador de pie y no acertaba nunca).
  3. El césped de suelo y plataformas se mozaica con `techoDeHierba()` a tamaño
     nativo (64×64) en vez de estirar un sprite 40× (escalones con filtro *nearest*);
     el borde superior del bloque coincide con el colisionador.
  4. El corazón sube a `y = 316`: antes se recogía caminando por la plataforma 2.
  5. Se eliminó `loadSound("error")` (no se usaba en ninguna parte del proyecto).
  6. Simplificación de `golpeAlJefe()` y captura de la posición del jefe antes de
     destruirlo para el estallido final.
- **Verificación realizada:** `smoke.cjs` 4/4 páginas sin errores de consola ni
  HTTP ≥ 400; **21/21 comprobaciones guiadas** de juego — arranque, cámara
  (seguimiento y tope), pisotón (+100, enemigo destruido), daño lateral,
  invulnerabilidad de 1 s, curación con el corazón, game over, reinicio con `R`,
  récord persistido y sobreviviente a recarga, proyectiles (aparición a partir de
  `x > 1750` y acierto al jugador de pie), 6 golpes al jefe → victoria con
  proyectiles limpiados y `PUNTOS: 300   RÉCORD: 300` — más verificación numérica
  del parallax (cada capa se desplaza exactamente `-factor × Δcámara`) y revisión
  visual de capturas (inicio, parallax, zona del jefe y victoria).
- **Ejecución:** browser-only con Live Server, HTML y JavaScript de módulos; KAPLAY se obtiene del CDN y no requiere instalar Node.js ni dependencias en el equipo. El script `smoke.cjs` sí usa Node.js para pruebas automatizadas, pero es opcional y separado de la demo.

### `assets/`

**Estado de la carpeta:** contiene 49 archivos: 34 sprites PNG, 14 sonidos y una fuente. Todos los archivos listados abajo aparecen en el inventario.

- `fonts/happy.ttf` — **Presente.** Fuente usada en juego y presentación.
- `sounds/` — **Recursos presentes (14):**
  - `boss-hit.ogg`
  - `crew-bean_voice.wav`
  - `crew-burp.mp3`
  - `error.ogg`
  - `gameover.ogg`
  - `heal.ogg`
  - `hurt.ogg`
  - `jump.ogg`
  - `land.ogg`
  - `pickup.ogg`
  - `projectile.ogg`
  - `select.ogg`
  - `stomp.ogg`
  - `victory.ogg`
- `sprites/` — **Recursos presentes (17 pares de variantes):**
  - `bean.png`, `bean-o.png`
  - `cloud.png`, `cloud-o.png`
  - `coin.png`, `coin-o.png`
  - `door.png`, `door-o.png`
  - `ghosty.png`, `ghosty-o.png`
  - `gigagantrum.png`, `gigagantrum-o.png`
  - `grass.png`, `grass-o.png`
  - `heart.png`, `heart-o.png`
  - `moon.png`, `moon-o.png`
  - `portal.png`, `portal-o.png`
  - `skuller.png`, `skuller-o.png`
  - `sparkles.png`, `sparkles-o.png`
  - `spike.png`, `spike-o.png`
  - `star.png`, `star-o.png`
  - `steel.png`, `steel-o.png`
  - `sun.png`, `sun-o.png`
  - `zombean.png`, `zombean-o.png`

Los sprites y sonidos están en el repositorio y los carga cada demo mediante `loadRoot("../assets/")`.

## Próximo trabajo sugerido

1. ~~Probar de forma guiada todos los casos de Día 2~~ — **Hecho:** 21/21
   comprobaciones guiadas (pisotón, daño e invulnerabilidad, curación,
   proyectiles, derrotar al jefe, game over, récord y reinicio), sin errores de
   consola/red. Detalle en el apartado de `solucion-dia2/`.
2. ~~Preparar el guion del taller y el README~~ — **Hechos:** `guion-taller.md`
   (agendas, checkpoints, escaleras y plan B por bloque) y `README.md`.
3. Pendiente del instructor (no del repositorio):
   - Ensayar una pasada con el guion en el portátil del proyector (sonido,
     resolución y sensación de los tiempos por bloque).
   - Si se va a usar `smoke.cjs`, adaptar sus rutas al entorno del equipo; sigue
     sin ser requisito para impartir el taller.

## Ejecución para participantes

El taller y las soluciones están planteados para ejecutarse en el navegador con HTML, JavaScript de módulos y Live Server en VS Code. KAPLAY se obtiene desde el CDN y los assets se sirven desde el repositorio. No se requiere instalar Node.js ni paquetes en los equipos de participantes; Node.js/Playwright solo intervienen si se decide ejecutar el script automatizado `smoke.cjs`.

## Verificación acumulada

- **Smoke test global (esta ronda):** `smoke.cjs` sobre las 4 páginas → **4/4 OK**,
  sin errores de consola ni respuestas HTTP ≥ 400 (incluye los favicons inline
  añadidos a `presentacion/`, `starter/` y `solucion-dia1/`).
- **Presentación y Día 1:** smoke tests previos sin errores; en Día 1 se
  verificaron el pisotón, el incremento de puntos y el rebote.
- **Día 2 — flujos de juego (esta ronda):** **21/21 comprobaciones** con estado
  leído del propio juego (globals de KAPLAY en la página) y física real:
  arranque, HUD, cámara (seguimiento y tope), pisotón +100 con enemigo destruido,
  récord en `localStorage` y sobreviviente a recarga, daño lateral, i-frames de
  1 s, curación con el corazón, game over, reinicio con `R`, aparición de
  proyectiles a partir de `x > 1750`, acierto del proyectil al jugador de pie,
  6 golpes al jefe → victoria con proyectiles limpiados y marcador
  `PUNTOS: 300   RÉCORD: 300`. Sin errores de consola ni de red.
- **Parallax (esta ronda):** verificación numérica: cada capa se desplaza en
  pantalla exactamente `-factor × Δcámara` (estrellas −23 px, luna −38 px,
  nubes −228 px, colinas −418 px, mundo −760 px para Δcámara = 760).
- **Revisión visual (esta ronda):** capturas de inicio, mundo con parallax,
  zona del jefe (barra, proyectil a la altura del jugador, `+50` flotante,
  césped mozaicado) y pantalla de victoria.
