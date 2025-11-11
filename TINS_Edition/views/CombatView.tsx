/// <reference types="@react-three/fiber" />
// FIX: Add a triple-slash directive to explicitly include react-three-fiber types.
// This resolves errors where TypeScript doesn't recognize R3F's custom JSX elements like <mesh>, <boxGeometry>, etc.

import React, { useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

import { useGameState } from '../context/GameState';
import AfterActionReport from './AfterActionReport';
import { useBattleSim } from '../hooks/useBattleSim';
import { HUD } from '../components/hud/HUD';

const Skybox = () => {
    return (
        <mesh>
            <sphereGeometry args={[150, 32, 32]} />
            <meshStandardMaterial color="#1a1a2e" wireframe transparent opacity={0.3} />
        </mesh>
    )
}

const Jet: React.FC<{ entity: any, color: string }> = ({ entity, color }) => {
    const ref = React.useRef<THREE.Group>(null!);
    const [trail, setTrail] = useState<THREE.Vector3[]>([]);

    useFrame(() => {
        if (ref.current && !entity.isDestroyed) {
            const newPosition = new THREE.Vector3(entity.position[0], entity.position[1], entity.position[2]);
            ref.current.position.copy(newPosition);
            ref.current.rotation.set(entity.rotation[0], entity.rotation[1], entity.rotation[2]);
            setTrail(prev => [...prev, newPosition.clone()].slice(-25));
        }
    });

    if (entity.isDestroyed) return null;

    const baseColor = color === 'green' ? '#2E8B57' : '#C41E3A';
    const trailColor = color === 'green' ? '#4ADE80' : '#F87171';
    
    const trailOpacity = 0.2 + (entity.health / entity.maxHealth) * 0.6;


    return (
        <group>
            <group ref={ref} scale={0.5}>
                {/* Fuselage */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[1, 0.8, 5]} />
                    <meshStandardMaterial color={baseColor} emissive={baseColor} emissiveIntensity={0.3} />
                </mesh>
                {/* Wings */}
                <mesh position={[0, 0, -0.5]}>
                    <boxGeometry args={[7, 0.2, 1.5]} />
                    <meshStandardMaterial color={baseColor} emissive={baseColor} emissiveIntensity={0.3} />
                </mesh>
                {/* Cockpit */}
                <mesh position={[0, 0.65, 1.5]}>
                    <boxGeometry args={[0.8, 0.5, 1]} />
                    <meshStandardMaterial color={'#9999ff'} emissive={'#9999ff'} emissiveIntensity={0.2} />
                </mesh>
                {/* Tail fin */}
                <mesh position={[0, 1, -2]}>
                    <boxGeometry args={[0.2, 1.2, 0.8]} />
                    <meshStandardMaterial color={baseColor} emissive={baseColor} emissiveIntensity={0.3} />
                </mesh>
                {/* Tail wings */}
                <mesh position={[0, 0, -2]}>
                    <boxGeometry args={[2.5, 0.1, 0.8]} />
                    <meshStandardMaterial color={baseColor} emissive={baseColor} emissiveIntensity={0.3} />
                </mesh>
            </group>
            {trail.length > 1 && (
                 <primitive object={
                    (() => {
                        const lineGeometry = new THREE.BufferGeometry().setFromPoints(trail);
                        const lineMaterial = new THREE.LineBasicMaterial({ color: trailColor, transparent: true, opacity: trailOpacity });
                        return new THREE.Line(lineGeometry, lineMaterial);
                    })()
                } />
            )}
        </group>
    );
};

const Projectile: React.FC<{ projectile: any }> = ({ projectile }) => {
    const ref = React.useRef<THREE.Group>(null!);
    const [trail, setTrail] = useState<THREE.Vector3[]>([]);
     useFrame(() => {
        if (ref.current) {
            const newPosition = new THREE.Vector3(projectile.position[0], projectile.position[1], projectile.position[2]);
            ref.current.position.copy(newPosition);
            setTrail(prev => [...prev, newPosition.clone()].slice(-12));
        }
    });
    return (
        <group>
            <mesh ref={ref}>
                <sphereGeometry args={[0.6, 8, 8]} />
                <meshStandardMaterial color="#00B4D8" emissive="#00B4D8" emissiveIntensity={0.8} />
            </mesh>
             {trail.length > 1 && (
                <primitive object={
                    (() => {
                        const lineGeometry = new THREE.BufferGeometry().setFromPoints(trail);
                        const lineMaterial = new THREE.LineBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.4 });
                        return new THREE.Line(lineGeometry, lineMaterial);
                    })()
                } />
            )}
             <mesh position={projectile.position}>
                <sphereGeometry args={[1.2, 8, 8]} />
                <meshBasicMaterial color="#00B4D8" transparent opacity={0.3} />
            </mesh>
        </group>
    )
}

