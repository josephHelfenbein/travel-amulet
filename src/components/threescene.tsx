'use client';
import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useGLTF, Outlines } from '@react-three/drei';
import * as THREE from 'three';


const PlaneModel = () => {
    const gltf = useGLTF('/plane.glb');
    const ref = useRef<THREE.Group>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.position.x = 3;
            ref.current.position.y = 0;
            ref.current.position.z = -15;
            ref.current.rotation.x = 60 * Math.PI / 180;
        }
    }, []);
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => { window.removeEventListener('scroll', handleScroll); };
    })
    useFrame(({ clock }) => {
        const a = clock.getElapsedTime();
        if (ref.current) {
            ref.current.position.x = 3 - scrollY / 500;
            ref.current.position.z = -15 + scrollY / 500;
            ref.current.position.y = +scrollY / 250;
            ref.current.rotation.z = -1.5 * (32 + Math.sin(a)) * Math.PI / 180;
            ref.current.rotation.y = 1.5 * (25 + Math.cos(a)) * Math.PI / 180 + scrollY / 4000;
        }
    })
    return <primitive object={gltf.scene} ref={ref} />;
};
useGLTF.preload('/plane.glb');

const EarthModel = () => {
    const gltf = useGLTF('/earth.glb');
    const ref = useRef<THREE.Group>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.position.x = 1.5;
            ref.current.position.y = -8;
            ref.current.position.z = -3;
            const earthScale = 1.4;
            ref.current.scale.set(earthScale, earthScale, earthScale);
        }
    }, []);
    useFrame(({ clock }) => {
        const a = clock.getElapsedTime();
        if (ref.current) {
            ref.current.rotation.y = a / 2;
        }
    })
    return <primitive object={gltf.scene} ref={ref} onClick={() => { console.log("click") }} />;
};
useGLTF.preload('/earth.glb');

const CloudGeometry = () => {
    const texture = useLoader(THREE.TextureLoader, '/6-clouds-2.png');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(5, 5, 5, 5);
    material.transparent = true;
    var cloud = new THREE.Mesh(geometry, material);
    const ref = useRef<THREE.Group>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.position.x = -2;
            ref.current.position.y = -3;
            ref.current.position.z = -2;
            const cloudScale = 1;
            ref.current.scale.set(cloudScale, cloudScale, cloudScale);
        }
    })
    return <primitive object={cloud} ref={ref} />;
}
const CloudGeometry2 = () => {
    const texture = useLoader(THREE.TextureLoader, '/6-clouds-2.png');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(5, 5, 5, 5);
    material.transparent = true;
    var cloud = new THREE.Mesh(geometry, material);
    const ref = useRef<THREE.Group>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.position.x = 3;
            ref.current.position.y = -8;
            ref.current.position.z = -5;
            const cloudScale = 1.4;
            ref.current.scale.set(cloudScale, cloudScale, cloudScale);
        }
    })
    return <primitive object={cloud} ref={ref} />;
}
const CloudGeometry3 = () => {
    const texture = useLoader(THREE.TextureLoader, '/6-clouds-2.png');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(5, 5, 5, 5);
    material.transparent = true;
    var cloud = new THREE.Mesh(geometry, material);
    const ref = useRef<THREE.Group>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.position.x = -3;
            ref.current.position.y = -9;
            ref.current.position.z = -12;
            const cloudScale = 3;
            ref.current.scale.set(cloudScale, cloudScale, cloudScale);
        }
    })
    return <primitive object={cloud} ref={ref} />;
}
const CloudGeometry4 = () => {
    const texture = useLoader(THREE.TextureLoader, '/realistic-white-cloud-png.webp');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(5, 5, 5, 5);
    material.transparent = true;
    var cloud = new THREE.Mesh(geometry, material);
    const ref = useRef<THREE.Group>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.position.x = 8;
            ref.current.position.y = -8;
            ref.current.position.z = -20;
            const cloudScale = 4;
            ref.current.scale.set(cloudScale, cloudScale, cloudScale);
        }
    })
    return <primitive object={cloud} ref={ref} />;
}
const CloudGeometry5 = () => {
    const texture = useLoader(THREE.TextureLoader, '/6-clouds-2.png');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(5, 5, 5, 5);
    material.transparent = true;
    var cloud = new THREE.Mesh(geometry, material);
    const ref = useRef<THREE.Group>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.position.x = 18;
            ref.current.position.y = -8;
            ref.current.position.z = -17;
            const cloudScale = 4;
            ref.current.scale.set(cloudScale, cloudScale, cloudScale);
        }
    })
    return <primitive object={cloud} ref={ref} />;
}
const CloudGeometry6 = () => {
    const texture = useLoader(THREE.TextureLoader, '/6-clouds-2.png');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(5, 5, 5, 5);
    material.transparent = true;
    var cloud = new THREE.Mesh(geometry, material);
    const ref = useRef<THREE.Group>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.position.x = -18;
            ref.current.position.y = -8;
            ref.current.position.z = -14;
            const cloudScale = 4;
            ref.current.scale.set(cloudScale, cloudScale, cloudScale);
        }
    })
    return <primitive object={cloud} ref={ref} />;
}
const CloudGeometry7 = () => {
    const texture = useLoader(THREE.TextureLoader, '/6-clouds-2.png');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(5, 5, 5, 5);
    material.transparent = true;
    var cloud = new THREE.Mesh(geometry, material);
    const ref = useRef<THREE.Group>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.position.x = 2;
            ref.current.position.y = -9.1;
            ref.current.position.z = 0;
            const cloudScale = .4;
            ref.current.scale.set(cloudScale, cloudScale, cloudScale);
        }
    })
    return <primitive object={cloud} ref={ref} />;
}

const CameraController = () => {
    const { camera } = useThree();
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => { window.removeEventListener('scroll', handleScroll); };
    }, []);
    useFrame(() => {
        if (camera.position.y - scrollY / 200 > -15) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
                camera.position.y = 2 - scrollY / 180;
            }
            else camera.position.y = -scrollY / 200;
            camera.updateProjectionMatrix();
        }

    });
    return null;
}
const Scene = () => {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={3.0} />
            <directionalLight intensity={5.0} position={[5, 8, -15]} />
            <directionalLight intensity={6.0} position={[-5, -10, 20]} />
            <PlaneModel />
            <EarthModel />
            <CloudGeometry />
            <CloudGeometry2 />
            <CloudGeometry3 />
            <CloudGeometry4 />
            <CloudGeometry5 />
            <CloudGeometry6 />
            <CloudGeometry7 />
            <CameraController />
        </Canvas>
    );
};
export default Scene;