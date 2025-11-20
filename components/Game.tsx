import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Poem, CellData } from '../types';
import { generateGrid } from '../utils/gameLogic';
import { ArrowLeft, RefreshCcw, HelpCircle, ChevronRight } from 'lucide-react';

interface GameProps {
  poem: Poem;
  onBack: () => void;
}

const Game: React.FC<GameProps> = ({ poem, onBack }) => {
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [gridData, setGridData] = useState<CellData[]>([]);
  
  // User progress in current sentence
  // stores indices of gridData that are selected
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [lastCharOfPrevSentence, setLastCharOfPrevSentence] = useState<string | null>(null);
  
  const [showHint, setShowHint] = useState(false);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  const currentSentence = poem.chunks[currentChunkIndex];
  
  // Combine last char of previous sentence + current sentence for the logic
  // If it's the first sentence, we just use the sentence.
  // If > 0, we prepend the last char.
  const targetSequence = lastCharOfPrevSentence 
    ? lastCharOfPrevSentence + currentSentence 
    : currentSentence;

  // Initialize Grid
  useEffect(() => {
    const fullPoemContent = poem.chunks.join('');
    const newGrid = generateGrid(targetSequence, fullPoemContent);
    setGridData(newGrid);
    setSelectedIndices([]);
    setIsLevelComplete(false);
    setShowHint(false);

    // If we have a carry-over character, automatically select the center (start)
    // because visually it's the anchor.
    if (lastCharOfPrevSentence) {
      const centerCellIndex = newGrid.findIndex(c => c.sequenceIndex === 0);
      if (centerCellIndex !== -1) {
        setSelectedIndices([centerCellIndex]);
      }
    }
  }, [currentChunkIndex, poem, lastCharOfPrevSentence, targetSequence]);

  const handleCellClick = (index: number) => {
    if (isTransitioning || isLevelComplete) return;

    const cell = gridData[index];
    const nextSequenceIndex = selectedIndices.length;

    // Logic:
    // 1. If it's the very first click (and no carry over), it must be seq index 0.
    // 2. If we have selected items, the clicked cell must be a neighbor of the last selected cell.
    // 3. The clicked cell must match the correct next character in the sequence.

    // Case A: First click of the game (no prev sentence context)
    if (selectedIndices.length === 0) {
        if (cell.sequenceIndex === 0) {
            setSelectedIndices([index]);
            checkCompletion(1);
        } else {
            triggerShake(index);
        }
        return;
    }

    // Case B: Continuing the path
    const lastIndex = selectedIndices[selectedIndices.length - 1];
    const lastCell = gridData[lastIndex];

    // Check adjacency (chebyshev distance <= 1)
    const rowDiff = Math.abs(cell.row - lastCell.row);
    const colDiff = Math.abs(cell.col - lastCell.col);
    const isAdjacent = rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);

    if (isAdjacent && cell.sequenceIndex === nextSequenceIndex) {
        const newIndices = [...selectedIndices, index];
        setSelectedIndices(newIndices);
        checkCompletion(newIndices.length);
    } else {
        triggerShake(index);
    }
  };

  const triggerShake = (index: number) => {
    setShakeIndex(index);
    setTimeout(() => setShakeIndex(null), 400);
  };

  const checkCompletion = (currentLength: number) => {
    if (currentLength === targetSequence.length) {
      setIsLevelComplete(true);
    }
  };

  const handleNextLevel = () => {
    setIsTransitioning(true);
    
    // Delay for animation
    setTimeout(() => {
      const lastChar = targetSequence[targetSequence.length - 1];
      setLastCharOfPrevSentence(lastChar);
      
      if (currentChunkIndex < poem.chunks.length - 1) {
        setCurrentChunkIndex(prev => prev + 1);
      } else {
        // Finished Poem
        alert("恭喜！背誦完成。");
        onBack();
      }
      setIsTransitioning(false);
    }, 500);
  };

  // Render helpers
  const getCellStatus = (index: number, cell: CellData) => {
    if (selectedIndices.includes(index)) return 'selected';
    // If hint is on, highlight the NEXT correct cell
    if (showHint && !isLevelComplete) {
        const nextSeqNeeded = selectedIndices.length;
        if (cell.sequenceIndex === nextSeqNeeded) {
            // Only show hint if adjacent to current head
            if (selectedIndices.length > 0) {
                const lastIdx = selectedIndices[selectedIndices.length-1];
                const lastCell = gridData[lastIdx];
                const rD = Math.abs(cell.row - lastCell.row);
                const cD = Math.abs(cell.col - lastCell.col);
                if (rD <= 1 && cD <= 1) return 'hint';
            } else if (cell.sequenceIndex === 0) {
                return 'hint';
            }
        }
    }
    return 'default';
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-stone-100 relative shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-stone-800 text-stone-100 p-4 flex justify-between items-center shadow-md z-10">
        <button onClick={onBack} className="hover:text-red-400 transition-colors">
          <ArrowLeft />
        </button>
        <div className="text-center">
            <h2 className="text-lg font-bold">{poem.title}</h2>
            <p className="text-xs text-stone-400">句 {currentChunkIndex + 1} / {poem.chunks.length}</p>
        </div>
        <div className="w-6"></div> {/* Spacer */}
      </header>

      {/* Target Sentence Display (Top Area) */}
      <div className="p-4 bg-white border-b border-stone-200 min-h-[80px] flex items-center justify-center flex-wrap gap-1">
        {targetSequence.split('').map((char, i) => {
          const isRevealed = i < selectedIndices.length;
          // Determine if this char belongs to previous sentence (is start char)
          const isStartChar = lastCharOfPrevSentence && i === 0;
          
          return (
            <span 
              key={i} 
              className={`
                w-8 h-8 flex items-center justify-center rounded-sm text-lg font-serif transition-all duration-300
                ${isRevealed ? 'text-stone-800 font-bold' : 'text-stone-300'}
                ${isStartChar ? 'text-red-800 bg-red-50' : ''}
              `}
            >
              {isRevealed ? char : '○'}
            </span>
          );
        })}
      </div>

      {/* Grid Area */}
      <div className="flex-1 flex items-center justify-center p-2 bg-[#f0f0ea]">
        <div 
            className="grid grid-cols-8 gap-1 bg-stone-300 p-1 rounded-sm shadow-inner select-none touch-manipulation"
            style={{ aspectRatio: '1/1', width: '100%', maxWidth: '400px' }}
        >
            {gridData.map((cell, idx) => {
                const status = getCellStatus(idx, cell);
                const isShaking = shakeIndex === idx;
                
                return (
                    <div
                        key={cell.id}
                        onClick={() => handleCellClick(idx)}
                        className={`
                            relative flex items-center justify-center text-xl md:text-2xl font-calligraphy cursor-pointer rounded-sm transition-all duration-200
                            ${status === 'selected' ? 'bg-stone-800 text-white scale-95' : 'bg-white text-stone-700 hover:bg-stone-50'}
                            ${status === 'hint' ? 'ring-2 ring-red-400 bg-red-50 animate-pulse' : ''}
                            ${isShaking ? 'animate-shake bg-red-200' : ''}
                            ${cell.sequenceIndex === 0 && lastCharOfPrevSentence ? 'border-2 border-red-800' : ''} 
                        `}
                    >
                        {cell.char}
                        {/* Connection lines could go here, but logic is complex for pure CSS/React without canvas */}
                    </div>
                );
            })}
        </div>
      </div>

      {/* Controls / Footer */}
      <div className="p-6 bg-white border-t border-stone-200 flex justify-around items-center pb-8">
        <button 
            onClick={() => setShowHint(prev => !prev)}
            className="flex flex-col items-center text-stone-500 hover:text-stone-800 transition-colors"
        >
            <HelpCircle size={24} />
            <span className="text-xs mt-1">提示</span>
        </button>

        <div className="flex-1 mx-4">
            {isLevelComplete ? (
                <button 
                    onClick={handleNextLevel}
                    className="w-full py-3 bg-red-800 text-white rounded-md shadow-lg font-bold text-lg hover:bg-red-700 active:scale-95 transition-all animate-bounce flex justify-center items-center gap-2"
                >
                    下一句 <ChevronRight />
                </button>
            ) : (
                <div className="text-center text-stone-400 text-sm italic">
                    請按順序點擊文字
                </div>
            )}
        </div>

        <button 
            onClick={() => {
                // Reset current level
                setSelectedIndices(lastCharOfPrevSentence ? [selectedIndices[0]] : []);
                setShakeIndex(null);
                setIsLevelComplete(false);
            }}
            className="flex flex-col items-center text-stone-500 hover:text-stone-800 transition-colors"
        >
            <RefreshCcw size={24} />
            <span className="text-xs mt-1">重置</span>
        </button>
      </div>
      
      {/* Shake Animation Style Injection */}
      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
        }
        .animate-shake {
            animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Game;
