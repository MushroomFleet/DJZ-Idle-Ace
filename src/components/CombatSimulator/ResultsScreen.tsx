import React from 'react';
import { BattleResults } from '@/types/combat.types';

interface ResultsScreenProps {
  results: BattleResults;
  onReturn: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, onReturn }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-gray-800 border-4 border-military-green rounded-lg p-8">
        {/* Victory/Defeat Header */}
        <div className="text-center mb-8">
          {results.victory ? (
            <>
              <i className="fas fa-trophy text-7xl text-yellow-400 mb-4"></i>
              <h1 className="text-5xl font-bold text-yellow-400">MISSION SUCCESS</h1>
            </>
          ) : (
            <>
              <i className="fas fa-skull-crossbones text-7xl text-red-500 mb-4"></i>
              <h1 className="text-5xl font-bold text-red-500">MISSION FAILED</h1>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 p-4 rounded">
            <div className="text-gray-400 text-sm mb-2">Allied Casualties</div>
            <div className="text-3xl font-bold text-allied-green">
              {results.destroyedAllied} / {results.survivingAllied + results.destroyedAllied}
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded">
            <div className="text-gray-400 text-sm mb-2">Enemy Destroyed</div>
            <div className="text-3xl font-bold text-enemy-red">{results.destroyedEnemy}</div>
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-gray-900 p-6 rounded mb-6">
          <h3 className="text-xl font-bold mb-4 text-military-tan">REWARDS</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <i className="fas fa-coins text-3xl text-green-400 mb-2"></i>
              <div className="text-2xl font-bold text-green-400">
                +{results.rewards.credits}
              </div>
              <div className="text-xs text-gray-400">Credits</div>
            </div>
            <div>
              <i className="fas fa-flask text-3xl text-blue-400 mb-2"></i>
              <div className="text-2xl font-bold text-blue-400">
                +{results.rewards.researchPoints}
              </div>
              <div className="text-xs text-gray-400">Research</div>
            </div>
            <div>
              <i className="fas fa-trophy text-3xl text-yellow-400 mb-2"></i>
              <div className="text-2xl font-bold text-yellow-400">
                +{results.rewards.highScoreBonus}
              </div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
          </div>
        </div>

        {/* Return Button */}
        <button
          onClick={onReturn}
          className="w-full bg-military-green hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-all text-xl"
        >
          <i className="fas fa-home mr-2"></i>
          RETURN TO BASE
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
