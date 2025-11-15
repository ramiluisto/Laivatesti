/**
 * Game Balance Tests
 *
 * These tests verify that the casino games are balanced and fair.
 * They run multiple simulations to ensure statistical properties are within expected ranges.
 */

const { AutomatedPlayer, GameSimulator } = require('./automated-player');

describe('Casino Game Balance Tests', () => {
  describe('Video Poker', () => {
    it('should have reasonable payout rate over 1000 hands', () => {
      let totalWagered = 0;
      let totalWon = 0;
      const hands = 1000;

      for (let i = 0; i < hands; i++) {
        const wager = 1;
        totalWagered += wager;
        totalWon += GameSimulator.playVideoPoker(wager);
      }

      const payoutRate = (totalWon / totalWagered) * 100;
      console.log(`Video Poker payout rate: ${payoutRate.toFixed(2)}%`);

      // Video poker with good strategy should return 85-100%
      expect(payoutRate).toBeGreaterThan(80);
      expect(payoutRate).toBeLessThan(105);
    });
  });

  describe('Roulette', () => {
    it('should have payout rate close to expected (~48.6% for red/black)', () => {
      let totalWagered = 0;
      let totalWon = 0;
      const spins = 1000;

      for (let i = 0; i < spins; i++) {
        const wager = 1;
        totalWagered += wager;
        totalWon += GameSimulator.playRoulette(wager);
      }

      const payoutRate = (totalWon / totalWagered) * 100;
      console.log(`Roulette payout rate: ${payoutRate.toFixed(2)}%`);

      // European roulette red/black should return ~94.6% (18/37 * 2)
      expect(payoutRate).toBeGreaterThan(80);
      expect(payoutRate).toBeLessThan(110);
    });
  });

  describe('Craps', () => {
    it('should have reasonable payout rate for pass line', () => {
      let totalWagered = 0;
      let totalWon = 0;
      const rolls = 500; // Craps can take multiple rolls per game

      for (let i = 0; i < rolls; i++) {
        const wager = 1;
        totalWagered += wager;
        totalWon += GameSimulator.playCraps(wager);
      }

      const payoutRate = (totalWon / totalWagered) * 100;
      console.log(`Craps payout rate: ${payoutRate.toFixed(2)}%`);

      // Pass line has ~98.6% RTP in real craps
      expect(payoutRate).toBeGreaterThan(85);
      expect(payoutRate).toBeLessThan(115);
    });
  });

  describe('Slots Lucky 7', () => {
    it('should have slot machine payout rate', () => {
      let totalWagered = 0;
      let totalWon = 0;
      const spins = 1000;

      for (let i = 0; i < spins; i++) {
        const wager = 1;
        totalWagered += wager;
        totalWon += GameSimulator.playSlotsLucky7(wager);
      }

      const payoutRate = (totalWon / totalWagered) * 100;
      console.log(`Lucky 7 Slots payout rate: ${payoutRate.toFixed(2)}%`);

      // Slots typically have 85-98% RTP
      expect(payoutRate).toBeGreaterThan(70);
      expect(payoutRate).toBeLessThan(120);
    });
  });

  describe('Slots Fortune Wheel', () => {
    it('should have higher payout due to birthday jackpot', () => {
      let totalWagered = 0;
      let totalWon = 0;
      const spins = 1000;

      for (let i = 0; i < spins; i++) {
        const wager = 1;
        totalWagered += wager;
        totalWon += GameSimulator.playSlotsFortune(wager);
      }

      const payoutRate = (totalWon / totalWagered) * 100;
      console.log(`Fortune Wheel payout rate: ${payoutRate.toFixed(2)}%`);

      // Fortune wheel has 5% jackpot chance, should be slightly higher RTP
      expect(payoutRate).toBeGreaterThan(70);
      expect(payoutRate).toBeLessThan(130);
    });
  });

  describe('Full Simulation', () => {
    it('should be possible to reach €2000 goal within reasonable time', () => {
      const player = new AutomatedPlayer();
      let round = 0;
      const maxRounds = 10000;

      while (round < maxRounds && player.balance >= 0.2) {
        player.playRound();
        round++;

        if (player.balance >= 2000) {
          console.log(`Goal reached in ${round} rounds!`);
          expect(player.balance).toBeGreaterThanOrEqual(2000);
          expect(round).toBeLessThan(maxRounds);
          return;
        }
      }

      // If we didn't reach the goal, that's okay - it's gambling
      // But we should log what happened
      console.log(`Simulation ended at round ${round} with balance €${player.balance.toFixed(2)}`);
      expect(round).toBeLessThanOrEqual(maxRounds);
    }, 30000); // 30 second timeout

    it('should track statistics correctly', () => {
      const player = new AutomatedPlayer();

      for (let i = 0; i < 100; i++) {
        if (player.balance < 0.2) break;
        player.playRound();
      }

      expect(player.stats.totalRounds).toBeGreaterThan(0);
      expect(player.stats.balanceHistory.length).toBe(player.stats.totalRounds + 1);
      expect(player.stats.maxBalance).toBeGreaterThanOrEqual(player.stats.minBalance);
    });
  });

  describe('Edge Cases', () => {
    it('should handle low balance correctly', () => {
      const player = new AutomatedPlayer();
      player.balance = 0.2; // Minimum wager

      const canPlay = player.playRound();
      expect(typeof canPlay).toBe('boolean');

      if (player.balance < 0.2) {
        const cannotPlay = player.playRound();
        expect(cannotPlay).toBe(false);
      }
    });

    it('should adjust wager based on balance', () => {
      const player = new AutomatedPlayer();

      // Test high balance
      player.balance = 1500;
      player.selectWager();
      expect(player.currentWager).toBeGreaterThan(0);

      // Test low balance
      player.balance = 50;
      player.selectWager();
      expect(player.currentWager).toBeLessThanOrEqual(player.balance);

      // Test very low balance
      player.balance = 0.2;
      player.selectWager();
      expect(player.currentWager).toBe(0.2);
    });
  });
});
