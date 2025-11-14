'use client';

import { useGame } from '../contexts/GameContext';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

export default function MoneyDisplay() {
  const { balance, hasWon } = useGame();

  return (
    <motion.div
      className="fixed top-4 right-4 bg-gradient-to-br from-casino-gold to-casino-darkGold text-black px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <Coins className="w-6 h-6" />
      <div className="flex flex-col">
        <span className="text-xs font-semibold opacity-80">BALANCE</span>
        <span className="text-2xl font-bold">€{balance.toFixed(2)}</span>
      </div>
      {hasWon && (
        <motion.div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg font-bold whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🎉 GOAL REACHED! 🎉
        </motion.div>
      )}
    </motion.div>
  );
}

