'use client';

import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import BackButton from '../BackButton';
import WagerSelector from '../WagerSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

type BetType = 'red' | 'black' | 'even' | 'odd' | 'low' | 'high';

const PAYOUTS = {
  'Red/Black': 1,
  'Even/Odd': 1,
  'Low (1-18)/High (19-36)': 1,
};

const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function Roulette() {
  const { wager, addToBalance, subtractFromBalance, playerName } = useGame();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [selectedBet, setSelectedBet] = useState<BetType>('red');
  const [gameState, setGameState] = useState<'betting' | 'result'>('betting');
  const [showPayouts, setShowPayouts] = useState(false);
  const [message, setMessage] = useState('');

  const bets: BetType[] = ['red', 'black', 'even', 'odd', 'low', 'high'];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const spin = () => {
    if (!subtractFromBalance(wager)) {
      setMessage('Insufficient funds!');
      return;
    }

    setSpinning(true);
    setMessage('');
    
    // Simulate spinning
    setTimeout(() => {
      const number = Math.floor(Math.random() * 37); // 0-36
      setResult(number);
      setSpinning(false);
      evaluateResult(number);
    }, 3000);
  };

  const evaluateResult = (number: number) => {
    let won = false;
    
    if (number === 0) {
      setMessage(`Green 0! House wins. But ${playerName} is still a winner at 40!`);
      setGameState('result');
      return;
    }

    switch (selectedBet) {
      case 'red':
        won = redNumbers.includes(number);
        break;
      case 'black':
        won = !redNumbers.includes(number);
        break;
      case 'even':
        won = number % 2 === 0;
        break;
      case 'odd':
        won = number % 2 === 1;
        break;
      case 'low':
        won = number >= 1 && number <= 18;
        break;
      case 'high':
        won = number >= 19 && number <= 36;
        break;
    }

    if (won) {
      const winAmount = wager * 2;
      addToBalance(winAmount);
      setMessage(`${number} ${getNumberColor(number)}! ${playerName} wins €${winAmount.toFixed(2)}! Forty but still lucky!`);
    } else {
      setMessage(`${number} ${getNumberColor(number)}. Better luck next spin, sexy!`);
    }
    
    setGameState('result');
  };

  const getNumberColor = (num: number): string => {
    if (num === 0) return '🟢 Green';
    return redNumbers.includes(num) ? '🔴 Red' : '⚫ Black';
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!spinning) {
          if (gameState === 'result') {
            setGameState('betting');
          } else {
            spin();
          }
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + bets.length) % bets.length);
        setSelectedBet(bets[(selectedIndex - 1 + bets.length) % bets.length]);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % bets.length);
        setSelectedBet(bets[(selectedIndex + 1) % bets.length]);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, spinning, wager, selectedIndex]);

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
              <h2 className="text-2xl font-bold text-casino-gold mb-4">Roulette Payouts</h2>
              <div className="space-y-2">
                {Object.entries(PAYOUTS).map(([bet, payout]) => (
                  <div key={bet} className="flex justify-between text-white">
                    <span>{bet}</span>
                    <span className="text-casino-gold font-bold">{payout}:1</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-300 mt-4">Landing on 0 (green) = house wins</p>
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

      <h1 className="text-4xl font-bold text-casino-gold mb-8">Roulette</h1>

      <motion.div
        className="w-64 h-64 rounded-full border-8 border-casino-gold bg-casino-green mb-8 flex items-center justify-center relative overflow-hidden"
        animate={spinning ? { rotate: 360 } : {}}
        transition={spinning ? { duration: 3, ease: "linear" } : {}}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Roulette wheel design */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-24 bg-white origin-bottom"
              style={{
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </div>
        
        {result !== null && !spinning && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl font-bold text-white z-10"
          >
            {result}
          </motion.div>
        )}
        
        {spinning && (
          <div className="text-2xl font-bold text-white z-10">
            SPINNING...
          </div>
        )}
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold mb-4 text-center max-w-md"
        >
          {message}
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-6">
        {bets.map((bet, index) => (
          <button
            key={bet}
            onClick={() => {
              setSelectedBet(bet);
              setSelectedIndex(index);
            }}
            className={`px-6 py-3 font-bold rounded-lg shadow-lg transition-all ${
              selectedBet === bet
                ? 'bg-casino-gold text-black scale-105'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {bet.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex gap-4 items-center mb-4">
        <WagerSelector />
        
        {gameState === 'result' ? (
          <button
            onClick={() => setGameState('betting')}
            className="px-8 py-3 bg-casino-gold hover:bg-casino-darkGold text-black font-bold rounded-lg shadow-lg"
          >
            NEW SPIN (SPACE)
          </button>
        ) : (
          <button
            onClick={spin}
            disabled={spinning}
            className="px-8 py-3 bg-casino-red hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg"
          >
            {spinning ? 'SPINNING...' : 'SPIN (SPACE)'}
          </button>
        )}
      </div>

      <p className="text-sm text-gray-400">
        Use ← → to select bet • Press SPACE to spin
      </p>
    </div>
  );
}

