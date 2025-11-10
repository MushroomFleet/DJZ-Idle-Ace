import React, { useState, useEffect } from 'react';
import { useGameState } from '@/contexts/GameStateContext';
import { useNarrative } from '@/contexts/NarrativeContext';
import { useOpenRouter } from '@/hooks/useOpenRouter';
import { useBattleSimulation } from '@/hooks/useBattleSimulation';
import ThreeJsScene from './ThreeJsScene';
import ResultsScreen from './ResultsScreen';
import { HUD } from './HUD';
import {
  generateMissionResultsPrompt,
  FALLBACK_VICTORY,
  FALLBACK_DEFEAT,
} from '@/utils/dialogueGenerator';
import { calculateMissionScore } from '@/utils/scoreCalculations';

interface CombatSimulatorProps {
  onMissionComplete?: (results: any) => void;
}

const CombatSimulator: React.FC<CombatSimulatorProps> = ({ onMissionComplete }) => {
  const { gameState, setCurrentView, updateResources, updateHighScore, addCompletedMission } =
    useGameState();
  const { narrativeState, addDialogue } = useNarrative();
  const { sendChatCompletion } = useOpenRouter();
  const [tactic, setTactic] = useState<'aggressive' | 'defensive'>('aggressive');
  const [hasGeneratedResults, setHasGeneratedResults] = useState(false);
  const [hasAppliedRewards, setHasAppliedRewards] = useState(false);

  const { battleState, initializeBattle } = useBattleSimulation(
    gameState.squadron,
    gameState.pilots,
    gameState.currentMission,
    tactic
  );

  // Initialize battle on mount
  useEffect(() => {
    initializeBattle();
  }, []);

  // Apply rewards automatically when battle ends
  useEffect(() => {
    if (!battleState?.results || hasAppliedRewards) return;
    if (battleState.status !== 'victory' && battleState.status !== 'defeat') return;

    const missionScore = gameState.currentMission
      ? calculateMissionScore(gameState.currentMission, battleState.results)
      : battleState.results.rewards.highScoreBonus;

    console.info('Applying mission rewards:', {
      credits: battleState.results.rewards.credits,
      researchPoints: battleState.results.rewards.researchPoints,
      missionScore,
      victory: battleState.results.victory
    });

    updateResources(
      battleState.results.rewards.credits,
      battleState.results.rewards.researchPoints
    );
    updateHighScore(missionScore);

    if (gameState.currentMission) {
      addCompletedMission(gameState.currentMission);
    }

    setHasAppliedRewards(true);
  }, [battleState?.status, hasAppliedRewards]);

  // Generate AI results dialogue when battle ends
  useEffect(() => {
    const generateResultsDialogue = async () => {
      if (!battleState?.results || !gameState.currentMission || hasGeneratedResults) return;
      if (battleState.status !== 'victory' && battleState.status !== 'defeat') return;

      setHasGeneratedResults(true);

      const apiKey = localStorage.getItem('idle-ace-api-key') || '';
      const model = localStorage.getItem('idle-ace-model') || 'x-ai/grok-beta';

      let resultsText = battleState.results.victory ? FALLBACK_VICTORY : FALLBACK_DEFEAT;

      if (apiKey) {
        const messages = generateMissionResultsPrompt(
          gameState.currentMission,
          battleState.results,
          narrativeState.warProgress
        );

        const response = await sendChatCompletion(apiKey, model, messages);
        if (response) {
          resultsText = response;
        }
      }

      addDialogue({
        id: `results-${Date.now()}`,
        type: 'mission-result',
        speaker: 'general-martin',
        text: resultsText,
        timestamp: Date.now(),
        dismissed: false,
        metadata: {
          missionId: gameState.currentMission.id,
          victory: battleState.results.victory,
          casualtyCount: battleState.results.destroyedAllied,
        },
      });
    };

    if (battleState && (battleState.status === 'victory' || battleState.status === 'defeat')) {
      generateResultsDialogue();
    }
  }, [battleState?.status, hasGeneratedResults]);

  const handleReturnToBase = () => {
    // Rewards already applied automatically, just handle navigation
    setTimeout(() => {
      if (battleState?.results) {
        if (onMissionComplete) {
          onMissionComplete(battleState.results);
        } else {
          setCurrentView('idle');
        }
      }
    }, 100); // Small delay ensures smooth state propagation
  };

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
    return <ResultsScreen results={battleState.results!} onReturn={handleReturnToBase} />;
  }

  return (
    <div className="relative h-screen bg-gray-900 overflow-hidden">
      {/* Three.js Scene */}
      <div className="absolute inset-0">
        <ThreeJsScene
          alliedJets={battleState.alliedJets}
          enemyJets={battleState.enemyJets}
          projectiles={battleState.projectiles}
          recentEvents={battleState.executedEvents.slice(-5)}
        />
      </div>

      {/* New HUD System */}
      <HUD 
        battleState={battleState}
        cameraPosition={[0, 50, 100]} 
        cameraRotation={[0, 0, 0]}
      />

      {/* Event Log */}
      <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 p-4 rounded border-2 border-military-green max-w-md pointer-events-none">
        <div className="text-xs text-gray-400 uppercase mb-2">Combat Log</div>
        <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
          {battleState.executedEvents.slice(-5).map((event, i) => (
            <div key={i} className="text-gray-300">
              {event.type === 'hit' && '💥 Direct hit!'}
              {event.type === 'destroy' && '☠️ Target destroyed!'}
              {event.type === 'escape' && '🚀 Enemy escaping!'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CombatSimulator;
