import React from 'react';
import ReactDOM from 'react-dom/client';
import { GameStateProvider } from '@/contexts/GameStateContext';
import { NarrativeProvider } from '@/contexts/NarrativeContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import Index from './pages/Index';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GameStateProvider>
        <NarrativeProvider>
          <Index />
        </NarrativeProvider>
      </GameStateProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
