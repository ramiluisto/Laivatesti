# Automated Testing System for Jan-Erik's Casino

## Overview

This automated testing system simulates a player going through the casino games, tracking detailed statistics, and generating comprehensive reports. It's designed to help analyze game balance, player experience, and identify potential issues before human testing.

## Features

### 🤖 Automated Player
- Simulates realistic gameplay across all 7 casino games
- Implements basic strategies for each game
- Dynamically adjusts wager amounts based on balance
- Makes intelligent game selection decisions

### 📊 Statistics Tracking
- Per-game win/loss ratios
- Total wagered and won amounts
- ROI (Return on Investment) for each game
- Balance history over time
- Milestone tracking (€500, €1000, €1500, €2000)
- Biggest wins and losses
- Peak and lowest balance points

### 📈 Reporting
- Real-time progress updates during simulation
- Comprehensive end-of-simulation reports
- JSON export of detailed statistics
- Visual progress indicators

## Installation

Install testing dependencies:

```bash
npm install
```

This will install:
- Jest (testing framework)
- React Testing Library
- Testing utilities

## Usage

### Quick Simulation

Run a single automated simulation:

```bash
npm run test:simulate
```

This will:
1. Start with €200 balance
2. Play games using intelligent strategies
3. Track all statistics
4. Display progress every 100 rounds
5. Continue until reaching €2000 goal or max 10,000 rounds
6. Generate and save a detailed report

### Example Output

```
🎰 Starting Automated Casino Player Simulation...

Starting Balance: €200.00
Goal: €2000.00
Max Rounds: 10000

Round 100: €187.40 (9.4% of goal)
Round 200: €224.80 (11.2% of goal)
Round 300: €312.60 (15.6% of goal)
...

🏆 GOAL REACHED at round 2847!
Final Balance: €2043.80

================================================================================
📊 SIMULATION REPORT
================================================================================

📈 Overall Statistics:
  Total Rounds Played: 2847
  Simulation Duration: 2.34s
  Starting Balance: €200.00
  Final Balance: €2043.80
  Net Change: €1843.80
  Peak Balance: €2043.80
  Lowest Balance: €156.20
  Biggest Single Win: €320.00
  Biggest Single Loss: €15.00

🎯 Milestones:
  €500: Reached at round 432
  €1000: Reached at round 1256
  €1500: Reached at round 1989
  €2000: Reached at round 2847

🎮 Game-by-Game Statistics:

  Video Poker:
    Rounds: 487
    Won: 203 (41.7%)
    Lost: 284
    Total Wagered: €1,234.60
    Total Won: €1,156.80
    Net: €-77.80
    ROI: -6.3%

  [... more game statistics ...]

📄 Detailed report saved to: simulation-report-2025-01-15T14-30-45.json
```

### Unit Tests

