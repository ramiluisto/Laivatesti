'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { Heart, Sparkles, Gift, PartyPopper } from 'lucide-react';

export default function AnniversaryPopup() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showMilestone, setShowMilestone] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const { balance, playerName, addToBalance, hasWon } = useGame();

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

  useEffect(() => {
    if (hasWon && !showVictory) {
      setShowVictory(true);
    }
  }, [hasWon]);

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

      {showVictory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-8"
        >
          <motion.div
            initial={{ scale: 0.5, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ type: 'spring', duration: 1, bounce: 0.5 }}
            className="bg-gradient-to-br from-yellow-400 via-casino-gold to-yellow-600 p-12 rounded-3xl max-w-3xl text-center relative overflow-hidden"
          >
            {/* Animated confetti effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  initial={{
                    top: '50%',
                    left: '50%',
                    opacity: 1,
                    scale: 0
                  }}
                  animate={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0,
                    scale: 1,
                    rotate: Math.random() * 360
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.05,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  {['🎉', '🎊', '✨', '🎂', '🎁', '👑', '💰'][i % 7]}
                </motion.div>
              ))}
            </div>

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="text-9xl mb-6 relative z-10"
            >
              🏆
            </motion.div>

            <h1 className="text-7xl font-bold text-black mb-4 relative z-10 drop-shadow-lg">
              VICTORY!
            </h1>

            <div className="flex items-center justify-center gap-4 mb-6 relative z-10">
              <Heart className="w-12 h-12 text-red-600 fill-current animate-pulse" />
              <p className="text-4xl text-black font-bold">
                {playerName} DID IT!
              </p>
              <Heart className="w-12 h-12 text-red-600 fill-current animate-pulse" />
            </div>

            <div className="bg-black/30 p-8 rounded-2xl mb-6 relative z-10">
              <p className="text-3xl text-black font-bold mb-4">
                🎯 GOAL ACHIEVED! 🎯
              </p>
              <p className="text-6xl font-bold text-green-600 mb-4">
                €{balance.toFixed(2)}
              </p>
              <p className="text-2xl text-black/90 mb-2">
                From €200 to over €2,000!
              </p>
              <p className="text-xl text-black/80">
                Just like getting better with age! 🥂
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mb-8 relative z-10">
              <Sparkles className="w-10 h-10 text-yellow-600 animate-pulse" />
              <p className="text-3xl italic text-black font-bold">
                Forty, Fabulous, and VICTORIOUS!
              </p>
              <Sparkles className="w-10 h-10 text-yellow-600 animate-pulse" />
            </div>

            <motion.button
              onClick={() => setShowVictory(false)}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.9 }}
              className="bg-black text-casino-gold px-12 py-5 rounded-2xl text-2xl font-bold shadow-2xl relative z-10"
            >
              Continue Playing! 🎰
            </motion.button>

            <p className="mt-6 text-black/70 text-lg relative z-10">
              Keep the winning streak going, birthday champion!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

