# Taller de KAPLAY · Snow Bros en 4 horas

Taller de desarrollo de juegos 2D con **[KAPLAY](https://kaplayjs.com)** (v3001 estable,
cargado por CDN). Se construye un juego tipo *Snow Bros* de una sola pantalla el
**Día 1** (MVP "feo" de rects y colores) y se sube de nivel el **Día 2**
(sprites, parallax, vida, ítems, jefe, partículas y récord local).

**Duración:** 4 h = 2 sesiones de 2 h · **Guion completo:** [`guion-taller.md`](guion-taller.md)
· **Estado y verificación:** [`ESTATUS-PROYECTO.md`](ESTATUS-PROYECTO.md)

---

## Requisitos

- **VS Code** con la extensión **Live Server**.
- **Navegador** (Chrome/Firefox/Edge) e **internet** la primera vez: KAPLAY se
  descarga desde `unpkg.com`. Los assets ya están en el repositorio.
- **No hace falta Node.js, npm ni nada más.** Solo HTML + JavaScript de módulos (+ CSS).

---

## Cómo ejecutarlo

1. Clona o copia el repositorio a un sitio local.
2. Abre la carpeta en VS Code.
3. Sobre cualquier `index.html`, click derecho → **Open with Live Server**
   (o *Go Live* de la barra de estado).

| Carpeta | Qué es | Cuándo |
|---|---|---|
| `presentacion/` | Juego-presentación: hub + 5 salas de teoría con retos y micro-demos jugables | Proyectado, Día 1 |
| `starter/` | Plantilla para los participantes: escenario montado + 4 TODOs | Día 1, equipos |
| `solucion-dia1/` | Solución del MVP del Día 1 | Referencia / plan B |
| `solucion-dia2/` | Solución completa del Día 2, con bloques etiquetados `▸ D2-n` (qué pegar y qué escribir) | Kit de bloques del Día 2 |
| `assets/` | Sprites (34 PNG), sonidos (14) y fuente | Ya descargados, sin red |
| `guion-taller.md` | Guion del instructor: agendas, checkpoints, escaleras y plan B por bloque | Antes de impartir |
| `ESTATUS-PROYECTO.md` | Informe de estado y verificación del proyecto | — |
| `smoke.cjs` | Prueba de humo (Playwright) — **opcional** | Solo si quieres automatizar |

## Controles

- **A/D o ←/→** mover · **ESPACIO** saltar · **R** reiniciar
- En la presentación: **1–5** para ir directo a cada sala · **S** abre/cierra la
  **solución del bloque** (ESC la cierra o vuelve al mapa) · **ESPACIO/A/D** para
  los micro-demos (las flechas navegan entre salas)
- **Objetivo del Día 1:** `PUNTOS: 1000` → victoria (10 pisotones de 100; los
  enemigos reaparecen a los 2 s; chocar de lado = game over)

## El taller en una línea

- **Día 1 (2 h):** TODO 1 física (`dt()`, `body()`, `isGrounded()`) → TODO 2 tags y
  `onCollide` (patrulla con reaparición, pisotón vs. choque lateral) → TODO 3 marcador
  con `text()` y META 1000 → TODO 4 sonidos y victoria con `puntos >= 1000`.
  Cada TODO encaja con una franja de la agenda.
- **Día 2 (2 h):** bloques guiados D2-1 a D2-6 — sprites + `anchor("bot")`/`col.isBottom()`,
  mundo de 2560 px con cámara y parallax, `health()` + ítem curativo, jefe con
  proyectiles, partículas y récord con `getData`/`setData`, y showcase final.

## Prueba de humo (opcional)

`smoke.cjs` navega las cuatro páginas con Playwright, pulsa teclas, comprueba
errores de consola/red y guarda capturas en `/tmp/shots/`. **No es necesario para
el taller**: los participantes solo necesitan navegador y Live Server.

Requiere Node.js y Playwright instalado (ajusta la ruta `require` del archivo a tu
entorno):

```bash
# servir el repo
python3 -m http.server 8123

# ejecutar (filtro opcional por carpeta)
node smoke.cjs http://127.0.0.1:8123
node smoke.cjs http://127.0.0.1:8123 solucion-dia2
```

## Licencias

- **KAPLAY**: MIT.
- **Sprites y sonidos**: KAPLAY Crew (CC0-1.0) y Kenney.nl (CC0) — dominio público.
- **Código del taller** (presentación, starter, soluciones y guion): material de
  curso, libre de usar y modificar.
