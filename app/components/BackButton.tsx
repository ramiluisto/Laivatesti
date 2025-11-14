'use client';

import { useGame } from '../contexts/GameContext';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const { setCurrentGame } = useGame();

  return (
    <button
      onClick={() => setCurrentGame('menu')}
      className="fixed top-4 left-4 bg-casino-red hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all z-50"
    >
      <ArrowLeft className="w-5 h-5" />
      Back to Menu
    </button>
  );
}

