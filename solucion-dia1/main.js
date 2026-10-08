// solucion-dia1/main.js
// SOLUCIÓN DÍA 1 — el MVP "feo" pero jugable.
// Rectángulos y colores, sin un solo sprite: esto es lo que debería quedar
// al final de las 2 horas. Todo lo bonito (sprites, parallax, vida, jefe,
// partículas, récord) llega mañana en solucion-dia2/.
//
// Orden del archivo = orden de la agenda del Día 1:
//   1. Mundo      2. Jugador   3. Enemigos   4. Colisiones
//   5. Puntos     6. Sonido    7. Estados (escenas)
//
// OBJETIVO del día: "PUNTOS: 1000" → victoria. Cada pisotón vale 100 y el
// enemigo reaparece a los 2 s por el extremo más lejos de ti (10 pisotones).
// De lado pierdes: game over. R reinicia.

import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

// ------------------------------------------------------------------ setup
kaplay({
    width: 1280,
    height: 720,
    letterbox: true,          // barras si la ventana no es 16:9
    pixelDensity: Math.min(Math.max(window.devicePixelRatio || 1, 2), 3), // texto nítido
    background: [10, 12, 30],
});

loadRoot("../assets/");
loadFont("happy", "fonts/happy.ttf");
loadSound("jump", "sounds/jump.ogg");
loadSound("stomp", "sounds/stomp.ogg");
loadSound("hurt", "sounds/hurt.ogg");
loadSound("pickup", "sounds/pickup.ogg");
loadSound("victory", "sounds/victory.ogg");
loadSound("gameover", "sounds/gameover.ogg");

// Paleta del MVP: misma que usa la presentación.
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
// ESCENA: juego
// ==================================================================
scene("juego", () => {
    setGravity(2400);

    let puntos = 0;
    let jugando = true;

    // ---------------------------------------------------------- 1. Mundo
    // Un rectángulo ancho con body({ isStatic: true }) es un suelo:
    // no cae y otras cosas no lo atraviesan (necesita area() para chocar).
    add([
        rect(1280, 60), pos(0, 660),
        color(COL.suelo), area(), body({ isStatic: true }),
        "suelo",
    ]);

    // 4 plataformas estáticas. Sube/baja la segunda coordenada y prueba.
    const PLATAFORMAS = [
        [130, 525, 300],
        [520, 415, 280],
        [930, 545, 260],
        [380, 300, 260],
    ];
    for (const [x, y, w] of PLATAFORMAS) {
        add([
            rect(w, 24), pos(x, y),
            color(COL.plataforma), area(), body({ isStatic: true }),
            "plataforma",
        ]);
    }

    // --------------------------------------------------------- 2. Jugador
    // rect() dibuja, area() choca, body() cae con la gravedad.
    const jugador = add([
        rect(48, 60), pos(80, 560),
        color(COL.jugador), area(),
        body({ jumpForce: 1150 }),
        "jugador",
    ]);

    const VELOCIDAD = 360;
    onKeyDown("a", () => { if (jugando) jugador.pos.x -= VELOCIDAD * dt(); });
    onKeyDown("d", () => { if (jugando) jugador.pos.x += VELOCIDAD * dt(); });
    onKeyDown("left", () => { if (jugando) jugador.pos.x -= VELOCIDAD * dt(); });
    onKeyDown("right", () => { if (jugando) jugador.pos.x += VELOCIDAD * dt(); });

    // Saltar solo si toca el suelo: sin ese if, saltarías en el aire.
    function saltar() {
        if (!jugando) return;
        if (jugador.isGrounded()) {
            jugador.jump();
            play("jump");                       // ← sonido al saltar
        }
    }
    onKeyPress("space", saltar);
    onKeyPress("w", saltar);
    onKeyPress("up", saltar);

    // Estás en una sola pantalla: si sales del borde, vuelve a entrar.
    jugador.onUpdate(() => {
        if (jugador.pos.x < 0) jugador.pos.x = 0;
        if (jugador.pos.x > 1280 - 48) jugador.pos.x = 1280 - 48;
        if (jugador.pos.y > 760) jugador.pos = vec2(80, 400);
    });

    // -------------------------------------------------------- 3. Enemigos
    // "enemigo" es una etiqueta (tag). Con ella chocamos por nombre en
    // onCollide("jugador", "enemigo", ...) y los contamos con get("enemigo").
    function crearEnemigo(px, py, desde, hasta) {
        const e = add([
            rect(44, 44), pos(px, py),
            color(COL.enemigo), area(),
            body({ isStatic: true }),           // no cae: patrulla a mano
            { dir: 1, velocidad: 130, desde, hasta },
            "enemigo",
        ]);
        // Patrulla: avanza y rebota en los límites que le pasamos.
        e.onUpdate(() => {
            e.pos.x += e.dir * e.velocidad * dt();
            if (e.pos.x <= e.desde || e.pos.x >= e.hasta) {
                e.dir *= -1;
                e.pos.x = clamp(e.pos.x, e.desde, e.hasta);
            }
            // PISOTÓN: KAPLAY no dispara onCollide en el aterrizaje vertical
            // (lo resuelve sin evento), así que lo miramos aquí, cada frame:
            // solape horizontal + pies por encima del centro del enemigo
            // (los -6 px de arriba hacen que "tocar la cara superior" cuente).
            const pies = jugador.pos.y + jugador.height;
            if (jugando && jugador.exists() && jugador.vel.y >= 0
                && jugador.pos.x < e.pos.x + e.width
                && jugador.pos.x + jugador.width > e.pos.x
                && pies > e.pos.y - 6
                && pies < e.pos.y + e.height / 2) {
                pisar(e);
            }
        });
        return e;
    }

    // Suelo, suelo y las dos plataformas altas.
    crearEnemigo(140, 616, 60, 460);
    crearEnemigo(860, 616, 720, 1220);
    crearEnemigo(200, 481, 130, 386);           // sobre la plataforma 1
    crearEnemigo(1000, 501, 930, 1146);         // sobre la plataforma 3

    // ----------------------------------------------------------- 5. Puntos
    const hud = add([
        text("PUNTOS: 0   META: 1000", { size: 42, font: "happy" }),
        pos(24, 16),
        fixed(),                                 // pegado a la pantalla
        color(COL.titulo),
        z(100),
    ]);

    const ayuda = add([
        text("A/D o flechas: mover   ·   ESPACIO: saltar   ·   R: reiniciar", { size: 22 }),
        pos(24, 686),
        fixed(),
        color(COL.texto),
        opacity(0.75),
        z(100),
    ]);

    function refrescarHud() {
        hud.text = "PUNTOS: " + puntos + "   META: 1000";
    }

    // Número flotante "+100": text() + lifespan() se lleva de maravilla.
    function sumar(n, px, py) {
        puntos += n;
        refrescarHud();
        play("pickup");
        const f = add([
            text("+" + n, { size: 34, font: "happy" }),
            pos(px, py), anchor("center"),
            color(COL.bien),
            opacity(1),
            lifespan(0.8, { fade: 0.4 }),
            z(90),
        ]);
        f.onUpdate(() => { f.pos.y -= 70 * dt(); });
    }

    // ------------------------------------------------------- 4. Colisiones
    function pisandolo(j, e) {
        // Pisotón = no está saltando hacia arriba Y sus pies están por
        // encima del centro del enemigo. Ojo: es una condición GEOMÉTRICA,
        // no "isFalling()": el aterrizaje puede resolver sin disparar el
        // choque, y el disparo suele llegar cuando el enemigo se le escapa
        // de debajo (vel.y ya es 0 y el pisotón se comería como lateral).
        return j.vel.y >= 0 && j.pos.y + j.height < e.pos.y + e.height / 2;
    }

    // Destruye al enemigo pisado: puntos, rebote y reaparece a los 2 s.
    function pisar(e) {
        const px = e.pos.x, py = e.pos.y;
        const d = e.desde, h = e.hasta;
        e.destroy();
        sumar(100, px, py - 30);
        play("stomp");
        shake(5);
        jugador.jump(700);                       // rebote corto al pisar
        wait(2, () => {                          // vuelve a los 2 s…
            if (!jugando) return;
            const lejos = jugador.pos.x < (d + h) / 2 ? h : d;  // …lejos de ti
            crearEnemigo(lejos, py, d, h);
        });
        if (puntos >= 1000) {                    // ← META: 10 pisotones
            jugando = false;
            play("victory");
            wait(0.9, () => go("victoria", puntos));
        }
    }

    onCollide("jugador", "enemigo", (j, e) => {
        if (!e.exists() || !jugando) return;

        if (pisandolo(j, e)) {
            pisar(e);                            // pisotón (raro: suele ir por solape)
        } else {
            // De lado o por abajo: pierdes. go() cambia de escena.
            jugando = false;
            play("hurt");
            shake(12);
            flash("#ff2d55", 0.3);
            wait(0.7, () => go("gameover", puntos));
        }
    });

    // R siempre reinicia. (Los handlers de esta escena los borra go().)
    onKeyPress("r", () => go("juego"));

    refrescarHud();
});

