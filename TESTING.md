# Jan-Erik's 40th Anniversary Casino - Testing Guide

## Overview
This document provides comprehensive testing instructions for the casino game.

## Running the Application

### Development Mode
```bash
npm install
npm run dev
```
Open http://localhost:3000 in your browser.

### Production Build
```bash
npm run build
npm start
```

## Test Checklist

### 1. Initial Load & Welcome Screen
- [ ] Welcome popup appears with "Happy 40th, Jan-Erik!"
- [ ] "Forty but still SEXY!" message is visible
- [ ] Starting balance shows €200.00
- [ ] Goal of €2,000 is displayed
- [ ] "Let's Win!" button works to dismiss welcome screen
- [ ] Main menu appears after dismissing welcome

### 2. Main Menu
- [ ] All 7 games are displayed with icons:
  - 🃏 Video Poker
  - ♠️ Texas Hold'em
  - ♥️ Caribbean Stud Poker
  - 🎲 Craps
  - 🎡 Roulette
  - 🎰 Lucky 7 Slots
  - 💎 Fortune Wheel Slots
- [ ] Mouse hover highlights game buttons
- [ ] Arrow keys (↑↓) navigate between games
- [ ] SPACE or ENTER selects highlighted game
- [ ] Mouse click selects game

### 3. Balance Display
- [ ] Balance is always visible in top-right corner
- [ ] Balance updates in real-time after wins/losses
- [ ] Balance displays with 2 decimal places
- [ ] Amounts are properly rounded

### 4. Wager Selection
- [ ] Wager selector shows current wager amount
- [ ] Four wager levels available: €0.20, €1.00, €2.00, €5.00
- [ ] Left chevron decreases wager (disabled at minimum)
- [ ] Right chevron increases wager (disabled at maximum)
- [ ] Current wager displays properly

### 5. Video Poker Testing

#### Basic Functionality
- [ ] Cards display large and clear (32x48 size)
- [ ] Cards show suit emoji and value
- [ ] Red suits (♥️♦️) display in red
- [ ] Black suits (♠️♣️) display in black

#### Game Flow
- [ ] DEAL button deducts wager from balance
- [ ] 5 cards are dealt with flip animation
- [ ] Click or press 1-5 to hold/unhold cards
- [ ] HELD indicator appears above held cards
- [ ] DRAW button replaces non-held cards
- [ ] Hand evaluation is correct
- [ ] Winnings are added to balance
- [ ] Payout messages include Jan-Erik's name

#### Payout Table
- [ ] Info button shows payout table
- [ ] All poker hands listed with payouts:
  - Royal Flush: 800:1
  - Straight Flush: 50:1
  - Four of a Kind: 25:1
  - Full House: 9:1
  - Flush: 6:1
  - Straight: 4:1
  - Three of a Kind: 3:1
  - Two Pair: 2:1
  - Jacks or Better: 1:1
- [ ] Close button dismisses payout table

#### Hand Evaluation Accuracy
Test these specific hands:
- [ ] Royal Flush (10-J-Q-K-A same suit)
- [ ] Straight Flush (consecutive same suit)
- [ ] Four of a Kind (4 same value)
- [ ] Full House (3 + 2 same values)
- [ ] Flush (5 same suit)
- [ ] Straight (consecutive values)
- [ ] Three of a Kind (3 same value)
- [ ] Two Pair (2 pairs)
- [ ] Jacks or Better (pair of J, Q, K, or A)
- [ ] Low pair (pair of 2-10) = No Win

### 6. Texas Hold'em Testing

#### Basic Functionality
- [ ] Cards are larger than before (24x36)
- [ ] Dealer gets 2 hidden cards
- [ ] Player gets 2 visible cards
- [ ] 3 community cards dealt on flop

#### Game Flow
- [ ] DEAL costs 1x wager
- [ ] Flop shows 3 community cards
- [ ] FOLD returns to betting (loses ante)
- [ ] CALL costs additional 1x wager
- [ ] Turn adds 4th community card
- [ ] River adds 5th community card
- [ ] Dealer cards revealed at end
- [ ] Correct winner determined
- [ ] Win pays 3x total bet (original + calls)
- [ ] Push returns both bets

