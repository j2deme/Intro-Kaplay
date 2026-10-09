// solucion-dia2-lite/main.js
// KIT DÍA 2 (versión reducida) — el MVP del Día 1 crece con sprites, un
// mundo grande, vidas, partículas y récord, sobre los patrones que ya
// dominas: mismos nombres (sumar, pisar, refrescarHud) y el pisotón
// geométrico que ya funciona.
//
// MAPA DE BLOCES = agenda del Día 2 (2 h). Cada bloque está marcado en el
// archivo con su etiqueta "▸ D2-n". Regla de tiempo: lo que dice PEGAR se
// copia tal cual y se explica (3–7 min); lo que dice escribir lo teclean
// los equipos dentro de su franja. Si un bloque se pasa de su marca, se pega.
//
//   (00:00–00:15) Cierre D1 — HUD + choque lateral, en TU archivo.
//   D2-1  00:15–00:40  Sprites ................. loads + rect→sprite     [escribir]
//   D2-2  00:40–01:00  Mundo y cámara .......... suelo ancho + cámara    [PEGAR]
//   D2-3  01:00–01:25  Vida y daño ............. health + corazones      [escribir/PEGAR]
//   D2-4  01:25–01:40  Partículas y récord ..... estallar + localStorage [PEGAR]
//   D2-5  01:40–01:50  ⭐ Jefe (opcional) ....... jefe + proyectiles     [PEGAR]
//   D2-6  01:50–02:00  Showcase ................ jugar y enseñar
//
// Controles: A/D o flechas · ESPACIO saltar · R reiniciar
// Este kit arranca jugable tal cual (es tu demo en vivo); a los equipos les
// sirve de fuente de copia para su propio archivo del Día 1.

import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

// ------------------------------------------------------------------ setup
kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  background: [10, 12, 30],
  pixelDensity: Math.min(Math.max(window.devicePixelRatio || 1, 2), 3),
});

// ---------------------------------------------------------------- assets
// YA HECHO: los assets viven en ../assets y se cargan antes de jugar.
loadRoot("../assets/");
loadFont("happy", "fonts/happy.ttf");

// ▸ D2-1 · Sprites (00:15 – 00:40) · escribir: copia esta lista de loads.
//   Cada sprite es un PNG de ../assets/sprites. "bean" es tu jugador,
//   "zombean" el enemigo, "grass" el bloque de hierba, "heart" el corazón
//   y "sparkles" la textura con la que estallan las partículas.
for (const nombre of ["bean", "zombean", "grass", "heart", "sparkles"]) {
  loadSprite(nombre, "sprites/" + nombre + ".png");
}
// ▸ D2-5 · solo los equipos con jefe cargan este:
loadSprite("gigagantrum", "sprites/gigagantrum.png");

loadSound("jump", "sounds/jump.ogg");
loadSound("stomp", "sounds/stomp.ogg");
loadSound("hurt", "sounds/hurt.ogg");
loadSound("pickup", "sounds/pickup.ogg");
loadSound("heal", "sounds/heal.ogg");
loadSound("victory", "sounds/victory.ogg");
loadSound("gameover", "sounds/gameover.ogg");
// ▸ D2-5 · jefe:
loadSound("projectile", "sounds/projectile.ogg");
loadSound("bosshit", "sounds/boss-hit.ogg");

const COL = {
  fondo: "#0a0c1e",
  plataforma: "#2b3370",
  suelo: "#222a5c",
  jugador: "#e69e10",
  enemigo: "#ff5c8a",
  titulo: "#ffd166",
  bien: "#7cff6b",
  texto: "#dfe6ff",
};

// ▸ D2-2 · el mundo ahora es más ancho que la pantalla: la cámara viaja.
const ANCHO_MUNDO = 2560;
const SUELO_Y = 660;
// ▸ D2-4 · clave donde vive el récord (localStorage entre sesiones).
const RECORD_KEY = "taller-record";

