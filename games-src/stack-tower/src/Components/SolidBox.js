import { React } from "react";
import CheeseMaterial from "./CheeseMaterial";
import { useBox } from "@react-three/cannon";

export default function SolidBox({ xpos, zpos, height, width, depth }) {
    const [mySolidBox, api] = useBox(() => ({
        mass: 2,
        position: [xpos, height, zpos],
        args: [width, 1, depth],
        type: "Static",
    }));

    return (
        <mesh ref={mySolidBox} position={[xpos, height, zpos]}>
            <boxGeometry args={[width, 1, depth]} />
            <CheeseMaterial width={width} depth={depth} height={height} />
        </mesh>
    );
}
