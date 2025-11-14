'use client';

import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import BackButton from '../BackButton';
import WagerSelector from '../WagerSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];
const PAYOUTS = {
  '7️⃣7️⃣7️⃣': 100,
  '💎💎💎': 50,
  '⭐⭐⭐': 25,
  '🍇🍇🍇': 10,
  '🍊🍊🍊': 8,
  '🍋🍋🍋': 6,
  '🍒🍒🍒': 5,
  'Any 2 match': 2,
};

export default function SlotsLucky7() {
  const { wager, addToBalance, subtractFromBalance, playerName } = useGame();
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(false);
  const [gameState, setGameState] = useState<'ready' | 'result'>('ready');
  const [showPayouts, setShowPayouts] = useState(false);
  const [message, setMessage] = useState('');

  const spin = () => {
    if (!subtractFromBalance(wager)) {
      setMessage('Insufficient funds!');
      return;
    }

    setSpinning(true);
    setMessage('');
    setGameState('ready');
    
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
      const finalReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
      setReels(finalReels);
      setSpinning(false);
      evaluateResult(finalReels);
    }, 2000);
  };

  const evaluateResult = (reels: string[]) => {
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      // Three of a kind
      const key = `${reels[0]}${reels[1]}${reels[2]}` as keyof typeof PAYOUTS;
      const payout = PAYOUTS[key] || 5;
      const winAmount = wager * payout;
      addToBalance(winAmount);
      setMessage(`🎉 THREE ${reels[0]}! ${playerName} wins €${winAmount.toFixed(2)}! Forty and fortunate!`);
    } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
      // Two of a kind
      const winAmount = wager * PAYOUTS['Any 2 match'];
      addToBalance(winAmount);
      setMessage(`Two match! ${playerName} wins €${winAmount.toFixed(2)}!`);
    } else {
      setMessage(`No match. Spin again, birthday champion!`);
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
              <h2 className="text-2xl font-bold text-casino-gold mb-4">Lucky 7 Payouts</h2>
              <div className="space-y-2">
                {Object.entries(PAYOUTS).map(([combo, payout]) => (
                  <div key={combo} className="flex justify-between text-white">
                    <span>{combo}</span>
                    <span className="text-casino-gold font-bold">{payout}:1</span>
                  </div>
                ))}
              </div>
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

      <h1 className="text-4xl font-bold text-casino-gold mb-8">🎰 Lucky 7 Slots</h1>

      <div className="bg-gradient-to-b from-casino-red to-red-900 p-8 rounded-2xl shadow-2xl mb-8">
        <div className="flex gap-4 mb-4">
          {reels.map((symbol, index) => (
            <motion.div
              key={index}
              className="w-32 h-32 bg-white rounded-xl flex items-center justify-center text-7xl shadow-inner"
              animate={spinning ? { y: [0, -20, 0] } : {}}
              transition={{ repeat: spinning ? Infinity : 0, duration: 0.2, delay: index * 0.1 }}
            >
              {symbol}
            </motion.div>
          ))}
        </div>
        
        <div className="bg-casino-gold text-black text-center py-2 rounded-lg font-bold">
          {playerName}'S LUCKY MACHINE
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
          className="px-8 py-4 bg-casino-gold hover:bg-casino-darkGold disabled:opacity-50 text-black font-bold rounded-lg shadow-lg text-xl"
        >
          {spinning ? '🎰 SPINNING...' : '🎰 SPIN (SPACE)'}
        </button>
      </div>

      <p className="text-sm text-gray-400">
        Press SPACE or click to spin
      </p>
    </div>
  );
}

