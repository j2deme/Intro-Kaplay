// SOLUCIÓN DÍA 2 — el MVP del Día 1 crece con sprites, vida, parallax y jefe.
// Un nivel, controles conocidos y comentarios que conectan cada bloque con
// los conceptos del segundo día del taller.
//
// MAPA DE BLOCES = agenda del Día 2 (2 h). Cada bloque está marcado en el
// archivo con su etiqueta "▸ D2-n". Regla de tiempo: lo que dice PEGAR se
// copia tal cual y se explica (3–7 min); lo que dice escribir lo teclean los
// equipos dentro de su franja. Si un bloque se pasa de su marca, se pega.
//
//   D2-1  00:15–00:40  Sprites + sonido ......... loads, jugador, enemigos
//   D2-2  00:40–00:55  Mundo, cámara, parallax .. parallax + mundo   [PEGAR]
//   D2-3  00:55–01:15  Vida, daño e ítems ....... salud, HUD, danar, corazón
//   D2-4  01:15–01:35  Jefe y proyectiles ....... jefe + proyectiles [PEGAR]
//   D2-5  01:35–01:50  Partículas y récord ...... estallar + récord  [PEGAR]
//   D2-6  01:50–02:00  Showcase ................. jugar y enseñar

import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

kaplay({
    width: 1280,
    height: 720,
    letterbox: true,
    pixelDensity: Math.min(Math.max(window.devicePixelRatio || 1, 2), 3), // texto nítido
    background: [10, 12, 30],
});

// ▸ D2-1 · Sprites y sonido (00:15 – 00:40) · escribir (copiar la lista)
loadRoot("../assets/");
loadFont("happy", "fonts/happy.ttf");

for (const nombre of ["bean", "cloud", "grass", "heart", "moon", "sparkles", "star", "zombean", "gigagantrum"]) {
    loadSprite(nombre, "sprites/" + nombre + ".png");
}

loadSound("jump", "sounds/jump.ogg");
loadSound("land", "sounds/land.ogg");
loadSound("stomp", "sounds/stomp.ogg");
loadSound("hurt", "sounds/hurt.ogg");
loadSound("heal", "sounds/heal.ogg");
loadSound("pickup", "sounds/pickup.ogg");
loadSound("projectile", "sounds/projectile.ogg");
loadSound("bosshit", "sounds/boss-hit.ogg");
loadSound("victory", "sounds/victory.ogg");
loadSound("gameover", "sounds/gameover.ogg");
loadSound("select", "sounds/select.ogg");
loadSound("burp", "sounds/crew-burp.mp3");
loadSound("voz", "sounds/crew-bean_voice.wav");

const ANCHO_MUNDO = 2560;
const SUELO_Y = 650;
const GRAVEDAD = 2400;
const VELOCIDAD = 360;
const RECORD_KEY = "snow-bros-record";

const COL = {
    fondo: "#0a0c1e",
    cielo: "#11183b",
    suelo: "#26305f",
    plataforma: "#343d78",
    texto: "#dfe6ff",
    titulo: "#ffd166",
    bien: "#7cff6b",
    peligro: "#ff5c8a",
    acento: "#5ee7ff",
};

const PLATAFORMAS = [
    [200, 530, 280],
    [600, 420, 260],
    [1060, 530, 300],
    [1680, 500, 280],
];

// ▸ D2-5 · Récord local (01:35 – 01:50) · PEGAR (getData/setData = localStorage)
const guardaRecord = (puntos) => {
    const anterior = leerRecord();
    if (puntos > anterior) setData(RECORD_KEY, puntos);
    return Math.max(anterior, puntos);
};

function leerRecord() {
    const valor = getData(RECORD_KEY);
    return typeof valor === "number" && Number.isFinite(valor) ? valor : 0;
}

