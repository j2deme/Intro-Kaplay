# Guion del taller · KAPLAY en 4 horas

**Duración:** 4 h = 2 sesiones de 2 h · **Participantes:** 20–30, nivel de JS mixto
**Día 1:** sesión en directo, todos a la vez (4 TODOs en el `starter/`)
**Día 2:** guiado por equipos, el instructor va marcando ritmo (6 bloques)

**Material:**

| Qué                | Carpeta             | Uso                                                          |
| ------------------ | ------------------- | ------------------------------------------------------------ |
| Juego-presentación | `presentacion/`     | Se **proyecta** en el Día 1 (hub + 5 salas)                  |
| Presentación Día 2 | `presentacion-dia2/`| Se **proyecta** en el Día 2 (hub + 6 salas, demo en vivo)    |
| Starter            | `starter/`          | Cada equipo lo edita el Día 1; es su partida el Día 2        |
| Solución Día 1     | `solucion-dia1/`    | Referencia y "plan B" al final del Día 1                     |
| Kit Día 2          | `solucion-dia2-lite/`| **Kit de enseñanza** del Día 2: bloques `▸ D2-n` reducidos  |
| Solución Día 2     | `solucion-dia2/`    | Solución completa (parallax y jefe) para las **demos**       |
| Assets             | `assets/`           | Sprites/sonidos/fuente ya descargados (CC0)                  |

---

## Cómo usar este guion

Cada bloque tiene seis líneas fijas: **proyectar → hablar → ellos → checkpoint → escalera → si vamos tarde**.

### La regla de oro del tiempo

Están las 4 horas **por bloques, no por código**. Un bloque se cierra en su franja
aunque falte algo, y lo que sobre se pega:

1. **ESCRIBIR** = lo que teclea el equipo dentro de su franja (siempre hay pista).
2. **PEGAR** = copiar de la solución y entender; el instructor lo explica proyectado.
   En la presentación, la tecla **`S`** abre la **solución del bloque** de la sala
   (y del reto): es la válvula rápida para no atascarse. `ESC` la cierra.
3. Si un bloque se pasa de su marca **≥ 5 min**, pasa automáticamente a PEGAR.
   Nunca se roba tiempo al bloque siguiente: **ganar la agenda, no el código**.
4. El showcase del Día 2 (01:50) **es intocable**: se enseña lo que haya.

> El objetivo no es que todos escriban 600 líneas: es que entiendan el bucle,
> la física, las colisiones y los estados, y se vayan con un juego que juegan.

---

## Antes del taller (checklist)

- [ ] Portátil del instructor con VS Code + Live Server y Chrome, probado con el proyector (resolución ≥ 1280×720).
- [ ] Repositorio copiado en los equipos (USB, carpeta compartida o git clone).
- [ ] Internet disponible: KAPLAY se carga desde **unpkg CDN** la primera vez (los assets ya están locales).
- [ ] Abrir `presentacion/index.html` con Live Server y comprobar sonido.
- [ ] Tener abiertas en pestañas: `starter/`, `solucion-dia1/`, `solucion-dia2-lite/`, `solucion-dia2/` y, el Día 2, `presentacion-dia2/`.
- [ ] Repartir/indicar: cada equipo abre **su** `starter/index.html` con Live Server (click derecho → _Open with Live Server_).

---

# DÍA 1 — 2 h · sesión en directo

| Franja      | Bloque                            | Entregable (checkpoint)              |
| ----------- | --------------------------------- | ------------------------------------ |
| 00:00–00:15 | Kickoff · Game Loop (sala 1)      | Canvas visible en todos los equipos  |
| 00:15–00:45 | Físicas (sala 2) → **TODO 1**     | Mover + saltar sin caerse            |
| 00:45–01:25 | Game States (sala 3) → **TODO 2** | 4 enemigos (reaparecen) + choque lateral |
| 01:25–01:40 | Puntuación (sala 4) → **TODO 3**  | `PUNTOS: x   META: 1000` en vivo    |
| 01:40–02:00 | Cierre (sala 5) → **TODO 4**      | Sonidos + victoria a 1000 + R       |

