import React, { useRef, useState, useEffect } from 'react';
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

// Fighter Jet Component with Energy Trail
interface FighterJetProps {
  entity: BattleEntity;
  color: 'green' | 'red';
}

const FighterJet: React.FC<FighterJetProps> = ({ entity, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [trailPositions, setTrailPositions] = useState<THREE.Vector3[]>([]);

  useFrame(() => {
    if (meshRef.current && !entity.isDestroyed) {
      // Update position
      const newPos = new THREE.Vector3(
        entity.position[0],
        entity.position[1],
        entity.position[2]
      );
      meshRef.current.position.copy(newPos);

      // Update rotation
      meshRef.current.rotation.set(
        entity.rotation[0],
        entity.rotation[1],
        entity.rotation[2]
      );

      // Update trail (keep last 15 positions)
      setTrailPositions(prev => {
        const updated = [...prev, newPos.clone()];
        return updated.slice(-15);
      });
    }
  });

  if (entity.isDestroyed) return null;

  const colorValue = color === 'green' ? '#2E8B57' : '#C41E3A';
  const trailColor = color === 'green' ? '#4ADE80' : '#F87171';
  
  // Calculate energy level (0-1) based on health and speed
  const velocity = Math.sqrt(
    entity.velocity[0] ** 2 + entity.velocity[1] ** 2 + entity.velocity[2] ** 2
  );
  const energyLevel = Math.min((velocity / 50) * (entity.health / entity.maxHealth), 1);

  return (
    <group>
      {/* Main jet body */}
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 1, 1]} />
        <meshStandardMaterial 
          color={colorValue}
          emissive={colorValue}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Energy trail */}
      {trailPositions.length > 1 && (
        <primitive object={
          (() => {
            const geometry = new THREE.BufferGeometry().setFromPoints(trailPositions);
            const material = new THREE.LineBasicMaterial({
              color: trailColor,
              transparent: true,
              opacity: 0.4 * energyLevel,
            });
            return new THREE.Line(geometry, material);
          })()
        } />
      )}

      {/* Glow effect for high energy */}
      {energyLevel > 0.7 && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial
            color={colorValue}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
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
