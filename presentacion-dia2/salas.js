// presentacion-dia2/salas.js
// Contenido de las 6 salas del Día 2 (versión reducida).
// Cada sala: 2 paneles de teoría (~30-40 palabras), 1 reto extra, 1 snippet
// copiable y la ficha de DEMO EN VIVO (el instructor la demuestra desde
// ../solucion-dia2-lite/, no hay micro-demo jugable propia).
//
// Agenda: recap cierra el D1 · D2-1 sprites · D2-2 mundo/cámara ·
// D2-3 vida/daño · D2-4 partículas/récord · D2-5⭐ jefe + showcase.

export const PALETA = {
    fondo: [10, 12, 30],
    panelBg: "#171b3d",
    panelBorder: "#33407e",
    titulo: "#ffd166",
    cuerpo: "#dfe6ff",
    acento: "#5ee7ff",
    codigoBg: "#0a0d22",
    texto: "#cfe0ff",
    enemigo: "#ff5c8a",
    bien: "#7cff6b",
};

export const SALAS = [
    // -------------------------------------------------------------- 1
    {
        titulo: "Recap · Cierra tu partida",
        hora: "00:00 – 00:15",
        paneles: [
            {
                t: "Los dos huecos de ayer",
                b: "El marcador no subía y el choque lateral no existía. Cerrarlos hoy es el prerequisito del Día 2: el HUD acogerá corazones y récord, y ese choque pasará a restar vida.",
            },
            {
                t: "Cómo se cierra",
                b: "Descomenta refrescarHud() y llámala dentro de sumar(). El choque de lado vive en onCollide: el de arriba es geométrico y no lo tocas. Pórtate con play, shake y flash.",
            },
        ],
        reto: "Retos · consigue 300 puntos viendo el marcador subir sin recargar; después choca de lado y confirma GAME OVER con sonido, shake y flash.",
        snippetDonde: "SNIPPET · en tu archivo: refrescarHud + onCollide tras crearEnemigo",
        codigo: `// 1) descomenta refrescarHud() y llámala en sumar():
function refrescarHud() {
  hud.text = "PUNTOS: " + puntos + "   META: 1000";
}
// 2) choque lateral — justo TRAS crearEnemigo(...):
onCollide("jugador", "enemigo", (j, e) => {
  if (!e.exists() || !jugando) return;
  if (pisandolo(j, e)) return;   // el aterrizaje ya lo resolvió
  jugando = false;
  play("hurt"); shake(12);
  flash("#ff2d55", 0.3);
  wait(0.7, () => go("gameover", puntos));
});`,
        solucion: `// SOLUCIÓN recap — tu archivo, dentro de scene("juego")
// 1) HUD: marcador que se refresca solo
function refrescarHud() {
  hud.text = "PUNTOS: " + puntos + "   META: 1000";
}
// dentro de sumar(), tras puntos += n:
refrescarHud();

// 2) choque lateral (tras las llamadas a crearEnemigo)
onCollide("jugador", "enemigo", (j, e) => {
  if (!e.exists() || !jugando) return;
  if (pisandolo(j, e)) return;
  jugando = false;
  play("hurt");
  shake(12);
  flash("#ff2d55", 0.3);
  wait(0.7, () => go("gameover", puntos));
});

// reto: sonido del salto, solo si pisa suelo
onKeyPress("space", () => {
  if (jugador.isGrounded()) { jugador.jump(); play("jump"); }
});`,
        demoTitulo: "el recap en tu archivo",
        pasos: [
            "Abre tu main.js (el del Día 1).",
            "Descomenta refrescarHud y su llamada en sumar().",
            "Pega el onCollide de choque lateral tras crearEnemigo.",
            "Juega: el +100 se ve al instante; chocar de lado mata.",
        ],
    },
    // -------------------------------------------------------------- 2
    {
        titulo: "D2-1 · Sprites",
        hora: "00:15 – 00:40",
        paneles: [
            {
                t: "Tu rect, con cara",
                b: "loadSprite registra un PNG y sprite('bean') dibuja donde iba rect(). El resto no cambia: area() se ajusta al PNG y tus fórmulas usan width/height, que un sprite también tiene.",
            },
            {
                t: "La y se recalcula",
                b: "El sprite mide 61×53 y tu rect era 48×60: la caja cambió. Cada enemigo se apoya en «borde de la superficie − 53». Patrulla y pisotón siguen idénticos.",
            },
        ],
        reto: "Retos · carga 'coin' y pon tres monedas con area() que sumen 50 al tocarlas por onCollide, con su chispa de pickup.",
        snippetDonde: "SNIPPET · copia la lista de loads y cambia rect → sprite",
        codigo: `// tras loadRoot("../assets/"):
for (const nombre of ["bean", "zombean", "grass", "heart", "sparkles"]) {
  loadSprite(nombre, "sprites/" + nombre + ".png");
}
// TU JUGADOR — el rect(48,60)+color pasa a:
const jugador = add([
  sprite("bean"),   // en vez de rect(48, 60), color(COL.jugador)
  pos(80, 560), area(), body({ jumpForce: 1150 }), "jugador",
]);
// ENEMIGOS — y = borde superior − 53 (61×53):
crearEnemigo(140, 607, 60, 460);      // suelo (660 − 53)
crearEnemigo(200, 472, 130, 360);     // plat. 1 (525 − 53)`,
        solucion: `// SOLUCIÓN D2-1 — loads + rect → sprite
loadRoot("../assets/");
loadFont("happy", "fonts/happy.ttf");
for (const nombre of ["bean", "zombean", "grass", "heart", "sparkles"]) {
  loadSprite(nombre, "sprites/" + nombre + ".png");
}

const jugador = add([
  sprite("bean"),
  pos(80, 560),
  area(),
  body({ jumpForce: 1150 }),
  "jugador",
]);

// y = borde de la superficie − 53 (alto del sprite)
crearEnemigo(140, 607, 60, 460);     // suelo izquierda
crearEnemigo(860, 607, 720, 1220);   // suelo derecha
crearEnemigo(200, 472, 130, 360);    // plataforma 1 (525 − 53)
crearEnemigo(1000, 492, 930, 1120);  // plataforma 3 (545 − 53)

// RETO — monedas:
// loadSprite("coin", "sprites/coin.png");
// const m = add([sprite("coin"), pos(x, y), area(), "moneda"]);
// jugador.onCollide("moneda", (m) => {
//   const px = m.pos.x, py = m.pos.y;
//   m.destroy(); sumar(50, px, py); play("pickup");
// });`,
        demoTitulo: "sprites en el kit",
        pasos: [
            "Abre solucion-dia2-lite y pulsa R: mismo código, otra cara.",
            "En tu archivo: copia la lista de loads.",
            "Cambia rect → sprite en jugador y en crearEnemigo.",
            "Ajusta la «y» de los 4 enemigos (borde − 53).",
        ],
    },
    // -------------------------------------------------------------- 3
    {
        titulo: "D2-2 · Mundo y cámara",
        hora: "00:40 – 01:00",
        paneles: [
            {
                t: "De pantalla a nivel",
                b: "ANCHO_MUNDO = 2560: el suelo y la hierba se extienden por todo el nivel. techoDeHierba mozaica el bloque de 64 px en vez de estirarlo, que es como se ve bien la línea ondulada.",
            },
            {
                t: "La cámara te sigue",
                b: "setCamPos con clamp() dentro de un onUpdate ancla al jugador al centro sin salirse del mundo. El HUD lleva fixed() para no viajar con la cámara.",
            },
        ],
        reto: "Retos · añade una quinta plataforma entre x1500 y x1900 con su enemigo, y comprueba que la cámara no se asoma a los bordes.",
        snippetDonde: "SNIPPET · PEGAR en «1. Mundo» (sustituye el suelo viejo)",
        codigo: `const ANCHO_MUNDO = 2560;   // 2 pantallas y media
// el suelo, ahora de todo el mundo:
add([rect(ANCHO_MUNDO, 60), pos(0, 660), color(COL.suelo),
     area(), body({ isStatic: true }), "suelo"]);
// hierba mosaico encima (borde = colisionador):
for (let gx = 0; gx < ANCHO_MUNDO; gx += 64)
  add([sprite("grass", { width: 64, height: 60 }), pos(gx, 660), z(1)]);
// cámara — va justo DESPUÉS de crear al jugador:
add([pos(0, 0)]).onUpdate(() => {
  setCamPos(clamp(jugador.pos.x + jugador.width / 2,
    640, ANCHO_MUNDO - 640), 360);
});`,
        solucion: `// SOLUCIÓN D2-2 — mundo ancho + cámara
const ANCHO_MUNDO = 2560;
const SUELO_Y = 660;

add([rect(ANCHO_MUNDO, 60), pos(0, SUELO_Y), color(COL.suelo),
     area(), body({ isStatic: true }), z(0), "suelo"]);

function techoDeHierba(x, y, ancho, alto, profundidad) {
  for (let gx = x; gx < x + ancho; gx += 64) {
    add([sprite("grass", { width: Math.min(64, x + ancho - gx), height: alto }),
         pos(gx, y), z(profundidad)]);
  }
}
techoDeHierba(0, SUELO_Y, ANCHO_MUNDO, 60, 1);

for (const [x, y, w] of PLATAFORMAS) {
  add([rect(w, 24), pos(x, y), color(COL.plataforma),
       area(), body({ isStatic: true }), z(2), "plataforma"]);
  techoDeHierba(x, y, w, 64, 3);
}

// la cámara, justo tras crear al jugador:
add([pos(0, 0)]).onUpdate(() => {
  setCamPos(clamp(jugador.pos.x + jugador.width / 2,
    640, ANCHO_MUNDO - 640), 360);
});

// red de seguridad actualizada al mundo ancho:
jugador.onUpdate(() => {
  jugador.pos.x = clamp(jugador.pos.x, 0, ANCHO_MUNDO - jugador.width);
  if (jugador.pos.y > 760) jugador.pos = vec2(80, 400);
});`,
        demoTitulo: "mundo y cámara en el kit",
        pasos: [
            "En el kit: camina a la derecha hasta el final del nivel.",
            "La cámara viaja contigo; el HUD (fixed) no se mueve.",
            "Pega el bloque en «1. Mundo» de tu archivo.",
            "Recorre el nivel entero con R de principio a fin.",
        ],
    },
    // -------------------------------------------------------------- 4
    {
        titulo: "D2-3 · Vida y daño",
        hora: "01:00 – 01:25",
        paneles: [
            {
                t: "health() y corazones",
                b: "health(3,3) añade hp(), hurt() y heal(). Tres corazones fixed bajo el marcador: refrescarHud los apaga (opacidad 0.22) en vez de borrarlos, para que sepas cuántas te quedan.",
            },
            {
                t: "−1 vida, no muerte",
                b: "El choque lateral de la sala 1 llama ahora a danar(): empujón, un segundo de invulnerabilidad con parpadeo y flash. Acabas de convertir un bug de ayer en diseño de juego.",
            },
        ],
        reto: "Retos · pasa a 5 vidas (health(5,5) y cinco corazones) y que el corazón flotante solo aparezca a partir de 200 puntos con hide()/show().",
        snippetDonde: "SNIPPET · health en TU add() + danar y su onCollide",
        codigo: `// 1) en el add() del jugador, añade: health(3, 3),
// 2) danar() — PEGAR (lo llama el onCollide):
function danar(c, origenX) {
  if (!jugando || invulnerable) return;
  jugador.hurt(c);
  invulnerable = true;
  jugador.pos.x += jugador.pos.x < origenX ? -90 : 90;
  play("hurt"); shake(8); flash("#ff2d55", 0.22);
  if (jugador.hp() <= 0) {
    jugando = false;
    wait(0.5, () => go("gameover", puntos));
  } else wait(1, () => { invulnerable = false; });
}`,
        solucion: `// SOLUCIÓN D2-3 — vida y daño
const jugador = add([sprite("bean"), pos(80, 560), area(),
  body({ jumpForce: 1150 }), "jugador", health(3, 3)]);

// tres corazones bajo el marcador
const corazones = [];
for (let i = 0; i < 3; i++)
  corazones.push(add([sprite("heart"), pos(24 + i * 44, 64), fixed(), z(100)]));

function refrescarHud() {
  hud.text = "PUNTOS: " + puntos + "   META: 1000";
  const vida = jugador.hp();
  corazones.forEach((c, i) => { c.opacity = i < vida ? 1 : 0.22; });
}

let invulnerable = false, blinkTime = 0;
function danar(c, origenX) {
  if (!jugando || invulnerable) return;
  jugador.hurt(c); invulnerable = true; blinkTime = 0;
  jugador.pos.x = clamp(jugador.pos.x +
    (jugador.pos.x < origenX ? -90 : 90), 0, ANCHO_MUNDO - jugador.width);
  jugador.jump(320);
  play("hurt"); shake(8); flash("#ff2d55", 0.22);
  refrescarHud();
  if (jugador.hp() <= 0) {
    jugando = false;
    wait(0.5, () => go("gameover", puntos));
  } else wait(1, () => { invulnerable = false; blinkTime = 0; });
}

onCollide("jugador", "enemigo", (j, e) => {
  if (!e.exists() || !jugando || pisandolo(j, e)) return;
  danar(1, e.pos.x);
});`,
        demoTitulo: "vida y daño en el kit",
        pasos: [
            "Kit: camina hacia el primer enemigo y aguanta 3 toques.",
            "3 golpes → GAME OVER; con vida sigues y parpadeas.",
            "Corazón flotante en la plataforma 2: +1 vida.",
            "En tu archivo: health + danar + corazones.",
        ],
    },
    // -------------------------------------------------------------- 5
    {
        titulo: "D2-4 · Partículas y récord",
        hora: "01:25 – 01:40",
        paneles: [
            {
                t: "Chisporroteo",
                b: "particles() con la textura sparkles: mínimo y máximo de speed, lifeTime y colors en rgb(). emisor.emit(n) dispara de golpe y a los 1.3 s el emisor se destruye solo.",
            },
            {
                t: "Tu récord",
                b: "getData/setData es localStorage con nombre. guardaRecord devuelve el máximo: si superas el récord se guarda, y las escenas de fin lo enseñan. Sobrevive a cerrar la pestaña.",
            },
        ],
        reto: "Retos · que el estallido de la META sea verde y grande (60 chispas) y muestre «¡RÉCORD NUEVO!» si batiste el anterior.",
        snippetDonde: "SNIPPET · PEGAR antes de sumar() y pisar()",
        codigo: `// PEGAR — efectos, ANTES de sumar() y pisar():
function estallar(px, py, n, colores) {
  const e = add([pos(px, py), particles({
    max: 80, texture: getSprite("sparkles").data.tex,
    speed: [70, 240], lifeTime: [0.35, 0.85],
    colors: colores.map((c) => rgb(c)), opacities: [1, 0],
    scales: [1.6, 0.3], angle: [0, 360] },
    { direction: 0, spread: 180 }), z(20)]);
  e.emit(n);
  wait(1.3, () => e.exists() && e.destroy());
}
// en sumar(), tras puntos += n:
estallar(px, py, 12, ["#ff5c8a", "#ffd166"]);`,
        solucion: `// SOLUCIÓN D2-4 — partículas + récord
const RECORD_KEY = "taller-record";
function leerRecord() { return Number(getData(RECORD_KEY) ?? 0); }
function guardaRecord(p) {
  const antes = leerRecord();
  if (p > antes) setData(RECORD_KEY, p);
  return Math.max(antes, p);
}

function estallar(px, py, n, colores) {
  const spriteData = getSprite("sparkles");
  const emisor = add([pos(px, py), particles({
    max: 80, texture: spriteData.data.tex,
    speed: [70, 240], lifeTime: [0.35, 0.85],
    colors: colores.map((c) => rgb(c)),
    opacities: [1, 0], scales: [1.6, 0.3],
    angle: [0, 360], angularVelocity: [-240, 240]
  }, { direction: 0, spread: 180 }), z(20)]);
  emisor.emit(n);
  wait(1.3, () => { if (emisor.exists()) emisor.destroy(); });
}

// sumar():  puntos += n; refrescarHud(); guardaRecord(puntos);
//           estallar(px, py, 12, ["#ff5c8a", "#ffd166"]);
// pisar():  estallar(px + 30, py + 26, 16, ["#ffd166", "#7cff6b"]);
// escenas:  scene("gameover", (puntos = 0, record = 0) => { ... })
//   text("PUNTOS: " + puntos + "   RÉCORD: " + record, ...)`,
        demoTitulo: "chispas y récord en el kit",
        pasos: [
            "Kit: pisa un enemigo y mira la explosión de chispas.",
            "Muere y vuelve a entrar: el récord persiste.",
            "Pega estallar() y guardaRecord() en tu archivo.",
            "Conecta estallar() en sumar() y en pisar().",
        ],
    },
    // -------------------------------------------------------------- 6
    {
        titulo: "D2-5 · Jefe y Showcase (opcional)",
        hora: "01:40 – 02:00",
        paneles: [
            {
                t: "El jefe (opcional)",
                b: "gigagantrum con health(6,6), patrulla a mano, barra de vida fixed y proyectiles cada 1.5 s. Usa el MISMO pisotón geométrico con 0.35 s de enfriamiento. Solo para equipos avanzados.",
            },
            {
                t: "Showcase (intocable)",
                b: "10 minutos: cada equipo enseña en 45 s su bloque estrella y una idea para mañana. El instructor demuestra parallax y jefe desde ../solucion-dia2/. Cierra con los récords en pantalla.",
            },
        ],
        reto: "Cierre · juega tu partida, anota tu récord y prepárate para enseñar en 45 s el bloque que más te haya gustado.",
        snippetDonde: "SNIPPET · el jefe, resumido (kit ▸ D2-5)",
        codigo: `// ▸ D2-5 (kit) — el jefe, resumido:
const jefe = add([sprite("gigagantrum"), pos(2300, 540),
  area(), body({ isStatic: true }), health(6, 6),
  { dir: -1, velocidad: 70,
    desde: 2150, hasta: 2400 }, "jefe"]);
// patrulla + MISMO pisotón geométrico + enfriamiento
function golpeAlJefe() {
  enfriamiento = 0.35;
  jefe.hurt(1); play("bosshit"); shake(6);
  jugador.jump(700); actualizarBarraJefe();
  if (jefe.hp() <= 0) { /* estallido + go victoria */ }
}
// proyectiles: loop(1.5, dispararProyectil);`,
        solucion: `// SOLUCIÓN D2-5 — el bloque▸ D2-5 completo está en el kit
let enfriamiento = 0, jefeDerrotado = false;
const jefe = add([
  sprite("gigagantrum"), pos(2300, 540),
  area(), body({ isStatic: true }), health(6, 6),
  { dir: -1, velocidad: 70, desde: 2150, hasta: 2400 }, z(5), "jefe",
]);
jefe.onUpdate(() => {   // patrulla + pisotón geométrico
  jefe.pos.x += jefe.dir * jefe.velocidad * dt();
  if (jefe.pos.x <= jefe.desde || jefe.pos.x >= jefe.hasta) {
    jefe.dir *= -1; jefe.pos.x = clamp(jefe.pos.x, jefe.desde, jefe.hasta);
  }
  const pies = jugador.pos.y + jugador.height;
  if (enfriamiento <= 0 && jugando && jugador.vel.y >= 0 &&
      jugador.pos.x < jefe.pos.x + jefe.width &&
      jugador.pos.x + jugador.width > jefe.pos.x &&
      pies > jefe.pos.y - 6 && pies < jefe.pos.y + jefe.height / 2)
    golpeAlJefe();
  enfriamiento = Math.max(0, enfriamiento - dt());
});
function golpeAlJefe() {
  if (!jugando || jefeDerrotado) return;
  enfriamiento = 0.35; jefe.hurt(1);
  play("bosshit"); shake(6); jugador.jump(700);
  estallar(jefe.pos.x + 60, jefe.pos.y + 60, 12, ["#ff5c8a", "#ffd166"]);
  sumar(50, jefe.pos.x + 30, jefe.pos.y - 20);
  actualizarBarraJefe();
  if (jefe.hp() <= 0) { jefeDerrotado = true; jugando = false;
    const px = jefe.pos.x, py = jefe.pos.y;
    jefe.destroy(); estallar(px, py, 50, ["#ffd166"]);
    wait(0.9, () => go("victoria", puntos, guardaRecord(puntos))); }
}`,
        demoTitulo: "jefe y showcase",
        pasos: [
            "Avanzados: pega ▸ D2-5 en su archivo (requiere D2-3 y D2-4).",
            "Todos: en el kit, camina hasta el fondo del nivel.",
            "Barra de vida, proyectiles y golpe con enfriamiento.",
            "SHOWCASE: 45 s por equipo y récord final en pantalla.",
        ],
    },
];
