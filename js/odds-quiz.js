// ---- pot odds quiz ----
// Every spot is a closed action decision (opponent is all in), so pure pot
// odds vs. equity is the whole answer — no implied odds to muddy it.

const OddsQuiz = (() => {
  const STORE = 'grinder_odds_stats';

  // Concrete draw templates. turnCard must not complete or improve the draw.
  const TEMPLATES = [
    { name: 'Flush draw', hero: '9h 8h', flop: 'Ad 6h 2h', turnCard: 'Kc', outs: 9,
      note: 'Nine hearts left in the deck complete your flush.' },
    { name: 'Open-ended straight draw', hero: '9c 8d', flop: '7h 6s 2c', turnCard: 'Kd', outs: 8,
      note: 'Any ten or any five completes your straight — eight outs.' },
    { name: 'Gutshot straight draw', hero: '9c 8d', flop: '6h 5s Ac', turnCard: 'Qd', outs: 4,
      note: 'Only a seven completes 5-6-7-8-9. It looks close to open-ended, but it\'s just four outs.' },
    { name: 'Flush draw + gutshot', hero: '9h 8h', flop: '7h 5h Kc', turnCard: '2d', outs: 12,
      note: 'Nine hearts plus three non-heart sixes (the 6♥ is already counted) — twelve outs.' },
    { name: 'Two overcards', hero: 'Ac Kd', flop: '9h 6s 2c', turnCard: '3d', outs: 6,
      note: 'Three aces and three kings likely give you the best hand — six outs, if your opponent has a pair.' },
    { name: 'Open-ended straight flush draw', hero: '9h 8h', flop: '7h 6h 2c', turnCard: null, outs: 15,
      note: 'Nine hearts plus eight straight cards, minus the T♥ and 5♥ counted twice — fifteen outs. A monster draw.' },
  ];

  const POTS = [30, 40, 60, 80, 100, 120, 150];
  const FRACS = [
    { f: 1 / 3, label: 'a third of the pot' },
    { f: 1 / 2, label: 'half the pot' },
    { f: 2 / 3, label: 'two-thirds pot' },
    { f: 3 / 4, label: 'three-quarters pot' },
    { f: 1, label: 'the full pot' },
    { f: 1.25, label: 'an overbet' },
  ];

  let current = null;
  let stats = loadStats();

  function loadStats() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE));
      if (s && typeof s.total === 'number') return s;
    } catch (e) { /* fall through */ }
    return { right: 0, total: 0, streak: 0, bestStreak: 0 };
  }
  function saveStats() { localStorage.setItem(STORE, JSON.stringify(stats)); }

  function generate() {
    for (let tries = 0; tries < 200; tries++) {
      const tpl = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
      const onTurn = tpl.turnCard !== null && Math.random() < 0.45;
      const pot = POTS[Math.floor(Math.random() * POTS.length)];
      const frac = FRACS[Math.floor(Math.random() * FRACS.length)];
      const bet = Math.max(5, Math.round((pot * frac.f) / 5) * 5);

      const toCome = onTurn ? 1 : 2;
      const unseen = onTurn ? 46 : 47;
      const equity = drawEquity(tpl.outs, toCome, unseen);
      const required = bet / (pot + 2 * bet);
      if (Math.abs(equity - required) < 0.025) continue; // skip coin-flip spots
      return { tpl, onTurn, pot, bet, frac, equity, required, shouldCall: equity > required };
    }
    // fallback: guaranteed-clear spot
    const tpl = TEMPLATES[0];
    return { tpl, onTurn: false, pot: 100, bet: 100, frac: FRACS[4],
      equity: drawEquity(tpl.outs, 2, 47), required: 100 / 300, shouldCall: drawEquity(tpl.outs, 2, 47) > 1 / 3 };
  }

  function next() {
    current = generate();
    current.answered = false;
    const { tpl, onTurn, pot, bet } = current;

    const hero = parseCards(tpl.hero);
    const board = parseCards(tpl.flop).concat(onTurn ? [parseCard(tpl.turnCard)] : []);

    document.getElementById('oddsScenario').innerHTML = `
      <div class="odds-line">Your hand:</div>
      <div class="odds-board">${hero.map(c => cardHTML(c, true)).join('')}</div>
      <div class="odds-line">${onTurn ? 'Turn' : 'Flop'}:</div>
      <div class="odds-board">${board.map(c => cardHTML(c, true)).join('')}</div>
      <div class="odds-line">You have a <b>${tpl.name.toLowerCase()}</b> (${tpl.outs} outs).</div>
      <div class="odds-line">Pot is <span class="odds-pot">$${pot}</span> and your opponent moves <b>all in for $${bet}</b> (${current.frac.label}). No more betting after this call.</div>
      <div class="odds-line"><b>Strictly on pot odds, do you call?</b></div>`;

    const fb = document.getElementById('oddsFeedback');
    fb.className = 'feedback';
    fb.innerHTML = '';
    document.getElementById('oddsNext').classList.add('hidden');
    setButtons(false);
  }

  function setButtons(disabled) {
    document.querySelectorAll('#view-odds .answer-row .btn').forEach(b => b.disabled = disabled);
  }

  function answer(choice) {
    if (!current || current.answered) return;
    current.answered = true;
    setButtons(true);

    const correct = (choice === 'call') === current.shouldCall;
    stats.total++;
    if (correct) {
      stats.right++;
      stats.streak++;
      stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
    } else stats.streak = 0;
    saveStats();
    Meta.award('drill', { correct, streak: stats.streak, source: 'odds' });

    const { tpl, onTurn, pot, bet, equity, required, shouldCall } = current;
    const eqPct = (equity * 100).toFixed(1);
    const reqPct = (required * 100).toFixed(1);
    const rule = onTurn
      ? `${tpl.outs} outs × 2 ≈ ${tpl.outs * 2}%`
      : `${tpl.outs} outs × 4 ≈ ${tpl.outs * 4}%`;

    const fb = document.getElementById('oddsFeedback');
    fb.className = 'feedback show ' + (correct ? 'correct' : 'wrong');
    fb.innerHTML = `
      <div class="fb-title">${correct ? 'ZING! Math wizard' : 'BONK! The math says otherwise'} — this is a ${shouldCall ? 'CALL' : 'FOLD'}</div>
      <div class="fb-detail">
        You call $${bet} to win $${pot + bet}, so you need <b>${reqPct}%</b> equity
        ($${bet} ÷ ($${pot} + $${bet} + $${bet})).<br>
        Your equity with ${tpl.outs} outs and ${onTurn ? 'one card' : 'two cards'} to come is
        <b>${eqPct}%</b> (rule of ${onTurn ? '2' : '4'}: ${rule}).<br>
        ${eqPct}% ${shouldCall ? '>' : '<'} ${reqPct}% → ${shouldCall ? 'calling prints money long-term' : 'calling loses money long-term'}.
        ${tpl.note}
      </div>`;
    document.getElementById('oddsNext').classList.remove('hidden');
    renderStats();
  }

  function renderStats() {
    const acc = stats.total ? Math.round((stats.right / stats.total) * 100) : 0;
    document.getElementById('oddsStats').innerHTML = `
      <div class="stat-cell"><div class="sc-val">${stats.total}</div><div class="sc-label">Spots</div></div>
      <div class="stat-cell"><div class="sc-val">${acc}%</div><div class="sc-label">Accuracy</div></div>
      <div class="stat-cell"><div class="sc-val">${stats.streak}</div><div class="sc-label">Streak</div></div>
      <div class="stat-cell"><div class="sc-val">${stats.bestStreak}</div><div class="sc-label">Best streak</div></div>`;
    App.updateSidebar();
  }

  function reset() {
    localStorage.removeItem(STORE);
    stats = loadStats();
    renderStats();
  }

  function init() {
    document.querySelectorAll('#view-odds .answer-row .btn').forEach(b =>
      b.addEventListener('click', () => answer(b.dataset.answer)));
    document.getElementById('oddsNext').addEventListener('click', next);
    document.getElementById('oddsReset').addEventListener('click', reset);
    renderStats();
    next();
  }

  return { init, getStats: () => stats, TEMPLATES };
})();
