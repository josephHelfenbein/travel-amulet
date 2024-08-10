'use client';
import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';



const PlaneModel = () => {
    const gltf = useGLTF('/plane.glb');
    const ref = useRef<THREE.Group>(null);
    useEffect(()=> {
        if(ref.current){
            ref.current.position.x = 3;
            ref.current.position.y = 0;
            ref.current.position.z = -15;
            ref.current.rotation.x = 60*Math.PI/180;
            
        }
    },[]);
    useFrame(({clock})=>{
        const a = clock.getElapsedTime();
        if(ref.current){
            ref.current.rotation.z = -1.5*(32+Math.sin(a))*Math.PI/180;
            ref.current.rotation.y = 1.5*(25+Math.cos(a))*Math.PI/180;
        }
    })
    return <primitive object={gltf.scene} ref={ref} onClick={()=>{console.log("click")}} />;
};
useGLTF.preload('/plane.glb');

const CameraController = () => {
    const {camera} = useThree();
    const [scrollY, setScrollY] = useState(0);
    useEffect(()=>{
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return ()=>{window.removeEventListener('scroll', handleScroll);};
    }, []);
    useFrame(()=>{
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
            camera.position.y = -scrollY / 250;
        }
        else camera.position.y = -scrollY / 200;
        camera.updateProjectionMatrix();
    });
    return null;
}
const Scene = () => {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov:50 }}>
        <ambientLight intensity={2.0} />
        <directionalLight intensity={2.0} position={[5, 8, -15]}/>
        <directionalLight intensity={5.0} position={[-5, -10, 20]}/>
        <PlaneModel />
        <CameraController />
        </Canvas>
    );
};
export default Scene;