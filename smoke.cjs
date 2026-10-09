// Smoke test: abre cada HTML con Playwright, comprueba que no haya errores
// de consola ni fallos de red, y guarda una captura en /tmp/shots/.
//
// Uso:
//   cd /mnt/c/Users/j2dem/Dev/Intro-Kaplay && python3 -m http.server 8123 &
//   node smoke.mjs [rutaBase]
//
const { chromium } = require("/tmp/pwtest/node_modules/playwright");

const BASE = process.argv[2] || "http://127.0.0.1:8123";

const TODAS = [
    { url: "/presentacion/index.html", nombre: "presentacion", teclas: ["1", "2", "3", "4", "5", "Escape"] },
    { url: "/starter/index.html", nombre: "starter", teclas: [] },
    { url: "/solucion-dia1/index.html", nombre: "solucion-dia1", teclas: ["Space", "ArrowRight"] },
    { url: "/solucion-dia2/index.html", nombre: "solucion-dia2", teclas: ["Space", "ArrowRight", "KeyA", "KeyD"] },
    { url: "/solucion-dia2-lite/index.html", nombre: "solucion-dia2-lite", teclas: ["Space", "ArrowRight", "KeyA", "KeyD"] },
    { url: "/presentacion-dia2/index.html", nombre: "presentacion-dia2", teclas: ["1", "s", "s", "3", "4", "5", "6"] },
];

// Filtra por nombre si se pasa como argumento: `node smoke.cjs http://... presentacion`
const filtro = process.argv[3];
const PAGINAS = filtro ? TODAS.filter((p) => p.nombre.includes(filtro)) : TODAS;

(async () => {
    const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
    let fallos = 0;

    for (const p of PAGINAS) {
        const ctx = await browser.newContext({ viewport: { width: 1300, height: 760 } });
        const page = await ctx.newPage();
        const errores = [];
        page.on("console", (m) => {
            if (m.type() === "error") errores.push("console: " + m.text());
        });
        page.on("pageerror", (e) => errores.push("pageerror: " + e.message));
        page.on("response", (r) => {
            if (r.status() >= 400) errores.push("HTTP " + r.status() + " " + r.url());
        });

        await page.goto(BASE + p.url, { waitUntil: "load" });
        await page.waitForTimeout(2500);

        for (const k of p.teclas) {
            await page.keyboard.press(k);
            await page.waitForTimeout(600);
        }
        // pulso de movimiento para que las demos avancen
        await page.keyboard.down("KeyD");
        await page.waitForTimeout(700);
        await page.keyboard.up("KeyD");
        await page.waitForTimeout(400);

        await page.screenshot({ path: "/tmp/shots/" + p.nombre + ".png" });

        if (errores.length) {
            fallos++;
            console.log("FAIL " + p.nombre);
            for (const e of [...new Set(errores)]) console.log("   " + e);
        } else {
            console.log("OK   " + p.nombre);
        }
        await ctx.close();
    }

    await browser.close();
    process.exit(fallos ? 1 : 0);
})();
