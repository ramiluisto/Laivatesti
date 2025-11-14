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
  'Four of a Kind': 40,
  'Full House': 10,
  'Flush': 7,
  'Straight': 5,
  'Three of a Kind': 3,
  'Two Pair': 2,
  'Pair': 1,
};

export default function TexasHoldem() {
  const { wager, addToBalance, subtractFromBalance, playerName } = useGame();
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'flop' | 'turn' | 'river' | 'result'>('betting');
  const [playerAction, setPlayerAction] = useState<'fold' | 'call' | null>(null);
  const [showPayouts, setShowPayouts] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedAction, setSelectedAction] = useState<'fold' | 'call'>('call');

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
    setPlayerCards([deck[0], deck[1]]);
    setDealerCards([deck[2], deck[3]]);
    setCommunityCards([deck[4], deck[5], deck[6]]);
    setGameState('flop');
    setPlayerAction(null);
    setMessage('');
  };

  const handleAction = (action: 'fold' | 'call') => {
    setPlayerAction(action);
    
    if (action === 'fold') {
      setMessage(`${playerName}, you folded. Better safe than sorry!`);
      setGameState('result');
      return;
    }

    if (!subtractFromBalance(wager)) {
      setMessage('Insufficient funds for call!');
      return;
    }

    if (gameState === 'flop') {
      const deck = createDeck();
      setCommunityCards(prev => [...prev, deck[7]]);
      setGameState('turn');
    } else if (gameState === 'turn') {
      const deck = createDeck();
      setCommunityCards(prev => [...prev, deck[8]]);
      setGameState('river');
    } else if (gameState === 'river') {
      evaluateWinner();
    }
  };

  const evaluateWinner = () => {
    const playerHand = evaluateHand([...playerCards, ...communityCards]);
    const dealerHand = evaluateHand([...dealerCards, ...communityCards]);

    if (playerHand.rank > dealerHand.rank) {
      const winAmount = wager * 3; // Original bet + 2x win
      addToBalance(winAmount);
      setMessage(`${playerName} wins with ${playerHand.name}! +€${winAmount.toFixed(2)}`);
    } else if (playerHand.rank < dealerHand.rank) {
      setMessage(`Dealer wins with ${dealerHand.name}. Keep going, champ!`);
    } else {
      addToBalance(wager * 2); // Push - return both bets
      setMessage(`Push! Both have ${playerHand.name}`);
    }
    setGameState('result');
  };

  const evaluateHand = (cards: Card[]): { name: string; rank: number } => {
    // Simplified hand evaluation - checks best 5-card combination
    const valueCounts: Record<string, number> = {};
    const suitCounts: Record<string, number> = {};
    
    cards.forEach(c => {
      valueCounts[c.value] = (valueCounts[c.value] || 0) + 1;
      suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
    });

    const counts = Object.values(valueCounts).sort((a, b) => b - a);
    const isFlush = Object.values(suitCounts).some(count => count >= 5);
    
    if (counts[0] === 4) return { name: 'Four of a Kind', rank: 7 };
    if (counts[0] === 3 && counts[1] >= 2) return { name: 'Full House', rank: 6 };
    if (isFlush) return { name: 'Flush', rank: 5 };
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
        setSelectedAction(prev => prev === 'fold' ? 'call' : 'fold');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, selectedAction, wager]);

  const CardComponent = ({ card, hidden = false }: { card: Card; hidden?: boolean }) => (
    <div className="w-20 h-28 bg-white rounded-lg flex flex-col items-center justify-center shadow-xl">
      {hidden ? (
        <div className="text-4xl">🂠</div>
      ) : (
        <>
          <div className="text-3xl">{card.emoji}</div>
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
              <h2 className="text-2xl font-bold text-casino-gold mb-4">Texas Hold'em Payouts</h2>
              <div className="space-y-2">
                {Object.entries(PAYOUTS).map(([hand, payout]) => (
                  <div key={hand} className="flex justify-between text-white">
                    <span>{hand}</span>
                    <span className="text-casino-gold font-bold">{payout}:1</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-300 mt-4">Win against dealer: 3x your total bet</p>
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

      <h1 className="text-4xl font-bold text-casino-gold mb-8">Texas Hold'em</h1>

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
              <CardComponent card={card} hidden={gameState !== 'result'} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-2 text-center">Community Cards</p>
        <div className="flex gap-2">
          {communityCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              transition={{ delay: (i + 2) * 0.1 }}
            >
              <CardComponent card={card} />
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
            DEAL (SPACE)
          </button>
        )}
        
        {['flop', 'turn', 'river'].includes(gameState) && (
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
              onClick={() => handleAction('call')}
              className={`px-6 py-3 font-bold rounded-lg shadow-lg ${
                selectedAction === 'call'
                  ? 'bg-casino-gold text-black'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              CALL (€{wager.toFixed(2)})
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
        {['flop', 'turn', 'river'].includes(gameState) && 'Use ← → to select • SPACE to confirm'}
        {gameState === 'betting' && 'Press SPACE to deal'}
      </p>
    </div>
  );
}