Run the Jest test suite:

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:ci
```

The test suite includes:
- Game balance tests (verifying payout rates)
- Statistical tests (1000+ hands per game)
- Edge case tests (low balance, bust scenarios)
- Full simulation tests

## Configuration

Edit `tests/automated-player.js` to customize:

```javascript
const CONFIG = {
  STARTING_BALANCE: 200,        // Starting balance in EUR
  GOAL_BALANCE: 2000,           // Goal to reach
  MAX_ROUNDS: 10000,            // Maximum rounds before stopping
  WAGER_LEVELS: [0.2, 1, 2, 5], // Available wager amounts
  REPORT_INTERVAL: 100,         // Progress update frequency
};
```

## Game Strategies

The automated player implements these strategies:

### Video Poker
- Hold pairs automatically
- Hold high cards (J, Q, K, A)
- Draw new cards for non-held positions

### Texas Hold'em
- Always call (aggressive strategy)
- Plays all the way to river

### Caribbean Stud
- Raise with pair or better
- Fold with high card only

### Craps
- Always bet Pass Line
- Standard craps rules apply

### Roulette
- Always bet on Red
- Simple 50/50 strategy (excluding 0)

### Slots (Both Lucky 7 and Fortune Wheel)
- Pure chance
- No strategy (as it should be for slots)

## Wager Strategy

The player dynamically adjusts wagers based on balance:

- **€1000+**: Bet €5 (high stakes)
- **€500-€999**: Bet €2 (medium stakes)
- **€200-€499**: Bet €1 (standard stakes)
- **< €200**: Bet €0.20 (conservative)

This mimics realistic player behavior and helps reach the goal faster when winning.

## Report Files

Each simulation generates a JSON report file:

**Location**: `tests/simulation-report-[timestamp].json`

**Contains**:
```json
{
  "timestamp": "2025-01-15T14:30:45.123Z",
  "config": { ... },
  "summary": {
    "totalRounds": 2847,
    "startingBalance": 200,
    "finalBalance": 2043.80,
    "netChange": 1843.80,
    "peakBalance": 2043.80,
    "lowestBalance": 156.20,
    "biggestWin": 320.00,
    "biggestLoss": 15.00,
    "goalReached": true
  },
  "milestones": { ... },
  "gameStats": { ... },
  "balanceHistory": [ ... ]
}
```

## Analysis Tips

### 1. Run Multiple Simulations

```bash
# Run 10 simulations to get average statistics
for i in {1..10}; do npm run test:simulate; done
```

### 2. Check Game Balance

Look for:
- **ROI per game**: Should games be balanced? Or some harder than others?
- **Win rates**: Are they reasonable?
- **Payout rates**: Do they match expected house edge?

### 3. Identify Issues

Watch for:
- Games that consistently lose money
- Unrealistic payout rates (too high or too low)
- Balance getting stuck at certain levels
- Milestones never being reached

### 4. Player Experience

Consider:
- **Time to goal**: Is 2000-5000 rounds reasonable?
- **Volatility**: Are there big swings in balance?
- **Milestone frequency**: Do bonuses come at good times?

## Expected Results

Based on typical casino games:

### Payout Rates (RTP - Return to Player)
- **Video Poker**: 85-100% (with good strategy)
- **Texas Hold'em**: 85-95%
- **Caribbean Stud**: 85-95%
- **Craps (Pass Line)**: ~98.6%
- **Roulette (Red/Black)**: ~94.6% (European)
- **Slots**: 85-98%

### Goal Achievement
- **Success rate**: 40-60% of simulations should reach €2000
- **Average rounds**: 2000-5000 rounds
- **Average time**: < 5 seconds per simulation

### Balance Volatility
- **Peak balance**: Often 20-50% above goal
- **Lowest balance**: Commonly dips to 50-80% of starting
- **Bust rate**: 10-30% of runs may go bust

## Troubleshooting

### Tests Fail
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Try again
npm run test:ci
```

### Simulation Never Reaches Goal
This is normal! Gambling involves variance. Run multiple simulations:
- Some will reach quickly (< 1000 rounds)
- Some will take longer (5000-10000 rounds)
- Some will bust out

### Unexpected Payout Rates
Check game logic in `tests/automated-player.js`:
- Verify RNG is truly random
- Check payout calculations
- Ensure strategy is implemented correctly

## Advanced Usage

### Custom Game Analysis

```javascript
const { GameSimulator } = require('./tests/automated-player');

// Test specific game 1000 times
let totalWon = 0;
for (let i = 0; i < 1000; i++) {
  totalWon += GameSimulator.playVideoPoker(1);
}
console.log('Average return:', totalWon / 1000);
```

### Balance History Analysis

```javascript
const fs = require('fs');
const report = JSON.parse(fs.readFileSync('tests/simulation-report-[timestamp].json'));

// Find biggest swings
const history = report.balanceHistory;
const swings = [];
for (let i = 1; i < history.length; i++) {
  swings.push(history[i] - history[i-1]);
}

console.log('Max swing:', Math.max(...swings));
console.log('Min swing:', Math.min(...swings));
```

### Statistical Significance

Run 100+ simulations and aggregate results to determine:
- True payout rates
- Variance by game
- Optimal strategies
- Balance required to reach goal with 90% confidence

## Integration with CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Run automated casino tests
  run: npm run test:ci

- name: Run game simulation
  run: npm run test:simulate
```

## Contributing

When adding new games:

1. Add game logic to `GameSimulator` class
2. Add strategy to `AutomatedPlayer.playRound()`
3. Add to `games` array and `gameStats` tracking
4. Create unit test for payout rate
5. Update documentation

## Performance Notes

- **Simulation speed**: ~1000-2000 rounds/second
- **Memory usage**: < 50MB per simulation
- **Report size**: ~100KB-500KB per simulation

## Known Limitations

1. **Strategies are basic**: Real players might use more advanced tactics
2. **No emotional factors**: Bot doesn't tilt, chase losses, or get overconfident
3. **Perfect play**: No mistakes in holding cards or making bets
4. **No UI delays**: Bot plays instantly without thinking time
5. **Pure RNG**: May not match exact probabilities in small sample sizes

## Support

For issues or questions:
1. Check test output for error messages
2. Review simulation reports for anomalies
3. Run multiple simulations to confirm patterns
4. Consult `TESTING.md` for manual testing steps

---

**Happy Testing! May Jan-Erik's casino bring joy and entertainment! 🎰🎉**