const Explosion: React.FC<{position: number[], timestamp: number}> = ({position, timestamp}) => {
    const ref = React.useRef<THREE.Group>(null!);
    const [scale, setScale] = useState(0);

    const elapsedTime = (Date.now() - timestamp) / 1000;
    
    useFrame(() => {
        if (ref.current && elapsedTime < 2) {
            const progress = elapsedTime / 2;
            setScale(1 + progress * 3);
            ref.current.scale.set(scale, scale, scale);
        }
    });

    if (elapsedTime >= 2) return null;

    const opacity = Math.max(0, 1 - (elapsedTime / 2));
    
    return (
        <group ref={ref} position={position as [number, number, number]}>
            <mesh>
                <sphereGeometry args={[3, 16, 16]} />
                <meshBasicMaterial color="#FF4500" transparent opacity={opacity * 0.8} />
            </mesh>
            <mesh>
                <sphereGeometry args={[4, 16, 16]} />
                <meshBasicMaterial color="#FFA500" transparent opacity={opacity * 0.4} />
            </mesh>
             {elapsedTime < 0.2 && (
                <mesh>
                    <sphereGeometry args={[6, 16, 16]} />
                    <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8 * (1 - (elapsedTime / 0.2))} />
                </mesh>
            )}
            {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const distance = elapsedTime * 10;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                const z = Math.sin(elapsedTime * 5) * distance * 0.5;
                return (
                    <mesh key={i} position={[x, y, z]}>
                        <boxGeometry args={[0.5, 0.5, 0.5]} />
                        <meshBasicMaterial color="#2C2C2C" transparent opacity={opacity} />
                    </mesh>
                )
            })}
        </group>
    )
}

const CombatSceneContents: React.FC<{ alliedJets: any[], enemyJets: any[], projectiles: any[], recentEvents: any[] }> = ({ alliedJets, enemyJets, projectiles, recentEvents = [] }) => {
    const [explosions, setExplosions] = useState<{ id: string, position: number[], timestamp: number }[]>([]);

    useEffect(() => {
        const newExplosions = recentEvents
            .filter(e => e.type === 'destroy')
            .map(e => {
                const target = [...alliedJets, ...enemyJets].find(j => j.id === e.targetId);
                return target ? { id: `explosion-${e.timestamp}-${Math.random()}`, position: target.position, timestamp: Date.now() } : null;
            })
            .filter(Boolean as any);

        if (newExplosions.length > 0) {
            setExplosions(prev => [...prev, ...newExplosions]);
        }
    }, [recentEvents, alliedJets, enemyJets]);
    
     useEffect(() => {
        const timer = setInterval(() => {
            setExplosions(prev => prev.filter(e => Date.now() - e.timestamp < 2000));
        }, 100);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Skybox />
            {alliedJets.map(jet => <Jet key={jet.id} entity={jet} color="green" />)}
            {enemyJets.map(jet => <Jet key={jet.id} entity={jet} color="red" />)}
            {projectiles.map(p => <Projectile key={p.id} projectile={p} />)}
            {explosions.map(exp => <Explosion key={exp.id} position={exp.position} timestamp={exp.timestamp} />)}
            <OrbitControls enablePan={false} minDistance={50} maxDistance={200} enableDamping dampingFactor={0.05} />
        </>
    );
};

const CombatView: React.FC<{ onMissionComplete: (results: any) => void }> = ({ onMissionComplete }) => {
    const { gameState } = useGameState();
    const [tactic, setTactic] = useState<'aggressive' | 'defensive'>('aggressive');
    const [isChoosingTactic, setIsChoosingTactic] = useState(true);

    const { battleState, initializeBattle } = useBattleSim(gameState.squadron, gameState.pilots, gameState.currentMission, tactic);
    
    useEffect(() => {
        if (!isChoosingTactic) {
            initializeBattle();
        }
    }, [isChoosingTactic, initializeBattle]);
    
    if (isChoosingTactic) {
        return (
             <div className="h-screen bg-gray-900 flex items-center justify-center p-8">
                 <div className="max-w-md w-full bg-gray-800 border-4 border-military-green rounded-lg p-8 text-center">
                    <h2 className="text-3xl font-bold text-military-tan font-military mb-6">CHOOSE TACTIC</h2>
                    <div className="space-y-4">
                         <button onClick={() => { setTactic('aggressive'); setIsChoosingTactic(false); }} className="w-full bg-enemy-red/80 hover:bg-enemy-red text-white font-bold py-4 rounded-lg transition-all text-xl">
                             <i className="fas fa-fighter-jet mr-2"></i>AGGRESSIVE
                        </button>
                         <button onClick={() => { setTactic('defensive'); setIsChoosingTactic(false); }} className="w-full bg-allied-green/80 hover:bg-allied-green text-white font-bold py-4 rounded-lg transition-all text-xl">
                             <i className="fas fa-shield-halved mr-2"></i>DEFENSIVE
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!battleState) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-6xl text-hud-blue mb-4"></i>
                    <p className="text-xl">Initializing Combat Systems...</p>
                </div>
            </div>
        );
    }
    
    if (battleState.status === 'victory' || battleState.status === 'defeat') {
        if (battleState.results) {
             onMissionComplete(battleState.results);
        }
        return <AfterActionReport results={battleState.results} onReturn={() => {}} />;
    }

    return (
        <div className="relative h-screen bg-gray-900 overflow-hidden">
            <div className="absolute inset-0">
                 <Canvas camera={{ position: [0, 50, 100], fov: 60 }} performance={{ min: 0.5 }} dpr={[1, 2]}>
                    <CombatSceneContents
                        alliedJets={battleState.alliedJets}
                        enemyJets={battleState.enemyJets}
                        projectiles={battleState.projectiles}
                        recentEvents={battleState.executedEvents.slice(-5)}
                    />
                </Canvas>
            </div>
            <HUD battleState={battleState} cameraPosition={[0,50,100]} cameraRotation={[0,0,0]} />
        </div>
    );
};

export default CombatView;