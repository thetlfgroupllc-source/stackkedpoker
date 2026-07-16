// ---- Monte Carlo equity ----
// hero: [c,c]  villain: [c,c] or null (random)  board: 0..5 cards
// Returns {win, tie, lose, equity} as fractions.

function runEquity(hero, villain, board, iters) {
  const usedBase = new Set();
  for (const c of hero) usedBase.add(cardKey(c));
  if (villain) for (const c of villain) usedBase.add(cardKey(c));
  for (const c of board) usedBase.add(cardKey(c));

  const pool = makeDeck().filter(c => !usedBase.has(cardKey(c)));
  const boardNeed = 5 - board.length;
  const villNeed = villain ? 0 : 2;
  const drawN = boardNeed + villNeed;

  let win = 0, tie = 0, lose = 0;
  const poolLen = pool.length;
  const drawn = new Array(drawN);

  for (let it = 0; it < iters; it++) {
    // partial Fisher-Yates draw without replacement
    for (let i = 0; i < drawN; i++) {
      const j = i + Math.floor(Math.random() * (poolLen - i));
      const tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
      drawn[i] = pool[i];
    }
    const vill = villain || [drawn[0], drawn[1]];
    const fullBoard = board.concat(drawn.slice(villNeed, villNeed + boardNeed));
    const hs = evaluate7(hero.concat(fullBoard));
    const vs = evaluate7(vill.concat(fullBoard));
    if (hs > vs) win++;
    else if (hs < vs) lose++;
    else tie++;
  }
  return {
    win: win / iters,
    tie: tie / iters,
    lose: lose / iters,
    equity: (win + tie / 2) / iters,
  };
}

// Exact one/two-card draw equity from outs
function drawEquity(outs, cardsToCome, unseen) {
  // unseen = cards left in deck from hero's perspective (47 on flop, 46 on turn)
  if (cardsToCome === 1) return outs / unseen;
  return 1 - ((unseen - outs) / unseen) * ((unseen - 1 - outs) / (unseen - 1));
}
