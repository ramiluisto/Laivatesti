'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { Heart, Sparkles, Gift, PartyPopper } from 'lucide-react';

export default function AnniversaryPopup() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showMilestone, setShowMilestone] = useState(false);
  const { balance, playerName, addToBalance } = useGame();

  useEffect(() => {
    // Check for milestones
    if (balance >= 500 && balance < 510 && !showMilestone) {
      setShowMilestone(true);
      addToBalance(20); // Bonus for being awesome!
    } else if (balance >= 1000 && balance < 1010 && !showMilestone) {
      setShowMilestone(true);
      addToBalance(40); // 40 EUR for 40th birthday!
    } else if (balance >= 1500 && balance < 1510 && !showMilestone) {
      setShowMilestone(true);
      addToBalance(40);
    }
  }, [balance]);

  useEffect(() => {
    if (showMilestone) {
      const timer = setTimeout(() => setShowMilestone(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showMilestone]);

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-8"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gradient-to-br from-casino-gold via-yellow-400 to-casino-darkGold p-8 rounded-2xl max-w-2xl text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-8xl mb-4"
            >
              🎉
            </motion.div>
            
            <h1 className="text-5xl font-bold text-black mb-4">
              Happy 40th, {playerName}!
            </h1>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-red-600 fill-current" />
              <p className="text-3xl text-black font-bold">
                Forty but still SEXY!
              </p>
              <Heart className="w-8 h-8 text-red-600 fill-current" />
            </div>

            <div className="bg-black/20 p-6 rounded-xl mb-6">
              <p className="text-xl text-black mb-3">
                Welcome to your exclusive 40th anniversary casino!
              </p>
              <p className="text-lg text-black/80">
                Starting Balance: <span className="font-bold text-2xl">€200</span>
              </p>
              <p className="text-lg text-black/80">
                Goal: Win <span className="font-bold text-2xl">€2,000</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6 text-black">
              <Sparkles className="w-6 h-6" />
              <p className="text-lg italic">
                Because you're awesome and deserve this celebration!
              </p>
              <Sparkles className="w-6 h-6" />
            </div>

            <motion.button
              onClick={() => setShowWelcome(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-casino-gold px-8 py-4 rounded-lg text-xl font-bold shadow-lg"
            >
              Let's Win! 🎰
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {showMilestone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -100 }}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl shadow-2xl z-50 max-w-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-8 h-8 text-yellow-300" />
            <h3 className="text-2xl font-bold text-white">Milestone Bonus!</h3>
          </div>
          <p className="text-white text-lg">
            {playerName}, you're doing amazing! Here's a bonus for being fabulous at 40! 🎉
          </p>
          <div className="flex items-center gap-2 mt-3 text-yellow-300">
            <PartyPopper className="w-6 h-6" />
            <span className="text-xl font-bold">+€40 Bonus!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