scene("juego", () => {
    setGravity(GRAVEDAD);

    let puntos = 0;
    let jugando = true;
    let invulnerable = false;
    let blinkTime = 0;
    let estabaEnSuelo = true;
    let landBloqueado = false;
    let record = leerRecord();
    let jefeDerrotado = false;

    // --------------------------------------------------------------- cámara
    // Se registra ANTES que los callbacks de las capas: update() recorre los
    // hijos en orden de inserción y, si una capa lee la cámara del frame
    // anterior, se queda 1 frame de retraso (~6 px mientras la cámara camina).
    function actualizarCamara() {
        setCamPos(clamp(jugador.pos.x, 640, ANCHO_MUNDO - 640), 360);
    }
    add([pos(0, 0)]).onUpdate(actualizarCamara);

    // ▸ D2-2 · Parallax (00:40 – 00:55) · PEGAR de este archivo
    // -------------------------------------------------------------- parallax
    // Cada capa se desplaza solo la fracción (1 - factor) que se mueve la
    // cámara: factor 1 = mundo (se mueve con todo), factor 0 = pantalla fija.
    const cielo = add([
        rect(5000, 720),
        pos(-1600, 0),
        color(COL.cielo),
        z(-50),
    ]);
    cielo.onUpdate(() => {
        cielo.pos.x = -1600 + 0.95 * (getCamPos().x - 640);
    });

    function capa(componentes, x, y, factor, profundidad) {
        const obj = add([
            ...componentes,
            pos(x, y),
            { parallaxFactor: factor, parallaxBaseX: x },
            z(profundidad),
        ]);
        obj.onUpdate(() => {
            obj.pos.x = obj.parallaxBaseX
                + (1 - obj.parallaxFactor) * (getCamPos().x - 640);
        });
        return obj;
    }

    for (const [x, y, size] of [
        [130, 100, 32], [390, 210, 24], [780, 80, 28],
        [1190, 155, 22], [1570, 85, 30], [2050, 170, 25],
        [2320, 95, 28],
    ]) {
        capa([sprite("star", { width: size, height: size }), opacity(0.8)], x, y, 0.03, -40);
    }
    capa([sprite("moon", { width: 160, height: 160 })], 170, 105, 0.05, -39);

    for (const [x, y, w, h] of [
        [40, 340, 540, 280], [680, 390, 620, 230],
        [1390, 330, 540, 290], [1950, 400, 580, 220],
    ]) {
        capa([rect(w, h, { radius: 120 }), color("#202952")], x, y, 0.55, -20);
    }

    for (const [x, y, w] of [
        [110, 170, 150], [540, 230, 190], [1010, 130, 170],
        [1450, 195, 210], [1930, 120, 170], [2290, 205, 160],
    ]) {
        capa([sprite("cloud", { width: w, height: Math.round(w * 0.55) }), opacity(0.72)], x, y, 0.3, -30);
    }

    // --------------------------------------------------------------- mundo
    // ▸ D2-2 · Mundo y parallax (00:40 – 00:55) · PEGAR de este archivo
    add([
        rect(ANCHO_MUNDO, 70),
        pos(0, SUELO_Y),
        color(COL.suelo),
        area(),
        body({ isStatic: true }),
        z(0),
        "suelo",
    ]);

    // El sprite "grass" es un bloque de 64×64 (hierba arriba, tierra abajo).
    // Lo mozaicamos a tamaño nativo: estirarlo a 2560 px con el filtro
    // nearest deja escalones de 40 px en la línea ondulada.
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
    techoDeHierba(0, SUELO_Y, ANCHO_MUNDO, 70, 1);

    for (const [x, y, w] of PLATAFORMAS) {
        add([
            rect(w, 22),
            pos(x, y),
            color(COL.plataforma),
            area(),
            body({ isStatic: true }),
            z(2),
            "plataforma",
        ]);
        techoDeHierba(x, y, w, 64, 3);
    }

    // -------------------------------------------------------------- jugador
    // ▸ D2-1 · Sprites (00:15 – 00:40) · escribir: rect() → sprite() y
    //   anchor("bot") para que los pies se queden clavados al hacer squash.
    const jugador = add([
        sprite("bean", { width: 78, height: 68 }),
        pos(80, SUELO_Y),
        anchor("bot"),
        area(),
        body({ jumpForce: 1250 }),
        health(3, 3),
        scale(1),
        z(10),
        "jugador",
    ]);

    // (La cámara se actualiza en el callback registrado al inicio de la escena,
    //  antes que los de las capas parallax.)

    function escalarJugador(destino) {
        tween(jugador.scale, destino, 0.08, (valor) => {
            jugador.scale = valor;
        }, easings.easeOutQuad).then(() => {
            tween(jugador.scale, vec2(1, 1), 0.12, (valor) => {
                jugador.scale = valor;
            }, easings.easeOutBack);
        });
    }

    const limitarJugador = () => {
        jugador.pos.x = clamp(jugador.pos.x, 0, ANCHO_MUNDO - 78);
        if (jugador.pos.y > SUELO_Y + 180) jugador.pos = vec2(80, SUELO_Y);
    };
    jugador.onUpdate(() => {
        limitarJugador();
        if (jugando && invulnerable) {
            blinkTime += dt();
            jugador.opacity = Math.floor(blinkTime * 14) % 2 === 0 ? 0.35 : 1;
        } else {
            jugador.opacity = 1;
        }

        if (!jugador.isGrounded()) {
            estabaEnSuelo = false;
        } else if (!estabaEnSuelo) {
            estabaEnSuelo = true;
            if (!landBloqueado) {
                play("land");
                escalarJugador(vec2(1.15, 0.82));
                landBloqueado = true;
                wait(0.3, () => { landBloqueado = false; });
            }
        }
    });

    const moverIzquierda = () => {
        if (jugando) jugador.pos.x -= VELOCIDAD * dt();
    };
    const moverDerecha = () => {
        if (jugando) jugador.pos.x += VELOCIDAD * dt();
    };
    onKeyDown("a", moverIzquierda);
    onKeyDown("left", moverIzquierda);
    onKeyDown("d", moverDerecha);
    onKeyDown("right", moverDerecha);

    function saltar() {
        if (!jugando || !jugador.isGrounded()) return;
        jugador.jump();
        play("jump");
        escalarJugador(vec2(0.84, 1.18));
    }
    onKeyPress("space", saltar);
    onKeyPress("w", saltar);
    onKeyPress("up", saltar);

    // -------------------------------------------------------------- HUD
    // ▸ D2-3 · Vida (00:55 – 01:15) · escribir: health(3,3) + corazones
    const hud = add([
        text("", { size: 25, font: "happy" }),
        pos(22, 14),
        fixed(),
        color(COL.titulo),
        z(100),
    ]);
    const corazones = [0, 1, 2].map((i) => add([
        sprite("heart", { width: 32, height: 30 }),
        pos(24 + i * 38, 52),
        fixed(),
        z(100),
    ]));
    const ayuda = add([
        text("A/D o ←/→: mover  ·  ESPACIO: saltar  ·  R: reiniciar", { size: 18 }),
        pos(22, 688),
        fixed(),
        color(COL.texto),
        opacity(0.8),
        z(100),
    ]);

    const etiquetaJefe = add([
        text("JEFE", { size: 18, font: "happy" }),
        pos(900, 18),
        fixed(),
        color(COL.peligro),
        z(100),
        opacity(0),
    ]);
    add([
        rect(320, 18),
        pos(900, 44),
        fixed(),
        color("#4a2440"),
        z(99),
        opacity(0),
    ]);
    const barraJefe = add([
        rect(320, 18),
        pos(900, 44),
        fixed(),
        color(COL.peligro),
        z(100),
        opacity(0),
    ]);

    function actualizarHud() {
        hud.text = "PUNTOS: " + puntos + "   RÉCORD: " + record;
        const vida = jugador.hp();
        corazones.forEach((corazon, i) => {
            corazon.opacity = i < vida ? 1 : 0.22;
        });
    }

    // ▸ D2-5 · Partículas (01:35 – 01:50) · PEGAR de este archivo
    // -------------------------------------------------------------- efectos
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
            }, {
                direction: 0,
                spread: 180,
            }),
            z(20),
        ]);
        emisor.emit(cantidad);
        wait(1.3, () => {
            if (emisor.exists()) emisor.destroy();
        });
    }

    function mostrarPuntos(cantidad, px, py) {
        puntos += cantidad;
        record = guardaRecord(puntos);
        actualizarHud();
        play("pickup");
        const flotante = add([
            text("+" + cantidad, { size: 30, font: "happy" }),
            pos(px, py),
            anchor("center"),
            color(COL.bien),
            opacity(1),
            lifespan(0.85, { fade: 0.4 }),
            z(30),
        ]);
        flotante.onUpdate(() => { flotante.pos.y -= 55 * dt(); });
    }

    // ▸ D2-3 · Daño e invulnerabilidad (00:55 – 01:15) · PEGAR y explicar
    function danar(cantidad, origenX) {
        if (!jugando || invulnerable) return;
        jugador.hurt(cantidad);
        invulnerable = true;
        blinkTime = 0;
        jugador.pos.x = clamp(
            jugador.pos.x + (jugador.pos.x < origenX ? -90 : 90),
            0,
            ANCHO_MUNDO - 78,
        );
        jugador.jump(320);
        play("hurt");
        play("burp");
        shake(8);
        flash("#ff2d55", 0.22);
        actualizarHud();

        if (jugador.hp() <= 0) {
            jugando = false;
            wait(0.5, () => go("gameover", puntos, record));
            return;
        }
        wait(1, () => {
            invulnerable = false;
            blinkTime = 0;
        });
    }

    // -------------------------------------------------------------- enemigos
    // ▸ D2-1 · Sprites (00:15 – 00:40) · escribir: mismo patrullaje del
    //   Día 1 pero con sprite y anchor("bot") (los límites son centros).
    function crearEnemigo(px, yPie, desde, hasta) {
        const enemigo = add([
            sprite("zombean", { width: 72, height: 63 }),
            pos(px, yPie),
            anchor("bot"),
            area(),
            body({ isStatic: true }),
            { patrolDir: 1, patrolSpeed: 105, patrolMin: desde, patrolMax: hasta },
            scale(1),
            z(8),
            "enemigo",
        ]);
        enemigo.onUpdate(() => {
            enemigo.pos.x += enemigo.patrolDir * enemigo.patrolSpeed * dt();
            if (enemigo.pos.x <= enemigo.patrolMin || enemigo.pos.x >= enemigo.patrolMax) {
                enemigo.patrolDir *= -1;
                enemigo.pos.x = clamp(enemigo.pos.x, enemigo.patrolMin, enemigo.patrolMax);
            }
            enemigo.scale.x = enemigo.patrolDir;
        });
        return enemigo;
    }

    crearEnemigo(380, SUELO_Y, 330, 560);
    crearEnemigo(860, SUELO_Y, 760, 1080);
    crearEnemigo(340, 530, 245, 435);
    crearEnemigo(1210, 530, 1105, 1315);

    // -------------------------------------------------------------- item vida
    // ▸ D2-3 · Vida y objetos (00:55 – 01:15) · escribir
    // Subido a316: el jugador de pie sobre la plataforma 2 alcanza hasta352,
    // así que ahora hace falta un salto corto para conseguirlo.
    const CORAZON_Y = 316;
    const corazon = add([
        sprite("heart", { width: 44, height: 42 }),
        pos(730, CORAZON_Y),
        anchor("center"),
        area(),
        z(9),
        "item-vida",
    ]);
    let faseCorazon = 0;
    corazon.onUpdate(() => {
        faseCorazon += dt() * 2.4;
        corazon.pos.y = CORAZON_Y + Math.sin(faseCorazon) * 8;
    });
    jugador.onCollide("item-vida", (item) => {
        if (!jugando || !item.exists()) return;
        const px = item.pos.x, py = item.pos.y;
        item.destroy();
        if (jugador.hp() < jugador.maxHP()) {
            jugador.heal(1);
            play("heal");
        } else {
            play("pickup");
        }
        estallar(px, py, 18, ["#ff5c8a", "#ffd166", "#ffffff"]);
        actualizarHud();
    });

    // -------------------------------------------------------------- jefe
    // ▸ D2-4 · Jefe (01:15 – 01:35) · PEGAR de este archivo
    const jefe = add([
        sprite("gigagantrum", { width: 183, height: 180 }),
        pos(2210, SUELO_Y),
        anchor("bot"),
        area(),
        body({ isStatic: true }),
        health(6, 6),
        { patrolDir: -1, patrolSpeed: 72, patrolMin: 2080, patrolMax: 2360 },
        scale(1),
        z(9),
        "jefe",
    ]);
    jefe.onUpdate(() => {
        if (jefeDerrotado) return;
        jefe.pos.x += jefe.patrolDir * jefe.patrolSpeed * dt();
        if (jefe.pos.x <= jefe.patrolMin || jefe.pos.x >= jefe.patrolMax) {
            jefe.patrolDir *= -1;
            jefe.pos.x = clamp(jefe.pos.x, jefe.patrolMin, jefe.patrolMax);
        }
        jefe.scale.x = jefe.patrolDir;
        const visible = jugador.pos.x > 1500;
        etiquetaJefe.opacity = visible ? 1 : 0;
        barraJefe.opacity = visible ? 1 : 0;
        barraJefe.width = 320 * jefe.hp() / jefe.maxHP();
    });

    function dispararProyectil() {
        if (!jugando || jefeDerrotado || !jefe.exists() || jugador.pos.x <= 1750) return;
        const dir = jugador.pos.x < jefe.pos.x ? -1 : 1;
        add([
            rect(24, 14, { radius: 6 }),
            // -45: alineado con el cuerpo del jugador de pie (los pies en650
            // y la cabeza en582); con -96 pasaba21 px por encima de su cabeza.
            pos(jefe.pos.x + dir * 90, jefe.pos.y - 45),
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
    loop(1.5, dispararProyectil);

    function golpeAlJefe() {
        if (jefeDerrotado) return;
        jefe.hurt(1);
        play("bosshit");
        shake(5);
        estallar(jefe.pos.x, jefe.pos.y - 90, 12, ["#ff5c8a", "#ffd166"]);
        mostrarPuntos(50, jefe.pos.x, jefe.pos.y - 150);
        if (jefe.hp() <= 0) {
            jefeDerrotado = true;
            jugando = false;
            // Guardamos la posición antes de destruirlo para el estallido final.
            const px = jefe.pos.x, py = jefe.pos.y;
            jefe.destroy();
            for (const proyectil of get("proyectil")) proyectil.destroy();
            estallar(px, py - 90, 50, ["#ff5c8a", "#ffd166", "#5ee7ff"]);
            play("victory");
            play("voz");
            wait(1.2, () => go("victoria", puntos, record));
        }
    }

    // ▸ D2-1 · Colisiones (00:15 – 00:40) · escribir: sustituye la fórmula
    //   geométrica del Día 1 por col.isBottom() (empuja al jugador hacia arriba).
    let jefeStompBloqueado = false;
    onCollide("jugador", "enemigo", (j, enemigo, col) => {
        if (!jugando || !enemigo.exists() || invulnerable) return;
        if (col.isBottom()) {
            const px = enemigo.pos.x, py = enemigo.pos.y - 42;
            enemigo.destroy();
            mostrarPuntos(100, px, py);
            estallar(px, py, 20, ["#ff5c8a", "#ffd166"]);
            play("stomp");
            j.jump(760);
            escalarJugador(vec2(1.15, 0.82));
        } else {
            danar(1, enemigo.pos.x);
        }
    });

    onCollide("jugador", "jefe", (j, objetivo, col) => {
        if (!jugando || jefeDerrotado || !objetivo.exists()) return;
        if (col.isBottom()) {
            if (jefeStompBloqueado) return;
            jefeStompBloqueado = true;
            golpeAlJefe();
            j.jump(820);
            escalarJugador(vec2(1.15, 0.82));
            wait(0.35, () => { jefeStompBloqueado = false; });
        } else {
            danar(1, objetivo.pos.x);
        }
    });

    onCollide("jugador", "proyectil", (j, proyectil) => {
        if (!proyectil.exists()) return;
        const origenX = proyectil.pos.x;
        proyectil.destroy();
        danar(1, origenX);
    });

    onKeyPress("r", () => {
        play("select");
        go("juego");
    });

    actualizarHud();
});

scene("gameover", (puntos = 0, record = 0) => {
    add([
        text("GAME OVER", { size: 92, font: "happy" }),
        pos(width() / 2, 220),
        anchor("center"),
        color(COL.peligro),
    ]);
    add([
        text("PUNTOS: " + puntos + "   RÉCORD: " + record, { size: 38, font: "happy" }),
        pos(width() / 2, 340),
        anchor("center"),
        color(COL.titulo),
    ]);
    add([
        text("Pulsa R o ENTER para volver a intentarlo", { size: 27 }),
        pos(width() / 2, 445),
        anchor("center"),
        color(COL.texto),
    ]);
    play("gameover");
    onKeyPress("r", () => go("juego"));
    onKeyPress("enter", () => go("juego"));
});

scene("victoria", (puntos = 0, record = 0) => {
    add([
        text("¡NIVEL SUPERADO!", { size: 78, font: "happy" }),
        pos(width() / 2, 220),
        anchor("center"),
        color(COL.bien),
    ]);
    add([
        text("PUNTOS: " + puntos + "   RÉCORD: " + record, { size: 38, font: "happy" }),
        pos(width() / 2, 340),
        anchor("center"),
        color(COL.titulo),
    ]);
    add([
        text("Día 2 completado · Pulsa R o ENTER para jugar de nuevo", { size: 25 }),
        pos(width() / 2, 445),
        anchor("center"),
        color(COL.texto),
    ]);
    onKeyPress("r", () => go("juego"));
    onKeyPress("enter", () => go("juego"));
});

go("juego");

// Se consulta el progreso del loader fuera de los eventos de escena: go()
// limpia sus listeners. El timeout es una red de seguridad para la red lenta.
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
