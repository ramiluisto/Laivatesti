#!/usr/bin/env node

/**
 * Automated Casino Player Simulator
 *
 * This script simulates a player going through Jan-Erik's 40th Anniversary Casino,
 * playing games, tracking statistics, and generating a comprehensive report.
 *
 * Usage: npm run test:simulate
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  STARTING_BALANCE: 200,
  GOAL_BALANCE: 2000,
  MAX_ROUNDS: 10000,
  WAGER_LEVELS: [0.2, 1, 2, 5],
  REPORT_INTERVAL: 100, // Report every N rounds
};

// Statistics tracker
class Statistics {
  constructor() {
    this.reset();
  }

  reset() {
    this.totalRounds = 0;
    this.balanceHistory = [CONFIG.STARTING_BALANCE];
    this.gameStats = {
      'video-poker': { played: 0, won: 0, lost: 0, totalWagered: 0, totalWon: 0 },
      'texas-holdem': { played: 0, won: 0, lost: 0, totalWagered: 0, totalWon: 0 },
      'caribbean-stud': { played: 0, won: 0, lost: 0, totalWagered: 0, totalWon: 0 },
      'craps': { played: 0, won: 0, lost: 0, totalWagered: 0, totalWon: 0 },
      'roulette': { played: 0, won: 0, lost: 0, totalWagered: 0, totalWon: 0 },
      'slots-lucky7': { played: 0, won: 0, lost: 0, totalWagered: 0, totalWon: 0 },
      'slots-fortune': { played: 0, won: 0, lost: 0, totalWagered: 0, totalWon: 0 },
    };
    this.milestones = {
      500: null,
      1000: null,
      1500: null,
      2000: null,
    };
    this.biggestWin = 0;
    this.biggestLoss = 0;
    this.maxBalance = CONFIG.STARTING_BALANCE;
    this.minBalance = CONFIG.STARTING_BALANCE;
    this.bustedCount = 0;
    this.startTime = Date.now();
  }

  recordRound(game, wager, winAmount, currentBalance) {
    this.totalRounds++;
    this.balanceHistory.push(currentBalance);

    const stats = this.gameStats[game];
    stats.played++;
    stats.totalWagered += wager;

    const netResult = winAmount - wager;
    if (netResult > 0) {
      stats.won++;
      stats.totalWon += winAmount;
      this.biggestWin = Math.max(this.biggestWin, netResult);
    } else if (netResult < 0) {
      stats.lost++;
      this.biggestLoss = Math.max(this.biggestLoss, Math.abs(netResult));
    }

    this.maxBalance = Math.max(this.maxBalance, currentBalance);
    this.minBalance = Math.min(this.minBalance, currentBalance);

    // Check milestones
    Object.keys(this.milestones).forEach(milestone => {
      if (!this.milestones[milestone] && currentBalance >= milestone) {
        this.milestones[milestone] = this.totalRounds;
      }
    });

    if (currentBalance <= 0) {
      this.bustedCount++;
    }
  }
}

// Game simulators
class GameSimulator {
  static createDeck() {
    const suits = ['♠️', '♥️', '♦️', '♣️'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value });
      }
    }
    return deck.sort(() => Math.random() - 0.5);
  }

  static evaluatePokerHand(cards) {
    const values = cards.map(c => c.value);
    const suits = cards.map(c => c.suit);

    const valueCounts = {};
    values.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);
    const counts = Object.values(valueCounts).sort((a, b) => b - a);

    const isFlush = suits.every(s => s === suits[0]);
    const valueOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const sortedIndices = values.map(v => valueOrder.indexOf(v)).sort((a, b) => a - b);
    const isStraight = sortedIndices.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1);
    const isRoyal = isStraight && sortedIndices[0] === 8;

    if (isRoyal && isFlush) return { name: 'Royal Flush', payout: 800 };
    if (isStraight && isFlush) return { name: 'Straight Flush', payout: 50 };
    if (counts[0] === 4) return { name: 'Four of a Kind', payout: 25 };
    if (counts[0] === 3 && counts[1] === 2) return { name: 'Full House', payout: 9 };
    if (isFlush) return { name: 'Flush', payout: 6 };
    if (isStraight) return { name: 'Straight', payout: 4 };
    if (counts[0] === 3) return { name: 'Three of a Kind', payout: 3 };
    if (counts[0] === 2 && counts[1] === 2) return { name: 'Two Pair', payout: 2 };
    if (counts[0] === 2) {
      const pairValue = Object.keys(valueCounts).find(k => valueCounts[k] === 2);
      if (['J', 'Q', 'K', 'A'].includes(pairValue)) {
        return { name: 'Jacks or Better', payout: 1 };
      }
    }

    return { name: 'No Win', payout: 0 };
  }

  static playVideoPoker(wager) {
    const deck = this.createDeck();
    const hand = deck.slice(0, 5);

    // Simple strategy: hold pairs and high cards
    const held = hand.map((card, i) => {
      const hasHighCard = ['J', 'Q', 'K', 'A'].includes(card.value);
      const hasPair = hand.some((c, j) => i !== j && c.value === card.value);
      return hasHighCard || hasPair;
    });

    // Draw new cards
    let deckIndex = 5;
    const finalHand = hand.map((card, i) => {
      if (held[i]) return card;
      return deck[deckIndex++];
    });

    const result = this.evaluatePokerHand(finalHand);
    return wager * result.payout;
  }

  static playTexasHoldem(wager) {
    const deck = this.createDeck();
    const playerCards = deck.slice(0, 2);
    const dealerCards = deck.slice(2, 4);
    const community = deck.slice(4, 9);

    const playerHand = [...playerCards, ...community];
    const dealerHand = [...dealerCards, ...community];

    const playerResult = this.evaluatePokerHand(playerHand);
    const dealerResult = this.evaluatePokerHand(dealerHand);

    // Simple strategy: always call
    const totalBet = wager * 2; // Ante + call

    if (playerResult.payout > dealerResult.payout) {
      return totalBet * 2; // Win both bets back plus winnings
    } else if (playerResult.payout === dealerResult.payout) {
      return totalBet; // Push
    }
    return 0; // Loss
  }

  static playCaribbeanStud(wager) {
    const deck = this.createDeck();
    const playerCards = deck.slice(0, 5);
    const dealerCards = deck.slice(5, 10);

    const playerResult = this.evaluatePokerHand(playerCards);
    const dealerResult = this.evaluatePokerHand(dealerCards);

    // Simple strategy: raise with pair or better
    if (playerResult.payout === 0) {
      return 0; // Fold, lose ante
    }

    const totalBet = wager * 3; // Ante + raise (2x)

    // Dealer needs AK or better to qualify
    const hasAceKing = dealerCards.some(c => c.value === 'A') && dealerCards.some(c => c.value === 'K');
    if (dealerResult.payout === 0 && !hasAceKing) {
      return wager * 4; // Dealer doesn't qualify
    }

    if (playerResult.payout > dealerResult.payout) {
      return totalBet + (wager * playerResult.payout);
    }
    return 0;
  }

  static playCraps(wager) {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;

    // Play Pass Line
    // Come out roll
    if (total === 7 || total === 11) {
      return wager * 2;
    } else if (total === 2 || total === 3 || total === 12) {
      return 0;
    }

    // Point established - simulate point phase
    const point = total;
    while (true) {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const roll = d1 + d2;

      if (roll === point) {
        return wager * 2;
      } else if (roll === 7) {
        return 0;
      }
    }
  }

  static playRoulette(wager) {
    const number = Math.floor(Math.random() * 37); // 0-36

    // Simple strategy: bet on red
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

    if (number === 0) {
      return 0; // House wins
    }

    if (redNumbers.includes(number)) {
      return wager * 2;
    }
    return 0;
  }

  static playSlotsLucky7(wager) {
    const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];
    const payouts = {
      '7️⃣': 100,
      '💎': 50,
      '⭐': 25,
      '🍇': 10,
      '🍊': 8,
      '🍋': 6,
      '🍒': 5,
    };

    const reels = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];

    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      return wager * (payouts[reels[0]] || 5);
    } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
      return wager * 2;
    }
    return 0;
  }

  static playSlotsFortune(wager) {
    const symbols = ['👑', '💰', '🎁', '🎂', '🎉', '✨', '🔥'];
    const payouts = {
      '👑': 80,
      '💰': 40,
      '🎁': 30,
      '🎂': 40,
      '🎉': 20,
      '✨': 15,
      '🔥': 25,
    };

    // 5% chance of birthday jackpot
    const isJackpot = Math.random() < 0.05;

    let reels;
    if (isJackpot) {
      reels = ['🎂', '🎂', '🎂'];
    } else {
      reels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
    }

    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      return wager * (payouts[reels[0]] || 10);
    } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
      return wager * 2;
    }
    return 0;
  }
}

// Automated player
class AutomatedPlayer {
  constructor() {
    this.balance = CONFIG.STARTING_BALANCE;
    this.stats = new Statistics();
    this.currentWager = CONFIG.WAGER_LEVELS[0];
    this.games = [
      'video-poker',
      'texas-holdem',
      'caribbean-stud',
      'craps',
      'roulette',
      'slots-lucky7',
      'slots-fortune',
    ];
  }

  selectWager() {
    // Dynamic wagering strategy
    if (this.balance >= 1000) {
      this.currentWager = CONFIG.WAGER_LEVELS[3]; // €5
    } else if (this.balance >= 500) {
      this.currentWager = CONFIG.WAGER_LEVELS[2]; // €2
    } else if (this.balance >= 200) {
      this.currentWager = CONFIG.WAGER_LEVELS[1]; // €1
    } else {
      this.currentWager = CONFIG.WAGER_LEVELS[0]; // €0.20
    }

    // Ensure we can afford the wager
    if (this.balance < this.currentWager) {
      this.currentWager = CONFIG.WAGER_LEVELS[0];
    }
  }

  selectGame() {
    // Varied game selection - prefer different games
    const weights = {
      'video-poker': 2,
      'texas-holdem': 1.5,
      'caribbean-stud': 1.5,
      'craps': 1,
      'roulette': 1,
      'slots-lucky7': 1.5,
      'slots-fortune': 2, // Slightly prefer fortune wheel for jackpot
    };

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (const game of this.games) {
      random -= weights[game];
      if (random <= 0) {
        return game;
      }
    }

    return this.games[0];
  }

  playRound() {
    if (this.balance < CONFIG.WAGER_LEVELS[0]) {
      return false; // Busted
    }

    this.selectWager();
    const game = this.selectGame();

    this.balance -= this.currentWager;
    let winAmount = 0;

    switch (game) {
      case 'video-poker':
        winAmount = GameSimulator.playVideoPoker(this.currentWager);
        break;
      case 'texas-holdem':
        winAmount = GameSimulator.playTexasHoldem(this.currentWager);
        break;
      case 'caribbean-stud':
        winAmount = GameSimulator.playCaribbeanStud(this.currentWager);
        break;
      case 'craps':
        winAmount = GameSimulator.playCraps(this.currentWager);
        break;
      case 'roulette':
        winAmount = GameSimulator.playRoulette(this.currentWager);
        break;
      case 'slots-lucky7':
        winAmount = GameSimulator.playSlotsLucky7(this.currentWager);
        break;
      case 'slots-fortune':
        winAmount = GameSimulator.playSlotsFortune(this.currentWager);
        break;
    }

    this.balance += winAmount;
    this.balance = Math.round(this.balance * 100) / 100;

    this.stats.recordRound(game, this.currentWager, winAmount, this.balance);

    return true;
  }

  simulate() {
    console.log('🎰 Starting Automated Casino Player Simulation...\n');
    console.log(`Starting Balance: €${this.balance.toFixed(2)}`);
    console.log(`Goal: €${CONFIG.GOAL_BALANCE.toFixed(2)}`);
    console.log(`Max Rounds: ${CONFIG.MAX_ROUNDS}\n`);

    let round = 0;
    while (round < CONFIG.MAX_ROUNDS) {
      if (!this.playRound()) {
        console.log(`\n❌ Busted at round ${round + 1}!`);
        break;
      }

      round++;

      // Progress update
      if (round % CONFIG.REPORT_INTERVAL === 0) {
        const progress = (this.balance / CONFIG.GOAL_BALANCE * 100).toFixed(1);
        console.log(`Round ${round}: €${this.balance.toFixed(2)} (${progress}% of goal)`);
      }

      // Check if goal reached
      if (this.balance >= CONFIG.GOAL_BALANCE) {
        console.log(`\n🏆 GOAL REACHED at round ${round}!`);
        console.log(`Final Balance: €${this.balance.toFixed(2)}`);
        break;
      }
    }

    if (round >= CONFIG.MAX_ROUNDS) {
      console.log(`\n⏱️  Reached maximum rounds (${CONFIG.MAX_ROUNDS})`);
      console.log(`Final Balance: €${this.balance.toFixed(2)}`);
    }

    this.generateReport();
  }

  generateReport() {
    const duration = (Date.now() - this.stats.startTime) / 1000;

    console.log('\n' + '='.repeat(80));
    console.log('📊 SIMULATION REPORT');
    console.log('='.repeat(80));

    console.log('\n📈 Overall Statistics:');
    console.log(`  Total Rounds Played: ${this.stats.totalRounds}`);
    console.log(`  Simulation Duration: ${duration.toFixed(2)}s`);
    console.log(`  Starting Balance: €${CONFIG.STARTING_BALANCE.toFixed(2)}`);
    console.log(`  Final Balance: €${this.balance.toFixed(2)}`);
    console.log(`  Net Change: €${(this.balance - CONFIG.STARTING_BALANCE).toFixed(2)}`);
    console.log(`  Peak Balance: €${this.stats.maxBalance.toFixed(2)}`);
    console.log(`  Lowest Balance: €${this.stats.minBalance.toFixed(2)}`);
    console.log(`  Biggest Single Win: €${this.stats.biggestWin.toFixed(2)}`);
    console.log(`  Biggest Single Loss: €${this.stats.biggestLoss.toFixed(2)}`);

    console.log('\n🎯 Milestones:');
    Object.keys(this.stats.milestones).forEach(milestone => {
      const round = this.stats.milestones[milestone];
      if (round) {
        console.log(`  €${milestone}: Reached at round ${round}`);
      } else {
        console.log(`  €${milestone}: Not reached`);
      }
    });

    console.log('\n🎮 Game-by-Game Statistics:');
    const gameNames = {
      'video-poker': 'Video Poker',
      'texas-holdem': 'Texas Hold\'em',
      'caribbean-stud': 'Caribbean Stud',
      'craps': 'Craps',
      'roulette': 'Roulette',
      'slots-lucky7': 'Lucky 7 Slots',
      'slots-fortune': 'Fortune Wheel',
    };

    Object.keys(this.stats.gameStats).forEach(game => {
      const stats = this.stats.gameStats[game];
      if (stats.played > 0) {
        const winRate = ((stats.won / stats.played) * 100).toFixed(1);
        const roi = ((stats.totalWon - stats.totalWagered) / stats.totalWagered * 100).toFixed(1);

        console.log(`\n  ${gameNames[game]}:`);
        console.log(`    Rounds: ${stats.played}`);
        console.log(`    Won: ${stats.won} (${winRate}%)`);
        console.log(`    Lost: ${stats.lost}`);
        console.log(`    Total Wagered: €${stats.totalWagered.toFixed(2)}`);
        console.log(`    Total Won: €${stats.totalWon.toFixed(2)}`);
        console.log(`    Net: €${(stats.totalWon - stats.totalWagered).toFixed(2)}`);
        console.log(`    ROI: ${roi}%`);
      }
    });

    // Save detailed report to file
    this.saveReportToFile();
  }

  saveReportToFile() {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `simulation-report-${timestamp}.json`;
    const filepath = path.join(__dirname, filename);

    const report = {
      timestamp: new Date().toISOString(),
      config: CONFIG,
      summary: {
        totalRounds: this.stats.totalRounds,
        startingBalance: CONFIG.STARTING_BALANCE,
        finalBalance: this.balance,
        netChange: this.balance - CONFIG.STARTING_BALANCE,
        peakBalance: this.stats.maxBalance,
        lowestBalance: this.stats.minBalance,
        biggestWin: this.stats.biggestWin,
        biggestLoss: this.stats.biggestLoss,
        goalReached: this.balance >= CONFIG.GOAL_BALANCE,
      },
      milestones: this.stats.milestones,
      gameStats: this.stats.gameStats,
      balanceHistory: this.stats.balanceHistory,
    };

    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${filename}`);
  }
}

// Run simulation
if (require.main === module) {
  const player = new AutomatedPlayer();
  player.simulate();
}

module.exports = { AutomatedPlayer, GameSimulator, Statistics };