#### Controls
- [ ] Arrow keys (←→) switch between FOLD/CALL
- [ ] SPACE confirms action
- [ ] Mouse click works on buttons

### 7. Caribbean Stud Poker Testing

#### Basic Functionality
- [ ] Cards displayed clearly (20x32)
- [ ] Player gets 5 cards face up
- [ ] Dealer gets 5 cards (1 up, 4 down)

#### Game Flow
- [ ] ANTE costs 1x wager
- [ ] FOLD loses ante
- [ ] RAISE costs 2x wager (total 3x ante)
- [ ] Dealer must qualify with AK or better
- [ ] If dealer doesn't qualify, player wins even money
- [ ] If dealer qualifies, hands compared
- [ ] Bonus payout for strong hands

#### Qualification Rules
- [ ] Dealer with less than AK = player wins
- [ ] Dealer with AK+ = hands compared
- [ ] Push returns all bets

### 8. Craps Testing

#### Dice Display
- [ ] Two dice display clearly
- [ ] Dice animate when rolling
- [ ] Dice show proper dot patterns
- [ ] Total is calculated correctly

#### Come Out Roll
- [ ] 7 or 11 = Pass wins, Don't Pass loses
- [ ] 2, 3, or 12 = Pass loses, Don't Pass wins (12 is push for DP)
- [ ] Other numbers establish point

#### Point Phase
- [ ] Point number displayed clearly
- [ ] Rolling point = Pass wins
- [ ] Rolling 7 = Pass loses, Don't Pass wins
- [ ] Other numbers continue game

#### Controls
- [ ] Arrow keys (←→) select Pass/Don't Pass
- [ ] SPACE rolls dice
- [ ] Bet type selection works before first roll

### 9. Roulette Testing

#### Wheel Display
- [ ] Roulette wheel visible and animated
- [ ] Wheel spins for 3 seconds
- [ ] Result number displays clearly

#### Betting Options
- [ ] All 6 bet types available:
  - Red
  - Black
  - Even
  - Odd
  - Low (1-18)
  - High (19-36)
- [ ] Selected bet highlighted in gold
- [ ] Arrow keys (←→) cycle through bets

#### Results
- [ ] Green 0 = house wins (all bets lose)
- [ ] Red numbers: 1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
- [ ] All other 1-36 are black
- [ ] Correct color displayed in result
- [ ] Even/Odd evaluated correctly
- [ ] Low/High ranges correct
- [ ] Wins pay 2:1 (including original bet)

### 10. Lucky 7 Slots Testing

#### Display
- [ ] 3 reels with large symbols
- [ ] Symbols: 🍒🍋🍊🍇⭐💎7️⃣
- [ ] Reels spin smoothly for 2 seconds
- [ ] Jan-Erik's name on machine

#### Payouts
- [ ] 7️⃣7️⃣7️⃣ = 100:1
- [ ] 💎💎💎 = 50:1
- [ ] ⭐⭐⭐ = 25:1
- [ ] 🍇🍇🍇 = 10:1
- [ ] 🍊🍊🍊 = 8:1
- [ ] 🍋🍋🍋 = 6:1
- [ ] 🍒🍒🍒 = 5:1
- [ ] Any 2 match = 2:1

#### Functionality
- [ ] SPACE or click to spin
- [ ] Wager deducted before spin
- [ ] Results evaluated correctly
- [ ] Win messages include Jan-Erik's name

### 11. Fortune Wheel Slots Testing

#### Special Features
- [ ] Special 40th anniversary theme
- [ ] Purple/gold gradient design
- [ ] Birthday symbols: 👑💰🎁🎂🎉✨🔥
- [ ] 5% chance of 🎂🎂🎂 jackpot trigger
- [ ] "JACKPOT!" overlay appears for birthday bonus

#### Payouts
- [ ] 👑👑👑 = 80:1
- [ ] 🎂🎂🎂 = 40:1 (Birthday Special!)
- [ ] 💰💰💰 = 40:1
- [ ] 🎁🎁🎁 = 30:1
- [ ] 🔥🔥🔥 = 25:1
- [ ] 🎉🎉🎉 = 20:1
- [ ] ✨✨✨ = 15:1
- [ ] Any 2 match = 2:1

