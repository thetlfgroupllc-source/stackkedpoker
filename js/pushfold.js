// ---- tournament push/fold (approximate Nash, unopened pots) ----
// Ranges are built as "top X% of hands" using an all-in hand-strength
// ordering (equity vs a random hand), which is a solid approximation of
// Nash jamming ranges for a trainer.

// 169 hands ranked by all-in strength, best first
const JAM_RANKING = (
  'AA KK QQ JJ TT 99 88 AKs 77 AQs AJs AKo ATs AQo AJo KQs 66 A9s ATo KJs ' +
  'A8s KTs KQo A7s A9o KJo 55 QJs K9s A5s A6s A8o KTo QTs A4s A7o K8s A3s ' +
  'QJo K9o A5o A6o Q9s K7s JTs A2s QTo 44 A4o K6s K8o Q8s A3o K5s J9s Q9o ' +
  'JTo K7o A2o K4s Q7s K6o K3s T9s J8s 33 Q6s Q8o K5o J9o K2s Q5s T8s K4o ' +
  'J7s Q4s Q7o T9o J8o K3o Q6o Q3s 98s T7s J6s K2o 22 Q2s Q5o J5s T8o J7o ' +
  'Q4o 97s J4s T6s J3s Q3o 98o 87s T7o J6o 96s J2s Q2o T5s J5o T4s 97o 86s ' +
  'J4o T6o 95s T3s 76s J3o 87o T2s 85s 96o T5o J2o 75s 94s T4o 65s 86o 93s ' +
  '84s 95o T3o 76o 92s 74s 54s T2o 85o 64s 83s 94o 75o 82s 73s 93o 65o 53s ' +
  '63s 84o 92o 43s 74o 72s 54o 64o 52s 62s 83o 42s 82o 73o 53o 63o 32s 43o ' +
  '72o 52o 62o 42o 32o'
).trim().split(/\s+/);

console.assert(JAM_RANKING.length === 169, 'JAM_RANKING must have 169 hands, got ' + JAM_RANKING.length);

// % of all combos to jam, by position and stack (bb). Approximations of
// Nash unopened-push charts, 6-max, no antes.
const PUSH_PCT = {
  UTG: { 5: 26, 7: 20, 10: 15, 12: 13, 15: 11 },
  HJ:  { 5: 31, 7: 25, 10: 18, 12: 16, 15: 13 },
  CO:  { 5: 40, 7: 32, 10: 24, 12: 20, 15: 17 },
  BTN: { 5: 55, 7: 45, 10: 33, 12: 28, 15: 23 },
  SB:  { 5: 78, 7: 64, 10: 50, 12: 44, 15: 38 },
};
const PUSH_STACKS = [5, 7, 10, 12, 15];
const PUSH_POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB'];

// Build the top-X%-of-combos set from the ranking
function topPercentRange(pct) {
  const target = (pct / 100) * 1326;
  const set = new Set();
  let combos = 0;
  for (const code of JAM_RANKING) {
    if (combos >= target) break;
    set.add(code);
    combos += comboCount(code);
  }
  return set;
}

const PUSH_RANGE_CACHE = {};
function getPushRange(pos, bb) {
  const key = pos + ':' + bb;
  if (!PUSH_RANGE_CACHE[key]) PUSH_RANGE_CACHE[key] = topPercentRange(PUSH_PCT[pos][bb]);
  return PUSH_RANGE_CACHE[key];
}
