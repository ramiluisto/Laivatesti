'use client';

import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import BackButton from '../BackButton';
import WagerSelector from '../WagerSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

const PAYOUTS = {
  'Pass Line (Win)': 1,
  'Don\'t Pass (Win)': 1,
  'Come Out 7 or 11': 1,
  'Come Out 2, 3, 12 (Craps)': -1,
  'Point Made': 1,
};

export default function Craps() {
  const { wager, addToBalance, subtractFromBalance, playerName } = useGame();
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [point, setPoint] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'betting' | 'comeout' | 'point' | 'result'>('betting');
  const [betType, setBetType] = useState<'pass' | 'dontpass'>('pass');
  const [showPayouts, setShowPayouts] = useState(false);
  const [message, setMessage] = useState('');
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    if (gameState === 'betting') {
      if (!subtractFromBalance(wager)) {
        setMessage('Insufficient funds!');
        return;
      }
      setGameState('comeout');
    }

    setRolling(true);
    
    // Animate dice roll
    const rollInterval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setDice1(d1);
      setDice2(d2);
      setRolling(false);
      evaluateRoll(d1 + d2);
    }, 1000);
  };

  const evaluateRoll = (total: number) => {
    if (gameState === 'comeout') {
      if (total === 7 || total === 11) {
        if (betType === 'pass') {
          addToBalance(wager * 2);
          setMessage(`Natural ${total}! ${playerName} wins! Still got it at 40! +€${wager.toFixed(2)}`);
        } else {
          setMessage(`Natural ${total}! Don't Pass loses.`);
        }
        setGameState('result');
      } else if (total === 2 || total === 3 || total === 12) {
        if (betType === 'dontpass') {
          if (total === 12) {
            addToBalance(wager);
            setMessage(`Craps ${total}! Push on 12 for Don't Pass.`);
          } else {
            addToBalance(wager * 2);
            setMessage(`Craps ${total}! Don't Pass wins! +€${wager.toFixed(2)}`);
          }
        } else {
          setMessage(`Craps ${total}! Pass Line loses.`);
        }
        setGameState('result');
      } else {
        setPoint(total);
        setMessage(`Point is ${total}. Roll it again to win, ${playerName}!`);
        setGameState('point');
      }
    } else if (gameState === 'point') {
      if (total === point) {
        if (betType === 'pass') {
          addToBalance(wager * 2);
          setMessage(`Point ${total} made! ${playerName} wins! Forty and fabulous! +€${wager.toFixed(2)}`);
        } else {
          setMessage(`Point ${total} made! Don't Pass loses.`);
        }
        setPoint(null);
        setGameState('result');
      } else if (total === 7) {
        if (betType === 'dontpass') {
          addToBalance(wager * 2);
          setMessage(`Seven out! Don't Pass wins! +€${wager.toFixed(2)}`);
        } else {
          setMessage(`Seven out! Pass Line loses. Keep rolling, champ!`);
        }
        setPoint(null);
        setGameState('result');
      } else {
        setMessage(`Rolled ${total}. Point is still ${point}. Roll again!`);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!rolling) {
          if (gameState === 'result') {
            setGameState('betting');
            setMessage('');
          } else {
            rollDice();
          }
        }
      } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && gameState === 'betting') {
        e.preventDefault();
        setBetType(prev => prev === 'pass' ? 'dontpass' : 'pass');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, rolling, wager, betType, point]);

  const DiceComponent = ({ value }: { value: number }) => {
    const dots = [
      [],
      [4],
      [0, 8],
      [0, 4, 8],
      [0, 2, 6, 8],
      [0, 2, 4, 6, 8],
      [0, 2, 3, 5, 6, 8],
    ];

    return (
      <motion.div
        className="w-20 h-20 bg-white rounded-lg shadow-2xl p-2 relative"
        animate={rolling ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.1 }}
      >
        <div className="grid grid-cols-3 grid-rows-3 h-full w-full">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {dots[value]?.includes(i) && (
                <div className="w-2 h-2 bg-black rounded-full" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <BackButton />
      
      <button
        onClick={() => setShowPayouts(!showPayouts)}
        className="fixed top-20 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all z-50"
      >
        <Info className="w-5 h-5" />
        Rules
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
              <h2 className="text-2xl font-bold text-casino-gold mb-4">Craps Rules</h2>
              <div className="space-y-3 text-white text-sm">
                <div>
                  <p className="font-bold text-casino-gold">Pass Line:</p>
                  <p>• Come out: Win on 7 or 11, lose on 2, 3, or 12</p>
                  <p>• Point: Win if point is rolled before 7</p>
                </div>
                <div>
                  <p className="font-bold text-casino-gold">Don't Pass:</p>
                  <p>• Come out: Win on 2 or 3, push on 12, lose on 7 or 11</p>
                  <p>• Point: Win if 7 is rolled before point</p>
                </div>
                <p className="text-casino-gold font-bold mt-4">Both pay 1:1</p>
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

      <h1 className="text-4xl font-bold text-casino-gold mb-8">Craps</h1>

      <div className="flex gap-6 mb-8">
        <DiceComponent value={dice1} />
        <DiceComponent value={dice2} />
      </div>

      <div className="text-3xl font-bold text-white mb-4">
        Total: {dice1 + dice2}
      </div>

      {point && (
        <div className="text-2xl font-bold text-casino-gold mb-4">
          Point: {point}
        </div>
      )}

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold mb-4 text-center max-w-md"
        >
          {message}
        </motion.div>
      )}

      <div className="flex gap-4 items-center mb-4 flex-wrap justify-center">
        {gameState === 'betting' && (
          <div className="flex gap-2">
            <button
              onClick={() => setBetType('pass')}
              className={`px-6 py-3 font-bold rounded-lg shadow-lg ${
                betType === 'pass'
                  ? 'bg-casino-gold text-black'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              PASS LINE
            </button>
            <button
              onClick={() => setBetType('dontpass')}
              className={`px-6 py-3 font-bold rounded-lg shadow-lg ${
                betType === 'dontpass'
                  ? 'bg-casino-gold text-black'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              DON'T PASS
            </button>
          </div>
        )}
        
        <WagerSelector />
        
        {gameState === 'result' ? (
          <button
            onClick={() => {
              setGameState('betting');
              setMessage('');
            }}
            className="px-8 py-3 bg-casino-gold hover:bg-casino-darkGold text-black font-bold rounded-lg shadow-lg"
          >
            NEW GAME (SPACE)
          </button>
        ) : (
          <button
            onClick={rollDice}
            disabled={rolling}
            className="px-8 py-3 bg-casino-red hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg"
          >
            {rolling ? 'ROLLING...' : 'ROLL DICE (SPACE)'}
          </button>
        )}
      </div>

      <p className="text-sm text-gray-400">
        {gameState === 'betting' && 'Select bet type with ← → • Press SPACE to roll'}
        {gameState !== 'betting' && gameState !== 'result' && 'Press SPACE to roll'}
      </p>
    </div>
  );
}

