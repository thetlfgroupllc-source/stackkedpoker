// ---- equity calculator ----

const EquityLab = (() => {
  const PRESETS = [
    { label: 'AA vs KK — the classic cooler', hero: 'As Ah', villain: 'Ks Kh', board: '' },
    { label: 'AK vs QQ — the race', hero: 'As Kh', villain: 'Qd Qc', board: '' },
    { label: 'AK vs 76s — big cards vs suited connector', hero: 'As Kh', villain: '7d 6d', board: '' },
    { label: 'Set vs flush draw on the flop', hero: '8s 8d', villain: 'Ah Qh', board: '8h 6h 2c' },
    { label: 'Top pair vs open-ender on the flop', hero: 'Ac Jd', villain: 'Th 9h', board: 'Js 8c 2d' },
    { label: 'Overpair vs top pair', hero: 'Qs Qd', villain: 'Ah Jc', board: 'Jh 7s 3c' },
    { label: 'AA vs random hand', hero: 'As Ah', villain: '', board: '' },
    { label: 'Your button trash vs random hand', hero: '9c 4d', villain: '', board: '' },
  ];

  function validate() {
    const err = document.getElementById('eqError');
    err.textContent = '';

    const hero = parseCards(document.getElementById('eqHero').value);
    if (!hero || hero.length !== 2) return fail('Your hand must be exactly 2 cards, like "As Kh".');

    const vRaw = document.getElementById('eqVillain').value.trim();
    let villain = null;
    if (vRaw) {
      villain = parseCards(vRaw);
      if (!villain || villain.length !== 2) return fail('Opponent hand must be 2 cards, or blank for random.');
    }

    const bRaw = document.getElementById('eqBoard').value.trim();
    let board = [];
    if (bRaw) {
      board = parseCards(bRaw);
      if (!board || ![3, 4, 5].includes(board.length)) return fail('Board must be 0, 3, 4 or 5 cards.');
    }

    const all = hero.concat(villain || [], board);
    const seen = new Set();
    for (const c of all) {
      const k = cardKey(c);
      if (seen.has(k)) return fail(`Duplicate card: ${rankChar(c.r)}${SUIT_CHARS[c.s]}.`);
      seen.add(k);
    }
    return { hero, villain, board };

    function fail(msg) { err.textContent = msg; return null; }
  }

  function run() {
    const input = validate();
    if (!input) return;

    const btn = document.getElementById('eqRun');
    btn.disabled = true;
    btn.textContent = 'Running…';

    // let the UI paint before the sim blocks the thread
    setTimeout(() => {
      const res = runEquity(input.hero, input.villain, input.board, 20000);
      show(res);
      btn.disabled = false;
      btn.textContent = 'Run 20,000 hands';
    }, 30);
  }

  function show(res) {
    document.getElementById('eqResult').classList.remove('hidden');
    document.getElementById('eqBarHero').style.width = (res.win * 100).toFixed(1) + '%';
    document.getElementById('eqBarTie').style.width = (res.tie * 100).toFixed(1) + '%';
    document.getElementById('eqHeroPct').textContent = (res.equity * 100).toFixed(1) + '%';
    document.getElementById('eqTiePct').textContent = (res.tie * 100).toFixed(1) + '%';
    document.getElementById('eqVillPct').textContent = ((res.lose + res.tie / 2) * 100).toFixed(1) + '%';
  }

  function init() {
    document.getElementById('eqRun').addEventListener('click', run);
    const box = document.getElementById('eqPresets');
    box.innerHTML = PRESETS.map((p, i) =>
      `<button class="preset-btn" data-i="${i}">${p.label}</button>`).join('');
    box.addEventListener('click', e => {
      const b = e.target.closest('.preset-btn');
      if (!b) return;
      const p = PRESETS[+b.dataset.i];
      document.getElementById('eqHero').value = p.hero;
      document.getElementById('eqVillain').value = p.villain;
      document.getElementById('eqBoard').value = p.board;
      run();
    });
  }

  return { init };
})();
