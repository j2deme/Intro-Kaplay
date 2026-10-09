// presentacion-dia2/main.js
// Juego-presentación del DÍA 2 (versión reducida): un hub top-down con 6
// puertas (las 6 franjas de la agenda) y una escena por sala con teoría,
// snippet copiable y la ficha de DEMO EN VIVO. A diferencia del Día 1, no
// hay micro-demo jugable propia: las demos las hace el instructor desde
// ../solucion-dia2-lite/ (el kit) y ../solucion-dia2/ (jefe y parallax).

import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";
import { SALAS, PALETA } from "./salas.js";

// ------------------------------------------------------------------ setup
kaplay({
    width: 1280,
    height: 720,
    letterbox: true,          // barras negras si la ventana no es 16:9
    pixelDensity: Math.min(Math.max(window.devicePixelRatio || 1, 2), 3), // texto nítido al escalar
    background: [10, 12, 30],
});

loadRoot("../assets/");
loadFont("happy", "fonts/happy.ttf");
loadRoot("");
loadFont("inter", "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf");
loadFont("jetbrains", "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPQ.ttf");
loadRoot("../assets/");
loadSprite("bean", "sprites/bean.png");
loadSprite("door", "sprites/door.png");
loadSound("select", "sounds/select.ogg");

const FONT_TITULO = "happy";
const FONT_CUERPO = "inter";
const FONT_CODIGO = "jetbrains";

// ------------------------------------------------------------- resaltador
// El parser de estilos de KAPLAY trata [palabra] como etiqueta, así que
// escapamos primero toda la corchetería del código y *después* insertamos
// nuestras etiquetas de color.
function escapar(code) {
    return code.replace(/\\/g, "\\\\").replace(/\[/g, "\\[");
}

const RE_CODIGO = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b(?:const|let|var|function|return|if|else|for|while|new|import|export|from|default|true|false|null|undefined|class|typeof|of|in)\b|=>)|(\b\d+(?:\.\d+)?\b)/g;

function resaltar(code) {
    const src = escapar(code);
    let out = "";
    let last = 0;
    let m;
    RE_CODIGO.lastIndex = 0;
    while ((m = RE_CODIGO.exec(src))) {
        out += src.slice(last, m.index);
        if (m[1] !== undefined) out += "[cm]" + m[1] + "[/cm]";
        else if (m[2] !== undefined) out += "[st]" + m[2] + "[/st]";
        else if (m[3] !== undefined) out += "[kw]" + m[3] + "[/kw]";
        else out += "[nu]" + m[4] + "[/nu]";
        last = RE_CODIGO.lastIndex;
    }
    out += src.slice(last);
    return out;
}

const STYLES_CODIGO = {
    cm: { color: rgb(118, 138, 170) },
    st: { color: rgb(124, 255, 107) },
    kw: { color: rgb(255, 126, 219) },
    nu: { color: rgb(255, 209, 102) },
};

// ------------------------------------------------------------------ utils
function medir(str, opts) {
    const o = make([text(str, opts)]);
    const h = o.height;
    o.destroy();
    return h;
}

// Panel de teoría: título + cuerpo. Devuelve su altura para apilar.
function panelTeoria(x, y, w, titulo, cuerpo) {
    const headH = medir(titulo, { size: 24, font: FONT_TITULO });
    const bodyOpts = { size: 21, width: w - 34, font: FONT_CUERPO, lineSpacing: 5 };
    const bodyH = medir(cuerpo, bodyOpts);
    const h = 14 + headH + 8 + bodyH + 14;

    add([
        rect(w, h, { radius: 12 }),
        pos(x, y),
        color(PALETA.panelBg),
        outline(2, rgb(PALETA.panelBorder)),
    ]);
    add([text(titulo, { size: 24, font: FONT_TITULO }), pos(x + 17, y + 14), color(PALETA.titulo)]);
    add([text(cuerpo, bodyOpts), pos(x + 17, y + 14 + headH + 8), color(PALETA.cuerpo)]);
    return h;
}

