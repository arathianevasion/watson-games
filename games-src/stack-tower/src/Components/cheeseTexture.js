import * as THREE from "three";

// Procedural Swiss-cheese textures drawn once per page: a colour map with
// soft-edged holes and a matching grayscale bump map so the holes look recessed.
let cached = null;

function mulberry32(seed) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function makeHoles(rand, size, count) {
    const holes = [];
    let tries = 0;
    while (holes.length < count && tries < count * 40) {
        tries++;
        const r = size * (0.035 + rand() * 0.06);
        const x = rand() * size;
        const y = rand() * size;
        const ok = holes.every((h) => Math.hypot(h.x - x, h.y - y) > h.r + r + size * 0.02);
        if (ok) holes.push({ x, y, r });
    }
    return holes;
}

// Draw with wrap-around copies so the texture tiles seamlessly.
function drawHole(ctx, size, { x, y, r }, paint) {
    for (const dx of [-size, 0, size]) {
        for (const dy of [-size, 0, size]) {
            paint(ctx, x + dx, y + dy, r);
        }
    }
}

export function getCheeseTextures() {
    if (cached) return cached;
    const size = 512;
    const rand = mulberry32(1337);
    const holes = makeHoles(rand, size, 26);

    // Colour map
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#f5c842";
    ctx.fillRect(0, 0, size, size);
    // subtle mottling
    for (let i = 0; i < 400; i++) {
        ctx.fillStyle = `rgba(255,235,150,${rand() * 0.12})`;
        ctx.beginPath();
        ctx.arc(rand() * size, rand() * size, 4 + rand() * 18, 0, Math.PI * 2);
        ctx.fill();
    }
    holes.forEach((h) =>
        drawHole(ctx, size, h, (g, x, y, r) => {
            const grad = g.createRadialGradient(x - r * 0.25, y - r * 0.25, r * 0.1, x, y, r);
            grad.addColorStop(0, "#b8891a");
            grad.addColorStop(0.7, "#a3760f");
            grad.addColorStop(0.92, "#d4a52a");
            grad.addColorStop(1, "rgba(245,200,66,0)");
            g.fillStyle = grad;
            g.beginPath();
            g.arc(x, y, r, 0, Math.PI * 2);
            g.fill();
        })
    );

    // Bump map: light surface, dark holes
    const b = document.createElement("canvas");
    b.width = b.height = size;
    const bctx = b.getContext("2d");
    bctx.fillStyle = "#c8c8c8";
    bctx.fillRect(0, 0, size, size);
    holes.forEach((h) =>
        drawHole(bctx, size, h, (g, x, y, r) => {
            const grad = g.createRadialGradient(x, y, r * 0.55, x, y, r);
            grad.addColorStop(0, "#202020");
            grad.addColorStop(1, "rgba(200,200,200,0)");
            g.fillStyle = grad;
            g.beginPath();
            g.arc(x, y, r, 0, Math.PI * 2);
            g.fill();
        })
    );

    const map = new THREE.CanvasTexture(c);
    const bumpMap = new THREE.CanvasTexture(b);
    [map, bumpMap].forEach((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = 4;
    });
    map.encoding = THREE.sRGBEncoding;
    cached = { map, bumpMap };
    return cached;
}
