import { useState, useEffect, useCallback, useRef } from 'react';
import { BattleState, BattleEntity, BattleEvent, Projectile } from '@/types/combat.types';
import { FighterJet, Pilot, Mission } from '@/types/game.types';
import { calculateBattleOutcome } from '@/utils/combatCalculations';
import * as THREE from 'three';

// Simulation constants (adapted from PoC.tsx)
const DEBUG = true;
const RESPAWN_TIME = 5000; // ms
const JET_SPEED = 35;
const TURN_SPEED = 1.8;
const WORLD_RADIUS = 120;
const ROLE_SWAP_BASE_TIME = 10;
const ROLE_SWAP_RANDOMNESS = 2;
const TRACER_SPEED = 150;
const TRACER_LIFESPAN = 2; // seconds
const FIRING_COOLDOWN = 3; // seconds
const BURST_COUNT = 3;
const TRACERS_PER_BURST = 5;
const TIME_BETWEEN_TRACERS = 0.06; // seconds
const TIME_BETWEEN_BURSTS = 0.3; // seconds
const DISENGAGE_ALTITUDE_RANGE = 30;
const GREEN_COHESION_RADIUS = 40;
const GREEN_COHESION_STRENGTH = 0.3;
const GREEN_AVOIDANCE_RADIUS = 15;
const GREEN_AVOIDANCE_STRENGTH = 1.5;
const FIRING_CONE_DOT_PRODUCT = 0.97; // Target must be within this cone to fire
const GREEN_TARGET_SWAP_TIME = 10; // seconds
const MISSILE_SPEED = 100;
const MISSILE_LIFESPAN = 5; // seconds
const MISSILE_PROXIMITY_DETONATION_RANGE = 10;
const LEAD_TARGET_DISTANCE = 10;
const MISSILE_TURN_SPEED = 3.0;
const FLARE_LIFESPAN = 3; // seconds
const FLARE_EJECTION_SPEED = 15; // Relative to the jet
const FLARES_TO_DEPLOY = 6; // 3 pairs
const TIME_BETWEEN_FLARE_PAIRS = 0.2; // 200ms
const FLARE_DRAG = 0.5;
const FLARE_WING_OFFSET = 3;
const WEAPON_RANGE_THRESHOLD = 60;

