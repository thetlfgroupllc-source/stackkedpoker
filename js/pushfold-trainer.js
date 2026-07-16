// ---- tournament push/fold trainer ----

const PushFoldTrainer = (() => {
  const SEATS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
  const STORE = 'grinder_ph_stats';

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

  function pickHand(rangeSet) {
    if (Math.random() < 0.55) {
      const border = borderlineHands(rangeSet);
      return border[Math.floor(Math.random() * border.length)];
    }
    return ALL_HANDS[Math.floor(Math.random() * ALL_HANDS.length)];
  }

  function renderSeats(el, heroPos) {
    const heroIdx = SEATS.indexOf(heroPos);
    const css = [
      { left: '50%', top: '88%' }, { left: '13%', top: '70%' }, { left: '8%', top: '30%' },
      { left: '50%', top: '10%' }, { left: '92%', top: '30%' }, { left: '87%', top: '70%' },
    ];
    let html = '';
    for (let i = 0; i < 6; i++) {
      const seatName = SEATS[(heroIdx + i) % 6];
      const isHero = i === 0;
      const folded = !isHero && SEATS.indexOf(seatName) < heroIdx;
      html += `<div class="seat${isHero ? ' hero' : ''}${folded ? ' folded' : ''}"
        style="left:${css[i].left};top:${css[i].top}">${seatName}</div>`;
    }
    el.innerHTML = html;
  }

  function next() {
    const pos = PUSH_POSITIONS[Math.floor(Math.random() * PUSH_POSITIONS.length)];
    const bb = PUSH_STACKS[Math.floor(Math.random() * PUSH_STACKS.length)];
    const range = getPushRange(pos, bb);
    const code = pickHand(range);
    const cards = comboFromCode(code);
    current = { pos, bb, code, cards, answered: false };

    document.getElementById('phPosition').textContent = pos === 'SB' ? 'Small blind' : pos;
    document.getElementById('phCards').innerHTML = cards.map(c => cardHTML(c)).join('');
    document.getElementById('phStack').textContent = `${bb}bb stack — folded to you`;
    renderSeats(document.getElementById('phSeats'), pos);

    // side panel: show the push range grid for this spot (without giving away the answer? it's a study aid — show it)
    renderRangeGrid(document.getElementById('phGrid'), range, null);

    const fb = document.getElementById('phFeedback');
    fb.className = 'feedback';
    fb.innerHTML = '';
    document.getElementById('phNext').classList.add('hidden');
    setButtons(false);
  }

  function setButtons(disabled) {
    document.querySelectorAll('#view-pushfold .answer-row .btn').forEach(b => b.disabled = disabled);
  }

  function answer(choice) {
    if (!current || current.answered) return;
    current.answered = true;
    setButtons(true);

    const range = getPushRange(current.pos, current.bb);
    const shouldPush = range.has(current.code);
    const correct = (choice === 'push') === shouldPush;

    stats.total++;
    if (correct) {
      stats.right++;
      stats.streak++;
      stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
    } else stats.streak = 0;
    saveStats();
    Meta.award('drill', { correct, streak: stats.streak, source: 'pushfold' });

    const pct = rangePercent(range).toFixed(0);
    const fb = document.getElementById('phFeedback');
    fb.className = 'feedback show ' + (correct ? 'correct' : 'wrong');
    fb.innerHTML = `
      <div class="fb-title">${correct ? 'BOOM! Got it' : 'OOF! Not this one'} — ${current.code} at ${current.bb}bb from ${current.pos} is a ${shouldPush ? 'JAM' : 'FOLD'}</div>
      <div class="fb-detail">The jam range here is roughly the top ${pct}% of hands (highlighted in the grid).
      ${shouldPush ? 'Shoving picks up the blinds often enough — and you still have equity when called.' : 'Too weak to jam — when called you\'re in bad shape, and folding preserves your stack.'}</div>`;
    renderRangeGrid(document.getElementById('phGrid'), range, current.code);
    document.getElementById('phNext').classList.remove('hidden');
    renderStats();
  }

  function renderStats() {
    const acc = stats.total ? Math.round((stats.right / stats.total) * 100) : 0;
    document.getElementById('phStats').innerHTML = `
      <div class="stat-cell"><div class="sc-val">${stats.total}</div><div class="sc-label">Hands</div></div>
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
    document.querySelectorAll('#view-pushfold .answer-row .btn').forEach(b =>
      b.addEventListener('click', () => answer(b.dataset.answer)));
    document.getElementById('phNext').addEventListener('click', next);
    document.getElementById('phReset').addEventListener('click', reset);
    renderStats();
    next();
  }

  return { init, getStats: () => stats };
})();
