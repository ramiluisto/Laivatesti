'use client';

import { useGame, WAGER_LEVELS, WagerLevel } from '../contexts/GameContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function WagerSelector() {
  const { wager, setWager } = useGame();
  const currentIndex = WAGER_LEVELS.indexOf(wager);

  const increaseWager = () => {
    if (currentIndex < WAGER_LEVELS.length - 1) {
      setWager(WAGER_LEVELS[currentIndex + 1]);
    }
  };

  const decreaseWager = () => {
    if (currentIndex > 0) {
      setWager(WAGER_LEVELS[currentIndex - 1]);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-lg">
      <button
        onClick={decreaseWager}
        disabled={currentIndex === 0}
        className="p-1 bg-casino-red hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="text-xs text-gray-300">WAGER</span>
        <span className="text-xl font-bold text-casino-gold">€{wager.toFixed(2)}</span>
      </div>
      <button
        onClick={increaseWager}
        disabled={currentIndex === WAGER_LEVELS.length - 1}
        className="p-1 bg-casino-red hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