export const useBattleSimulation = (
  squadron: FighterJet[],
  pilots: Pilot[],
  mission: Mission | null,
  tactic: 'aggressive' | 'defensive'
) => {
  const [battleState, setBattleState] = useState<BattleState | null>(null);

  const initializeBattle = useCallback(() => {
    if (!mission) return;

    // Calculate battle outcome
    const { events, results } = calculateBattleOutcome(squadron, pilots, mission, tactic);

    // Create battle entities
    const alliedJets: BattleEntity[] = squadron.map((jet, i) => {
      const pilot = pilots.find((p) => p.id === jet.assignedPilotId);
      const angle = (i / squadron.length) * Math.PI * 2;
      const radius = 40;

      return {
        id: `allied-${i}`,
        originalJetId: jet.id,
        team: 'allied',
        health: 100,
        maxHealth: 100,
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        velocity: [0, 0, 0],
        quaternion: [0, 0, 0, 1], // Identity quaternion
        targetId: null,
        partnerId: null,
        weaponStrength: jet.computedStats.weaponStrength,
        speed: jet.computedStats.speed,
        agility: jet.computedStats.agility,
        intelligence: pilot?.intelligence || 50,
        endurance: pilot?.endurance || 50,
        isDestroyed: false,
        isWrecked: false,
        destroyedAt: null,
        isEscaping: false,
        killCount: 0,
        aiState: 'attacking',
        roleChangeTimer: 0,
        disengagementAltitude: null,
        fireCooldown: Math.random() * 3,
        burstState: { active: false, burstsLeft: 0, tracersLeftInBurst: 0, nextShotTimer: 0, isKillShot: false },
        flareState: { deploying: false, flaresLeft: 0, nextFlareTimer: 0 },
        wreckageAngularVelocity: null,
        behaviorState: 'idle',
        behaviorTimer: 0,
      };
    });

    const enemyJets: BattleEntity[] = Array.from({ length: mission.enemyCount }, (_, i) => {
      const angle = (i / mission.enemyCount) * Math.PI * 2;
      const radius = 60;

      return {
        id: `enemy-${i}`,
        originalJetId: '',
        team: 'enemy',
        health: 100,
        maxHealth: 100,
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        velocity: [0, 0, 0],
        quaternion: [0, 0, 0, 1], // Identity quaternion
        targetId: null,
        partnerId: null,
        weaponStrength: mission.enemyStats.weaponStrength,
        speed: mission.enemyStats.speed,
        agility: mission.enemyStats.agility,
        intelligence: mission.enemyStats.intelligence,
        endurance: mission.enemyStats.endurance,
        isDestroyed: false,
        isWrecked: false,
        destroyedAt: null,
        isEscaping: false,
        killCount: 0,
        aiState: 'attacking',
        roleChangeTimer: 0,
        disengagementAltitude: null,
        fireCooldown: Math.random() * 3,
        burstState: { active: false, burstsLeft: 0, tracersLeftInBurst: 0, nextShotTimer: 0, isKillShot: false },
        flareState: { deploying: false, flaresLeft: 0, nextFlareTimer: 0 },
        wreckageAngularVelocity: null,
        behaviorState: 'idle',
        behaviorTimer: 0,
      };
    });

    setBattleState({
      status: 'active',
      startTime: Date.now(),
      endTime: null,
      alliedJets,
      enemyJets,
      playerTactic: tactic,
      scheduledEvents: events,
      executedEvents: [],
      projectiles: [],
      tracers: [],
      missiles: [],
      flares: [],
      results,
    });
  }, [squadron, pilots, mission, tactic]);

  // Update battle state
  useEffect(() => {
    if (!battleState || battleState.status !== 'active') return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - battleState.startTime;

      // Execute scheduled events
      const newExecutedEvents: BattleEvent[] = [];
      const newProjectiles: Projectile[] = [...battleState.projectiles];

      battleState.scheduledEvents.forEach((event) => {
        if (event.timestamp <= elapsed && !battleState.executedEvents.includes(event)) {
          newExecutedEvents.push(event);

          // Create projectile visual effect
          if (event.type === 'hit' || event.type === 'destroy') {
            const attacker =
              [...battleState.alliedJets, ...battleState.enemyJets].find(
                (j) => j.id === event.attackerId
              );

            if (attacker) {
              newProjectiles.push({
                id: `proj-${Date.now()}-${Math.random()}`,
                position: [...attacker.position] as [number, number, number],
                velocity: [
                  (Math.random() - 0.5) * 5,
                  (Math.random() - 0.5) * 5,
                  (Math.random() - 0.5) * 5,
                ],
                color: 0x00b4d8,
                lifespan: 2000,
                createdAt: Date.now(),
              });
            }
          }

          // Mark entities as destroyed
          if (event.type === 'destroy') {
            setBattleState((prev) => {
              if (!prev) return null;
              
              return {
                ...prev,
                alliedJets: prev.alliedJets.map((j) =>
                  j.id === event.targetId ? { ...j, isDestroyed: true } : j
                ),
                enemyJets: prev.enemyJets.map((j) =>
                  j.id === event.targetId ? { ...j, isDestroyed: true } : j
                ),
              };
            });
          }
        }
      });

      // Realistic AI physics and movement (adapted from PoC.tsx)
      const delta = 0.016; // ~60 FPS
      const tempMatrix = new THREE.Matrix4();
      const targetQuaternion = new THREE.Quaternion();

      // Convert arrays to THREE objects for calculations
      const convertToVector3 = (arr: [number, number, number]) => new THREE.Vector3(arr[0], arr[1], arr[2]);
      const convertToQuaternion = (arr: [number, number, number, number]) => new THREE.Quaternion(arr[0], arr[1], arr[2], arr[3]);
      const convertFromVector3 = (v: THREE.Vector3): [number, number, number] => [v.x, v.y, v.z];
      const convertFromQuaternion = (q: THREE.Quaternion): [number, number, number, number] => [q.x, q.y, q.z, q.w];

      const allJets = [...battleState.alliedJets, ...battleState.enemyJets];
      const activeAlliedJets = battleState.alliedJets.filter(j => j.team === 'allied' && !j.isDestroyed && !j.isWrecked);
      const activeEnemyJets = battleState.enemyJets.filter(j => j.team === 'enemy' && !j.isDestroyed && !j.isWrecked);

      // Calculate allied barycenter for cohesion
      const alliedBarycenter = new THREE.Vector3();
      if (activeAlliedJets.length > 0) {
        activeAlliedJets.forEach(j => alliedBarycenter.add(convertToVector3(j.position)));
        alliedBarycenter.divideScalar(activeAlliedJets.length);
      }

      // Update each jet with AI physics
      const updateJet = (jet: BattleEntity): BattleEntity => {
        if (jet.isWrecked) {
          // Wreckage physics
          const velocity = convertToVector3(jet.velocity);
          velocity.multiplyScalar(1 - (delta * 0.9)); // Air resistance / drag
          velocity.y -= 9.8 * delta; // Gravity

          const position = convertToVector3(jet.position);
          position.add(velocity.clone().multiplyScalar(delta));

          // Angular velocity for spinning
          if (jet.wreckageAngularVelocity) {
            const angularVel = convertToVector3(jet.wreckageAngularVelocity);
            const deltaRotation = new THREE.Quaternion().setFromEuler(
              new THREE.Euler(
                angularVel.x * delta,
                angularVel.y * delta,
                angularVel.z * delta
              )
            );
            const quaternion = convertToQuaternion(jet.quaternion);
            quaternion.multiply(deltaRotation).normalize();
          }

          // World boundaries for wreckage
          if (position.length() > WORLD_RADIUS) {
            jet.destroyedAt = Date.now() - RESPAWN_TIME - 1; // Mark for cleanup
          }

          return {
            ...jet,
            position: convertFromVector3(position),
            velocity: convertFromVector3(velocity),
          };
        }

        if (jet.isDestroyed) return jet;

        // Find target
        let target = allJets.find(j => j.id === jet.targetId && !j.isDestroyed && !j.isWrecked);

        // AI target selection logic
        if (jet.team === 'allied') {
          if (!target) {
            // Find closest enemy
            const enemies = allJets.filter(j => j.team === 'enemy' && !j.isDestroyed && !j.isWrecked);
            if (enemies.length > 0) {
              target = enemies.reduce((closest, enemy) => {
                const distToClosest = convertToVector3(jet.position).distanceTo(convertToVector3(closest.position));
                const distToEnemy = convertToVector3(jet.position).distanceTo(convertToVector3(enemy.position));
                return distToEnemy < distToClosest ? enemy : closest;
              });
              jet.targetId = target.id;
            }
          }
        } else if (jet.team === 'enemy') {
          // Enemy AI - attack allied jets
          if (!target) {
            const allies = allJets.filter(j => j.team === 'allied' && !j.isDestroyed && !j.isWrecked);
            if (allies.length > 0) {
              target = allies[Math.floor(Math.random() * allies.length)];
              jet.targetId = target.id;
            }
          }
        }

        // Steering and physics
        let pointToLookAt: THREE.Vector3;

        if (target) {
          pointToLookAt = convertToVector3(target.position);

          // Allied team cohesion and avoidance
          if (jet.team === 'allied' && activeAlliedJets.length > 1) {
            const distToBarycenter = convertToVector3(jet.position).distanceTo(alliedBarycenter);
            if (distToBarycenter > GREEN_COHESION_RADIUS) {
              const pullFactor = Math.min(1, (distToBarycenter - GREEN_COHESION_RADIUS) / GREEN_COHESION_RADIUS);
              pointToLookAt.lerp(alliedBarycenter, pullFactor * GREEN_COHESION_STRENGTH);
            }

            // Avoidance
            for (const otherJet of activeAlliedJets) {
              if (jet.id === otherJet.id) continue;

              const distanceToOther = convertToVector3(jet.position).distanceTo(convertToVector3(otherJet.position));

              if (distanceToOther < GREEN_AVOIDANCE_RADIUS) {
                const repulsionVector = new THREE.Vector3().subVectors(convertToVector3(jet.position), convertToVector3(otherJet.position)).normalize();
                const avoidanceStrength = Math.pow(1 - (distanceToOther / GREEN_AVOIDANCE_RADIUS), 2) * GREEN_AVOIDANCE_STRENGTH;
                const avoidancePoint = convertToVector3(jet.position).clone().add(repulsionVector.multiplyScalar(WORLD_RADIUS));
                pointToLookAt.lerp(avoidancePoint, avoidanceStrength);
              }
            }
          }
        } else {
          // No target - fly forward
          const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(convertToQuaternion(jet.quaternion));
          pointToLookAt = convertToVector3(jet.position).clone().add(forward.multiplyScalar(10));
        }

        // Calculate rotation to target
        const position = convertToVector3(jet.position);
        const quaternion = convertToQuaternion(jet.quaternion);

        const directionToTarget = pointToLookAt.clone().sub(position).normalize();
        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion);

        const rotationAxis = forward.clone().cross(directionToTarget).normalize();

        if (rotationAxis.lengthSq() > 0.001) {
          const targetUp = directionToTarget.clone().cross(rotationAxis).normalize().negate();
          tempMatrix.lookAt(pointToLookAt, position, targetUp);
        } else {
          tempMatrix.lookAt(pointToLookAt, position, new THREE.Vector3(0, 1, 0));
        }

        targetQuaternion.setFromRotationMatrix(tempMatrix);
        quaternion.slerp(targetQuaternion, delta * TURN_SPEED);

        // Update velocity and position
        const forwardDir = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion);
        const velocity = convertToVector3(jet.velocity);
        velocity.lerp(forwardDir.clone().multiplyScalar(JET_SPEED), delta * 2.0);

        position.add(velocity.clone().multiplyScalar(delta));

        // World boundaries
        if (position.length() > WORLD_RADIUS) {
          position.negate();
        }

        return {
          ...jet,
          position: convertFromVector3(position),
          velocity: convertFromVector3(velocity),
          quaternion: convertFromQuaternion(quaternion),
        };
      };

      const updatedAllied = battleState.alliedJets.map(updateJet);
      const updatedEnemy = battleState.enemyJets.map(updateJet);

      // Remove old projectiles
      const activeProjectiles = newProjectiles.filter(
        (p) => Date.now() - p.createdAt < p.lifespan
      );

      // Check if battle should end (only if not in DEBUG mode)
      if (!DEBUG && elapsed >= 30000) {
        setBattleState((prev) =>
          prev
            ? {
                ...prev,
                status: prev.results?.victory ? 'victory' : 'defeat',
                endTime: Date.now(),
              }
            : null
        );
        return;
      }

      // Handle respawns in DEBUG mode
      if (DEBUG) {
        const respawnJets = (jets: BattleEntity[]): BattleEntity[] => {
          return jets.map(jet => {
            if ((jet.isDestroyed || jet.isWrecked) && jet.destroyedAt && Date.now() - jet.destroyedAt > RESPAWN_TIME) {
              // Respawn the jet
              const angle = Math.random() * Math.PI * 2;
              const radius = jet.team === 'allied' ? 40 : 60;
              return {
                ...jet,
                isDestroyed: false,
                isWrecked: false,
                destroyedAt: null,
                wreckageAngularVelocity: null,
                position: [
                  Math.cos(angle) * radius,
                  (Math.random() - 0.5) * 20, // Random height
                  Math.sin(angle) * radius,
                ] as [number, number, number],
                velocity: [0, 0, 0],
                quaternion: [0, 0, 0, 1], // Identity quaternion
                health: jet.maxHealth,
                fireCooldown: Math.random() * 3,
                burstState: { active: false, burstsLeft: 0, tracersLeftInBurst: 0, nextShotTimer: 0, isKillShot: false },
                flareState: { deploying: false, flaresLeft: 0, nextFlareTimer: 0 },
              };
            }
            return jet;
          });
        };

        const respawnedAllied = respawnJets(updatedAllied);
        const respawnedEnemy = respawnJets(updatedEnemy);

        setBattleState((prev) =>
          prev
            ? {
                ...prev,
                alliedJets: respawnedAllied,
                enemyJets: respawnedEnemy,
                executedEvents: [...prev.executedEvents, ...newExecutedEvents],
                projectiles: activeProjectiles,
              }
            : null
        );
        return;
      }

      setBattleState((prev) =>
        prev
          ? {
              ...prev,
              alliedJets: updatedAllied,
              enemyJets: updatedEnemy,
              executedEvents: [...prev.executedEvents, ...newExecutedEvents],
              projectiles: activeProjectiles,
            }
          : null
      );
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [battleState]);

  const forceEndBattle = useCallback(() => {
    setBattleState(prev =>
      prev ? {
        ...prev,
        status: 'victory',
        endTime: Date.now(),
      } : null
    );
  }, []);

  return { battleState, initializeBattle, forceEndBattle };
};