### 12. Back to Menu
- [ ] Back button visible in top-left on all games
- [ ] Returns to main menu when clicked
- [ ] Balance persists across games

### 13. Milestone Bonuses

Test by manipulating balance to reach milestones:
- [ ] €500 milestone = +€20 bonus + popup
- [ ] €1,000 milestone = +€40 bonus + popup
- [ ] €1,500 milestone = +€40 bonus + popup
- [ ] Popup appears for 5 seconds
- [ ] Purple/pink gradient design
- [ ] "Fabulous at 40" messages

### 14. Victory Celebration (€2,000 Goal)

#### Trigger
- [ ] Activate when balance >= €2,000
- [ ] Only shows once per session

#### Visual Elements
- [ ] Full-screen overlay
- [ ] Animated confetti (50 emojis)
- [ ] Trophy emoji pulses
- [ ] "VICTORY!" in large text
- [ ] Jan-Erik's name featured
- [ ] Current balance displayed
- [ ] "€200 to €2,000" journey highlighted
- [ ] "Forty, Fabulous, and VICTORIOUS!" message
- [ ] "Continue Playing" button
- [ ] Button can dismiss popup

### 15. Personalization Testing
Check that "Jan-Erik" appears in:
- [ ] Welcome screen
- [ ] Main menu title
- [ ] All win messages
- [ ] Milestone popups
- [ ] Victory celebration
- [ ] Slot machine labels

Check "40th" / "Forty" / "40" references:
- [ ] Main menu "40th Anniversary Edition"
- [ ] "Forty but still sexy!" tagline
- [ ] €40 bonuses at milestones
- [ ] Victory celebration "Forty, Fabulous"
- [ ] Fortune Wheel "Age 40" label

### 16. Responsive Design
Test at different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Large cards don't overflow
- [ ] All elements visible without scroll (or proper scroll)
- [ ] Buttons remain clickable
- [ ] Text remains readable

### 17. Keyboard Controls
- [ ] Main menu: ↑↓ to navigate, SPACE/ENTER to select
- [ ] Video Poker: 1-5 to hold, SPACE for actions
- [ ] Texas Hold'em: ←→ to choose action, SPACE to confirm
- [ ] Caribbean Stud: ←→ to choose action, SPACE to confirm
- [ ] Craps: ←→ to choose bet, SPACE to roll
- [ ] Roulette: ←→ to choose bet, SPACE to spin
- [ ] Slots: SPACE to spin

### 18. Edge Cases

#### Low Balance
- [ ] Warning when balance < wager
- [ ] Cannot place bet with insufficient funds
- [ ] "Insufficient funds" message displays

#### Zero Balance
- [ ] All games show insufficient funds
- [ ] Can still navigate menu
- [ ] Can still view payout tables

#### Very High Balance
- [ ] Balance displays correctly above €9,999
- [ ] No overflow issues
- [ ] Victory already triggered (if above €2,000)

### 19. Performance
- [ ] No lag when spinning slots
- [ ] Smooth animations throughout
- [ ] No memory leaks after extended play
- [ ] Quick load time (< 2 seconds)

### 20. Build & Deploy
- [ ] `npm run build` completes without errors
- [ ] `npm start` runs production build
- [ ] All games work in production mode
- [ ] No console errors in browser
- [ ] No TypeScript errors

## Known Behaviors (Not Bugs)

1. **RNG is Pure Random**: Game outcomes are truly random - no guaranteed wins
2. **Milestone Bonuses**: Only trigger once per balance threshold
3. **Victory Popup**: Only appears once when first reaching €2,000
4. **Welcome Screen**: Shows on every page load (refresh resets game)

## Performance Benchmarks

- Initial load: < 2 seconds
- Game transitions: < 500ms
- Animation frame rate: 60 FPS
- Build size: < 150 KB (first load JS)

## Browser Compatibility

Tested on:
- [ ] Chrome 120+
- [ ] Firefox 120+
- [ ] Safari 17+
- [ ] Edge 120+

## Accessibility

- [ ] All interactive elements keyboard accessible
- [ ] Sufficient color contrast
- [ ] Clear visual feedback for all actions
- [ ] Large, readable text

---

**Happy Testing! Make sure Jan-Erik has an amazing 40th birthday celebration! 🎉**
