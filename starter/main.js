// starter/main.js
// TALLER KAPLAY · Día 1 — tu MVP desde cero.
//
// Este archivo arranca **funcionando**: tienes el escenario montado y cuatro
// TODOs que rellenar siguiendo la agenda. Si te pierdes, mira el código ya
// escrito (está comentado) y, sobre todo, la solución completa en
// ../solucion-dia1/main.js —mismo orden, mismos nombres.
//
// Orden de los TODOs = orden de la agenda del Día 1:
//   TODO 1  Físicas      (00:15 – 00:45)  jugador + salto
//   TODO 2  Game States  (00:45 – 01:25)  enemigos + colisiones
//   TODO 3  Puntuación   (01:25 – 01:40)  marcador con text()
//   TODO 4  Cierre       (01:40 – 02:00)  sonido + escenas de fin
//
// META del día: llegar a "PUNTOS: 1000" (10 pisotones de 100) → victoria.
// Los enemigos reaparecen a los 2 s, así que la pantalla nunca se vacía.
//
// Controles: A/D o flechas · ESPACIO saltar · R reiniciar

import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

// ------------------------------------------------------------------ setup
// YA HECHO: KAPLAY en modo carta 16:9. Si cambias width/height, cambia el
// canvas entero; letterbox pone barras para no deformar.
kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  background: [10, 12, 30],
  // YA HECHO: textos nítidos también en pantallas de alta densidad (evita el
  // "borroneado" que se ve si el lienzo se estira sin compensar).
  pixelDensity: Math.min(Math.max(window.devicePixelRatio || 1, 2), 3),
});

// YA HECHO: los assets viven en ../assets y se cargan antes de jugar.
loadRoot("../assets/");
loadFont("happy", "fonts/happy.ttf");
loadSound("jump", "sounds/jump.ogg");
loadSound("stomp", "sounds/stomp.ogg");
loadSound("hurt", "sounds/hurt.ogg");
loadSound("pickup", "sounds/pickup.ogg");
loadSound("victory", "sounds/victory.ogg");
loadSound("gameover", "sounds/gameover.ogg");

const COL = {
  fondo: "#0a0c1e",
  plataforma: "#2b3370",
  suelo: "#222a5c",
  jugador: "#5ee7ff",
  enemigo: "#ff5c8a",
  titulo: "#ffd166",
  bien: "#7cff6b",
  texto: "#dfe6ff",
};

