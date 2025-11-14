'use client';

import { GameProvider, useGame } from './contexts/GameContext';
import MoneyDisplay from './components/MoneyDisplay';
import MainMenu from './components/MainMenu';
import VideoPoker from './components/games/VideoPoker';
import TexasHoldem from './components/games/TexasHoldem';
import CaribbeanStud from './components/games/CaribbeanStud';
import Craps from './components/games/Craps';
import Roulette from './components/games/Roulette';
import SlotsLucky7 from './components/games/SlotsLucky7';
import SlotsFortune from './components/games/SlotsFortune';
import AnniversaryPopup from './components/AnniversaryPopup';

function GameContent() {
  const { currentGame } = useGame();

  const renderGame = () => {
    switch (currentGame) {
      case 'menu':
        return <MainMenu />;
      case 'video-poker':
        return <VideoPoker />;
      case 'texas-holdem':
        return <TexasHoldem />;
      case 'caribbean-stud':
        return <CaribbeanStud />;
      case 'craps':
        return <Craps />;
      case 'roulette':
        return <Roulette />;
      case 'slots-lucky7':
        return <SlotsLucky7 />;
      case 'slots-fortune':
        return <SlotsFortune />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <>
      <AnniversaryPopup />
      <MoneyDisplay />
      {renderGame()}
    </>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

