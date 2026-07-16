# StackkedPoker

A local desktop training app for small-stakes cash games and tournaments.
No install, no dependencies, no account — everything runs in your browser
and your data stays on your machine (localStorage).

## Run it

Double-click `index.html`, or serve it locally:

```sh
python3 -m http.server 4173
# then open http://localhost:4173
```

## Live version

Hosted on GitHub Pages — open from any device, including your phone:

**https://thetlfgroupllc-source.github.io/stackkedpoker/**

Your stats and sessions live in each browser's localStorage, so they're private
to that device and don't sync between phone and laptop.

## Editing from your phone (no laptop)

You can change this app from your phone using Claude Code on the web
(needs a Claude Pro/Max/Team plan):

1. Open the **Claude app** (iOS/Android) or **claude.ai/code**, and connect your
   GitHub account (authorize the Claude GitHub App once).
2. Pick the **stackkedpoker** repo and start a session.
3. Describe the change in plain English (e.g. "make the pot-odds timer 20s").
4. Claude edits the code and opens a **pull request** — review the diff, tap **Merge**.
5. Merging to `main` triggers GitHub Pages; the live site updates in ~1 minute.

**Keeping this machine in sync:** after merging anything from your phone, run
`git pull` here before making further local edits, or the two copies drift apart.

To push local changes the other way: `git add -A && git commit -m "..." && git push`.

## What's inside

| Tab | What it trains |
|---|---|
| **Arcade** | The game mode: 20 rapid-fire questions (preflop, push/fold, pot odds) scored on accuracy + speed. **Daily Challenge** seeds the questions from the date, so every player worldwide gets the same 20 hands each day. After a run you get a share code — friends paste each other's codes to build a local friends leaderboard, and a percentile estimate shows where you land vs. the field. No accounts, no server. |
| **Preflop Trainer** | 6-max open-raise decisions by position (100bb cash). Biased toward borderline hands — the ones that actually cost you money. |
| **Push/Fold Trainer** | Tournament short-stack jamming (5–15bb), based on Nash push/fold approximations. |
| **Pot Odds Quiz** | Draw vs. price decisions with exact equity math in every explanation. |
| **Equity Lab** | Monte Carlo hand-vs-hand calculator (20k simulations) with classic matchup presets. |
| **Range Charts** | Study grids for every opening range and jam range the trainers test. |
| **Session Tracker** | Log cash sessions and tournaments — bankroll graph, hourly rate, ROI, win rate. Export/import JSON for backup. |
| **Cheat Sheet** | Bankroll rules, small-stakes exploits, stack-depth strategy, session discipline. |

## Arcade scoring

- Correct answer: **100 pts** + up to **100 speed pts** (15-second clock per question)
- **+25 streak bonus** on every correct answer from the 3rd in a row
- Wrong or timed out: 0 pts and the streak resets
- Leaderboards rank by score, ties broken by total time

## Keyboard shortcuts (in the trainers)

- `1` / `r` / `c` — first answer (Raise / All-in / Call)
- `2` / `f` — second answer (Fold)
- `n` or `Enter` — next hand

## Notes on the ranges

- Opening ranges are standard 6-max 100bb TAG charts — solid defaults for
  small-stakes games where tight-aggressive prints money.
- Push/fold ranges approximate Nash equilibrium for unopened pots without
  antes (built as top-X% of hands by all-in strength). With antes, jam
  slightly wider than the trainer suggests.

Quiz stats and sessions persist per browser. "Reset stats" in each trainer
clears just that module.
