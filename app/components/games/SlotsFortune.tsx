'use client';

import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import BackButton from '../BackButton';
import WagerSelector from '../WagerSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

const symbols = ['👑', '💰', '🎁', '🎂', '🎉', '✨', '🔥'];
const PAYOUTS = {
  '👑👑👑': 80,
  '💰💰💰': 40,
  '🎁🎁🎁': 30,
  '🎂🎂🎂': 40, // Special 40th birthday bonus!
  '🎉🎉🎉': 20,
  '✨✨✨': 15,
  '🔥🔥🔥': 25,
  'Any 2 match': 2,
};

export default function SlotsFortune() {
  const { wager, addToBalance, subtractFromBalance, playerName } = useGame();
  const [reels, setReels] = useState(['🎂', '🎉', '✨']);
  const [spinning, setSpinning] = useState(false);
  const [gameState, setGameState] = useState<'ready' | 'result'>('ready');
  const [showPayouts, setShowPayouts] = useState(false);
  const [message, setMessage] = useState('');
  const [jackpotTrigger, setJackpotTrigger] = useState(false);

  const spin = () => {
    if (!subtractFromBalance(wager)) {
      setMessage('Insufficient funds!');
      return;
    }

    setSpinning(true);
    setMessage('');
    setGameState('ready');
    setJackpotTrigger(false);
    
    // Animate reels spinning
    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      
      // Small chance of birthday jackpot!
      const isJackpot = Math.random() < 0.05; // 5% chance
      
      let finalReels;
      if (isJackpot) {
        finalReels = ['🎂', '🎂', '🎂'];
        setJackpotTrigger(true);
      } else {
        finalReels = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
        ];
      }
      
      setReels(finalReels);
      setSpinning(false);
      evaluateResult(finalReels);
    }, 2000);
  };

  const evaluateResult = (reels: string[]) => {
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      const key = `${reels[0]}${reels[1]}${reels[2]}` as keyof typeof PAYOUTS;
      const payout = PAYOUTS[key] || 10;
      const winAmount = wager * payout;
      addToBalance(winAmount);
      
      if (reels[0] === '🎂') {
        setMessage(`🎂🎉 BIRTHDAY JACKPOT! ${playerName} wins €${winAmount.toFixed(2)}! FORTY AND FABULOUS! 🎉🎂`);
      } else {
        setMessage(`🎊 THREE ${reels[0]}! ${playerName} wins €${winAmount.toFixed(2)}! Still got it!`);
      }
    } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
      const winAmount = wager * PAYOUTS['Any 2 match'];
      addToBalance(winAmount);
      setMessage(`Two match! ${playerName} wins €${winAmount.toFixed(2)}!`);
    } else {
      setMessage(`Keep spinning, ${playerName}! You're amazing just for being you!`);
    }
    setGameState('result');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!spinning) {
          spin();
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [spinning, wager]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <BackButton />
      
      <button
        onClick={() => setShowPayouts(!showPayouts)}
        className="fixed top-20 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all z-50"
      >
        <Info className="w-5 h-5" />
        Payouts
      </button>

      <AnimatePresence>
        {showPayouts && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setShowPayouts(false)}
          >
            <div className="bg-casino-green p-8 rounded-xl max-w-md" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-casino-gold mb-4">Fortune Wheel Payouts</h2>
              <div className="space-y-2">
                {Object.entries(PAYOUTS).map(([combo, payout]) => (
                  <div key={combo} className="flex justify-between text-white">
                    <span className={combo.includes('🎂') ? 'text-pink-400 font-bold' : ''}>
                      {combo}
                    </span>
                    <span className="text-casino-gold font-bold">{payout}:1</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-pink-300 mt-4">🎂 Birthday Special: 40x payout!</p>
              <button
                onClick={() => setShowPayouts(false)}
                className="mt-6 w-full bg-casino-red hover:bg-red-700 text-white py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {jackpotTrigger && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: 3, duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-40"
        >
          <div className="text-8xl font-bold text-casino-gold drop-shadow-2xl">
            JACKPOT!
          </div>
        </motion.div>
      )}

      <h1 className="text-4xl font-bold text-casino-gold mb-4">💎 Fortune Wheel</h1>
      <p className="text-pink-400 mb-6">✨ Special 40th Anniversary Edition ✨</p>

      <div className="bg-gradient-to-b from-purple-800 to-purple-950 p-8 rounded-2xl shadow-2xl mb-8 border-4 border-casino-gold">
        <div className="flex gap-4 mb-4">
          {reels.map((symbol, index) => (
            <motion.div
              key={index}
              className="w-32 h-32 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center text-7xl shadow-inner border-2 border-casino-gold"
              animate={spinning ? { 
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ repeat: spinning ? Infinity : 0, duration: 0.3, delay: index * 0.1 }}
            >
              {symbol}
            </motion.div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-casino-gold to-casino-darkGold text-black text-center py-2 rounded-lg font-bold">
          {playerName}'S FORTUNE WHEEL - AGE 40!
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold mb-4 text-center max-w-md"
        >
          {message}
        </motion.div>
      )}

      <div className="flex gap-4 items-center mb-4">
        <WagerSelector />
        
        <button
          onClick={spin}
          disabled={spinning}
          className="px-8 py-4 bg-gradient-to-r from-casino-gold to-casino-darkGold hover:from-casino-darkGold hover:to-casino-gold disabled:opacity-50 text-black font-bold rounded-lg shadow-lg text-xl"
        >
          {spinning ? '✨ SPINNING...' : '✨ SPIN (SPACE)'}
        </button>
      </div>

      <p className="text-sm text-gray-400">
        Press SPACE or click to spin
      </p>
    </div>
  );
}