// ==================================================================
scene("juego", () => {
  // YA HECHO: la gravedad tira de todo hacia abajo. Prueba a ponerla a 4800
  // y verás cómo el salto se vuelve perezoso: así se ajusta el "feel".
  setGravity(2400);

  let puntos = 0;
  let jugando = true;

  // 1. Mundo
  // YA HECHO: suelo + 4 plataformas. `body({ isStatic: true })` hace que
  // no caigan; `area()` es obligatorio si queremos chocar contra ellos.
  add([
    rect(1280, 60),
    pos(0, 660),
    color(COL.suelo),
    area(),
    body({ isStatic: true }),
    "suelo",
  ]);

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
      "plataforma",
    ]);
  }

  // 2. Jugador
  // YA HECHO: el objeto básico. rect() dibuja, area() da la caja de
  // colisión, body() hace que caiga, y "jugador" es su etiqueta.
  const jugador = add([
    rect(48, 60),
    pos(80, 560),
    color(COL.jugador),
    area(),
    body({ jumpForce: 1150 }),
    "jugador",
  ]);

  // TODO 1 · física (sala 2)
  // dt() son los segundos desde el último fotograma: sin él, la velocidad
  // depende de los FPS del portátil (habrá uno que vaya a 0,5×).
  //
  // Pista (esqueleto — descomenta cuando toque):
  //    const VELOCIDAD = 360;
  //    onKeyDown("d", () => { jugador.pos.x += VELOCIDAD * dt(); });
  //    onKeyDown("a", () => { jugador.pos.x -= VELOCIDAD * dt(); });
  //    onKeyPress("space", () => {
  //        if (jugador.isGrounded()) jugador.jump();
  //    });
  //    (también left/right y w/up, como en el esqueleto de la sala 2)
  //
  // Reto extra (feel): prueba jumpForce 900/1400 y gravedad 1800/3000.
  // (Los límites laterales ya están escritos más abajo, como red de
  // seguridad: no hace falta que los repitas.)

  // TODO 2 · estados (sala 3)
  // 1) Crea una función crearEnemigo(px, py, desde, hasta) que haga un
  //    rect de 44×44 con area(), body({ isStatic: true }) y la etiqueta
  //    "enemigo". Devuélvelo.
  // 2) Dale patrulla a mano en su onUpdate(): avanza `e.dir * e.velocidad
  //    * dt()` y rebota al llegar a `desde`/`hasta`.
  // 3) Llámala 4 veces: suelo izquierda, suelo derecha y dos plataformas.
  //    Suelo → y = 616 · plataforma 1 (y 525) → y = 481
  //    plataforma 3 (y 545) → y = 501
  // 4) PISOTÓN por solape, en un onUpdate dentro de crearEnemigo (tras la
  //    patrulla). Ojo: onCollide NO ve el aterrizaje vertical (KAPLAY lo
  //    resuelve sin disparar el choque), por eso se mira la geometría:
  //      const pies = jugador.pos.y + jugador.height;
  //      if (jugando && jugador.vel.y >= 0
  //        && jugador.pos.x < e.pos.x + e.width
  //        && jugador.pos.x + jugador.width > e.pos.x
  //        && pies > e.pos.y - 6 && pies < e.pos.y + e.height / 2) {
  //        // destruye, rebote… y reaparece a los 2 s:
  //        const py = e.pos.y, d = e.desde, h = e.hasta;
  //        e.destroy();
  //        wait(2, () => { if (!jugando) return;
  //          const lejos = jugador.pos.x < (d+h)/2 ? h : d;
  //          crearEnemigo(lejos, py, d, h); });   // vuelve lejos de ti
  //      }
  // 5) El choque de LADO sí llega por onCollide("jugador","enemigo", cb):
  //    pon jugando = false y go("gameover", puntos).
  // TODO 3 · puntos (sala 4)
  // 1) YA HECHO: el marcador de ahí abajo — text() + pos(24,16) + fixed()
  //    para que se quede pegado a la pantalla.
  // 2) Descomenta refrescarHud() y pon el formato final de la sala 4:
  //      hud.text = "PUNTOS: " + puntos + "   META: 1000"
  // 3) Cuando destruyas un enemigo (en el pisotón del TODO 2):
  //    puntos += 100; refrescarHud(); play("pickup");
  //    Extra: un text("+100") flotante con lifespan(0.8, { fade: 0.4 }).
  const hud = add([
    text("PUNTOS: 0   META: 1000", { size: 42, font: "happy" }),
    pos(24, 16),
    fixed(),
    color(COL.titulo),
    z(100),
  ]);
  // function refrescarHud() { hud.text = "PUNTOS: " + puntos + "   META: 1000"; }

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

  // TODO 4 · cierre (sala 5)
  // 1) play("jump") dentro del salto, play("stomp") al pisar,
  //    play("hurt") al chocar. Un sonido bien puesto vale 10 de diseño.
  // 2) VICTORIA — dentro del onCollide, después de sumar los puntos:
  //      if (puntos >= 1000) {
  //        jugando = false;
  //        play("victory");
  //        wait(0.9, () => go("victoria", puntos));
  //      }
  // 3) Al chocar de lado: play("hurt"), shake(12) y go("gameover", puntos).
  // 4) YA HECHO ahí debajo: R para reiniciar.
  //    Extra: shake(5) al pisar y flash("#ff2d55", 0.3) al morir.
  onKeyPress("r", () => go("juego"));

  // YA HECHO: red de seguridad — límites laterales y vuelta al mapa si
  // caes fuera. Ahora mismo el jugador ni puede salirse, pero si mueves
  // plataformas o quitas este bloque, esta línea te salva en la demo.
  jugador.onUpdate(() => {
    if (jugador.pos.x < 0) jugador.pos.x = 0;
    if (jugador.pos.x > 1280 - 48) jugador.pos.x = 1280 - 48;
    if (jugador.pos.y > 760) jugador.pos = vec2(80, 400);
  });
});

// escenas de fin
// YA HECHO: los dos destinos a los que llamarás con go(). Los argumentos
// llegan como parámetros: go("gameover", puntos) → scene recibe puntos.
scene("gameover", (puntos = 0) => {
  add([
    text("GAME OVER", { size: 96, font: "happy" }),
    pos(width() / 2, 250),
    anchor("center"),
    color(COL.enemigo),
  ]);
  add([
    text("PUNTOS: " + puntos, { size: 46, font: "happy" }),
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

scene("victoria", (puntos = 0) => {
  add([
    text("NIVEL SUPERADO", { size: 88, font: "happy" }),
    pos(width() / 2, 250),
    anchor("center"),
    color(COL.bien),
  ]);
  add([
    text("PUNTOS: " + puntos, { size: 46, font: "happy" }),
    pos(width() / 2, 360),
    anchor("center"),
    color(COL.titulo),
  ]);
  add([
    text("Mañana: sprites, parallax, vida y un jefe.   ·   R: jugar otra vez", {
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