### 00:00–00:15 · Kickoff · Game Loop → Sala 1

- **Proyectar:** hub de `presentacion/` → sala 1 (2 paneles, reto y micro-demo).
- **Ellos (mientras):** abrir `starter/` con Live Server; deben ver el escenario y el texto de ayuda. El loader se oculta solo.
- **Hablar (~6 min):** qué es KAPLAY (JS 2D entero en el navegador, sin instalar nada); el _game loop_ (actualizar + dibujar 60 veces/s, KAPLAY lleva el bucle); mapa del taller: "hoy 4 TODOs, mañana sprites, parallax, vida y un jefe".
- **Mostrar:** el starter **ya arranca** — "esto lo tienen gratis; hoy solo escribimos lo que se mueve".
- **Checkpoint:** canvas visible en todos, sin loader.
- **Escalera:** reto de la sala 1 (el jugador "respira" con `onUpdate()` + contador que se reinicia a 300).
- **Si vamos tarde:** recortar el reto de la sala 1. No tocar el starter todavía.

### 00:15–00:45 · Físicas → TODO 1 (30 min)

- **Proyectar:** sala 2 (`pos()`, `area()`, `body()` + suelo y salto) con su demo jugable.
- **Hablar (~8 min):**
  - `pos()` coloca · `area()` es la caja de colisión (**sin `area()` no hay choque: atraviesas las plataformas**) · `body()` hace caer · `body({ isStatic: true })` para que el suelo no caiga.
  - `isGrounded()` + `jump()` dentro de `onKeyPress`: sin el `if`, saltas en el aire.
  - **`dt()`**: segundos desde el último fotograma. Sin `dt()` la velocidad depende de los FPS del portátil (y en 30 equipos habrá uno que vaya a 0,5×).
  - _Feel_: `setGravity()` y `jumpForce` son la sensación del juego — probarlos es diseño.
- **Ellos (~17 min): TODO 1** — mover con `onKeyDown("a"/"d")` y saltar con `onKeyPress("space")`. La pista está escrita en el propio archivo.
- **Checkpoint (00:45):** el jugador se mueve a la misma velocidad en todos, salta solo en el suelo y no se sale de la pantalla.
- **Escalera:** reto de la sala 2 (2ª plataforma / gravedad 4000) y el paso 3 del TODO 1 (ajustar `jumpForce` 900/1400 y gravedad 1800/3000).
- **Si vamos tarde:** comprobar en directo los dos errores típicos — falta `dt()` y handler fuera de `scene("juego")` — y proyectar los 8 líneas de movimiento de `solucion-dia1/main.js` para que lo peguen.

### 00:45–01:25 · Game States → TODO 2 (40 min) · _el bloque grande_

- **Proyectar:** sala 3 (tags, `onCollide`, estados).
- **Hablar (~10 min):**
  - **Tag = etiqueta**: `"enemigo"` se pone en el `add([])` y con ello lo buscas por nombre: `get("enemigo").length` y `onCollide("jugador", "enemigo", cb)`. El `cb` recibe los dos objetos.
  - `body({ isStatic: true })` en el enemigo: **no cae**, patrulla a mano en su `onUpdate` (avanza y rebota en `desde`/`hasta`).
  - Estados: `jugando` es una variable que decide qué puede pasar; `go("gameover")` **cambia de escena** y borra los listeners de la anterior.