// ==================================================================
scene("juego", () => {
  setGravity(2400);

  let puntos = 0;
  let jugando = true;
  // ▸ D2-3 · mientras invulnerable no recibes daño (y el sprite parpadea).
  let invulnerable = false;
  let blinkTime = 0;

  // 1. Mundo — ▸ D2-2 · Mundo (00:40 – 01:00) · PEGAR:
  //    el suelo ya no mide 1280 (una pantalla): mide ANCHO_MUNDO.
  add([
    rect(ANCHO_MUNDO, 60),
    pos(0, SUELO_Y),
    color(COL.suelo),
    area(),
    body({ isStatic: true }),
    z(0),
    "suelo",
  ]);

  // El sprite "grass" es un bloque de 64×64 (hierba arriba, tierra abajo).
  // Lo mozaicamos tile a tile en vez de estirarlo: estirado, la línea
  // ondulada del borde se convierte en escalones gigantes.
  function techoDeHierba(x, y, ancho, alto, profundidad) {
    for (let gx = x; gx < x + ancho; gx += 64) {
      add([
        sprite("grass", { width: Math.min(64, x + ancho - gx), height: alto }),
        pos(gx, y),
        z(profundidad),
      ]);
    }
  }
  // El borde superior del bloque coincide con el borde del colisionador:
  // los pies del jugador quedan justo sobre el verde.
  techoDeHierba(0, SUELO_Y, ANCHO_MUNDO, 60, 1);

  const PLATAFORMAS = [
    [130, 525, 300],
    [520, 415, 280],
    [930, 545, 260],
    [380, 300, 260],
  ];
  for (const [x, y, w] of PLATAFORMAS) {
    add([
      rect(w, 24),
      pos(x, y),
      color(COL.plataforma),
      area(),
      body({ isStatic: true }),
      z(2),
      "plataforma",
    ]);
    // Su pastito: ancla visual de la plataforma (el colisionador es el rect).
    techoDeHierba(x, y, w, 64, 3);
  }

  // 2. Jugador — ▸ D2-1 · Sprites (00:15 – 00:40) · escribir:
  //    rect(48, 60) + color(...) pasa a ser sprite("bean"). ¡Eso es todo!
  //    area() ahora mide el sprite (61×53) y el resto del código no cambia:
  //    el pisotón usa e.width/e.height, no números mágicos.
  const jugador = add([
    sprite("bean"),
    pos(80, 560),
    area(),
    body({ jumpForce: 1150 }),
    z(10),
    "jugador",
    // ▸ D2-3 · Vida (01:00 – 01:25) · escribe: 3 vidas, una por corazón.
    health(3, 3),
  ]);

  // 3. Controles — el mismo bloque del Día 1, con el sonido del salto
  //    (el detalle del TODO 4 que quedó pendiente de ayer).
  const VELOCIDAD = 360;
  onKeyDown("d", () => {
    jugador.pos.x += VELOCIDAD * dt();
  });
  onKeyDown("right", () => {
    jugador.pos.x += VELOCIDAD * dt();
  });
  onKeyDown("a", () => {
    jugador.pos.x -= VELOCIDAD * dt();
  });
  onKeyDown("left", () => {
    jugador.pos.x -= VELOCIDAD * dt();
  });
  onKeyPress("space", () => {
    if (jugador.isGrounded()) {
      jugador.jump();
      play("jump");
    }
  });
  onKeyPress("up", () => {
    if (jugador.isGrounded()) {
      jugador.jump();
      play("jump");
    }
  });

  // ▸ D2-2 · Cámara (00:40 – 01:00) · PEGAR: sigue al jugador y no se
  //    sale del mundo. clamp() deja su centro siempre dentro de
  //    [mitad de pantalla, fin del mundo].
  add([pos(0, 0)]).onUpdate(() => {
    setCamPos(
      clamp(jugador.pos.x + jugador.width / 2, 640, ANCHO_MUNDO - 640),
      360
    );
  });

  // 4. HUD — el marcador del Día 1, más los corazones de vida.
  const hud = add([
    text("PUNTOS: 0   META: 1000", { size: 42, font: "happy" }),
    pos(24, 16),
    fixed(),
    color(COL.titulo),
    z(100),
  ]);

  // ▸ D2-3 · Corazones (01:00 – 01:25) · escribe: tres corazones pegados
  //    debajo del marcador. Su opacidad la manda refrescarHud: el que
  //    falta se ve apagado, no desaparece (así siempre sabes cuántas vidas
  //    te quedan, también en la última).
  const corazones = [];
  for (let i = 0; i < 3; i++) {
    corazones.push(
      add([
        sprite("heart"),
        pos(24 + i * 44, 64),
        fixed(),
        z(100),
      ])
    );
  }

  // El refrescarHud del Día 1 (aquí ya descomentado y en marcha), ahora
  // con los corazones dentro: una sola función refresca TODO el HUD.
  function refrescarHud() {
    hud.text = "PUNTOS: " + puntos + "   META: 1000";
    const vida = jugador.hp();
    corazones.forEach((corazon, i) => {
      corazon.opacity = i < vida ? 1 : 0.22;
    });
  }

  const ayuda = add([
    text("A/D o flechas: mover   ·   ESPACIO: saltar   ·   R: reiniciar", {
      size: 22,
    }),
    pos(24, 686),
    fixed(),
    color(COL.texto),
    opacity(0.75),
    z(100),
  ]);

  // ▸ D2-4 · Récord (01:25 – 01:40) · PEGAR: dos helpers sobre
  //    getData/setData, que son las versiones de KAPLAY de localStorage.
  //    El récord sobrevive a cerrar la pestaña: es "su" partida.
  function leerRecord() {
    return Number(getData(RECORD_KEY) ?? 0);
  }
  function guardaRecord(puntosNuevos) {
    const anterior = leerRecord();
    if (puntosNuevos > anterior) setData(RECORD_KEY, puntosNuevos);
    return Math.max(anterior, puntosNuevos);
  }

  // ▸ D2-4 · Partículas (01:25 – 01:40) · PEGAR: estallar(px, py,
  //    cuántas, colores) suelta chispas con la textura "sparkles" en el
  //    punto que le pases. La usan pisar(), sumar() y el corazón.
  function estallar(px, py, cantidad, colores) {
    const spriteData = getSprite("sparkles");
    const emisor = add([
      pos(px, py),
      particles({
        max: 80,
        texture: spriteData.data.tex,
        speed: [70, 240],
        lifeTime: [0.35, 0.85],
        colors: colores.map((c) => rgb(c)),
        opacities: [1, 0],
        scales: [1.6, 0.3],
        angle: [0, 360],
        angularVelocity: [-240, 240],
      }, { direction: 0, spread: 180 }),
      z(20),
    ]);
    emisor.emit(cantidad);
    wait(1.3, () => {
      if (emisor.exists()) emisor.destroy();
    });
  }

  // 5. Puntos — el sumar del Día 1 (con refrescarHud ya en marcha) más
  //    dos añadidos del D2-4: récord y chispas.
  function sumar(n, px, py) {
    puntos += n;
    refrescarHud();
    guardaRecord(puntos); // ▸ D2-4: ¿récord nuevo? guárdalo ya.
    play("pickup");
    estallar(px, py, 12, ["#ff5c8a", "#ffd166"]); // ▸ D2-4: chispas al puntuar.
    const f = add([
      text("+" + n, { size: 34, font: "happy" }),
      pos(px, py),
      anchor("center"),
      color(COL.bien),
      opacity(1),
      lifespan(0.8, { fade: 0.4 }),
      z(90),
    ]);
    f.onUpdate(() => {
      f.pos.y -= 70 * dt();
    });
  }

  // 6. Colisiones — la condición geométrica del Día 1, intacta.
  function pisandolo(j, e) {
    return j.vel.y >= 0 && j.pos.y + j.height < e.pos.y + e.height / 2;
  }

  // Destruye al enemigo pisado: puntos, chispas, rebote y reaparece a 2 s.
  function pisar(e) {
    const px = e.pos.x,
      py = e.pos.y;
    const d = e.desde,
      h = e.hasta;
    e.destroy();
    sumar(100, px, py - 30);
    estallar(px + 30, py + 26, 16, ["#ffd166", "#7cff6b"]);
    play("stomp");
    shake(5);
    jugador.jump(700); // rebote corto al pisar
    wait(2, () => {
      if (!jugando) return;
      const lejos = jugador.pos.x < (d + h) / 2 ? h : d; // vuelve lejos de ti
      crearEnemigo(lejos, py, d, h);
    });
    if (puntos >= 1000) {
      // ← META: 10 pisotones, igual que el Día 1.
      jugando = false;
      play("victory");
      const recordFinal = guardaRecord(puntos); // ▸ D2-4
      wait(0.9, () => go("victoria", puntos, recordFinal));
    }
  }

  // Enemigo — ▸ D2-1 · Sprites: rect(44, 44) + color(...) pasa a ser
  // sprite("zombean"). OJO: el sprite mide 61×53 (la caja cambió), por eso
  // la "y" de cada llamada es ahora "borde de la superficie − 53".
  function crearEnemigo(px, py, desde, hasta) {
    const e = add([
      sprite("zombean"),
      pos(px, py),
      area(),
      body({ isStatic: true }), // no cae: patrulla a mano
      { dir: 1, velocidad: 130, desde, hasta },
      z(5),
      "enemigo",
    ]);
    // Patrulla: avanza y rebota en los límites que le pasamos.
    e.onUpdate(() => {
      e.pos.x += e.dir * e.velocidad * dt();
      if (e.pos.x <= e.desde || e.pos.x >= e.hasta) {
        e.dir *= -1;
        e.pos.x = clamp(e.pos.x, e.desde, e.hasta);
      }
      // PISOTÓN (Día 1, intacto): KAPLAY no dispara onCollide en el
      // aterrizaje vertical (lo resuelve sin evento), así que lo miramos
      // aquí, cada frame: solape horizontal + pies por encima del centro.
      const pies = jugador.pos.y + jugador.height;
      if (
        jugando &&
        jugador.exists() &&
        jugador.vel.y >= 0 &&
        jugador.pos.x < e.pos.x + e.width &&
        jugador.pos.x + jugador.width > e.pos.x &&
        pies > e.pos.y - 6 &&
        pies < e.pos.y + e.height / 2
      ) {
        pisar(e);
      }
    });
    return e;
  }

  // Suelo y plataformas. Fíjate en la "y": borde superior − 53 (alto).
  crearEnemigo(140, 607, 60, 460); // suelo izquierda   (660 − 53)
  crearEnemigo(860, 607, 720, 1220); // suelo derecha
  crearEnemigo(200, 472, 130, 360); // plataforma 1      (525 − 53)
  crearEnemigo(1000, 492, 930, 1120); // plataforma 3     (545 − 53)

  // ▸ D2-3 · Daño e invulnerabilidad (01:00 – 01:25) · PEGAR y explicar:
  //    el choque de LADO deja de ser muerte y pasa a ser −1 vida. Si
  //    quedan vidas, sigues jugando con 1 s de invulnerabilidad (el
  //    parpadeo). Este es el bloque que convierte el hueco del onCollide
  //    del Día 1 en diseño de juego.
  function danar(cantidad, origenX) {
    if (!jugando || invulnerable) return;
    jugador.hurt(cantidad);
    invulnerable = true;
    blinkTime = 0;
    // Empujoncito hacia el lado contrario del golpe: en plataformas esto
    // te salva de caer al vacío.
    const empuje = jugador.pos.x < origenX ? -90 : 90;
    jugador.pos.x = clamp(
      jugador.pos.x + empuje,
      0,
      ANCHO_MUNDO - jugador.width
    );
    jugador.jump(320);
    play("hurt");
    shake(8);
    flash("#ff2d55", 0.22);
    refrescarHud();
    if (jugador.hp() <= 0) {
      // Última vida: ahí sí, game over (con el récord bajo el brazo).
      jugando = false;
      const recordFinal = guardaRecord(puntos);
      wait(0.5, () => go("gameover", puntos, recordFinal));
      return;
    }
    wait(1, () => {
      invulnerable = false;
      blinkTime = 0;
    });
  }

  // El choque lateral: el único que llega por onCollide. Si el solape es
  // de cabeza (pisandolo), lo ignoramos — el pisotón lo resuelve el
  // onUpdate de arriba; sin este guard, un enemigo que se te escapa de
  // debajo te castigaría en lugar de dejarte pisotearlo.
  onCollide("jugador", "enemigo", (j, e) => {
    if (!e.exists() || !jugando) return;
    if (pisandolo(j, e)) return;
    danar(1, e.pos.x);
  });

  // ▸ D2-3 · Corazón flotante (01:00 – 01:25) · PEGAR: un corazón sobre
  //    la plataforma 2 que devuelve 1 vida al tocarlo. La senoide de su
  //    onUpdate es lo que lo hace flotar.
  const CORAZON_Y = 356;
  const corazonItem = add([
    sprite("heart"),
    pos(640, CORAZON_Y),
    area(),
    z(9),
    "item-vida",
  ]);
  let ondaCorazon = 0;
  corazonItem.onUpdate(() => {
    ondaCorazon += dt() * 2.4;
    corazonItem.pos.y = CORAZON_Y + Math.sin(ondaCorazon) * 8;
  });
  jugador.onCollide("item-vida", (item) => {
    if (!jugando || !item.exists()) return;
    const px = item.pos.x,
      py = item.pos.y;
    item.destroy();
    if (jugador.hp() < jugador.maxHP()) {
      jugador.heal(1);
      play("heal");
    } else {
      play("pickup"); // ya estás a tope: igualmente celebra
    }
    estallar(px, py, 18, ["#ff5c8a", "#ffd166", "#ffffff"]);
    refrescarHud();
  });

  // Red de seguridad (Día 1, actualizada al mundo ancho) + el parpadeo
  // ▸ D2-3 de la invulnerabilidad.
  jugador.onUpdate(() => {
    if (jugador.pos.x < 0) jugador.pos.x = 0;
    if (jugador.pos.x > ANCHO_MUNDO - jugador.width)
      jugador.pos.x = ANCHO_MUNDO - jugador.width;
    if (jugador.pos.y > 760)
      jugador.pos = vec2(clamp(jugador.pos.x, 60, ANCHO_MUNDO - 60), 400);
    if (invulnerable) {
      blinkTime += dt();
      jugador.opacity = Math.floor(blinkTime * 14) % 2 === 0 ? 0.35 : 1;
    } else {
      jugador.opacity = 1;
    }
  });

  onKeyPress("r", () => go("juego"));

  // =========================================================== ⭐ JEFE
  // ▸ D2-5 · Jefe (01:40 – 01:50) · PEGAR solo si vas avanzado —
  //    requiere D2-3 (danar) y D2-4 (estallar). Si no llegáis, lo veis
  //    funcionando en el showcase: está en ../solucion-dia2/.
  let enfriamiento = 0; // no apales: un golpe por rebote
  let jefeDerrotado = false;

  const jefe = add([
    sprite("gigagantrum"),
    pos(2300, 540), // suelo 660 − 120 (alto del sprite)
    area(),
    body({ isStatic: true }), // no cae: patrulla a mano
    health(6, 6),
    { dir: -1, velocidad: 70, desde: 2150, hasta: 2400 },
    z(5),
    "jefe",
  ]);

  // Su barra de vida, arriba a la derecha (fixed: no se mueve con la cámara).
  const barraFondo = add([
    rect(240, 18),
    pos(1016, 24),
    color("#3a1420"),
    outline(3, "#ffd166"),
    fixed(),
    z(100),
  ]);
  const barraVida = add([
    rect(240, 18),
    pos(1016, 24),
    color("#ff2d55"),
    fixed(),
    z(101),
  ]);
  add([
    text("JEFE", { size: 20, font: "happy" }),
    pos(946, 20),
    fixed(),
    color(COL.titulo),
    z(102),
  ]);
  function actualizarBarraJefe() {
    barraVida.width = 240 * Math.max(0, jefe.hp() / jefe.maxHP());
  }

  jefe.onUpdate(() => {
    // Patrulla, igual que los enemigos.
    jefe.pos.x += jefe.dir * jefe.velocidad * dt();
    if (jefe.pos.x <= jefe.desde || jefe.pos.x >= jefe.hasta) {
      jefe.dir *= -1;
      jefe.pos.x = clamp(jefe.pos.x, jefe.desde, jefe.hasta);
    }
    // Mismo pisotón geométrico que los enemigos, con enfriamiento.
    const pies = jugador.pos.y + jugador.height;
    if (
      enfriamiento <= 0 &&
      jugando &&
      jugador.exists() &&
      jugador.vel.y >= 0 &&
      jugador.pos.x < jefe.pos.x + jefe.width &&
      jugador.pos.x + jugador.width > jefe.pos.x &&
      pies > jefe.pos.y - 6 &&
      pies < jefe.pos.y + jefe.height / 2
    ) {
      golpeAlJefe();
    }
    enfriamiento = Math.max(0, enfriamiento - dt());
  });

  function golpeAlJefe() {
    if (!jugando || jefeDerrotado) return;
    enfriamiento = 0.35; // un golpe por rebote: no le apales en el aire
    jefe.hurt(1);
    play("bosshit");
    shake(6);
    estallar(jefe.pos.x + 60, jefe.pos.y + 60, 12, ["#ff5c8a", "#ffd166"]);
    sumar(50, jefe.pos.x + 30, jefe.pos.y - 20);
    jugador.jump(700); // te rebota igual que un enemigo
    actualizarBarraJefe();
    if (jefe.hp() <= 0) {
      jefeDerrotado = true;
      jugando = false;
      const px = jefe.pos.x + 60,
        py = jefe.pos.y + 60;
      jefe.destroy();
      for (const p of get("proyectil")) p.destroy();
      loopProyectiles.cancel();
      barraFondo.destroy();
      barraVida.destroy();
      estallar(px, py, 50, ["#ff5c8a", "#ffd166", "#5ee7ff"]);
      const recordFinal = guardaRecord(puntos);
      play("victory");
      wait(0.9, () => go("victoria", puntos, recordFinal));
    }
  }

  // Proyectil: sale del jefe hacia donde estás tú y dura 3 s.
  function dispararProyectil() {
    if (!jugando || jefeDerrotado || !jefe.exists()) return;
    const dir = jugador.pos.x < jefe.pos.x ? -1 : 1;
    add([
      rect(24, 14, { radius: 6 }),
      pos(jefe.pos.x + dir * 90, jefe.pos.y + 90),
      anchor("center"),
      color("#ffb347"),
      area(),
      move(vec2(dir, 0), 400),
      rotate(dir < 0 ? 180 : 0),
      opacity(1),
      lifespan(3, { fade: 0.5 }),
      z(12),
      "proyectil",
    ]);
    play("projectile");
  }
  const loopProyectiles = loop(1.5, dispararProyectil);

  onCollide("jugador", "proyectil", (j, p) => {
    if (!p.exists() || !jugando) return;
    const px = p.pos.x,
      py = p.pos.y;
    p.destroy();
    danar(1, px);
    estallar(px, py, 10, ["#ffb347", "#ff2d55"]);
  });

  // El jefe de lado también duele; el pisotón lo resolvió golpeAlJefe().
  jugador.onCollide("jefe", () => {
    if (!jugando || jefeDerrotado || enfriamiento > 0) return;
    danar(1, jefe.pos.x);
  });

  // Estado inicial de marcador y corazones.
  refrescarHud();
});