// ==================================================================
// ESCENA: gameover
// ==================================================================
scene("gameover", (puntos = 0) => {
    add([
        text("GAME OVER", { size: 96, font: "happy" }),
        pos(width() / 2, 250), anchor("center"),
        color(COL.enemigo),
    ]);
    add([
        text("PUNTOS: " + puntos, { size: 46, font: "happy" }),
        pos(width() / 2, 360), anchor("center"),
        color(COL.titulo),
    ]);
    add([
        text("Pulsa R para reintentar", { size: 30 }),
        pos(width() / 2, 450), anchor("center"),
        color(COL.texto),
    ]);

    play("gameover");
    onKeyPress("r", () => go("juego"));
    onKeyPress("enter", () => go("juego"));
});

// ==================================================================
// ESCENA: victoria
// ==================================================================
scene("victoria", (puntos = 0) => {
    add([
        text("NIVEL SUPERADO", { size: 88, font: "happy" }),
        pos(width() / 2, 250), anchor("center"),
        color(COL.bien),
    ]);
    add([
        text("PUNTOS: " + puntos, { size: 46, font: "happy" }),
        pos(width() / 2, 360), anchor("center"),
        color(COL.titulo),
    ]);
    add([
        text("Mañana: sprites, parallax, vida y un jefe.   ·   R: jugar otra vez", { size: 26 }),
        pos(width() / 2, 450), anchor("center"),
        color(COL.texto),
    ]);

    onKeyPress("r", () => go("juego"));
    onKeyPress("enter", () => go("juego"));
});

go("juego");

// --------------------------------------------------------------- loader
// El HTML trae un velo "cargando…". Lo quitamos en cuanto loadProgress()
// llega a 1. (No usemos onLoad(): go() borra esos handlers en frameEnd.)
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