- **Ellos (~22 min): TODO 2** — `crearEnemigo(px, py, desde, hasta)` (rect 44×44 + `area()` + `body({ isStatic: true })` + tag + patrulla), llamarla 4 veces. **Pisotón = detección por SOLAPE en el `onUpdate` del enemigo** (no `onCollide`: KAPLAY no dispara el choque en el aterrizaje vertical) + destruir + `wait(2, …)` para que reaparezca (lejos de donde esté el jugador). El `onCollide` se queda para el choque lateral.
- **Si alguien se atasca con las coordenadas**, revelar (están en la solución):
  ```js
  crearEnemigo(140, 616, 60, 460); // suelo izquierda
  crearEnemigo(860, 616, 720, 1220); // suelo derecha
  crearEnemigo(200, 481, 130, 386); // plataforma 1
  crearEnemigo(1000, 501, 930, 1146); // plataforma 3
  ```
- **Checkpoint (01:25):** los 4 enemigos patrullan y **reaparecen a los 2 s**; caer encima los destruye (por solape en el `onUpdate`); chocar de lado acaba la partida.
- **Escalera:** reto de la sala 3 (5.º enemigo con **patralla vertical**; la solución está en el modal con `S`).
- **Si vamos tarde:** pegar entero `crearEnemigo` + sus 4 llamadas de `solucion-dia1/main.js` y quedarse solo con el `onCollide` escrito a mano (es la idea que importa).

### 01:25–01:40 · Puntuación → TODO 3 (15 min)

- **Proyectar:** sala 4 (`text()`, HUD con `fixed()`).
- **Hablar (~4 min):** `text()` dibuja texto; `fixed()` lo deja pegado a la pantalla aunque haya cámara; el marcador se **recalcula** en cada pisotón y muestra la meta: `"PUNTOS: x   META: 1000"` — el objetivo de hoy es ese número.
- **Ellos (~9 min): TODO 3** — completar `refrescarHud()` con el formato exacto `"PUNTOS: " + puntos + "   META: 1000"`, `puntos += 100` al pisar, `play("pickup")`.
- **Checkpoint (01:40):** al pisar sube 100 y el HUD se acerca a la META de 1000 (los enemigos siguen reapareciendo: la pantalla nunca se vacía).
- **Escalera:** el `text("+100")` flotante con `lifespan(0.8, { fade: 0.4 })` (paso 3 extra del TODO).

### 01:40–02:00 · Cierre → TODO 4 (20 min)

- **Proyectar:** sala 5 (tu MVP jugable).
- **Hablar (~4 min):** el sonido es _feedback_: uno bien puesto vale 10 de diseño; las escenas finales ya existen, solo hay que llamarlas con `go(...)`.
- **Ellos (~12 min): TODO 4** — `play("jump")` al saltar, `play("stomp")` al pisar, `play("hurt")` al chocar; **`puntos >= 1000`** → `play("victory")` + `go("victoria", puntos)` (10 pisotones); choque lateral → `play("hurt")`, `shake(12)`, `go("gameover", puntos)`. (`R` ya está hecho.)
- **Checkpoint final (01:55):** juego completo — se mueve, pisa (y reaparecen), choca, puntúa hacia 1000, suena, gana, pierde y reinicia.
- **Cierre (~5 min):** abrir `solucion-dia1/` al lado y comparar; **preview de mañana**: abrir `solucion-dia2-lite/` y pasear 30 s ("esto es vuestro código mañana: sprites, mundo, vida y chispas") y, si sobra un minuto, un flash de `solucion-dia2/` (parallax y jefe) como "techo posible".
  > **Valvula:** si alguien se lo ha dejado a medias, mañana copia `solucion-dia1/main.js` por el suyo. Sin culpa: es el punto de partida de todos.

---

# DÍA 2 — 2 h · guiado por equipos

**Se proyecta** `presentacion-dia2/index.html` (6 salas: teoría, snippet y una
**micro-demo conceptual jugable** en el recuadro derecho — una por concepto, con
su leyenda de teclas; la tecla **`S`** abre la solución del bloque, con **zoom**
— rueda del ratón o `+/−` — y scroll `↑/↓`).

**Archivo de trabajo:** `solucion-dia2-lite/main.js` es el **kit de bloques** (una
partida completa y jugable): cada sección está marcada con su etiqueta `▸ D2-n`
(bloque y franja) y con **PEGAR** o **escribir**. Los equipos pegan en **su**
archivo del Día 1. `solucion-dia2/main.js` (solución completa, con parallax y
jefe entero) se usa solo para las **demos** del instructor.

