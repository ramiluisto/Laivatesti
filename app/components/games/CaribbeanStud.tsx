'use client';

import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import BackButton from '../BackButton';
import WagerSelector from '../WagerSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

type Card = { suit: string; value: string; emoji: string };

const suits = ['♠️', '♥️', '♦️', '♣️'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const PAYOUTS = {
  'Royal Flush': 100,
  'Straight Flush': 50,
  'Four of a Kind': 20,
  'Full House': 7,
  'Flush': 5,
  'Straight': 4,
  'Three of a Kind': 3,
  'Two Pair': 2,
  'Pair': 1,
};

export default function CaribbeanStud() {
  const { wager, addToBalance, subtractFromBalance, playerName } = useGame();
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'result'>('betting');
  const [showPayouts, setShowPayouts] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedAction, setSelectedAction] = useState<'fold' | 'raise'>('raise');

  const createDeck = (): Card[] => {
    const deck: Card[] = [];
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value, emoji: suit });
      }
    }
    return deck.sort(() => Math.random() - 0.5);
  };

  const dealCards = () => {
    if (!subtractFromBalance(wager)) {
      setMessage('Insufficient funds!');
      return;
    }

    const deck = createDeck();
    setPlayerCards(deck.slice(0, 5));
    setDealerCards(deck.slice(5, 10));
    setGameState('playing');
    setMessage('');
  };

  const handleAction = (action: 'fold' | 'raise') => {
    if (action === 'fold') {
      setMessage(`${playerName} folded. Ante lost, but you're still fabulous at 40!`);
      setGameState('result');
      return;
    }

    // Raise costs 2x the ante
    if (!subtractFromBalance(wager * 2)) {
      setMessage('Insufficient funds for raise!');
      return;
    }

    evaluateWinner();
  };

  const evaluateWinner = () => {
    const playerHand = evaluateHand(playerCards);
    const dealerHand = evaluateHand(dealerCards);

    // Dealer must qualify with AK or better
    if (dealerHand.rank === 0 && !hasAceKing(dealerCards)) {
      addToBalance(wager * 4); // Return ante + raise, plus 1:1 on ante
      setMessage(`Dealer doesn't qualify! ${playerName} wins! +€${(wager * 4).toFixed(2)}`);
      setGameState('result');
      return;
    }

    if (playerHand.rank > dealerHand.rank) {
      const payout = PAYOUTS[playerHand.name as keyof typeof PAYOUTS] || 1;
      const winAmount = wager * (3 + payout);
      addToBalance(winAmount);
      setMessage(`${playerName} wins with ${playerHand.name}! +€${winAmount.toFixed(2)}`);
    } else if (playerHand.rank < dealerHand.rank) {
      setMessage(`Dealer wins with ${dealerHand.name}. You're still awesome!`);
    } else {
      addToBalance(wager * 3); // Push
      setMessage(`Push with ${playerHand.name}!`);
    }
    setGameState('result');
  };

  const hasAceKing = (cards: Card[]): boolean => {
    const values = cards.map(c => c.value);
    return values.includes('A') && values.includes('K');
  };

  const evaluateHand = (cards: Card[]): { name: string; rank: number } => {
    const valueMap = cards.map(c => c.value);
    const suitMap = cards.map(c => c.suit);
    
    const valueCounts: Record<string, number> = {};
    valueMap.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);
    
    const counts = Object.values(valueCounts).sort((a, b) => b - a);
    const isFlush = suitMap.every(s => s === suitMap[0]);
    
    const valueOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const sortedIndices = valueMap.map(v => valueOrder.indexOf(v)).sort((a, b) => a - b);
    const isStraight = sortedIndices.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1);
    const isRoyal = isStraight && sortedIndices[0] === 8;
    
    if (isRoyal && isFlush) return { name: 'Royal Flush', rank: 9 };
    if (isStraight && isFlush) return { name: 'Straight Flush', rank: 8 };
    if (counts[0] === 4) return { name: 'Four of a Kind', rank: 7 };
    if (counts[0] === 3 && counts[1] === 2) return { name: 'Full House', rank: 6 };
    if (isFlush) return { name: 'Flush', rank: 5 };
    if (isStraight) return { name: 'Straight', rank: 4 };
    if (counts[0] === 3) return { name: 'Three of a Kind', rank: 3 };
    if (counts[0] === 2 && counts[1] === 2) return { name: 'Two Pair', rank: 2 };
    if (counts[0] === 2) return { name: 'Pair', rank: 1 };
    
    return { name: 'High Card', rank: 0 };
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (gameState === 'betting') dealCards();
        else if (gameState === 'result') setGameState('betting');
        else handleAction(selectedAction);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedAction(prev => prev === 'fold' ? 'raise' : 'fold');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, selectedAction, wager]);

  const CardComponent = ({ card, hidden = false }: { card: Card; hidden?: boolean }) => (
    <div className="w-20 h-32 bg-white rounded-lg flex flex-col items-center justify-center shadow-2xl border-2 border-gray-300">
      {hidden ? (
        <div className="text-4xl">🂠</div>
      ) : (
        <>
          <div className="text-3xl mb-1">{card.emoji}</div>
          <div className={`text-xl font-bold ${['♥️', '♦️'].includes(card.suit) ? 'text-red-600' : 'text-black'}`}>
            {card.value}
          </div>
        </>
      )}
    </div>
  );

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
              <h2 className="text-2xl font-bold text-casino-gold mb-4">Caribbean Stud Payouts</h2>
              <div className="space-y-2">
                {Object.entries(PAYOUTS).map(([hand, payout]) => (
                  <div key={hand} className="flex justify-between text-white">
                    <span>{hand}</span>
                    <span className="text-casino-gold font-bold">{payout}:1</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-300 mt-4">Dealer must have AK or better to qualify</p>
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

      <h1 className="text-4xl font-bold text-casino-gold mb-8">Caribbean Stud Poker</h1>

      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-2 text-center">Dealer's Hand</p>
        <div className="flex gap-2">
          {dealerCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <CardComponent card={card} hidden={i !== 0 && gameState !== 'result'} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-2 text-center">Your Hand</p>
        <div className="flex gap-2">
          {playerCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              transition={{ delay: (i + 5) * 0.1 }}
            >
              <CardComponent card={card} />
            </motion.div>
          ))}
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold mb-4 text-casino-gold"
        >
          {message}
        </motion.div>
      )}

      <div className="flex gap-4 items-center mb-4">
        <WagerSelector />
        
        {gameState === 'betting' && (
          <button
            onClick={dealCards}
            className="px-8 py-3 bg-casino-red hover:bg-red-700 text-white font-bold rounded-lg shadow-lg"
          >
            ANTE (SPACE)
          </button>
        )}
        
        {gameState === 'playing' && (
          <div className="flex gap-2">
            <button
              onClick={() => handleAction('fold')}
              className={`px-6 py-3 font-bold rounded-lg shadow-lg ${
                selectedAction === 'fold'
                  ? 'bg-casino-gold text-black'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              FOLD
            </button>
            <button
              onClick={() => handleAction('raise')}
              className={`px-6 py-3 font-bold rounded-lg shadow-lg ${
                selectedAction === 'raise'
                  ? 'bg-casino-gold text-black'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              RAISE (€{(wager * 2).toFixed(2)})
            </button>
          </div>
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
        {gameState === 'playing' && 'Use ← → to select • SPACE to confirm'}
        {gameState === 'betting' && 'Press SPACE to ante'}
      </p>
    </div>
  );
}

