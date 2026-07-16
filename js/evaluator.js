// ---- 5- and 7-card hand evaluator ----
// evaluate5 returns a number: higher = better hand.
// Category * 15^5 + five base-15 tiebreak digits.

const HAND_CATEGORIES = [
  'High card', 'Pair', 'Two pair', 'Three of a kind', 'Straight',
  'Flush', 'Full house', 'Four of a kind', 'Straight flush'
];

function evaluate5(cs) {
  const rs = [cs[0].r, cs[1].r, cs[2].r, cs[3].r, cs[4].r].sort((a, b) => b - a);
  const flush = cs[0].s === cs[1].s && cs[0].s === cs[2].s && cs[0].s === cs[3].s && cs[0].s === cs[4].s;

  const counts = new Map();
  for (const r of rs) counts.set(r, (counts.get(r) || 0) + 1);
  const groups = [...counts.entries()]
    .map(([r, n]) => ({ r, n }))
    .sort((a, b) => b.n - a.n || b.r - a.r);

  let straightHigh = 0;
  if (groups.length === 5) {
    if (rs[0] - rs[4] === 4) straightHigh = rs[0];
    else if (rs[0] === 14 && rs[1] === 5 && rs[1] - rs[4] === 3) straightHigh = 5; // wheel
  }

  let cat, tie;
  if (flush && straightHigh) { cat = 8; tie = [straightHigh]; }
  else if (groups[0].n === 4) { cat = 7; tie = [groups[0].r, groups[1].r]; }
  else if (groups[0].n === 3 && groups[1].n === 2) { cat = 6; tie = [groups[0].r, groups[1].r]; }
  else if (flush) { cat = 5; tie = rs; }
  else if (straightHigh) { cat = 4; tie = [straightHigh]; }
  else if (groups[0].n === 3) { cat = 3; tie = [groups[0].r, groups[1].r, groups[2].r]; }
  else if (groups[0].n === 2 && groups[1].n === 2) { cat = 2; tie = [groups[0].r, groups[1].r, groups[2].r]; }
  else if (groups[0].n === 2) { cat = 1; tie = [groups[0].r, groups[1].r, groups[2].r, groups[3].r]; }
  else { cat = 0; tie = rs; }

  let score = cat;
  for (let i = 0; i < 5; i++) score = score * 15 + (tie[i] || 0);
  return score;
}

// All C(7,5) index combinations, precomputed
const COMBOS_7C5 = (() => {
  const out = [];
  for (let a = 0; a < 3; a++)
    for (let b = a + 1; b < 4; b++)
      for (let c = b + 1; c < 5; c++)
        for (let d = c + 1; d < 6; d++)
          for (let e = d + 1; e < 7; e++) out.push([a, b, c, d, e]);
  return out;
})();

function evaluate7(cs) {
  let best = -1;
  const hand = new Array(5);
  for (const idx of COMBOS_7C5) {
    for (let i = 0; i < 5; i++) hand[i] = cs[idx[i]];
    const s = evaluate5(hand);
    if (s > best) best = s;
  }
  return best;
}

function scoreCategory(score) {
  return HAND_CATEGORIES[Math.floor(score / Math.pow(15, 5))];
}
