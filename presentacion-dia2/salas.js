// presentacion-dia2/salas.js
// Contenido de las 6 salas del Día 2 (versión reducida).
// Cada sala: 2 paneles de teoría (~30-40 palabras), 1 reto extra, 1 snippet
// copiable (lo que se pega en el starter) y una micro-demo conceptual en
// `demo(box)` con su leyenda en `controles`: demuestra el MISMO efecto que
// el snippet, dentro del recuadro derecho. El juego completo vive en
// ../solucion-dia2-lite/ (kit) y ../solucion-dia2/ (jefe y parallax).
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

// Nombres de fuente registrados por main.js con loadFont(): los puede usar
// aquí cualquier demo (son globales en KAPLAY, no hace falta importarlos).
const F_TITULO = "happy";
const F_CUERPO = "inter";
const F_COD = "jetbrains";

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
        // Micro-demo conceptual: el recap del Día 1 — HUD que se refresca,
        // pisotón geométrico y choque lateral mortal, con el rect de ayer.
        controles: "A/D: mover · ESPACIO: saltar · R: reiniciar",
        demo(box) {
            const { x, y, w, h } = box;
            setGravity(2400);
            const sueloY = y + h - 44;
            let puntos = 0;
            let jugando = true;
            let metaOk = false;

            // suelo (isStatic: el jugador lo pisa)
            add([
                rect(w, 44), pos(x, sueloY), color("#2b3370"),
                area(), body({ isStatic: true }),
            ]);

            // HUD al estilo refrescarHud(): el texto se refresca al sumar
            const hud = add([
                text("PUNTOS: 0   META: 300", { size: 16, font: F_COD }),
                pos(x + 14, y + 10),
                color(PALETA.titulo),
            ]);
            const avisoMeta = add([
                text("¡META! ✓", { size: 22, font: F_TITULO }),
                pos(x + w - 14, y + 8),
                anchor("right"),
                color(PALETA.bien),
                opacity(0),
            ]);
            add([
                text("Pisa al enemigo: +100  ·  De lado: GAME OVER", {
                    size: 15, font: F_CUERPO,
                }),
                pos(x + 14, y + 40),
                color("#8a93c4"),
            ]);
            function refrescarHud() {
                hud.text = "PUNTOS: " + puntos + "   META: 300";
                if (puntos >= 300 && !metaOk) {
                    metaOk = true;
                    avisoMeta.opacity = 1;
                    play("pickup");
                }
            }
            function flotar(txt, px, py) {
                const t = add([
                    text(txt, { size: 18, font: F_TITULO }),
                    pos(px, py), anchor("center"),
                    color(PALETA.bien), opacity(1),
                    lifespan(0.8, { fade: 0.4 }),
                ]);
                t.onUpdate(() => { t.pos.y -= 70 * dt(); });
            }

            // EL JUGADOR — el rect del Día 1, intacto
            const jugador = add([
                rect(48, 60), pos(x + 70, y + 40),
                color(PALETA.acento), area(),
                // salto contenido: en el pico queda por debajo del HUD,
                // así la franja del marcador solo cambia al puntuar
                body({ jumpForce: 750 }),
                "jugador-demo",
            ]);

            // MISMO guard que en tu archivo: ¿lo está pisando?
            function pisandolo(j, e) {
                return j.vel.y >= 0 && j.pos.y + j.height < e.pos.y + e.height / 2;
            }
            function crearEnemigo(px) {
                const e = add([
                    rect(48, 60), pos(px, sueloY - 60),
                    color(PALETA.enemigo), area(),
                    body({ isStatic: true }),
                    { dir: px < x + w / 2 ? 1 : -1, velocidad: 90 },
                    "enemigo-demo",
                ]);
                e.onUpdate(() => {
                    // patrulla
                    e.pos.x += e.dir * e.velocidad * dt();
                    if (e.pos.x <= x + 8 || e.pos.x >= x + w - 56) {
                        e.dir *= -1;
                        e.pos.x = clamp(e.pos.x, x + 8, x + w - 56);
                    }
                    if (!jugando || !jugador.exists()) return;
                    // pisotón geométrico: onCollide no ve el aterrizaje
                    const pies = jugador.pos.y + jugador.height;
                    if (
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
            function pisar(e) {
                const px = e.pos.x, py = e.pos.y;
                const lejos = e.pos.x < x + w / 2;
                e.destroy();
                puntos += 100;
                refrescarHud();
                flotar("+100", px + 24, py - 6);
                play("stomp");
                jugador.jump(700); // rebote corto al pisar
                wait(2, () => {
                    if (jugando && get("enemigo-demo").length === 0) {
                        crearEnemigo(lejos ? x + w - 60 : x + 12);
                    }
                });
            }
            crearEnemigo(x + w - 110);

            // choque lateral → GAME OVER. El feedback es DENTRO del recuadro
            // (ni shake ni flash: sacudirían toda la presentación).
            const marca = add([rect(w, h), pos(x, y), color("#ff2d55"), opacity(0)]);
            const finCaja = add([
                rect(320, 96, { radius: 12 }),
                pos(x + w / 2, y + h / 2), anchor("center"),
                color("#1c0a14"), outline(3, rgb("#ff2d55")),
                opacity(0),
            ]);
            const finTxt = add([
                text("GAME OVER\nR: reiniciar", {
                    size: 24, align: "center", width: 300,
                    font: F_TITULO, lineSpacing: 8,
                }),
                pos(x + w / 2, y + h / 2), anchor("center"),
                color("#ff5c8a"), opacity(0),
            ]);
            onCollide("jugador-demo", "enemigo-demo", (j, e) => {
                if (!e.exists() || !jugando) return;
                if (pisandolo(j, e)) return; // el pisotón lo resuelve
                jugando = false;
                play("hurt");
                marca.opacity = 0.7;
                tween(0.7, 0, 0.45, (v) => (marca.opacity = v));
                finCaja.opacity = 1;
                finTxt.opacity = 1;
            });

            // controles + red de seguridad, como en tu archivo
            onKeyDown("a", () => { if (jugando) jugador.pos.x -= 260 * dt(); });
            onKeyDown("d", () => { if (jugando) jugador.pos.x += 260 * dt(); });
            onKeyPress("space", () => {
                if (jugando && jugador.isGrounded()) { jugador.jump(); play("jump"); }
            });
            jugador.onUpdate(() => {
                jugador.pos.x = clamp(jugador.pos.x, x, x + w - jugador.width);
                if (jugador.pos.y > y + h) jugador.pos = vec2(x + 70, y + 40);
            });

            onKeyPress("r", () => {
                puntos = 0;
                jugando = true;
                metaOk = false;
                refrescarHud();
                avisoMeta.opacity = 0;
                marca.opacity = 0;
                finCaja.opacity = 0;
                finTxt.opacity = 0;
                jugador.pos = vec2(x + 70, y + 40);
                jugador.vel.x = 0;
                jugador.vel.y = 0;
                if (get("enemigo-demo").length === 0) crearEnemigo(x + w - 110);
            });
        },
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
        // Micro-demo conceptual: el mismo objeto en rect y en sprite, con
        // los pies clavados en el suelo — la "y" cambia porque cambia la caja.
        controles: "A/D: mover · ESPACIO: rect ↔ sprite",
        demo(box) {
            const { x, y, w, h } = box;
            const sueloY = y + h - 44;
            let usandoSprite = false;
            let px = x + w / 2 - 30;

            add([rect(w, 44), pos(x, sueloY), color("#2b3370")]);

            const info = add([
                text("", { size: 16, font: F_COD, lineSpacing: 6 }),
                pos(x + 14, y + 10),
                color(PALETA.titulo),
            ]);
            function refrescarInfo() {
                const ancho = usandoSprite ? 61 : 48;
                const alto = usandoSprite ? 53 : 60;
                info.text =
                    (usandoSprite ? 'sprite("bean")' : "rect(48, 60)") +
                    "  ·  area() → " + ancho + "×" + alto +
                    "\ny = suelo " + Math.round(sueloY) + " − " + alto +
                    " = " + Math.round(sueloY - alto);
            }

            let obj = null;
            let caja = null;
            function crear() {
                if (obj) obj.destroy();
                if (caja) caja.destroy();
                const ancho = usandoSprite ? 61 : 48;
                const alto = usandoSprite ? 53 : 60;
                px = clamp(px, x + 8, x + w - ancho - 8); // el ancho cambió
                // la caja de colisión, visible, ATRÁS del objeto:
                // en el sprite se ve que mide 61×53 aunque la imagen no lo llene
                caja = add([
                    rect(ancho, alto),
                    pos(px, sueloY - alto),
                    color("#1d2a5e"),
                    outline(2, rgb(PALETA.acento)),
                ]);
                obj = usandoSprite
                    ? add([sprite("bean"), pos(px, sueloY - alto), area()])
                    : add([rect(48, 60), pos(px, sueloY - 60), color(PALETA.acento), area()]);
                refrescarInfo();
            }
            crear();

            const mover = (dx) => {
                const ancho = usandoSprite ? 61 : 48;
                px = clamp(px + dx, x + 8, x + w - ancho - 8);
                obj.pos.x = px;
                caja.pos.x = px;
            };
            onKeyDown("a", () => mover(-240 * dt()));
            onKeyDown("d", () => mover(240 * dt()));
            onKeyPress("space", () => {
                usandoSprite = !usandoSprite;
                crear();
                play("select");
            });
        },
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
        // Micro-demo conceptual: un nivel de 2 pantallas con cámara propia
        // (offset manual con clamp, como setCamPos del kit) y HUD quieto.
        controles: "A/D: mover · la cámara te sigue",
        demo(box) {
            const { x, y, w, h } = box;
            const MUNDO = w * 2; // dos "pantallas" de nivel
            const sueloY = h - 40; // y del suelo (relativa a la caja)
            let bx = 0; // el bean en coordenadas de MUNDO
            let camX = 0;
            let llegado = false;
            const mundoObjs = []; // [obj, wx]: lo que viaja con la cámara

            function alMundo(o, wx) {
                mundoObjs.push([o, wx]);
                o.pos.x = x + wx - camX;
                return o;
            }

            // suelo de todo el nivel + hierba mosaico encima
            alMundo(add([rect(MUNDO, 40), pos(x, y + sueloY), color("#2b3370")]), 0);
            for (let gx = 0; gx < MUNDO; gx += 64) {
                alMundo(add([sprite("grass", { width: 64, height: 40 }), pos(x, y + sueloY)]), gx);
            }
            // marca de fin de la primera "pantalla"
            alMundo(add([rect(2, h - 40), pos(x, y), color(PALETA.acento), opacity(0.35)]), w);
            // plataformas del nivel (el de arriba, decorativo)
            for (const [wx, ww] of [[260, 110], [720, 130]]) {
                alMundo(
                    add([rect(ww, 16), pos(x, y + 150), color("#3b4790"),
                        outline(2, rgb(PALETA.panelBorder))]),
                    wx,
                );
            }
            // la puerta del final del mundo
            alMundo(add([sprite("door", { width: 56, height: 70 }), pos(x, y + sueloY - 70)]), MUNDO - 78);

            const bean = add([sprite("bean"), pos(x + bx, y + sueloY - 53), area()]);

            // HUD: viaja en coordenadas de caja — quieto, como fixed() del kit
            const hud = add([
                text("", { size: 15, font: F_COD }),
                pos(x + 14, y + 10),
                color(PALETA.titulo),
            ]);
            const aviso = add([
                text("¡LLEGASTE!", { size: 20, font: F_TITULO }),
                pos(x + w - 14, y + 10),
                anchor("right"),
                color(PALETA.bien),
                opacity(0),
            ]);

            onUpdate(() => {
                if (isKeyDown("a")) bx -= 220 * dt();
                if (isKeyDown("d")) bx += 220 * dt();
                bx = clamp(bx, 0, MUNDO - 61);
                // la cámara, con clamp dentro — el patrón del kit, a mano
                camX = clamp(bx + 30 - w / 2, 0, MUNDO - w);
                bean.pos.x = x + bx - camX;
                for (const [o, wx] of mundoObjs) o.pos.x = x + wx - camX;
                hud.text =
                    "mundo " + MUNDO + " px · cámara x " + Math.round(camX) +
                    "  (clamp 0…" + (MUNDO - w) + ")";
                if (!llegado && bx >= MUNDO - 140) {
                    llegado = true;
                    aviso.opacity = 1;
                    play("pickup");
                } else if (llegado && bx < MUNDO - 300) {
                    llegado = false;
                    aviso.opacity = 0;
                }
            });
        },
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
        // Micro-demo conceptual: health() de verdad — corazones que se
        // apagan, danar() con empujón, parpadeo de invulnerabilidad y
        // corazón flotante que usa heal().
        controles: "A/D: mover · ESPACIO: saltar · R: reiniciar",
        demo(box) {
            const { x, y, w, h } = box;
            setGravity(2400);
            const sueloY = y + h - 44;
            let jugando = true;
            let invulnerable = false;
            let blinkTime = 0;

            add([
                rect(w, 44), pos(x, sueloY), color("#2b3370"),
                area(), body({ isStatic: true }),
            ]);

            // HUD: etiqueta + tres corazones que se APAGAN (0.22), no se borran
            add([text("VIDAS", { size: 16, font: F_COD }), pos(x + 14, y + 12), color(PALETA.titulo)]);
            const corazones = [];
            for (let i = 0; i < 3; i++) {
                corazones.push(add([
                    sprite("heart", { width: 30, height: 27 }),
                    pos(x + 90 + i * 36, y + 6),
                ]));
            }
            const avisoInv = add([
                text("invulnerable 1 s", { size: 15, font: F_CUERPO }),
                pos(x + w - 14, y + 10),
                anchor("right"),
                color(PALETA.acento),
                opacity(0),
            ]);

            const jugador = add([
                sprite("bean"),
                pos(x + 70, y + 40),
                area(),
                body({ jumpForce: 750 }),
                health(3, 3),
                "jugador-demo",
            ]);
            function refrescarHud() {
                const hp = jugador.hp();
                corazones.forEach((c, i) => { c.opacity = i < hp ? 1 : 0.22; });
            }
            function flotar(txt, px, py) {
                const t = add([
                    text(txt, { size: 18, font: F_TITULO }),
                    pos(px, py), anchor("center"),
                    color(PALETA.bien), opacity(1),
                    lifespan(0.8, { fade: 0.4 }),
                ]);
                t.onUpdate(() => { t.pos.y -= 70 * dt(); });
            }

            // MISMO guard que en tu archivo: ¿lo está pisando?
            function pisandolo(j, e) {
                return j.vel.y >= 0 && j.pos.y + j.height < e.pos.y + e.height / 2;
            }
            function crearEnemigo(px) {
                const e = add([
                    sprite("zombean"),
                    pos(px, sueloY - 53),
                    area(), body({ isStatic: true }),
                    { dir: px < x + w / 2 ? 1 : -1, velocidad: 80 },
                    "enemigo-demo",
                ]);
                e.onUpdate(() => {
                    e.pos.x += e.dir * e.velocidad * dt();
                    if (e.pos.x <= x + 8 || e.pos.x >= x + w - 69) {
                        e.dir *= -1;
                        e.pos.x = clamp(e.pos.x, x + 8, x + w - 69);
                    }
                    if (!jugando || !jugador.exists()) return;
                    const pies = jugador.pos.y + jugador.height;
                    if (
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
            function pisar(e) {
                const lejos = e.pos.x < x + w / 2;
                e.destroy();
                play("stomp");
                jugador.jump(700);
                wait(2, () => {
                    if (jugando && get("enemigo-demo").length === 0) {
                        crearEnemigo(lejos ? x + w - 69 : x + 12);
                    }
                });
            }
            crearEnemigo(x + w - 100);

            // Feedback DENTRO de la caja (ni shake ni flash globales)
            const marca = add([rect(w, h), pos(x, y), color("#ff2d55"), opacity(0)]);
            const finCaja = add([
                rect(320, 96, { radius: 12 }),
                pos(x + w / 2, y + h / 2), anchor("center"),
                color("#1c0a14"), outline(3, rgb("#ff2d55")),
                opacity(0),
            ]);
            const finTxt = add([
                text("SIN VIDAS\nR: reiniciar", {
                    size: 24, align: "center", width: 300,
                    font: F_TITULO, lineSpacing: 8,
                }),
                pos(x + w / 2, y + h / 2), anchor("center"),
                color("#ff5c8a"), opacity(0),
            ]);

            // danar() — el bloque ▸ D2-3, aquí sin shake/flash
            function danar(c, origenX) {
                if (!jugando || invulnerable) return;
                jugador.hurt(c);
                invulnerable = true;
                blinkTime = 0;
                jugador.pos.x += jugador.pos.x < origenX ? -70 : 70; // empujón
                jugador.jump(320);
                play("hurt");
                marca.opacity = 0.55;
                tween(0.55, 0, 0.4, (v) => (marca.opacity = v));
                refrescarHud();
                if (jugador.hp() <= 0) {
                    jugando = false;
                    invulnerable = false; // muerto: ni parpadeo ni etiqueta
                    get("corazon-item").forEach((c) => c.destroy()); // no tape la tarjeta
                    finCaja.opacity = 1;
                    finTxt.opacity = 1;
                } else {
                    wait(1, () => { invulnerable = false; blinkTime = 0; });
                }
            }
            onCollide("jugador-demo", "enemigo-demo", (j, e) => {
                if (!e.exists() || !jugando) return;
                if (pisandolo(j, e)) return; // el pisotón lo resuelve
                danar(1, e.pos.x);
            });

            // Corazón flotante: heal() solo cuando te falta vida
            function soltarCorazon() {
                if (!jugando || jugador.hp() >= 3 || get("corazon-item").length) return;
                const baseY = y + 120;
                const c = add([
                    sprite("heart", { width: 30, height: 27 }),
                    pos(x + w / 2 - 15, baseY),
                    area(),
                    "corazon-item",
                ]);
                c.onUpdate(() => { c.pos.y = baseY + Math.sin(time() * 3) * 8; });
            }
            onCollide("jugador-demo", "corazon-item", (j, c) => {
                if (!jugando) return;
                c.destroy();
                jugador.heal(1);
                play("heal");
                refrescarHud();
                flotar("+1 ♥", c.pos.x + 15, c.pos.y - 8);
            });
            soltarCorazon();
            loop(7, soltarCorazon);

            // controles + red de seguridad, como en tu archivo
            onKeyDown("a", () => { if (jugando) jugador.pos.x -= 240 * dt(); });
            onKeyDown("d", () => { if (jugando) jugador.pos.x += 240 * dt(); });
            onKeyPress("space", () => {
                if (jugando && jugador.isGrounded()) { jugador.jump(); play("jump"); }
            });
            jugador.onUpdate(() => {
                jugador.pos.x = clamp(jugador.pos.x, x, x + w - jugador.width);
                if (jugador.pos.y > y + h) jugador.pos = vec2(x + 70, y + 40);
                // parpadeo mientras dure la invulnerabilidad
                blinkTime += dt();
                if (invulnerable) {
                    jugador.opacity = Math.floor(blinkTime * 10) % 2 === 0 ? 1 : 0.3;
                    avisoInv.opacity = 1;
                } else {
                    jugador.opacity = 1;
                    avisoInv.opacity = 0;
                }
            });

            onKeyPress("r", () => {
                jugando = true;
                invulnerable = false;
                blinkTime = 0;
                finCaja.opacity = 0;
                finTxt.opacity = 0;
                marca.opacity = 0;
                jugador.pos = vec2(x + 70, y + 40);
                jugador.vel.x = 0;
                jugador.vel.y = 0;
                jugador.heal(3); // health(3,3): vuelve a la completa
                refrescarHud();
                if (get("enemigo-demo").length === 0) crearEnemigo(x + w - 100);
            });
            refrescarHud(); // corazones con el hp real
        },
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
        // Micro-demo conceptual: estallar() con la textura sparkles y
        // récord en localStorage con CLAVE PROPIA (no pisa la del kit).
        controles: "ESPACIO: +100 con chispas · R: a 0 · F5: récord",
        demo(box) {
            const { x, y, w, h } = box;
            const RECORD_KEY = "pres-dia2-demo-record";
            let puntos = 0;

            function leerRecord() { return Number(getData(RECORD_KEY) ?? 0); }
            function guardaRecord(p) {
                const antes = leerRecord();
                if (p > antes) setData(RECORD_KEY, p);
                return Math.max(antes, p);
            }
            function estallar(px, py, n, colores) {
                const emisor = add([pos(px, py), particles({
                    max: 80, texture: getSprite("sparkles").data.tex,
                    speed: [70, 240], lifeTime: [0.35, 0.85],
                    colors: colores.map((c) => rgb(c)),
                    opacities: [1, 0], scales: [1.6, 0.3],
                    angle: [0, 360], angularVelocity: [-240, 240],
                }, { direction: 0, spread: 180 }), z(20)]);
                emisor.emit(n);
                wait(1.3, () => { if (emisor.exists()) emisor.destroy(); });
            }

            add([rect(w, 44), pos(x, y + h - 44), color("#2b3370")]);
            const bean = add([sprite("bean"), pos(x + w / 2 - 30, y + h - 97)]);

            const hud = add([
                text("", { size: 16, font: F_COD }),
                pos(x + 14, y + 10),
                color(PALETA.titulo),
            ]);
            const avisoRec = add([
                text("¡RÉCORD NUEVO!", { size: 18, font: F_TITULO }),
                pos(x + w - 14, y + 10),
                anchor("right"),
                color(PALETA.bien),
                opacity(0),
            ]);
            add([
                text("El récord sobrevive a F5 y al cambio de sala", {
                    size: 15, font: F_CUERPO,
                }),
                pos(x + 14, y + 40),
                color("#8a93c4"),
            ]);
            function refrescarHud() {
                hud.text = "PUNTOS: " + puntos + "   RÉCORD: " + leerRecord();
            }
            refrescarHud(); // el récord ya viejo aparece al entrar

            onKeyPress("space", () => {
                const antes = leerRecord();
                puntos += 100;
                const rec = guardaRecord(puntos); // ▸ D2-4
                refrescarHud();
                play("pickup");
                estallar(bean.pos.x + 30, bean.pos.y - 6, 14, ["#ff5c8a", "#ffd166"]);
                const f = add([
                    text("+100", { size: 18, font: F_TITULO }),
                    pos(bean.pos.x + 30, bean.pos.y - 10),
                    anchor("center"),
                    color(PALETA.bien), opacity(1),
                    lifespan(0.8, { fade: 0.4 }),
                ]);
                f.onUpdate(() => { f.pos.y -= 70 * dt(); });
                if (rec > antes) {
                    avisoRec.opacity = 1;
                    wait(1.4, () => { if (avisoRec.exists()) avisoRec.opacity = 0; });
                }
            });
            onKeyPress("r", () => {
                puntos = 0;
                refrescarHud(); // el récord NO se toca
            });
        },
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
        // Micro-demo conceptual: el jefe — barra de vida, proyectiles que
        // hay que esquivar y pisotón geométrico con enfriamiento (kit ▸ D2-5).
        controles: "A/D: mover · ESPACIO: saltar · R: reiniciar",
        demo(box) {
            const { x, y, w, h } = box;
            setGravity(2400);
            const sueloY = y + h - 44;
            const VIDA_MAX = 6;
            let jugando = true;
            let derrotado = false;
            let enfriamiento = 0;
            let impactos = 0;
            let loopDisp = null;

            add([
                rect(w, 44), pos(x, sueloY), color("#2b3370"),
                area(), body({ isStatic: true }),
            ]);

            // barra de vida del jefe (arriba, como fixed() en el kit)
            add([text("JEFE", { size: 16, font: F_COD }), pos(x + 14, y + 11), color(PALETA.titulo)]);
            add([rect(200, 16, { radius: 4 }), pos(x + 70, y + 10), color("#3a1420"), outline(2, rgb("#ffd166"))]);
            const barra = add([rect(196, 12, { radius: 3 }), pos(x + 72, y + 12), color("#ff2d55")]);
            const impactosTxt = add([
                text("IMPACTOS: 0", { size: 15, font: F_CUERPO }),
                pos(x + w - 14, y + 11),
                anchor("right"),
                color(PALETA.acento),
            ]);
            function actualizarBarra() {
                const v = jefe && jefe.exists() ? jefe.hp() : 0;
                barra.width = 196 * Math.max(0, v / VIDA_MAX);
            }

            const jugador = add([
                sprite("bean"),
                pos(x + 50, y + 40),
                area(), body({ jumpForce: 750 }),
                "jugador-demo",
            ]);

            // MISMO guard que en tu archivo: ¿lo está pisando?
            function pisandolo(j, e) {
                return j.vel.y >= 0 && j.pos.y + j.height < e.pos.y + e.height / 2;
            }

            let jefe = null;
            function crearJefe() {
                jefe = add([
                    sprite("gigagantrum"),
                    pos(x + w - 240, sueloY - 120),
                    area(), body({ isStatic: true }),
                    health(6, 6),
                    { dir: -1, velocidad: 70, desde: x + w - 300, hasta: x + w - 130 },
                    "jefe-demo",
                ]);
                jefe.onUpdate(() => {
                    // patrulla
                    jefe.pos.x += jefe.dir * jefe.velocidad * dt();
                    if (jefe.pos.x <= jefe.desde || jefe.pos.x >= jefe.hasta) {
                        jefe.dir *= -1;
                        jefe.pos.x = clamp(jefe.pos.x, jefe.desde, jefe.hasta);
                    }
                    if (!jugando || !jugador.exists()) return;
                    // pisotón geométrico CON enfriamiento: un golpe por rebote
                    const pies = jugador.pos.y + jugador.height;
                    if (
                        enfriamiento <= 0 &&
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
                return jefe;
            }
            function golpeAlJefe() {
                if (!jugando || derrotado) return;
                enfriamiento = 0.35;
                jefe.hurt(1);
                play("bosshit");
                jugador.jump(700); // te rebota igual que un enemigo
                actualizarBarra();
                if (jefe.hp() <= 0) {
                    derrotado = true;
                    jugando = false;
                    const px = jefe.pos.x + 60, py = jefe.pos.y + 60;
                    jefe.destroy();
                    get("proyectil").forEach((p) => p.destroy());
                    if (loopDisp) { loopDisp.cancel(); loopDisp = null; }
                    play("victory");
                    flotar("¡VICTORIA!", px, py - 20);
                    victCaja.opacity = 1;
                    victTxt.opacity = 1;
                }
            }
            crearJefe();

            // Feedback DENTRO de la caja (ni shake ni flash globales)
            const marca = add([rect(w, h), pos(x, y), color("#ff2d55"), opacity(0)]);
            const victCaja = add([
                rect(340, 96, { radius: 12 }),
                pos(x + w / 2, y + h / 2), anchor("center"),
                color("#0d2a16"), outline(3, rgb("#7cff6b")),
                opacity(0),
            ]);
            const victTxt = add([
                text("¡VICTORIA!\nR: reiniciar", {
                    size: 24, align: "center", width: 320,
                    font: F_TITULO, lineSpacing: 8,
                }),
                pos(x + w / 2, y + h / 2), anchor("center"),
                color("#7cff6b"), opacity(0),
            ]);
            function flotar(txt, px, py) {
                const t = add([
                    text(txt, { size: 20, font: F_TITULO }),
                    pos(px, py), anchor("center"),
                    color(PALETA.bien), opacity(1),
                    lifespan(1, { fade: 0.4 }),
                ]);
                t.onUpdate(() => { t.pos.y -= 60 * dt(); });
            }

            // Proyectil: sale del jefe hacia donde estás y NO sale de la caja
            function dispararProyectil() {
                if (!jugando || derrotado || !jefe.exists()) return;
                const dir = jugador.pos.x < jefe.pos.x ? -1 : 1;
                const p = add([
                    rect(24, 14, { radius: 6 }),
                    pos(jefe.pos.x + dir * 60, jefe.pos.y + 70),
                    anchor("center"),
                    color("#ffb347"),
                    area(),
                    move(vec2(dir, 0), 400),
                    rotate(dir < 0 ? 180 : 0),
                    opacity(1),
                    lifespan(3, { fade: 0.5 }),
                    "proyectil",
                ]);
                p.onUpdate(() => {
                    if (p.pos.x < x - 12 || p.pos.x > x + w + 12) p.destroy();
                });
                play("projectile");
            }
            loopDisp = loop(1.5, dispararProyectil);

            function impacto(origenX) {
                impactos++;
                impactosTxt.text = "IMPACTOS: " + impactos;
                jugador.pos.x += jugador.pos.x < origenX ? -70 : 70; // empujón
                play("hurt");
                marca.opacity = 0.5;
                tween(0.5, 0, 0.35, (v) => (marca.opacity = v));
            }
            onCollide("jugador-demo", "proyectil", (j, p) => {
                if (!p.exists() || !jugando) return;
                const px = p.pos.x;
                p.destroy();
                impacto(px);
            });
            // el jefe de lado también duele; el pisotón lo resuelve arriba
            onCollide("jugador-demo", "jefe-demo", (j, b) => {
                if (!jugando || derrotado || enfriamiento > 0) return;
                if (pisandolo(j, b)) return;
                impacto(b.pos.x);
            });

            // controles + red de seguridad, como en tu archivo
            onKeyDown("a", () => { if (jugando) jugador.pos.x -= 260 * dt(); });
            onKeyDown("d", () => { if (jugando) jugador.pos.x += 260 * dt(); });
            onKeyPress("space", () => {
                if (jugando && jugador.isGrounded()) { jugador.jump(); play("jump"); }
            });
            jugador.onUpdate(() => {
                jugador.pos.x = clamp(jugador.pos.x, x, x + w - jugador.width);
                if (jugador.pos.y > y + h) jugador.pos = vec2(x + 50, y + 40);
            });

            onKeyPress("r", () => {
                jugando = true;
                derrotado = false;
                enfriamiento = 0;
                impactos = 0;
                impactosTxt.text = "IMPACTOS: 0";
                victCaja.opacity = 0;
                victTxt.opacity = 0;
                marca.opacity = 0;
                jugador.pos = vec2(x + 50, y + 40);
                jugador.vel.x = 0;
                jugador.vel.y = 0;
                get("proyectil").forEach((p) => p.destroy());
                if (!jefe || !jefe.exists()) crearJefe();
                jefe.heal(VIDA_MAX);
                actualizarBarra();
                if (!loopDisp) loopDisp = loop(1.5, dispararProyectil);
            });
        },
    },
];