**Alcance reducido:** cuatro bloques que se ven y se sienten (sprites, mundo,
vida, partículas) + el jefe como **opcional** para equipos avanzados. Parallax y
jefe completo = demo, no tarea.

| Franja      | Bloque                           | Modo                     |
| ----------- | -------------------------------- | ------------------------ |
| 00:00–00:15 | Cierre Día 1 + dudas             | escribir                 |
| 00:15–00:40 | **D2-1** Sprites                 | escribir                 |
| 00:40–01:00 | **D2-2** Mundo y cámara          | pegar                    |
| 01:00–01:25 | **D2-3** Vida y daño             | escribir + pegar `danar` |
| 01:25–01:40 | **D2-4** Partículas y récord     | pegar                    |
| 01:40–01:50 | **D2-5** Jefe ⭐ (opcional)      | pegar                    |
| 01:50–02:00 | **D2-6** Showcase                | —                        |

### 00:00–00:15 · Cierre del Día 1 + dudas

- Preguntar: **¿a cuántos les arranca el código de ayer?** Los que no, copian
  `solucion-dia1/main.js` encima de su `starter/main.js` (o trabajan desde esa carpeta).
- **Cerrar los dos huecos de ayer en cada equipo** (sala 1 de la presentación):
  `refrescarHud()` descomentado y llamado en `sumar()`, y el `onCollide` de choque
  lateral tras `crearEnemigo`. **Es el prerrequisito de D2-3**: ese mismo
  `onCollide` es el que pasará a llamar a `danar()`.
- Ver los assets (`assets/sprites`): bean, zombean, gigagantrum, heart, grass — todo CC0, ya en el repo.
- Enseñar el mapa: `presentacion-dia2/` + etiquetas `▸ D2-n` del kit.

### 00:15–00:40 · D2-1 · Sprites (25 min) — **escribir**

- **Cargar** (copiar la lista de `▸ D2-1` del kit): `loadSprite` de
  bean, zombean, grass, heart y sparkles.
- **Sustituir:** `rect(48, 60)` + `color(...)` → `sprite("bean")` y
  `rect(44, 44)` + `color(...)` → `sprite("zombean")`. **Se mantiene el ancla
  por esquina superior**: nada de `anchor("bot")` — así la fórmula del pisotón
  del Día 1 sigue intacta y `area()` se redibuja solo.
- **Coordenadas** (el sprite mide 61×53 → `y = borde de la superficie − 53`):
  ```js
  crearEnemigo(140, 607, 60, 460);      // suelo (660 − 53)
  crearEnemigo(860, 607, 720, 1220);
  crearEnemigo(200, 472, 130, 360);     // plat. 1 (525 − 53)
  crearEnemigo(1000, 492, 930, 1120);   // plat. 3 (545 − 53)
  ```
- **Sonido del salto:** `play("jump")` dentro de `onKeyPress("space")` con
  `isGrounded()` (el detalle pendiente del TODO 4).
- **Checkpoint (00:40):** mismo juego de ayer con cara; los pisotones siguen
  funcionando y suena el salto.
- **Escalera:** sonido de aterrizaje (`land`) al tocar el suelo.
- **Si vamos tarde:** pegar los loads + el `add()` del jugador y las 4 llamadas.

### 00:40–01:00 · D2-2 · Mundo y cámara (20 min) — **pegar**

- **PEGAR** los bloques `▸ D2-2`: `ANCHO_MUNDO`, el suelo ancho, `techoDeHierba()`
  y el callback de cámara.
- **Explicar (~5 min), solo 3 ideas:**
  1. **Mozaicar en vez de estirar:** `grass` es un bloque de 64×64; estirarlo a
     2560 px deja escalones gigantes en la línea ondulada.
  2. `setCamPos(clamp(x, 640, ANCHO_MUNDO − 640), 360)`: el jugador queda anclado
     al centro y la cámara no se sale del nivel.
  3. El HUD lleva `fixed()`: viaja con la pantalla, no con la cámara.
