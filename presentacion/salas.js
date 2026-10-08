// presentacion/salas.js
// Contenido de las 5 salas del Día 1 + sus micro-demos jugables.
// Cada sala: 2 paneles de teoría (~30-40 palabras), 1 reto extra y 1 snippet
// copiable. Los demos viven en un recuadro de la derecha y se mueven con
// A/D y ESPACIO (las flechas reservadas para navegar entre salas).

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
        titulo: "Kickoff · Game Loop",
        hora: "00:00 – 00:15",
        paneles: [
            {
                t: "¿Qué es KAPLAY?",
                b: "Una librería de JavaScript para juegos 2D que corre entera en el navegador. Sin instalar nada: cargas un archivo desde el CDN y tienes un canvas de 1280×720 listo para dibujar.",
            },
            {
                t: "El game loop",
                b: "Un juego es un bucle: actualizar la lógica y dibujar el resultado, unas 60 veces por segundo. KAPLAY lleva el bucle; tú describes qué pasa en cada fotograma con onUpdate().",
            },
        ],
        reto: "Retos · en tu starter, al terminar el bloque: haz que el jugador cambie de color cada 2 s con onUpdate() y un contador que se reinicie solo al llegar a 300.",
        controles: "ESPACIO: añadir cuadro",
        snippetDonde: "SNIPPET · arranque YA HECHO en tu starter · lo nuevo es onUpdate()",
        codigo: `// starter/main.js — YA HECHO (no lo repitas):
// kaplay({ width, height, letterbox, background })
// scene("juego", () => { ... })   go("juego")
//
// Lo nuevo — dentro de scene("juego"), en cualquier punto:
onUpdate(() => {
  // esto corre ~60 veces por segundo
  // deriva suave, para ver el bucle en acción:
  jugador.pos.x += 40 * dt();
})`,
        solucion: `// starter/main.js — reto de la sala 1, dentro de scene("juego")
let reloj = 0;

onUpdate(() => {
  // 1) contador que se reinicia al llegar a 300
  reloj += dt() * 60;
  if (reloj >= 300) reloj = 0;

  // 2) el jugador cambia de color cada 2 segundos
  const t = Math.floor(time() / 2) % 2;
  jugador.color = rgb(t ? 94 : 255, t ? 231 : 209, 255);
})`,
        demo(box) {
            const { x, y, w, h } = box;
            let frames = 0;
            const info = add([
                text("fotogramas: 0", { size: 18 }),
                pos(x + 14, y + 40),
                color(PALETA.cuerpo),
            ]);
            onUpdate(() => {
                frames++;
                info.text = "fotogramas: " + frames;
            });

            // El cuadro del snippet, rebotando con su propio onUpdate().
            const c = add([
                rect(44, 44), pos(x + w / 2, y + h / 2),
                anchor("center"), color("#ffd166"), rotate(0),
            ]);
            let vx = 160, vy = 120;
            c.onUpdate(() => {
                c.angle += 90 * dt();
                c.pos.x += vx * dt();
                c.pos.y += vy * dt();
                const r = 26;
                if (c.pos.x < x + r || c.pos.x > x + w - r) vx *= -1;
                if (c.pos.y < y + r || c.pos.y > y + h - r) vy *= -1;
            });

            // add() en caliente: cada ESPACIO lanza un cuadro que se desvanece.
            onKeyPress("space", () => {
                add([
                    rect(20, 20),
                    pos(x + 30, y + 30),
                    color("#5ee7ff"),
                    opacity(1),
                    move(rand(0, 360), 240),
                    lifespan(1.4, { fade: 0.6 }),
                    "demo",
                ]);
                play("select");
            });
        },
    },

    // -------------------------------------------------------------- 2
    {
        titulo: "Físicas · pos, area, body",
        hora: "00:15 – 00:45",
        paneles: [
            {
                t: "pos() · area() · body()",
                b: "pos(x, y) coloca el objeto. area() dibuja la caja invisible con la que choca. body() lo hace caer con gravedad. Sin area() no hay colisiones: atraviesas las plataformas.",
            },
            {
                t: "Suelo y salto",
                b: "Al suelo: body({ isStatic: true }) para que no se caiga. Al héroe: body() normal y jump() solo si isGrounded(). Ajusta setGravity() hasta que el salto se sienta bien.",
            },
        ],
        reto: "Retos · en tu starter, al terminar el bloque: sube la gravedad a 4000 (salto corto, juego tenso) y añade una segunda plataforma al array PLATAFORMAS.",
        controles: "A/D: mover · ESPACIO: saltar",
        snippetDonde: "SNIPPET · pégalo dentro de scene(\"juego\") · es tu TODO 1",
        codigo: `const VELOCIDAD = 360;

onKeyDown("d", () => {
  jugador.pos.x += VELOCIDAD * dt();
});
onKeyDown("a", () => {
  jugador.pos.x -= VELOCIDAD * dt();
});

onKeyPress("space", () => {
  if (jugador.isGrounded()) jugador.jump();
})`,
        solucion: `// TODO 1 completo (starter/main.js)
const VELOCIDAD = 360;

onKeyDown("d", () => { jugador.pos.x += VELOCIDAD * dt(); });
onKeyDown("a", () => { jugador.pos.x -= VELOCIDAD * dt(); });
onKeyDown("right", () => { jugador.pos.x += VELOCIDAD * dt(); });
onKeyDown("left", () => { jugador.pos.x -= VELOCIDAD * dt(); });

function saltar() {
  if (jugador.isGrounded()) jugador.jump();
}
onKeyPress("space", saltar);
onKeyPress("w", saltar);
onKeyPress("up", saltar);

// Reto: setGravity(4000) y una 2ª plataforma en PLATAFORMAS`,
        demo(box) {
            const { x, y, w, h } = box;
            setGravity(2400);

            add([
                rect(w, 60), pos(x, y + h - 60),
                color("#2b3370"), area(), body({ isStatic: true }),
                "demo",
            ]);
            add([
                rect(150, 18), pos(x + w - 190, y + h - 150),
                color("#2b3370"), area(), body({ isStatic: true }),
                "demo",
            ]);

            const hero = add([
                rect(34, 48), pos(x + 60, y + 40),
                color(PALETA.acento), area(),
                body({ jumpForce: 1000 }),
                "demo",
            ]);

            const estado = add([
                text("isGrounded(): ?", { size: 16 }),
                pos(x + 14, y + 14),
                color(PALETA.cuerpo),
            ]);
            hero.onUpdate(() => {
                estado.text = "isGrounded(): " + hero.isGrounded();
            });

            onKeyDown("a", () => { hero.pos.x -= 320 * dt(); });
            onKeyDown("d", () => { hero.pos.x += 320 * dt(); });
            onKeyPress("space", () => {
                if (hero.isGrounded()) {
                    hero.jump();
                    play("jump");
                }
            });
            // Si cae fuera del recuadro, vuelve a empezar.
            onUpdate(() => {
                if (hero.pos.y > y + h + 80) hero.pos = vec2(x + 60, y + 40);
                if (hero.pos.x < x) hero.pos.x = x;
                if (hero.pos.x > x + w - 40) hero.pos.x = x + w - 40;
            });
        },
    },

    // -------------------------------------------------------------- 3
    {
        titulo: "Game States · tags y onCollide",
        hora: "00:45 – 01:25",
        paneles: [
            {
                t: "Tags",
                b: "Añade strings al final de add([...]): \"jugador\", \"enemigo\". Son etiquetas para pedir get(\"enemigo\") o, sobre todo, para chocar por nombres con onCollide().",
            },
            {
                t: "onCollide() y estados",
                b: "onCollide(\"a\", \"b\", cb) se dispara cuando dos etiquetas se tocan. Dentro decides: destruir, sumar puntos o cambiar de escena con scene() y go(). Eso es un estado del juego.",
            },
        ],
        reto: "Retos · en tu starter, al terminar el bloque: añade un 5.º enemigo con patrulla VERTICAL (igual que el horizontal, pero moviendo pos.y con su propio desde/hasta).",
        controles: "A/D: mover · ESPACIO: saltar",
        snippetDonde: "SNIPPET · pégalo en scene(\"juego\") tras tus 4 crearEnemigo · es tu TODO 2",
        codigo: `const pies = jugador.pos.y + jugador.height;
if (jugando && jugador.vel.y >= 0
 && jugador.pos.x < e.pos.x + e.width
 && jugador.pos.x + jugador.width > e.pos.x
 && pies > e.pos.y - 6
 && pies < e.pos.y + e.height / 2) {
  const py = e.pos.y, d = e.desde, h = e.hasta;
  e.destroy();
  wait(2, () => { if (!jugando) return;
    const lejos = jugador.pos.x < (d+h)/2 ? h : d;
    crearEnemigo(lejos, py, d, h); });
}
onCollide("jugador", "enemigo", () => {
  jugando = false; go("gameover", puntos);
})`,
        solucion: `// TODO 2 · pisotón por SOLAPE dentro de crearEnemigo (onCollide no
// ve el aterrizaje vertical: KAPLAY lo resuelve sin disparar el choque)
const pies = jugador.pos.y + jugador.height;
if (jugando && jugador.vel.y >= 0 && jugador.exists()
  && jugador.pos.x < e.pos.x + e.width
  && jugador.pos.x + jugador.width > e.pos.x
  && pies > e.pos.y - 6 && pies < e.pos.y + e.height / 2) {
  const py = e.pos.y, d = e.desde, h = e.hasta;
  e.destroy();
  wait(2, () => { if (!jugando) return;
    const lejos = jugador.pos.x < (d+h)/2 ? h : d;
    crearEnemigo(lejos, py, d, h); });
}
// Choque de LADO → onCollide (fuera de crearEnemigo):
onCollide("jugador", "enemigo", () => {
  jugando = false; go("gameover", puntos);
});

// RETO — 5.º enemigo con patrulla vertical (dentro de scene("juego"))
const ev = add([rect(44, 44), pos(640, 330),
  color(COL.enemigo), area(), body({ isStatic: true }),
  { dir: 1, v: 90, desde: 300, hasta: 430 }, "enemigo"]);
ev.onUpdate(() => {
  ev.pos.y += ev.dir * ev.v * dt();
  if (ev.pos.y <= ev.desde || ev.pos.y >= ev.hasta) ev.dir *= -1;
});`,
        demo(box) {
            const { x, y, w, h } = box;
            setGravity(2400);
            let puntos = 0;
            let muerto = false;

            add([
                rect(w, 56), pos(x, y + h - 56),
                color("#2b3370"), area(), body({ isStatic: true }),
                "demo",
            ]);
            const marcador = add([
                text("PUNTOS: 0", { size: 22 }),
                pos(x + 14, y + 12),
                color(PALETA.titulo),
            ]);
            const aviso = add([
                text("", { size: 30, width: w - 28, align: "center" }),
                pos(x + 14, y + h / 2 - 44),
                color(PALETA.enemigo),
            ]);

            const jugador = add([
                rect(34, 46), pos(x + 50, y + 60),
                color(PALETA.acento), area(),
                body({ jumpForce: 700 }),
                "jugador",
            ]);

            function crearEnemigo(px) {
                const e = add([
                    rect(34, 34), pos(px, y + h - 90),
                    color(PALETA.enemigo), area(),
                    body({ isStatic: true }),
                    { dir: 1, velocidad: 90 },
                    "enemigo",
                ]);
                e.onUpdate(() => {
                    if (muerto) return;
                    e.pos.x += e.dir * e.velocidad * dt();
                    if (e.pos.x < x + 40 || e.pos.x > x + w - 74) e.dir *= -1;
                    // PISOTÓN por solape (onCollide no ve el aterrizaje vertical)
                    const pies = jugador.pos.y + jugador.height;
                    if (jugador.vel.y >= 0
                        && jugador.pos.x < e.pos.x + e.width
                        && jugador.pos.x + jugador.width > e.pos.x
                        && pies > e.pos.y - 6 && pies < e.pos.y + e.height / 2) {
                        e.destroy();
                        puntos += 100;
                        marcador.text = "PUNTOS: " + puntos;
                        play("stomp");
                        shake(4);
                        jugador.jump(600);
                        wait(1, () => crearEnemigo(x + w - 140));
                    }
                });
                return e;
            }
            crearEnemigo(x + w - 140);

            jugador.onUpdate(() => {
                if (jugador.pos.y > y + h + 80) jugador.pos = vec2(x + 50, y + 60);
                if (jugador.pos.x < x) jugador.pos.x = x;
                if (jugador.pos.x > x + w - 36) jugador.pos.x = x + w - 36;
            });
            onKeyDown("a", () => { if (!muerto) jugador.pos.x -= 330 * dt(); });
            onKeyDown("d", () => { if (!muerto) jugador.pos.x += 330 * dt(); });
            onKeyPress("space", () => {
                if (!muerto && jugador.isGrounded()) {
                    jugador.jump();
                    play("jump");
                }
            });

            onCollide("jugador", "enemigo", (j, e) => {
                if (!e.exists() || muerto) return;
                const pisandolo = j.vel.y >= 0 && j.pos.y + j.height < e.pos.y + e.height / 2;
                if (pisandolo) {
                    e.destroy();
                    puntos += 100;
                    marcador.text = "PUNTOS: " + puntos;
                    play("stomp");
                    shake(4);
                    j.jump(600);
                    wait(1, () => crearEnemigo(x + w - 140));
                } else {
                    muerto = true;
                    play("hurt");
                    shake(8);
                    aviso.text = "GAME OVER · pulsa R";
                }
            });

            onKeyPress("r", () => go("sala", 2));
        },
    },

    // -------------------------------------------------------------- 4
    {
        titulo: "Puntuación · text()",
        hora: "01:25 – 01:40",
        paneles: [
            {
                t: "Marcador con text()",
                b: "text(\"PUNTOS: 0\", { size: 44 }) crea el texto. Para actualizarlo no lo recreas: cambias su propiedad .text. Se redibuja solo en el siguiente fotograma.",
            },
            {
                t: "HUD fijo",
                b: "fixed() deja el texto pegado a la pantalla aunque la cámara se mueva. Los objetos del mundo (monedas, enemigos) no lo llevan. Escala extra: tween() para animar el cambio.",
            },
        ],
        reto: "Retos · en tu starter, al terminar el bloque: un text(\"+100\") flotante con lifespan(0.8, { fade: 0.4 }) que suba al puntuar.",
        controles: "A/D: mover · ESPACIO: saltar",
        snippetDonde: "SNIPPET · tu marcador ya existe y se llama hud · es tu TODO 3",
        codigo: `function refrescarHud() {
  hud.text = "PUNTOS: " + puntos
    + "   META: 1000";
}

// dentro del pisotón (onCollide), tras e.destroy():
puntos += 100;
refrescarHud();
play("pickup");`,
        solucion: `// TODO 3 completo (starter/main.js)
function refrescarHud() {
  hud.text = "PUNTOS: " + puntos + "   META: 1000";
}

// en la rama del pisotón de onCollide:
const px = e.pos.x, py = e.pos.y;
e.destroy();
puntos += 100;
refrescarHud();
play("pickup");

// Extra: "+100" flotante
const f = add([
  text("+100", { size: 34, font: "happy" }),
  pos(px, py - 30), anchor("center"),
  color(COL.bien), opacity(1),
  lifespan(0.8, { fade: 0.4 }), z(90),
]);
f.onUpdate(() => { f.pos.y -= 70 * dt(); });`,
        demo(box) {
            const { x, y, w, h } = box;
            setGravity(2400);
            let puntos = 0;

            add([
                rect(w, 52), pos(x, y + h - 52),
                color("#2b3370"), area(), body({ isStatic: true }),
                "demo",
            ]);
            const marcador = add([
                text("PUNTOS: 0", { size: 30 }),
                pos(x + 14, y + 12),
                color(PALETA.titulo),
                fixed(),
            ]);

            const jugador = add([
                rect(34, 44), pos(x + 50, y + 70),
                color(PALETA.acento), area(),
                body({ jumpForce: 900 }),
                "demo",
            ]);

            function crearMoneda(px) {
                return add([
                    sprite("star"), pos(px, y + h - 110),
                    anchor("center"), scale(1.1), area(),
                    "moneda", "demo",
                ]);
            }
            let moneda = crearMoneda(x + w - 120);

            function sumar(n, px, py) {
                puntos += n;
                marcador.text = "PUNTOS: " + puntos;
                play("pickup");
                const f = add([
                    text("+" + n, { size: 24 }),
                    pos(px, py), color(PALETA.bien),
                    opacity(1), lifespan(0.7, { fade: 0.4 }),
                    "demo",
                ]);
                f.onUpdate(() => { f.pos.y -= 40 * dt(); });
            }

            jugador.onCollide("moneda", (m) => {
                if (!m.exists()) return;
                const px = m.pos.x, py = m.pos.y;
                m.destroy();
                sumar(10, px, py);
                wait(0.8, () => { moneda = crearMoneda(x + 60 + rand(0, w - 200)); });
            });

            jugador.onUpdate(() => {
                if (jugador.pos.y > y + h + 80) jugador.pos = vec2(x + 50, y + 60);
                if (jugador.pos.x < x) jugador.pos.x = x;
                if (jugador.pos.x > x + w - 36) jugador.pos.x = x + w - 36;
            });
            onKeyDown("a", () => { jugador.pos.x -= 340 * dt(); });
            onKeyDown("d", () => { jugador.pos.x += 340 * dt(); });
            onKeyPress("space", () => {
                if (jugador.isGrounded()) {
                    jugador.jump();
                    play("jump");
                }
            });
        },
    },

    // -------------------------------------------------------------- 5
    {
        titulo: "Cierre · tu MVP jugable",
        hora: "01:40 – 02:00",
        paneles: [
            {
                t: "Lo que ya tienes",
                b: "Jugador, gravedad, plataformas, colisiones por tags, enemigos, puntuación y sonido. Es feo, pero se juega: eso es un MVP, y eso es lo que se celebra hoy.",
            },
            {
                t: "Mañana subimos el listón",
                b: "Sprites y sonido real, parallax, vida e ítems, un jefe con proyectiles, partículas y récord en localStorage. Compara tu código con solucion-dia1/ antes de irte.",
            },
        ],
        reto: "Retos · en tu starter, al terminar el bloque: victoria con un contador de intentos, sonido extra al caer y flash(\"#ff2d55\", 0.3) al morir.",
        controles: "A/D: mover · ESPACIO: saltar · R: reiniciar",
        snippetDonde: "MAPA · repaso del MVP — así queda tu código al cerrar",
        codigo: `// Tu MVP al final del Día 1, como mapa de conceptos
// 1. Mundo      : setGravity + suelo y plataformas
// 2. Jugador    : rect + area + body + salto
// 3. Enemigos   : crearEnemigo() + patrulla con onUpdate()
// 4. Colisiones : onCollide + pisotón + reaparece a los 2 s
// 5. Puntos     : refrescarHud() -> "PUNTOS: x  META: 1000"
// 6. Sonido     : play("jump"), play("stomp"), play("hurt")
// 7. Estados    : scene("juego") -> go("victoria") a 1000`,
        solucion: `// Victoria y sonidos — TODO 4 (starter/main.js)
// dentro de onCollide, tras sumar los puntos:
if (puntos >= 1000) {
  jugando = false;
  play("victory");
  wait(0.9, () => go("victoria", puntos));
}

// en la rama lateral (else):
play("hurt");
shake(12);
wait(0.7, () => go("gameover", puntos));

// y en el salto:
function saltar() {
  if (jugador.isGrounded()) {
    jugador.jump();
    play("jump");
  }
}`,
        demo(box) {
            const { x, y, w, h } = box;

            function construir() {
                setGravity(2400);
                const META = 300;     // en tu juego real: 1000 (10 pisotones)
                let puntos = 0;
                let jugando = true;

                add([
                    rect(w, 54), pos(x, y + h - 54),
                    color("#2b3370"), area(), body({ isStatic: true }),
                    "demo",
                ]);
                add([
                    rect(160, 16), pos(x + w - 210, y + h - 140),
                    color("#2b3370"), area(), body({ isStatic: true }),
                    "demo",
                ]);

                const hud = add([
                    text("PUNTOS: 0   META: 300", { size: 20 }),
                    pos(x + 14, y + 12),
                    color(PALETA.titulo),
                ]);
                const fin = add([
                    text("", { size: 34 }),
                    pos(x + w / 2 - 170, y + h / 2 - 30),
                    color(PALETA.bien),
                ]);

                const hero = add([
                    rect(32, 44), pos(x + 40, y + 60),
                    color(PALETA.acento), area(),
                    body({ jumpForce: 950 }),
                    "jugador",
                ]);

                function crearEnemigo(px, desde, hasta) {
                    const e = add([
                        rect(32, 32), pos(px, y + h - 86),
                        color(PALETA.enemigo), area(),
                        body({ isStatic: true }),
                        { dir: 1, velocidad: 85, desde, hasta },
                        "enemigo",
                    ]);
                    e.onUpdate(() => {
                        e.pos.x += e.dir * e.velocidad * dt();
                        if (e.pos.x < desde || e.pos.x > hasta) e.dir *= -1;
                        // PISOTÓN por solape (onCollide no ve el aterrizaje vertical)
                        const pies = hero.pos.y + hero.height;
                        if (jugando && hero.vel.y >= 0
                            && hero.pos.x < e.pos.x + e.width
                            && hero.pos.x + hero.width > e.pos.x
                            && pies > e.pos.y - 6 && pies < e.pos.y + e.height / 2) {
                            e.destroy();
                            puntos += 100;
                            hud.text = "PUNTOS: " + puntos + "   META: " + META;
                            play("stomp");
                            shake(4);
                            hero.jump(700);
                            wait(1.5, () => {
                                if (!jugando) return;
                                const lejos = hero.pos.x < (desde + hasta) / 2 ? hasta : desde;
                                crearEnemigo(lejos, desde, hasta);
                            });
                            if (puntos >= META) {
                                jugando = false;
                                fin.text = "¡META LOGRADA! (R)";
                                play("victory");
                                wait(1.2, () => go("sala", 4));
                            }
                        }
                    });
                    return e;
                }
                const izq = x + 30, der = x + w - 62;
                crearEnemigo(x + w - 150, izq, der);
                crearEnemigo(x + w - 320, izq, der);

                hero.onUpdate(() => {
                    if (hero.pos.y > y + h + 80) hero.pos = vec2(x + 40, y + 60);
                    if (hero.pos.x < x) hero.pos.x = x;
                    if (hero.pos.x > x + w - 34) hero.pos.x = x + w - 34;
                });
                onKeyDown("a", () => { if (jugando) hero.pos.x -= 350 * dt(); });
                onKeyDown("d", () => { if (jugando) hero.pos.x += 350 * dt(); });
                onKeyPress("space", () => {
                    if (!jugando) return;
                    if (hero.isGrounded()) {
                        hero.jump();
                        play("jump");
                    }
                });

                hero.onCollide("enemigo", (e) => {
                    if (!e.exists() || !jugando) return;
                    const cae = hero.vel.y >= 0
                        && hero.pos.y + hero.height < e.pos.y + e.height / 2;
                    if (cae) {
                        const px = e.pos.x, d = e.desde, fin2 = e.hasta;
                        e.destroy();
                        puntos += 100;
                        hud.text = "PUNTOS: " + puntos + "   META: " + META;
                        play("stomp");
                        shake(4);
                        hero.jump(700);
                        // reaparece lejos de ti (en tu juego: a los 2 s)
                        wait(1.5, () => {
                            if (!jugando) return;
                            const lejos = hero.pos.x < (d + fin2) / 2 ? fin2 : d;
                            crearEnemigo(lejos, d, fin2);
                        });
                        if (puntos >= META) {
                            jugando = false;
                            fin.text = "¡META LOGRADA! (R)";
                            play("victory");
                            wait(1.2, () => go("sala", 4));
                        }
                    } else {
                        // de lado = fin (igual que en tu starter)
                        jugando = false;
                        play("hurt");
                        shake(6);
                        fin.text = "GAME OVER (R)";
                        play("gameover");
                        wait(1.2, () => go("sala", 4));
                    }
                });
            }

            construir();
            onKeyPress("r", () => go("sala", 4));
        },
    },
];
