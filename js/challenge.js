// ---- Arcade: timed 20-question gauntlet with daily seed + share codes ----
// Daily mode seeds the RNG from the date, so every player worldwide gets the
// identical 20 questions that day. Share codes carry (name, date, score, time)
// so friend groups can compare without any server.

const Challenge = (() => {
  const STORE = 'grinder_arcade';
  const Q_COUNT = 20;
  const Q_TIME = 15000; // ms per question

  let data = load();      // {name, bests: [], friends: [], daily: {date: entry}, weekly: {week: entry}}
  let run = null;
  let timerInt = null;
  let qStart = 0;

  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(STORE));
      if (d && Array.isArray(d.bests)) {
        if (!d.weekly) d.weekly = {}; // added with the Grand Prix mode
        return d;
      }
    } catch (e) { /* fall through */ }
    return { name: '', bests: [], friends: [], daily: {}, weekly: {} };
  }
  function save() { localStorage.setItem(STORE, JSON.stringify(data)); }

  // ---------- seeded rng ----------
  function hashStr(s) {
    let h = 1779033703 ^ s.length;
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function todayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  // ISO week key like "2026-W29" — the Grand Prix runs Monday to Sunday
  function weekKey(d = new Date()) {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    const y = t.getUTCFullYear();
    const week = Math.ceil((((t - Date.UTC(y, 0, 1)) / 86400000) + 1) / 7);
    return y + '-W' + String(week).padStart(2, '0');
  }

  // ---------- question builders ----------
  const pick = (arr, rng) => arr[Math.floor(rng() * arr.length)];

  function pickHand(rangeSet, rng) {
    if (rng() < 0.7) return pick(borderlineHands(rangeSet), rng);
    return pick(ALL_HANDS, rng);
  }

  function preflopQ(rng) {
    const pos = pick(RFI_POSITIONS, rng);
    const r = RFI_RANGES[pos];
    const code = pickHand(r.range, rng);
    const cards = comboFromCode(code, rng);
    const isRaise = r.range.has(code);
    return {
      kind: 'Cash · preflop', options: ['Raise', 'Fold'], correct: isRaise ? 0 : 1,
      title: `${r.label} — 100bb, folded to you`,
      cardsHTML: `<div class="hole-cards">${cards.map(c => cardHTML(c)).join('')}</div>`,
      sub: 'Open-raise or fold?',
      short: `${code} open from ${pos}`,
      explain: `${code} from ${r.label} is a ${isRaise ? 'raise' : 'fold'} — the opening range there is about ${rangePercent(r.range).toFixed(0)}% of hands.`,
    };
  }

  function pushfoldQ(rng) {
    const pos = pick(PUSH_POSITIONS, rng);
    const bb = pick(PUSH_STACKS, rng);
    const range = getPushRange(pos, bb);
    const code = pickHand(range, rng);
    const cards = comboFromCode(code, rng);
    const isPush = range.has(code);
    return {
      kind: 'Tournament · push/fold', options: ['All-in', 'Fold'], correct: isPush ? 0 : 1,
      title: `${pos} — ${bb}bb stack, folded to you`,
      cardsHTML: `<div class="hole-cards">${cards.map(c => cardHTML(c)).join('')}</div>`,
      sub: 'Jam or fold?',
      short: `${code} jam from ${pos} at ${bb}bb`,
      explain: `${code} at ${bb}bb from ${pos} is a ${isPush ? 'jam' : 'fold'} — the Nash-ish jam range there is roughly the top ${rangePercent(range).toFixed(0)}% of hands.`,
    };
  }

  const ODDS_POTS = [30, 40, 60, 80, 100, 120, 150];
  const ODDS_FRACS = [1 / 3, 1 / 2, 2 / 3, 3 / 4, 1, 1.25];

  function oddsQ(rng) {
    for (let tries = 0; tries < 300; tries++) {
      const tpl = pick(OddsQuiz.TEMPLATES, rng);
      const onTurn = tpl.turnCard !== null && rng() < 0.45;
      const pot = pick(ODDS_POTS, rng);
      const bet = Math.max(5, Math.round((pot * pick(ODDS_FRACS, rng)) / 5) * 5);
      const equity = drawEquity(tpl.outs, onTurn ? 1 : 2, onTurn ? 46 : 47);
      const required = bet / (pot + 2 * bet);
      if (Math.abs(equity - required) < 0.03) continue;

      const hero = parseCards(tpl.hero);
      const board = parseCards(tpl.flop).concat(onTurn ? [parseCard(tpl.turnCard)] : []);
      const shouldCall = equity > required;
      return {
        kind: 'Pot odds', options: ['Call', 'Fold'], correct: shouldCall ? 0 : 1,
        title: `${tpl.name} (${tpl.outs} outs) on the ${onTurn ? 'turn' : 'flop'}`,
        cardsHTML: `<div class="hole-cards">${hero.map(c => cardHTML(c, true)).join('')}
          <span class="arc-vs">on</span>${board.map(c => cardHTML(c, true)).join('')}</div>`,
        sub: `Pot $${pot} — opponent all in for $${bet}. Strictly on pot odds?`,
        short: `${tpl.outs}-out draw, $${bet} into $${pot}`,
        explain: `You need ${(required * 100).toFixed(1)}% equity to call $${bet}; ${tpl.outs} outs with ${onTurn ? 'one card' : 'two cards'} to come is ${(equity * 100).toFixed(1)}% → ${shouldCall ? 'call' : 'fold'}.`,
      };
    }
    return preflopQ(rng); // unreachable in practice
  }

  function buildQuestions(rng) {
    const qs = [];
    for (let i = 0; i < 8; i++) qs.push(preflopQ(rng));
    for (let i = 0; i < 6; i++) qs.push(pushfoldQ(rng));
    for (let i = 0; i < 6; i++) qs.push(oddsQ(rng));
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [qs[i], qs[j]] = [qs[j], qs[i]];
    }
    return qs;
  }

  // ---------- game flow ----------
  function start(mode) {
    const date = todayStr();
    const seed = mode === 'daily' ? hashStr('stacked-daily-' + date)
      : mode === 'weekly' ? hashStr('stacked-weekly-' + weekKey())
      : hashStr('blitz-' + Math.random());
    run = {
      mode, date, qs: buildQuestions(mulberry32(seed)),
      idx: 0, score: 0, streak: 0, maxStreak: 0, correct: 0, totalMs: 0, review: [],
    };
    showScreen('play');
    nextQ();
  }

  function showScreen(name) {
    for (const s of ['Home', 'Play', 'Results'])
      document.getElementById('arc' + s).classList.toggle('hidden', s.toLowerCase() !== name);
  }

  function nextQ() {
    if (!run) return;
    if (run.idx >= Q_COUNT) return finish();
    const q = run.qs[run.idx];
    document.getElementById('arcQNum').textContent = run.idx + 1;
    document.getElementById('arcScore').textContent = run.score;
    document.getElementById('arcQKind').textContent = q.kind;
    document.getElementById('arcQTitle').textContent = q.title;
    document.getElementById('arcQCards').innerHTML = q.cardsHTML;
    document.getElementById('arcQSub').textContent = q.sub;
    document.getElementById('arcFlash').textContent = '';
    document.getElementById('arcFlash').className = 'arc-flash';
    document.getElementById('arcAnswers').innerHTML = q.options.map((o, i) =>
      `<button class="btn ${i === 0 ? 'btn-raise' : 'btn-fold'}" data-i="${i}">${o}</button>`).join('');

    qStart = performance.now();
    clearInterval(timerInt);
    const fill = document.getElementById('arcTimer');
    fill.style.width = '100%';
    fill.classList.remove('low');
    timerInt = setInterval(() => {
      const left = Q_TIME - (performance.now() - qStart);
      fill.style.width = Math.max(0, (left / Q_TIME) * 100) + '%';
      fill.classList.toggle('low', left < 5000);
      if (left <= 0) answer(null);
    }, 100);
  }

  function answer(i) {
    if (!run) return;
    clearInterval(timerInt);
    const q = run.qs[run.idx];
    const elapsed = Math.min(Q_TIME, performance.now() - qStart);
    run.totalMs += elapsed;
    const correct = i === q.correct;

    let pts = 0;
    if (correct) {
      run.streak++;
      run.maxStreak = Math.max(run.maxStreak, run.streak);
      run.correct++;
      const speed = Math.round(100 * Math.max(0, (Q_TIME - elapsed) / Q_TIME));
      const streakBonus = run.streak >= 3 ? 25 : 0;
      pts = 100 + speed + streakBonus;
      run.score += pts;
    } else {
      run.streak = 0;
    }
    run.review.push({ q, given: i, correct, elapsed, pts });

    // flash feedback on the buttons
    document.querySelectorAll('#arcAnswers .btn').forEach((b, bi) => {
      b.disabled = true;
      if (bi === q.correct) b.classList.add('arc-right');
      else if (bi === i) b.classList.add('arc-wrong');
    });
    const flash = document.getElementById('arcFlash');
    const cheer = ['KAPOW!', 'ZING!', 'BOOM!', 'WHEE!', 'NICE!'][Math.floor(Math.random() * 5)];
    flash.textContent = correct
      ? `${cheer} +${pts}`
      : (i === null ? `SNOOZE! Too slow — it was ${q.options[q.correct]}.` : `BONK! ${q.options[q.correct]} was right.`);
    flash.className = 'arc-flash show ' + (correct ? 'good' : 'bad');
    document.getElementById('arcScore').textContent = run.score;

    setTimeout(() => { if (run) { run.idx++; nextQ(); } }, correct ? 700 : 1600);
  }

  function abandon() {
    clearInterval(timerInt);
    run = null;
    showScreen('home');
    renderHome();
  }

  // ---------- scoring / results ----------
  // logistic approximation of the normal CDF
  function percentile(score) {
    const z = (score - 2100) / 750;
    return Math.min(99, Math.max(1, Math.round(100 / (1 + Math.exp(-1.702 * z)))));
  }

  const fmtTime = ms => {
    const s = Math.round(ms / 1000);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  };

  function finish() {
    clearInterval(timerInt);
    const r = run;
    run = null;
    const wk = weekKey();
    const entry = {
      mode: r.mode, date: r.mode === 'daily' ? r.date : r.mode === 'weekly' ? wk : 'blitz',
      score: r.score, timeMs: Math.round(r.totalMs),
      acc: Math.round((r.correct / Q_COUNT) * 100),
    };
    const firstDailyToday = r.mode === 'daily' && !data.daily[r.date];
    const firstWeeklyOfWeek = r.mode === 'weekly' && !data.weekly[wk];
    data.bests.push(entry);
    data.bests.sort((a, b) => b.score - a.score || a.timeMs - b.timeMs);
    data.bests = data.bests.slice(0, 10);
    if (r.mode === 'daily') {
      const prev = data.daily[r.date];
      if (!prev || entry.score > prev.score) data.daily[r.date] = entry;
    }
    if (r.mode === 'weekly') {
      const prev = data.weekly[wk];
      if (!prev || entry.score > prev.score) data.weekly[wk] = entry;
    }
    save();

    const gain = Meta.award('arcade', {
      score: r.score, correct: r.correct, maxStreak: r.maxStreak,
      mode: r.mode, avgMs: r.totalMs / Q_COUNT, firstDailyToday, firstWeeklyOfWeek,
    });

    document.getElementById('arcResMode').textContent =
      r.mode === 'daily' ? `Daily Showdown — ${r.date}`
      : r.mode === 'weekly' ? `Weekly Grand Prix — ${wk}` : 'Blitz';
    document.getElementById('arcResScore').textContent = r.score;
    document.getElementById('arcResXP').innerHTML =
      `+${gain.xp} XP${gain.notes.length ? ' <span class="arc-xp-notes">(' + gain.notes.join(' · ') + ')</span>' : ''}`;
    document.getElementById('arcResStats').innerHTML = `
      <div class="stat-cell"><div class="sc-val">${r.correct}/${Q_COUNT}</div><div class="sc-label">Correct</div></div>
      <div class="stat-cell"><div class="sc-val">${fmtTime(r.totalMs)}</div><div class="sc-label">Total time</div></div>
      <div class="stat-cell"><div class="sc-val">${(r.totalMs / Q_COUNT / 1000).toFixed(1)}s</div><div class="sc-label">Avg / question</div></div>
      <div class="stat-cell"><div class="sc-val">${r.maxStreak}</div><div class="sc-label">Best streak</div></div>`;

    const pct = percentile(r.score);
    document.getElementById('arcPctFill').style.width = pct + '%';
    document.getElementById('arcPctText').textContent = `You beat an estimated ${pct}% of the field`;

    document.getElementById('arcName').value = Meta.getName();
    updateShareCode(entry);
    document.getElementById('arcAgain').onclick = () => start(r.mode);

    document.getElementById('arcReview').innerHTML = r.review.map((rv, i) => `
      <div class="arc-review-row ${rv.correct ? 'good' : 'bad'}">
        <span class="arr-mark">${rv.correct ? '✓' : '✗'}</span>
        <div class="arr-body">
          <div class="arr-head">${i + 1}. ${rv.q.short}
            <span class="arr-meta">${rv.given === null ? 'timed out' : 'you: ' + rv.q.options[rv.given]}
            · ${(rv.elapsed / 1000).toFixed(1)}s${rv.correct ? ' · +' + rv.pts : ''}</span></div>
          <div class="arr-explain">${rv.q.explain}</div>
        </div>
      </div>`).join('');

    showScreen('results');
    renderHome(); // keep home fresh behind the scenes
  }

  // ---------- share codes ----------
  // v1 codes stay decodable; `av` (avatar id) is a new optional field, so
  // codes from older versions of the app simply show the card-back avatar.
  function encodeEntry(entry, name) {
    const payload = { v: 1, n: name || 'Anon', d: entry.date, s: entry.score, t: entry.timeMs, a: entry.acc, av: Meta.getAvatar() };
    return 'STK1.' + btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decodeEntry(code) {
    try {
      const m = code.trim().match(/^STK1\.([A-Za-z0-9_-]+)$/);
      if (!m) return null;
      const b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
      const p = JSON.parse(decodeURIComponent(escape(atob(b64))));
      if (p.v !== 1 || typeof p.n !== 'string' || typeof p.s !== 'number' ||
          typeof p.t !== 'number' || typeof p.d !== 'string') return null;
      return { name: p.n.slice(0, 16), date: p.d, score: Math.round(p.s), timeMs: Math.round(p.t), acc: p.a,
               av: typeof p.av === 'string' ? p.av.slice(0, 24) : '' };
    } catch (e) { return null; }
  }

  function updateShareCode(entry) {
    const code = encodeEntry(entry, Meta.getName());
    document.getElementById('arcShareCode').textContent = code;
    document.getElementById('arcCopy').onclick = () => {
      const btn = document.getElementById('arcCopy');
      const done = () => { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy code', 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText)
        navigator.clipboard.writeText(code).then(done, () => fallbackCopy(code, done));
      else fallbackCopy(code, done);
    };
    // re-encode when the name changes (the name lives in the Locker profile)
    document.getElementById('arcName').oninput = e => {
      Meta.setName(e.target.value);
      document.getElementById('arcShareCode').textContent = encodeEntry(entry, Meta.getName());
    };
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* user can select manually */ }
    ta.remove();
  }

  function addFriendCode() {
    const input = document.getElementById('arcCodeIn');
    const err = document.getElementById('arcCodeErr');
    const entry = decodeEntry(input.value);
    if (!entry) { err.textContent = 'That code didn\'t parse — make sure you pasted the whole thing.'; return; }
    err.textContent = '';
    // one row per (name, date): keep the best
    const key = e => e.name + '|' + e.date;
    const existing = data.friends.find(f => key(f) === key(entry));
    if (existing) { if (entry.score > existing.score) Object.assign(existing, entry); }
    else data.friends.push(entry);
    save();
    input.value = '';
    renderHome();
  }

  // ---------- home rendering ----------
  function renderHome() {
    const today = todayStr();
    const wk = weekKey();
    document.getElementById('arcDailyTitle').textContent = `Today's 20 puzzles — ${today}`;
    const db = data.daily[today];
    document.getElementById('arcDailyBest').textContent =
      db ? `Your best today: ${db.score} pts · ${fmtTime(db.timeMs)} · ${db.acc}% correct` : 'Not played yet today.';
    document.getElementById('arcWeeklyTitle').textContent = `This week's 20 — ${wk}`;
    const wb = data.weekly[wk];
    document.getElementById('arcWeeklyBest').textContent =
      wb ? `Your best this week: ${wb.score} pts · ${wb.acc}% correct` : 'No Grand Prix run yet this week.';
    const bb = data.bests.filter(b => b.mode === 'blitz')[0];
    document.getElementById('arcBlitzBest').textContent =
      bb ? `Blitz best: ${bb.score} pts · ${bb.acc}% correct` : 'No blitz runs yet.';

    document.getElementById('arcBests').innerHTML = data.bests.length
      ? `<table class="arc-lb">${data.bests.map((b, i) => `
          <tr><td class="lb-rank">${i + 1}</td>
          <td>${b.mode === 'blitz' ? 'Blitz' : b.mode === 'weekly' ? 'GP ' + b.date : b.date}</td>
          <td class="lb-score">${b.score}</td>
          <td>${fmtTime(b.timeMs)}</td><td>${b.acc}%</td></tr>`).join('')}</table>`
      : '<div class="arc-hint">Play a run to set your first best.</div>';

    // rivals board: your daily + weekly bests join the table, marked "you"
    const mineOf = obj => Object.values(obj).map(e => ({
      name: (Meta.getName() || 'You'), date: e.date, score: e.score, timeMs: e.timeMs, acc: e.acc,
      av: Meta.getAvatar(), me: true,
    }));
    const mine = mineOf(data.daily).concat(mineOf(data.weekly));
    const all = data.friends.concat(mine).sort((a, b) => b.score - a.score || a.timeMs - b.timeMs);
    const todays = all.filter(e => e.date === today);
    const weeks = all.filter(e => e.date === wk);
    const board = rows => `<table class="arc-lb">${rows.map((e, i) => `
      <tr class="${e.me ? 'me' : ''}"><td class="lb-rank">${i + 1}</td>
      <td class="lb-av"><span class="avatar-frame mini">${avatarSVG(e.av)}</span></td>
      <td>${escapeArc(e.name)}${e.me ? ' ★' : ''}</td>
      <td class="lb-score">${e.score}</td>
      <td>${fmtTime(e.timeMs)}</td><td>${e.date === 'blitz' ? 'blitz' : e.date}</td></tr>`).join('')}</table>`;
    document.getElementById('arcFriends').innerHTML =
      (todays.length ? `<div class="arc-lb-label">Today's Showdown</div>${board(todays)}` : '') +
      (weeks.length ? `<div class="arc-lb-label">This week's Grand Prix</div>${board(weeks)}` : '') +
      (all.length ? `<div class="arc-lb-label">All-time</div>${board(all.slice(0, 10))}`
        : '<div class="arc-hint">No entries yet — play the Daily Showdown and swap codes.</div>');

    renderSeason(today);
  }

  // ---------- season race ----------
  // A season is one calendar month. Every Daily Showdown best in that month
  // adds to your total — yours from data.daily, rivals' from their pasted codes.
  function renderSeason(today) {
    const season = today.slice(0, 7); // YYYY-MM
    const label = new Date(today + 'T12:00:00').toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    document.getElementById('arcSeasonLabel').textContent = label;

    const inSeason = e => /^\d{4}-\d{2}-\d{2}$/.test(e.date) && e.date.startsWith(season);
    const totals = new Map(); // name -> {name, av, me, pts, days}
    const bump = (nameKey, e, av, me) => {
      const t = totals.get(nameKey) || { name: nameKey, av, me, pts: 0, days: 0 };
      t.pts += e.score;
      t.days++;
      if (me) { t.me = true; t.av = av; }
      totals.set(nameKey, t);
    };
    for (const e of Object.values(data.daily)) if (inSeason(e)) bump(Meta.getName() || 'You', e, Meta.getAvatar(), true);
    for (const e of data.friends) if (inSeason(e)) bump(e.name, e, e.av, false);

    const standings = [...totals.values()].sort((a, b) => b.pts - a.pts || b.days - a.days);
    const podiumEl = document.getElementById('arcPodium');
    const listEl = document.getElementById('arcSeason');
    if (!standings.length) {
      podiumEl.innerHTML = '';
      listEl.innerHTML = '<div class="arc-hint">The podium is empty — play today\'s Daily Showdown to open the race!</div>';
      return;
    }

    // podium renders 2nd · 1st · 3rd, tallest block in the middle
    const medals = ['first', 'second', 'third'];
    const step = (t, i) => t ? `
      <div class="podium-step ${medals[i]} ${t.me ? 'me' : ''}">
        <div class="avatar-frame lg">${avatarSVG(t.av)}</div>
        <div class="podium-name">${escapeArc(t.name)}${t.me ? ' ★' : ''}</div>
        <div class="podium-pts">${t.pts} pts</div>
        <div class="podium-block"><span>${i + 1}</span></div>
      </div>` : '';
    podiumEl.innerHTML = step(standings[1], 1) + step(standings[0], 0) + step(standings[2], 2);

    listEl.innerHTML = standings.length > 3
      ? `<table class="arc-lb">${standings.slice(3, 10).map((t, i) => `
          <tr class="${t.me ? 'me' : ''}"><td class="lb-rank">${i + 4}</td>
          <td class="lb-av"><span class="avatar-frame mini">${avatarSVG(t.av)}</span></td>
          <td>${escapeArc(t.name)}${t.me ? ' ★' : ''}</td>
          <td class="lb-score">${t.pts}</td>
          <td>${t.days} day${t.days === 1 ? '' : 's'} played</td></tr>`).join('')}</table>`
      : '';
  }

  function escapeArc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function init() {
    document.getElementById('arcPlayDaily').addEventListener('click', () => start('daily'));
    document.getElementById('arcPlayWeekly').addEventListener('click', () => start('weekly'));
    document.getElementById('arcPlayBlitz').addEventListener('click', () => start('blitz'));
    document.getElementById('arcQuit').addEventListener('click', abandon);
    document.getElementById('arcHomeBtn').addEventListener('click', () => { showScreen('home'); renderHome(); });
    document.getElementById('arcCodeAdd').addEventListener('click', addFriendCode);
    document.getElementById('arcCodeIn').addEventListener('keydown', e => { if (e.key === 'Enter') addFriendCode(); });
    document.getElementById('arcAnswers').addEventListener('click', e => {
      const b = e.target.closest('.btn');
      if (b && !b.disabled) answer(+b.dataset.i);
    });
    renderHome();
  }

  return { init, buildQuestions, mulberry32, hashStr, encodeEntry, decodeEntry };
})();
