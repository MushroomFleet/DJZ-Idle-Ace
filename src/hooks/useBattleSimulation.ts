import { useState, useEffect, useCallback } from 'react';
import { BattleState, BattleEntity, BattleEvent, Projectile } from '@/types/combat.types';
import { FighterJet, Pilot, Mission } from '@/types/game.types';
import { calculateBattleOutcome } from '@/utils/combatCalculations';

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
        rotation: [0, 0, 0],
        targetId: null,
        weaponStrength: jet.computedStats.weaponStrength,
        speed: jet.computedStats.speed,
        agility: jet.computedStats.agility,
        intelligence: pilot?.intelligence || 50,
        endurance: pilot?.endurance || 50,
        isDestroyed: false,
        isEscaping: false,
        killCount: 0,
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
        rotation: [0, 0, 0],
        targetId: null,
        weaponStrength: mission.enemyStats.weaponStrength,
        speed: mission.enemyStats.speed,
        agility: mission.enemyStats.agility,
        intelligence: mission.enemyStats.intelligence,
        endurance: mission.enemyStats.endurance,
        isDestroyed: false,
        isEscaping: false,
        killCount: 0,
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

      // Update entity positions (simple movement)
      const updatedAllied = battleState.alliedJets.map((jet) => {
        if (jet.isDestroyed) return jet;

        // Simple circular movement
        const angle = (Date.now() / 1000) * (jet.speed / 10);
        const radius = 40;

        return {
          ...jet,
          position: [
            Math.cos(angle) * radius,
            Math.sin(angle * 0.5) * 10,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          rotation: [0, angle, 0] as [number, number, number],
        };
      });

      const updatedEnemy = battleState.enemyJets.map((jet) => {
        if (jet.isDestroyed) return jet;

        const angle = (Date.now() / 1000) * (jet.speed / 10) + Math.PI;
        const radius = 60;

        return {
          ...jet,
          position: [
            Math.cos(angle) * radius,
            Math.sin(angle * 0.5) * 10,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          rotation: [0, angle, 0] as [number, number, number],
        };
      });

      // Remove old projectiles
      const activeProjectiles = newProjectiles.filter(
        (p) => Date.now() - p.createdAt < p.lifespan
      );

      // Check if battle should end
      if (elapsed >= 30000) {
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

  return { battleState, initializeBattle };
};