// --------------------------------------------------------------- ESCENA 0
// Hub top-down: plano con 6 puertas (las 6 franjas del Día 2). Flechas/WASD
// caminan, ENTER entra, números 1-6 saltan directos y el ratón también sirve.
scene("hub", () => {
    add([
        text("MAPA DEL DÍA 2", { size: 52, font: FONT_TITULO }),
        pos(36, 26),
        color(PALETA.titulo),
    ]);
    add([
        text("Camina hasta una puerta y pulsa ENTER  ·  o pulsa 1–6 directamente", {
            size: 22,
            font: FONT_CUERPO,
        }),
        pos(38, 92),
        color(PALETA.acento),
    ]);

    // 6 salas caben con puertas algo más estrechas que en el Día 1.
    const W_SALA = 195;
    const GAP = 14;
    const X0 = (1280 - (SALAS.length * W_SALA + (SALAS.length - 1) * GAP)) / 2;

    const salas = SALAS.map((s, i) => {
        const x = X0 + i * (W_SALA + GAP);
        const y = 178;
        const h = 330;
        const g = add([
            rect(W_SALA, h, { radius: 16 }),
            pos(x, y),
            color("#141735"),
            outline(3, rgb(PALETA.panelBorder)),
            area(),
            { idx: i },
            "sala",
        ]);
        add([sprite("door"), pos(x + W_SALA / 2 - 55, y + 22), scale(1.7)]);
        add([
            text(String(i + 1), { size: 70, font: FONT_TITULO }),
            pos(x + W_SALA / 2 - 20, y + 130),
            color(PALETA.titulo),
        ]);
        add([
            text(s.titulo, { size: 18, width: W_SALA - 20, align: "center", font: FONT_CUERPO }),
            pos(x + 10, y + 214),
            color(PALETA.cuerpo),
        ]);
        add([
            text(s.hora, { size: 15, width: W_SALA - 20, align: "center", font: FONT_CUERPO }),
            pos(x + 10, y + h - 36),
            color("#8a93c4"),
        ]);
        return g;
    });

    const jugador = add([
        sprite("bean"),
        pos(640, 660),
        anchor("bot"),
        scale(1.4),
        area(),
        "jugador",
    ]);

    const aviso = add([
        text("", { size: 24, width: 1200, align: "center", font: FONT_CUERPO }),
        pos(40, 548),
        color(PALETA.acento),
    ]);

    add([
        text("← ↑ ↓ → o WASD mover  ·  ENTER entrar  ·  1–6 ir a sala", {
            size: 19,
            width: 1208,
            align: "center",
            font: FONT_CUERPO,
        }),
        pos(36, 692),
        color("#8a93c4"),
    ]);

    const vel = 300;
    onKeyDown("left", () => { jugador.pos.x -= vel * dt(); });
    onKeyDown("a", () => { jugador.pos.x -= vel * dt(); });
    onKeyDown("right", () => { jugador.pos.x += vel * dt(); });
    onKeyDown("d", () => { jugador.pos.x += vel * dt(); });
    onKeyDown("up", () => { jugador.pos.y -= vel * dt(); });
    onKeyDown("w", () => { jugador.pos.y -= vel * dt(); });
    onKeyDown("down", () => { jugador.pos.y += vel * dt(); });
    onKeyDown("s", () => { jugador.pos.y += vel * dt(); });

    let cercana = null;
    jugador.onUpdate(() => {
        jugador.pos.x = clamp(jugador.pos.x, 46, 1234);
        jugador.pos.y = clamp(jugador.pos.y, 160, 700);
        cercana = null;
        for (const s of salas) {
            if (jugador.isOverlapping(s)) { cercana = s; break; }
        }
        for (const s of salas) {
            const activa = s === cercana;
            s.color = rgb(activa ? "#232a5e" : "#141735");
            s.outline.color = rgb(activa ? PALETA.acento : PALETA.panelBorder);
            s.outline.width = activa ? 5 : 3;
        }
        aviso.text = cercana
            ? "ENTER para entrar en «" + SALAS[cercana.idx].titulo + "»"
            : "";
    });

    const entrar = (idx) => {
        play("select");
        go("sala", idx);
    };

    onKeyPress("enter", () => { if (cercana) entrar(cercana.idx); });
    onClick("sala", (s) => entrar(s.idx));
    SALAS.forEach((_, i) => {
        onKeyPress(String(i + 1), () => entrar(i));
    });
});

