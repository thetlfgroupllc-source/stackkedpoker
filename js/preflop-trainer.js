// ---- preflop open-raise trainer ----

const PreflopTrainer = (() => {
  const SEATS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
  const STORE = 'grinder_pf_stats';

  let current = null; // {pos, cards, code, answered}
  let stats = loadStats();

  function loadStats() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE));
      if (s && s.byPos) return s;
    } catch (e) { /* fall through */ }
    const byPos = {};
    for (const p of RFI_POSITIONS) byPos[p] = { right: 0, total: 0 };
    return { right: 0, total: 0, streak: 0, bestStreak: 0, byPos };
  }
  function saveStats() { localStorage.setItem(STORE, JSON.stringify(stats)); }

  // Pick a hand: 55% borderline (the instructive ones), 45% any hand
  function pickHand(rangeSet) {
    if (Math.random() < 0.55) {
      const border = borderlineHands(rangeSet);
      return border[Math.floor(Math.random() * border.length)];
    }
    return ALL_HANDS[Math.floor(Math.random() * ALL_HANDS.length)];
  }

  function seatPositionsCSS() {
    // 6 seats around an oval, hero seat at bottom
    return [
      { left: '50%', top: '88%' },   // hero (bottom center)
      { left: '13%', top: '70%' },
      { left: '8%', top: '30%' },
      { left: '50%', top: '10%' },
      { left: '92%', top: '30%' },
      { left: '87%', top: '70%' },
    ];
  }

  function renderSeats(el, heroPos) {
    // order seats so hero is at bottom, action moves clockwise
    const heroIdx = SEATS.indexOf(heroPos);
    const css = seatPositionsCSS();
    let html = '';
    for (let i = 0; i < 6; i++) {
      const seatName = SEATS[(heroIdx + i) % 6];
      const isHero = i === 0;
      // players before hero in the order have folded
      const folded = !isHero && SEATS.indexOf(seatName) < heroIdx;
      html += `<div class="seat${isHero ? ' hero' : ''}${folded ? ' folded' : ''}"
        style="left:${css[i].left};top:${css[i].top}">${seatName}</div>`;
    }
    el.innerHTML = html;
  }

  function next() {
    const pos = RFI_POSITIONS[Math.floor(Math.random() * RFI_POSITIONS.length)];
    const range = RFI_RANGES[pos].range;
    const code = pickHand(range);
    const cards = comboFromCode(code);
    current = { pos, code, cards, answered: false };

    document.getElementById('pfPosition').textContent = RFI_RANGES[pos].label;
    document.getElementById('pfCards').innerHTML = cards.map(c => cardHTML(c)).join('');
    document.getElementById('pfSituation').textContent =
      pos === 'SB' ? 'Folded to you in the small blind' : 'Folded to you';
    renderSeats(document.getElementById('pfSeats'), pos);

    const fb = document.getElementById('pfFeedback');
    fb.className = 'feedback';
    fb.innerHTML = '';
    document.getElementById('pfNext').classList.add('hidden');
    setButtons(false);
  }

  function setButtons(disabled) {
    document.querySelectorAll('#pfAnswers .btn').forEach(b => b.disabled = disabled);
  }

  function answer(choice) {
    if (!current || current.answered) return;
    current.answered = true;
    setButtons(true);

    const range = RFI_RANGES[current.pos].range;
    const shouldRaise = range.has(current.code);
    const correct = (choice === 'raise') === shouldRaise;

    stats.total++;
    stats.byPos[current.pos].total++;
    if (correct) {
      stats.right++;
      stats.byPos[current.pos].right++;
      stats.streak++;
      stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
    } else {
      stats.streak = 0;
    }
    saveStats();
    Meta.award('drill', { correct, streak: stats.streak, source: 'preflop' });

    const fb = document.getElementById('pfFeedback');
    fb.className = 'feedback show ' + (correct ? 'correct' : 'wrong');
    const pct = rangePercent(range).toFixed(0);
    fb.innerHTML = `
      <div class="fb-title">${correct ? 'KAPOW! Nailed it' : 'WHOOPS! Not quite'} — ${current.code} is a ${shouldRaise ? 'RAISE' : 'FOLD'} from ${RFI_RANGES[current.pos].label}</div>
      <div class="fb-detail">The ${RFI_RANGES[current.pos].label} opening range is about ${pct}% of hands.
      ${shouldRaise ? 'This hand is inside it.' : 'This hand falls just outside it — folding saves money long-term.'}
      Check the Range Charts tab to study the full grid.</div>`;
    document.getElementById('pfNext').classList.remove('hidden');
    renderStats();
  }

  function renderStats() {
    const acc = stats.total ? Math.round((stats.right / stats.total) * 100) : 0;
    document.getElementById('pfStats').innerHTML = `
      <div class="stat-cell"><div class="sc-val">${stats.total}</div><div class="sc-label">Hands</div></div>
      <div class="stat-cell"><div class="sc-val">${acc}%</div><div class="sc-label">Accuracy</div></div>
      <div class="stat-cell"><div class="sc-val">${stats.streak}</div><div class="sc-label">Streak</div></div>
      <div class="stat-cell"><div class="sc-val">${stats.bestStreak}</div><div class="sc-label">Best streak</div></div>`;

    let bars = '';
    for (const p of RFI_POSITIONS) {
      const s = stats.byPos[p];
      const pc = s.total ? Math.round((s.right / s.total) * 100) : 0;
      bars += `<div class="pos-bar-row">
        <span class="pb-label">${p}</span>
        <div class="pos-bar-track"><div class="pos-bar-fill" style="width:${pc}%"></div></div>
        <span class="pb-pct">${s.total ? pc + '%' : '—'}</span></div>`;
    }
    document.getElementById('pfPosStats').innerHTML = bars;
    App.updateSidebar();
  }

  function reset() {
    localStorage.removeItem(STORE);
    stats = loadStats();
    renderStats();
  }

  function init() {
    document.querySelectorAll('#pfAnswers .btn').forEach(b =>
      b.addEventListener('click', () => answer(b.dataset.answer)));
    document.getElementById('pfNext').addEventListener('click', next);
    document.getElementById('pfReset').addEventListener('click', reset);
    renderStats();
    next();
  }

  return { init, getStats: () => stats };
})();
