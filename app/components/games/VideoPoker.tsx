'use client';

import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import BackButton from '../BackButton';
import WagerSelector from '../WagerSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

type Card = { suit: string; value: string; emoji: string };
type HandResult = { name: string; payout: number };

const suits = ['♠️', '♥️', '♦️', '♣️'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const PAYOUTS = {
  'Royal Flush': 800,
  'Straight Flush': 50,
  'Four of a Kind': 25,
  'Full House': 9,
  'Flush': 6,
  'Straight': 4,
  'Three of a Kind': 3,
  'Two Pair': 2,
  'Jacks or Better': 1,
};

export default function VideoPoker() {
  const { wager, addToBalance, subtractFromBalance, playerName } = useGame();
  const [deck, setDeck] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [gameState, setGameState] = useState<'betting' | 'holding' | 'result'>('betting');
  const [result, setResult] = useState<HandResult | null>(null);
  const [showPayouts, setShowPayouts] = useState(false);
  const [message, setMessage] = useState('');

  const createDeck = (): Card[] => {
    const newDeck: Card[] = [];
    for (const suit of suits) {
      for (const value of values) {
        newDeck.push({ suit, value, emoji: suit });
      }
    }
    return newDeck.sort(() => Math.random() - 0.5);
  };

  const dealInitialHand = () => {
    if (!subtractFromBalance(wager)) {
      setMessage('Insufficient funds!');
      return;
    }
    const newDeck = createDeck();
    setDeck(newDeck);
    setHand(newDeck.slice(0, 5));
    setHeld([false, false, false, false, false]);
    setGameState('holding');
    setResult(null);
    setMessage('');
  };

  const toggleHold = (index: number) => {
    if (gameState !== 'holding') return;
    const newHeld = [...held];
    newHeld[index] = !newHeld[index];
    setHeld(newHeld);
  };

  const draw = () => {
    if (gameState !== 'holding') return;
    
    let deckIndex = 5;
    const newHand = hand.map((card, i) => {
      if (held[i]) return card;
      return deck[deckIndex++];
    });
    
    setHand(newHand);
    const handResult = evaluateHand(newHand);
    setResult(handResult);
    
    if (handResult.payout > 0) {
      const winAmount = wager * handResult.payout;
      addToBalance(winAmount);
      setMessage(`${playerName}, you won €${winAmount.toFixed(2)}! ${handResult.name}!`);
    } else {
      setMessage('Better luck next time, champ!');
    }
    
    setGameState('result');
  };

  const evaluateHand = (cards: Card[]): HandResult => {
    const values = cards.map(c => c.value);
    const suits = cards.map(c => c.suit);
    
    const valueCounts: Record<string, number> = {};
    values.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);
    const counts = Object.values(valueCounts).sort((a, b) => b - a);
    
    const isFlush = suits.every(s => s === suits[0]);
    const valueOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const sortedIndices = values.map(v => valueOrder.indexOf(v)).sort((a, b) => a - b);
    const isStraight = sortedIndices.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1);
    const isRoyal = isStraight && sortedIndices[0] === 8; // 10-A
    
    if (isRoyal && isFlush) return { name: 'Royal Flush', payout: PAYOUTS['Royal Flush'] };
    if (isStraight && isFlush) return { name: 'Straight Flush', payout: PAYOUTS['Straight Flush'] };
    if (counts[0] === 4) return { name: 'Four of a Kind', payout: PAYOUTS['Four of a Kind'] };
    if (counts[0] === 3 && counts[1] === 2) return { name: 'Full House', payout: PAYOUTS['Full House'] };
    if (isFlush) return { name: 'Flush', payout: PAYOUTS['Flush'] };
    if (isStraight) return { name: 'Straight', payout: PAYOUTS['Straight'] };
    if (counts[0] === 3) return { name: 'Three of a Kind', payout: PAYOUTS['Three of a Kind'] };
    if (counts[0] === 2 && counts[1] === 2) return { name: 'Two Pair', payout: PAYOUTS['Two Pair'] };
    if (counts[0] === 2) {
      const pairValue = Object.keys(valueCounts).find(k => valueCounts[k] === 2);
      if (pairValue && ['J', 'Q', 'K', 'A'].includes(pairValue)) {
        return { name: 'Jacks or Better', payout: PAYOUTS['Jacks or Better'] };
      }
    }
    
    return { name: 'No Win', payout: 0 };
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (gameState === 'betting') dealInitialHand();
        else if (gameState === 'holding') draw();
        else if (gameState === 'result') setGameState('betting');
      } else if (gameState === 'holding' && ['1', '2', '3', '4', '5'].includes(e.key)) {
        toggleHold(parseInt(e.key) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, wager, hand, held]);

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
              <h2 className="text-2xl font-bold text-casino-gold mb-4">Video Poker Payouts</h2>
              <div className="space-y-2">
                {Object.entries(PAYOUTS).map(([hand, payout]) => (
                  <div key={hand} className="flex justify-between text-white">
                    <span>{hand}</span>
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

      <h1 className="text-4xl font-bold text-casino-gold mb-8">Video Poker</h1>

      <div className="flex gap-3 mb-8">
        {hand.map((card, index) => (
          <motion.div
            key={`${card.suit}-${card.value}-${index}`}
            onClick={() => toggleHold(index)}
            className={`w-32 h-48 bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-2xl relative border-4 ${
              held[index] ? 'border-casino-gold ring-4 ring-casino-gold' : 'border-gray-300'
            }`}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
          >
            <div className="text-6xl mb-2">{card.emoji}</div>
            <div className={`text-3xl font-bold ${['♥️', '♦️'].includes(card.suit) ? 'text-red-600' : 'text-black'}`}>
              {card.value}
            </div>
            {held[index] && (
              <motion.div
                className="absolute -top-8 bg-casino-gold text-black px-3 py-1 rounded-lg text-sm font-bold shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                HELD
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl font-bold mb-4 ${result?.payout ? 'text-casino-gold' : 'text-gray-300'}`}
        >
          {message}
        </motion.div>
      )}

      <div className="flex gap-4 items-center mb-4">
        <WagerSelector />
        
        {gameState === 'betting' && (
          <button
            onClick={dealInitialHand}
            className="px-8 py-3 bg-casino-red hover:bg-red-700 text-white font-bold rounded-lg shadow-lg"
          >
            DEAL (SPACE)
          </button>
        )}
        
        {gameState === 'holding' && (
          <button
            onClick={draw}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg"
          >
            DRAW (SPACE)
          </button>
        )}
        
        {gameState === 'result' && (
          <button
            onClick={() => setGameState('betting')}
            className="px-8 py-3 bg-casino-gold hover:bg-casino-darkGold text-black font-bold rounded-lg shadow-lg"
          >
            NEW GAME (SPACE)
          </button>
        )}
      </div>

      <p className="text-sm text-gray-400">
        {gameState === 'holding' && 'Click cards or press 1-5 to hold • Press SPACE to draw'}
        {gameState === 'betting' && 'Press SPACE to deal'}
        {gameState === 'result' && 'Press SPACE for new game'}
      </p>
    </div>
  );
}