- **Checkpoint (01:00):** el nivel mide 2560 px y se recorre entero de punta a
  punta sin que la cámara se asome a los bordes.
- **Parallax → DEMO:** enseñarlo desde `solucion-dia2/` (30 s: "así quedaría con
  capas de fondo"), **no se implementa**.
- **Si vamos tarde:** es el bloque más mecánico; **pegar sin más** y explicarlo mientras.

### 01:00–01:25 · D2-3 · Vida y daño (25 min)

- **Escribir:** `health(3, 3)` en el jugador + HUD de 3 corazones (`sprite("heart")`
  `fixed()` bajo el marcador) + ampliar `refrescarHud()` para apagarlos (opacidad 0.22).
- **PEGAR y explicar `danar(cantidad, origenX)`** (`▸ D2-3`): resta vida, empuja
  (knockback), **1 s de invulnerabilidad** con parpadeo, `shake`/`flash` y, con la
  última vida, game over. El `onCollide` del cierre de hoy **no mata: llama a `danar`**.
- **Escribir el ítem corazón** (`▸ D2-3`): `sprite("heart")` + `area()` + tag
  `"item-vida"`, flota con `sin(fase)` y al chocar `jugador.heal(1)` +
  `play("heal")` y se retira.
- **Checkpoint (01:25):** 3 corazones en pantalla, el choque lateral quita uno con
  parpadeo (no mata de un golpe) y el corazón cura.
- **Escalera:** corazón que hace _bob_ más rápido con el jefe cerca.
- **Si vamos tarde:** pegar corazones + `danar` enteros.

### 01:25–01:40 · D2-4 · Partículas y récord (15 min) — **pegar**

- **PEGAR `estallar()`** y llamarla en `pisar()` y en `sumar()`
  (`particles()` + textura `sparkles`; **`lifespan` exige `opacity()`** o no se desvanecen).
- **PEGAR `guardaRecord` / `leerRecord`** con `getData`/`setData` (KAPLAY envuelve
  `localStorage`) y llamarla al puntuar; las escenas de fin muestran `RÉCORD: n`.
- **Checkpoint (01:40):** chispas al pisar y **F5**: el récord sigue ahí.
- **Si vamos tarde:** ver el _Modo emergencia_ de abajo.

### 01:40–01:50 · D2-5 · Jefe ⭐ (opcional) — **pegar**

- **Solo equipos avanzados** (requiere D2-3 y D2-4): **PEGAR** `▸ D2-5` del kit —
  jefe (`health(6, 6)`, patrulla, barra `fixed`), proyectiles con `loop(1.5, …)`
  y el mismo pisotón geométrico con **0.35 s de enfriamiento**.
- **El resto, mientras tanto:** juega su partida y va afinando sus retos.
- **Demo del instructor (al showcase):** jefe completo y **parallax** desde
  `solucion-dia2/` — "lo que da llegar al final del código".
- **Si nadie lo pega:** no pasa nada; el showcase enseña lo construido y la demo
  pone el techo visible.

### 01:50–02:00 · D2-6 · Showcase (10 min) — **intocable**

- Cada equipo enseña **45 s**: su bloque estrella + una idea para mañana.
- El instructor juega una partida completa proyectada (objetivo: el jefe, desde
  `solucion-dia2/`, o desde el kit si alguien lo pegó).
- Cierre: récords en pantalla, qué hemos visto (bucle, física, colisiones,
  estados, vida, datos persistentes), docs de KAPLAY, agradecimientos y licencias.

### Modo emergencia (si el día se descuadra)

Orden de prioridad si se atrasa:

1. **A las 01:00 sin cerrar D2-1** → pegar los loads + el `add()` del jugador y las 4 llamadas de enemigos.
2. **A las 01:25 sin cerrar D2-2** → pegar D2-2 entero y explicarlo en 3 min.
3. **A las 01:40 sin cerrar D2-3** → pegar corazones + `danar` enteros.
4. **D2-5 (jefe) se salta como bloque** y vive solo en la demo del showcase.
   **Nunca se recorta D2-4 ni el showcase**: partículas y récord son el cierre emocional.

---

## Escaleras (base vs. extra)

|           | **Base (obligatorio)**                                                   | **Extra (si sobra tiempo)**                                                                    |
| --------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Día 1** | TODO 1–4: mover/saltar, enemigos+colisiones, marcador, sonidos y escenas | Retos de las 5 salas · `+100` flotante · ajuste del _feel_ de salto · `shake`/`flash`          |
| **Día 2** | D2-1 a D2-4 + showcase                                                   | D2-5 (jefe ⭐) · _squash/stretch_ al saltar · parallax (demo) · más plataformas     |

## Errores típicos (y qué responder)

| Síntoma                                   | Causa                                                               | Remedio                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Atraviesa las plataformas                 | Falta `area()` (jugador u objeto)                                   | `area()` es la caja de choque                                                                       |
| Va a distintas velocidades según portátil | Falta `dt()`                                                        | multiplicar por `dt()`                                                                              |
| Salta estando en el aire                  | Falta `if (isGrounded())`                                           | guardar el salto                                                                                    |
| No reacciona al teclado                   | Handler fuera de `scene("juego")` o tras un `go()`                  | `go()` borra los listeners de la escena                                                             |
| No carga (loader atascado)                | Sin internet para el CDN o Live Server no está sirviendo la carpeta | recargar; abrir `index.html` desde la carpeta con Live Server                                       |
| El texto se desborda                      | Sin anclaje                                                         | `pos(width()/2, y)` + `anchor("center")`                                                            |
| Sprite borroso o deformado                | Tamaño lejos del nativo                                             | acercar `width/height` al tamaño real (bean 61×53, zombean 61×53, gigagantrum 122×120, grass 64×64) |
| `lifespan()` no hace nada                 | Falta `opacity()`                                                   | añadir `opacity(1)`                                                                                 |

## Verificación final (5 min, al cierre de cada día)

**Día 1** — en el juego de cada equipo:

- [ ] Se mueve igual de rápido que el resto · salta solo en el suelo
- [ ] 4 enemigos patrullan y **reaparecen a los 2 s** · pisotón = enemigo fuera + 100 · lateral = game over
- [ ] Marcador `PUNTOS: x   META: 1000` al día · suena salto/pisotón/muerte
- [ ] **`PUNTOS: 1000` = victoria** (10 pisotones) · `R` reinicia
- [ ] En la presentación: `S` abre/cierra la solución de la sala (probado en clase)

**Día 2** — en el kit y en el mejor de los equipos:

- [ ] Sprites (bean/zombean) · nivel de 2560 px recorrido con la cámara · HUD `fixed`
- [ ] 3 corazones · daño con parpadeo (1 s de invulnerabilidad) · corazón cura
- [ ] Chispas al pisar · F5 y el récord persiste · `R` reinicia
- [ ] ⭐ Jefe (si alguien lo pegó): barra, proyectiles y 6 golpes = victoria; si no, demo del instructor
- [ ] En `presentacion-dia2/`: `S` abre/cierra la solución de la sala (probado en clase)

## Licencias del material

- **KAPLAY** (motor): licencia MIT.
- **Sprites y sonidos** (`assets/`): KAPLAY Crew (**CC0-1.0**) y Kenney.nl (**CC0** — dominio público). Uso y modificación libres, sin atribución obligatoria; se agradece mencionarlos al proyectar.
- **Fuente `happy.ttf`** (`assets/fonts/`): incluida con el material KAPLAY Crew.
- El código del taller (presentación, starter y soluciones) es material de curso: copiadlo, editadlo y reutilizadlo libremente.
