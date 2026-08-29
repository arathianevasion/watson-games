import { React, useMemo } from "react";
import { getCheeseTextures } from "./cheeseTexture";

const BASE_SIZE = 3; // starting block is 3x3; holes keep this physical scale

// Standard material textured as Swiss cheese. Repeat scales with the block's
// footprint so cut-down blocks show proportionally sized holes, not squashed ones.
export default function CheeseMaterial({ width, depth, height = 0 }) {
    const { map, bumpMap } = useMemo(() => {
        const base = getCheeseTextures();
        const map = base.map.clone();
        const bumpMap = base.bumpMap.clone();
        const rx = Math.max(width, 0.05) / BASE_SIZE;
        const rz = Math.max(depth, 0.05) / BASE_SIZE;
        map.repeat.set(rx, rz);
        bumpMap.repeat.set(rx, rz);
        // offset per layer so stacked blocks don't show identical hole patterns
        const ox = (height * 0.37) % 1;
        const oz = (height * 0.61) % 1;
        map.offset.set(ox, oz);
        bumpMap.offset.set(ox, oz);
        map.needsUpdate = bumpMap.needsUpdate = true;
        return { map, bumpMap };
    }, [width, depth, height]);

    // Slight warm variation up the tower so it doesn't read as one flat colour.
    const tint = `hsl(46, 60%, ${88 + (height % 6) * 2}%)`;

    return (
        <meshStandardMaterial
            map={map}
            bumpMap={bumpMap}
            bumpScale={0.08}
            color={tint}
            roughness={0.85}
            metalness={0}
        />
    );
}