// --------------------------------------------------------------- ESCENA 1
// Una sala: banda superior, 2 paneles, barra de reto, snippet a la izquierda
// y la ficha de demo en vivo a la derecha. Modal "S" con la solución.
scene("sala", (idx) => {
    const s = SALAS[idx];

    // banda superior
    add([rect(1280, 76), pos(0, 0), color("#0d1030")]);
    add([text(s.titulo, { size: 36, font: FONT_TITULO }), pos(34, 14), color(PALETA.titulo)]);
    add([
        text("SALA " + (idx + 1) + "/" + SALAS.length, { size: 20, font: FONT_CUERPO }),
        pos(36, 54),
        color("#8a93c4"),
    ]);
    add([
        text(s.hora, { size: 24, width: 380, align: "right", font: FONT_CUERPO }),
        pos(866, 26),
        color(PALETA.acento),
    ]);

    // dos paneles de teoría en paralelo
    const PW = 594;
    const alturaPanel1 = panelTeoria(36, 84, PW, s.paneles[0].t, s.paneles[0].b);
    const alturaPanel2 = panelTeoria(650, 84, PW, s.paneles[1].t, s.paneles[1].b);

    // barra de reto (la escalera extra)
    const Y_RETO = Math.max(235, 84 + Math.max(alturaPanel1, alturaPanel2) + 20);
    add([
        rect(1208, 44, { radius: 10 }),
        pos(36, Y_RETO),
        color("#1d1030"),
        outline(2, rgb("#7a4fd6")),
    ]);
    add([
        text(s.reto, { size: 18, width: 1176, font: FONT_CUERPO }),
        pos(52, Y_RETO + 12),
        color("#d9c6ff"),
    ]);

    // columna inferior: snippet + ficha de demo en vivo
    const BY = Y_RETO + 56;
    const BH = 670 - BY;

    add([
        rect(600, BH, { radius: 12 }),
        pos(36, BY),
        color(PALETA.codigoBg),
        outline(2, rgb(PALETA.panelBorder)),
    ]);
    add([
        text(s.snippetDonde || "SNIPPET · cópialo tal cual", { size: 17, font: FONT_CUERPO }),
        pos(52, BY + 12),
        color("#8a93c4"),
    ]);
    add([
        text(resaltar(s.codigo), {
            size: 16,
            width: 568,
            font: FONT_CODIGO,
            lineSpacing: 5,
            styles: STYLES_CODIGO,
        }),
        pos(52, BY + 40),
        color(255, 255, 255),
    ]);

    // La derecha, en vez de una demo propia, es la ficha de lo que el
    // instructor demuestra EN VIVO desde el kit.
    add([
        rect(580, BH, { radius: 12 }),
        pos(664, BY),
        color("#0c0f26"),
        outline(2, rgb(PALETA.acento)),
    ]);
    add([
        text("DEMO EN VIVO · " + s.demoTitulo, { size: 17, font: FONT_CUERPO }),
        pos(680, BY + 12),
        color(PALETA.acento),
    ]);
    add([
        text(s.pasos.map((p, i) => (i + 1) + ". " + p).join("\n"), {
            size: 19,
            width: 548,
            font: FONT_CUERPO,
            lineSpacing: 8,
        }),
        pos(680, BY + 44),
        color(PALETA.cuerpo),
    ]);
    add([
        text("Fuente: ../solucion-dia2-lite/main.js  ·  busca la etiqueta ▸", {
            size: 16,
            width: 548,
            font: FONT_CODIGO,
        }),
        pos(680, BY + BH - 34),
        color("#8a93c4"),
    ]);

    // pie
    add([
        text(
            "←/→ sala anterior o siguiente  ·  1–6 ir a sala  ·  S ver solución  ·  ESC volver al mapa",
            { size: 17, width: 1208, align: "center", font: FONT_CUERPO },
        ),
        pos(36, 686),
        color("#8a93c4"),
    ]);

    // ------------------------------------------------------ MODAL "S"
    // Muestra la solución del bloque (el snippet resuelto y el reto).
    const modal = add([
        rect(1280, 720),
        pos(0, 0),
        color(0, 0, 0),
        opacity(0),
        z(500),
        fixed(),
        "modal",
    ]);
    const modalPanel = add([
        rect(1160, 640, { radius: 16 }),
        pos(60, 40),
        color("#0a0d22"),
        outline(3, rgb(PALETA.acento)),
        z(501),
        fixed(),
        "modal",
    ]);
    const modalTit = add([
        text("SOLUCIÓN · " + s.titulo, { size: 30, font: FONT_TITULO }),
        pos(88, 64),
        color(PALETA.titulo),
        z(502),
        fixed(),
        "modal",
    ]);
    const modalPie = add([
        text("S para cerrar  ·  ←/→ cambiar de sala", { size: 20, font: FONT_CUERPO }),
        pos(1172, 636),
        anchor("right"),
        color("#8a93c4"),
        z(502),
        fixed(),
        "modal",
    ]);
    const modalCod = add([
        text(resaltar(s.solucion), {
            size: 12,
            width: 1104,
            font: FONT_CODIGO,
            lineSpacing: 1,
            styles: STYLES_CODIGO,
        }),
        pos(88, 118),
        color(255, 255, 255),
        z(502),
        fixed(),
        "modal",
    ]);
    const modalOn = () => modal.opacity > 0;

    const toggleModal = (on) => {
        const objetivo = on ?? !modalOn();
        const t = tween(0, objetivo ? 1 : 0, 0.15, (v) => (modal.opacity = v));
        modalPanel.opacity = objetivo ? 1 : 0;
        modalTit.opacity = objetivo ? 1 : 0;
        modalPie.opacity = objetivo ? 1 : 0;
        modalCod.opacity = objetivo ? 1 : 0;
        if (objetivo) play("select");
    };
    // arranca oculto (opacidad 0 en los hijos)
    modalPanel.opacity = 0;
    modalTit.opacity = 0;
    modalPie.opacity = 0;
    modalCod.opacity = 0;
    let modalAbierto = false;

    const ir = (n) => {
        const total = SALAS.length;
        go("sala", (n + total) % total);
    };
    onKeyPress("left", () => { if (!modalAbierto) ir(idx - 1); });
    onKeyPress("right", () => { if (!modalAbierto) ir(idx + 1); });
    onKeyPress("s", () => {
        modalAbierto = !modalAbierto;
        toggleModal(modalAbierto);
    });
    onKeyPress("escape", () => {
        // ESC: primero cierra el modal, después vuelve al mapa
        if (modalAbierto) {
            modalAbierto = false;
            toggleModal(false);
        } else {
            go("hub");
        }
    });
    SALAS.forEach((_, i) =>
        onKeyPress(String(i + 1), () => { if (!modalAbierto) go("sala", i); }),
    );
});

go("hub");

// El HTML trae un velo "cargando…" por si la red va lenta. Lo quitamos en cuanto
// loadProgress() llega a 1 (fuentes, sprites y sonidos listos).
// Nota: no usamos onLoad() aquí porque go() borra los handlers al cambiar de escena.
const timerLoader = setInterval(() => {
    const loader = document.getElementById("loader");
    if (loadProgress() >= 1) {
        loader.classList.add("hide");
        clearInterval(timerLoader);
    }
}, 100);
// Cortapisa por si algo no termina de cargar (red mala, asset roto…).
setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hide");
    clearInterval(timerLoader);
}, 6000);
