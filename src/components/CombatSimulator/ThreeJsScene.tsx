import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { BattleEntity, Projectile, BattleEvent } from '@/types/combat.types';

interface ThreeJsSceneProps {
  alliedJets: BattleEntity[];
  enemyJets: BattleEntity[];
  projectiles: Projectile[];
  recentEvents?: BattleEvent[];
}

const ThreeJsScene: React.FC<ThreeJsSceneProps> = ({
  alliedJets,
  enemyJets,
  projectiles,
  recentEvents = [],
}) => {
  const [explosions, setExplosions] = useState<Array<{ id: string; position: [number, number, number]; timestamp: number }>>([]);

  // Create explosions from recent destruction events
  useEffect(() => {
    const newExplosions = recentEvents
      .filter(event => event.type === 'destroy')
      .map(event => {
        const target = [...alliedJets, ...enemyJets].find(j => j.id === event.targetId);
        return target ? {
          id: `explosion-${event.timestamp}-${Math.random()}`,
          position: target.position,
          timestamp: Date.now()
        } : null;
      })
      .filter(Boolean) as Array<{ id: string; position: [number, number, number]; timestamp: number }>;

    if (newExplosions.length > 0) {
      setExplosions(prev => [...prev, ...newExplosions]);
    }
  }, [recentEvents, alliedJets, enemyJets]);

  // Clean up old explosions
  useEffect(() => {
    const interval = setInterval(() => {
      setExplosions(prev => prev.filter(exp => Date.now() - exp.timestamp < 2000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <Canvas 
      camera={{ position: [0, 50, 100], fov: 60 }}
      performance={{ min: 0.5 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Arena Sphere */}
      <ArenaSphere />

      {/* Allied Jets */}
      {alliedJets.map((jet) => (
        <FighterJet key={jet.id} entity={jet} color="green" />
      ))}

      {/* Enemy Jets */}
      {enemyJets.map((jet) => (
        <FighterJet key={jet.id} entity={jet} color="red" />
      ))}

      {/* Projectiles with Trails */}
      {projectiles.map((proj) => (
        <ProjectileMesh key={proj.id} projectile={proj} />
      ))}

      {/* Explosions */}
      {explosions.map((exp) => (
        <Explosion key={exp.id} position={exp.position} timestamp={exp.timestamp} />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={50}
        maxDistance={200}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
};

// Arena Sphere Component
const ArenaSphere: React.FC = () => {
  return (
    <mesh>
      <sphereGeometry args={[80, 32, 32]} />
      <meshStandardMaterial
        color="#1a1a2e"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

// Advanced Jet Component (adapted from PoC.tsx)
interface FighterJetProps {
  entity: BattleEntity;
  color: 'green' | 'red';
}

const FighterJet: React.FC<FighterJetProps> = ({ entity, color }) => {
  const groupRef = useRef<THREE.Group>(null);
  const trailPoints = useRef<THREE.Vector3[]>([]).current;
  const maxTrailPoints = 50;
  const trailColor = color === 'green' ? '#4ADE80' : '#F87171';
  const trailLine = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ color: trailColor, transparent: true, opacity: 0.6 });
    return new THREE.Line(geometry, material);
  }, [trailColor]);

  // Wreckage smoke trail
  const smokeTrailPoints = useRef<THREE.Vector3[]>([]).current;
  const maxSmokeTrailPoints = 400;
  const smokeTrailLine = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1.0, linewidth: 3 });
    return new THREE.Line(geometry, material);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      const position = new THREE.Vector3(entity.position[0], entity.position[1], entity.position[2]);
      const quaternion = new THREE.Quaternion(entity.quaternion[0], entity.quaternion[1], entity.quaternion[2], entity.quaternion[3]);

      groupRef.current.position.copy(position);
      groupRef.current.quaternion.copy(quaternion);

      if (entity.isWrecked) {
        // Clear normal trail if it exists
        if (trailPoints.length > 0) {
          trailPoints.length = 0;
          trailLine.geometry.dispose();
          trailLine.geometry = new THREE.BufferGeometry();
        }

        // Update smoke trail
        smokeTrailPoints.push(position);
        if (smokeTrailPoints.length > maxSmokeTrailPoints) smokeTrailPoints.shift();

        if (smokeTrailPoints.length > 1) {
          smokeTrailLine.geometry.dispose();
          smokeTrailLine.geometry = new THREE.BufferGeometry().setFromPoints(smokeTrailPoints);
          const colors = [];
          const yellow = new THREE.Color(0xffff99); // Fiery core
          const orange = new THREE.Color(0xffa500); // Orange fire
          const darkGray = new THREE.Color(0x222222); // Black smoke
          for (let i = 0; i < smokeTrailPoints.length; i++) {
            const t = i / (smokeTrailPoints.length - 1);
            const color = new THREE.Color();
            if (t > 0.8) { // Last 20% of the trail (closest to jet) is fiery yellow
              color.lerpColors(orange, yellow, (t - 0.8) / 0.2);
            } else { // First 80% is a gradient from dark gray to orange
              color.lerpColors(darkGray, orange, t / 0.8);
            }
            colors.push(color.r, color.g, color.b);
          }
          smokeTrailLine.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        }
      } else {
        groupRef.current.visible = true;
        // Clear smoke trail if it exists
        if (smokeTrailPoints.length > 0) {
          smokeTrailPoints.length = 0;
          smokeTrailLine.geometry.dispose();
          smokeTrailLine.geometry = new THREE.BufferGeometry();
        }

        // Update normal trail
        if (trailPoints.length > 0) {
          const lastPoint = trailPoints[trailPoints.length - 1];
          const teleportThreshold = 120; // WORLD_RADIUS
          if (position.distanceTo(lastPoint) > teleportThreshold) {
            trailPoints.length = 0;
          }
        }
        trailPoints.push(position);
        if (trailPoints.length > maxTrailPoints) trailPoints.shift();

        trailLine.geometry.dispose();
        if (trailPoints.length > 1) {
          trailLine.geometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
        } else {
          trailLine.geometry = new THREE.BufferGeometry();
        }
      }
    }
  });

  if (entity.isDestroyed) return null;

  const baseColor = color === 'green' ? '#2E8B57' : '#C41E3A';

  return (
    <group>
      <group ref={groupRef} scale={0.5}>
        <mesh position={[0, 0, 0]}><boxGeometry args={[1, 0.8, 5]} /><meshStandardMaterial color={baseColor} /></mesh>
        <mesh position={[0, 0, -0.5]}><boxGeometry args={[7, 0.2, 1.5]} /><meshStandardMaterial color={baseColor} /></mesh>
        <mesh position={[0, 0.65, 1.5]}><boxGeometry args={[0.8, 0.5, 1]} /><meshStandardMaterial color={'#9999ff'} /></mesh>
        <mesh position={[0, 1, -2]}><boxGeometry args={[0.2, 1.2, 0.8]} /><meshStandardMaterial color={baseColor} /></mesh>
        <mesh position={[0, 0, -2]}><boxGeometry args={[2.5, 0.1, 0.8]} /><meshStandardMaterial color={baseColor} /></mesh>
        {entity.isWrecked && (
          <mesh scale={[0.5, 0.5, 1.5]}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshStandardMaterial
              color="orange"
              emissive="orange"
              emissiveIntensity={4}
              transparent
              opacity={0.6}
              toneMapped={false}
            />
          </mesh>
        )}
      </group>
      {entity.isWrecked ? <primitive object={smokeTrailLine} /> : <primitive object={trailLine} />}
    </group>
  );
};

// Projectile Component with Smoke Trail
interface ProjectileMeshProps {
  projectile: Projectile;
}

const ProjectileMesh: React.FC<ProjectileMeshProps> = ({ projectile }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [trailPositions, setTrailPositions] = useState<THREE.Vector3[]>([]);

  useFrame(() => {
    if (meshRef.current) {
      const newPos = new THREE.Vector3(
        projectile.position[0],
        projectile.position[1],
        projectile.position[2]
      );
      meshRef.current.position.copy(newPos);

      // Update trail (keep last 8 positions for smoke effect)
      setTrailPositions(prev => {
        const updated = [...prev, newPos.clone()];
        return updated.slice(-8);
      });
    }
  });

  return (
    <group>
      {/* Projectile */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial 
          color="#00B4D8" 
          emissive="#00B4D8"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Smoke trail */}
      {trailPositions.length > 1 && (
        <primitive object={
          (() => {
            const geometry = new THREE.BufferGeometry().setFromPoints(trailPositions);
            const material = new THREE.LineBasicMaterial({
              color: '#FFFFFF',
              transparent: true,
              opacity: 0.3,
            });
            return new THREE.Line(geometry, material);
          })()
        } />
      )}

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          color="#00B4D8"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

// Explosion Effect Component
interface ExplosionProps {
  position: [number, number, number];
  timestamp: number;
}

const Explosion: React.FC<ExplosionProps> = ({ position, timestamp }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(0);
  const age = (Date.now() - timestamp) / 1000; // seconds

  useFrame(() => {
    if (groupRef.current && age < 2) {
      // Expand and fade
      const progress = age / 2; // 0 to 1
      setScale(1 + progress * 3);
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  if (age >= 2) return null;

  const opacity = Math.max(0, 1 - age / 2);

  return (
    <group ref={groupRef} position={position}>
      {/* Fireball */}
      <mesh>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={opacity * 0.8}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={opacity * 0.4}
        />
      </mesh>

      {/* Flash */}
      {age < 0.2 && (
        <mesh>
          <sphereGeometry args={[6, 16, 16]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.8 * (1 - age / 0.2)}
          />
        </mesh>
      )}

      {/* Debris particles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const distance = age * 10;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const z = Math.sin(age * 5) * distance * 0.5;

        return (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial
              color="#2C2C2C"
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default ThreeJsScene;
