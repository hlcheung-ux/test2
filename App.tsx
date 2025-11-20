import React, { useState } from 'react';
import Menu from './components/Menu';
import Game from './components/Game';
import { Poem, GameState } from './types';
import { POEMS } from './constants';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);

  const handleSelectPoem = (poem: Poem) => {
    setSelectedPoem(poem);
    setGameState(GameState.PLAYING);
  };

  const handleBackToMenu = () => {
    setGameState(GameState.MENU);
    setSelectedPoem(null);
  };

  return (
    <div className="min-h-screen text-stone-800 font-sans overflow-hidden">
      {gameState === GameState.MENU && (
        <Menu poems={POEMS} onSelect={handleSelectPoem} />
      )}
      {gameState === GameState.PLAYING && selectedPoem && (
        <Game poem={selectedPoem} onBack={handleBackToMenu} />
      )}
    </div>
  );
}

export default App;
