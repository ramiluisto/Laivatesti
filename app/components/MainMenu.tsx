'use client';

import { useGame } from '../contexts/GameContext';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

const games = [
  { id: 'video-poker' as const, name: 'Video Poker', icon: '🃏' },
  { id: 'texas-holdem' as const, name: 'Texas Hold\'em', icon: '♠️' },
  { id: 'caribbean-stud' as const, name: 'Caribbean Stud Poker', icon: '♥️' },
  { id: 'craps' as const, name: 'Craps', icon: '🎲' },
  { id: 'roulette' as const, name: 'Roulette', icon: '🎡' },
  { id: 'slots-lucky7' as const, name: 'Lucky 7 Slots', icon: '🎰' },
  { id: 'slots-fortune' as const, name: 'Fortune Wheel Slots', icon: '💎' },
];

export default function MainMenu() {
  const { setCurrentGame, playerName } = useGame();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % games.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + games.length) % games.length);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setCurrentGame(games[selectedIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, setCurrentGame]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8"
      >
        <motion.h1
          className="text-6xl font-bold mb-4 bg-gradient-to-r from-casino-gold via-yellow-300 to-casino-gold bg-clip-text text-transparent"
          animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {playerName}'s Casino
        </motion.h1>
        <div className="flex items-center justify-center gap-2 text-2xl text-pink-400 mb-2">
          <Heart className="w-6 h-6 fill-current" />
          <span>40th Anniversary Edition</span>
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <p className="text-xl text-casino-gold flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          Forty but still sexy!
          <Sparkles className="w-5 h-5" />
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Start with €200 • Win €2,000 to complete your challenge!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            onClick={() => setCurrentGame(game.id)}
            onMouseEnter={() => setSelectedIndex(index)}
            className={`p-6 rounded-xl transition-all ${
              selectedIndex === index
                ? 'bg-gradient-to-br from-casino-gold to-casino-darkGold text-black scale-105 shadow-2xl'
                : 'bg-casino-green/40 hover:bg-casino-green/60'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-5xl mb-2">{game.icon}</div>
            <div className="text-xl font-bold">{game.name}</div>
          </motion.button>
        ))}
      </div>

      <motion.div
        className="mt-8 text-center text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>Use ↑↓ Arrow Keys to navigate • Press SPACE or ENTER to select</p>
        <p className="mt-2">Or click with your mouse</p>
      </motion.div>
    </div>
  );
}