// ---------------------------------------------------------- escenas de fin
// ▸ D2-4 · ambas escenas reciben el récord y lo enseñan: el objetivo ya
//    no es solo "llegar a 1000", es "mejorar tu propio récord".
scene("gameover", (puntos = 0, record = 0) => {
  add([
    text("GAME OVER", { size: 96, font: "happy" }),
    pos(width() / 2, 250),
    anchor("center"),
    color(COL.enemigo),
  ]);
  add([
    text("PUNTOS: " + puntos + "   RÉCORD: " + record, {
      size: 46,
      font: "happy",
    }),
    pos(width() / 2, 360),
    anchor("center"),
    color(COL.titulo),
  ]);
  add([
    text("Pulsa R para reintentar", { size: 30 }),
    pos(width() / 2, 450),
    anchor("center"),
    color(COL.texto),
  ]);
  onKeyPress("r", () => go("juego"));
  onKeyPress("enter", () => go("juego"));
});

scene("victoria", (puntos = 0, record = 0) => {
  add([
    text("NIVEL SUPERADO", { size: 88, font: "happy" }),
    pos(width() / 2, 250),
    anchor("center"),
    color(COL.bien),
  ]);
  add([
    text("PUNTOS: " + puntos + "   RÉCORD: " + record, {
      size: 46,
      font: "happy",
    }),
    pos(width() / 2, 360),
    anchor("center"),
    color(COL.titulo),
  ]);
  add([
    text("Sprites, vida, mundo grande y partículas: todo tuyo.   ·   R: otra vez", {
      size: 26,
    }),
    pos(width() / 2, 450),
    anchor("center"),
    color(COL.texto),
  ]);
  onKeyPress("r", () => go("juego"));
  onKeyPress("enter", () => go("juego"));
});

go("juego");

// --------------------------------------------------------------- loader
const timerLoader = setInterval(() => {
  if (loadProgress() >= 1) {
    document.getElementById("loader")?.classList.add("hide");
    clearInterval(timerLoader);
  }
}, 100);
setTimeout(() => {
  document.getElementById("loader")?.classList.add("hide");
  clearInterval(timerLoader);
}, 6000);
