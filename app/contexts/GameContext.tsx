'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type GameType = 'menu' | 'video-poker' | 'texas-holdem' | 'caribbean-stud' | 'craps' | 'roulette' | 'slots-lucky7' | 'slots-fortune';

export const WAGER_LEVELS = [0.2, 1, 2, 5] as const;
export type WagerLevel = typeof WAGER_LEVELS[number];

interface GameContextType {
  playerName: string;
  balance: number;
  currentGame: GameType;
  wager: WagerLevel;
  setCurrentGame: (game: GameType) => void;
  setWager: (wager: WagerLevel) => void;
  addToBalance: (amount: number) => void;
  subtractFromBalance: (amount: number) => boolean;
  hasWon: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [playerName] = useState('Jan-Erik');
  const [balance, setBalance] = useState(200);
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [wager, setWager] = useState<WagerLevel>(0.2);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    if (balance >= 2000 && !hasWon) {
      setHasWon(true);
    }
  }, [balance, hasWon]);

  const addToBalance = (amount: number) => {
    setBalance(prev => {
      const newBalance = prev + amount;
      return Math.round(newBalance * 100) / 100;
    });
  };

  const subtractFromBalance = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance(prev => {
        const newBalance = prev - amount;
        return Math.round(newBalance * 100) / 100;
      });
      return true;
    }
    return false;
  };

  return (
    <GameContext.Provider
      value={{
        playerName,
        balance,
        currentGame,
        wager,
        setCurrentGame,
        setWager,
        addToBalance,
        subtractFromBalance,
        hasWon,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

