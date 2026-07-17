// ---- Meta: XP, ranks, badges, streaks — the gamification spine ----
// Everything here is local-first like the rest of the app: one localStorage
// blob, no accounts. Trainers call Meta.award() and this module handles
// XP math, rank-ups, badge checks, toasts and the suit-rain celebration.

const Meta = (() => {
  const STORE = 'grinder_meta';

  // ---------- the rank ladder ----------
  // Cumulative XP needed to *hold* each rank (index 0 = rank 1).
  const RANK_XP = [0, 150, 400, 800, 1400, 2200, 3300, 4700, 6500, 8800, 11700, 15300, 19700];
  const RANKS = [
    { name: 'Deck Wetter',       flavor: 'You shuffled once. It went okay.' },
    { name: 'Limp Lord',         flavor: 'Every pot deserves a look. Right?' },
    { name: 'Bubble Boy',        flavor: 'So close you can taste the min-cash.' },
    { name: 'Calling Station',   flavor: 'Fold is a four-letter word.' },
    { name: 'Rag Merchant',      flavor: 'Seven-deuce has a story, and you tell it.' },
    { name: 'Chip Sherpa',       flavor: 'You carry stacks now. Sometimes your own.' },
    { name: 'Flop Whisperer',    flavor: 'The board texture speaks to you.' },
    { name: 'Turn Burglar',      flavor: 'You take pots on fourth street like rent is due.' },
    { name: 'River Rat Royalty', flavor: 'Ugly wins count double in your kingdom.' },
    { name: 'Nit Reaper',        flavor: 'You harvest blinds from the fearful.' },
    { name: 'Felt Phantom',      flavor: 'Dealers speak of you in hushed tones.' },
    { name: 'Stack Monarch',     flavor: 'Towers of chips bow when you sit down.' },
    { name: 'GOAT of the Felt',  flavor: 'The table is yours. It always was.' },
  ];
  const MAX_RANK = RANKS.length;

  // ---------- badges ----------
  // check(m, type, p) runs after every award; m = meta state, p = payload.
  const ICONS = {
    drop:    '<path d="M12 2 Q19 12 19 16 A7 7 0 0 1 5 16 Q5 12 12 2 Z"/>',
    flame:   '<path d="M12 2 Q17 8 15 12 Q18 11 18 8 Q21 13 19 18 A8 8 0 0 1 5 18 Q3 12 8 7 Q8 11 10 12 Q9 6 12 2 Z"/>',
    dizzy:   '<path d="M12 3 A9 9 0 1 0 21 12 L18 12 A6 6 0 1 1 12 6 Z"/><circle cx="12" cy="12" r="2.4"/>',
    chip:    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5.6" fill="none" stroke="#141414" stroke-width="1.6" stroke-dasharray="3 3"/>',
    stack:   '<rect x="4" y="15" width="16" height="4" rx="2"/><rect x="6" y="10" width="12" height="4" rx="2"/><rect x="8" y="5" width="8" height="4" rx="2"/>',
    target:  '<path d="M12 2 A10 10 0 1 0 22 12 L18 12 A6 6 0 1 1 12 6 Z"/><path d="M12 12 L20 4 L19 8 L21 7 Z"/>',
    joystick:'<rect x="5" y="15" width="14" height="6" rx="2"/><rect x="11" y="8" width="2" height="8"/><circle cx="12" cy="6" r="3.4"/>',
    glasses: '<circle cx="7" cy="14" r="4.4"/><circle cx="17" cy="14" r="4.4"/><path d="M11 13 L13 13 M2 11 L4 12 M22 11 L20 12" stroke-width="2" stroke="currentColor" fill="none"/>',
    bolt:    '<path d="M13 2 L5 14 L11 14 L9 22 L19 9 L13 9 Z"/>',
    sun:     '<circle cx="12" cy="12" r="5"/><path d="M12 2 L12 5 M12 19 L12 22 M2 12 L5 12 M19 12 L22 12 M4.9 4.9 L7 7 M17 17 L19.1 19.1 M19.1 4.9 L17 7 M7 17 L4.9 19.1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
    moon:    '<path d="M20 14 A9 9 0 1 1 10 4 A7.5 7.5 0 0 0 20 14 Z"/>',
    ledger:  '<path d="M5 3 Q4 3 4 4 L4 20 Q4 21 5 21 L19 21 Q20 21 20 20 L20 4 Q20 3 19 3 Z M8 3 L8 21" fill-rule="evenodd"/><path d="M11 8 L17 8 M11 12 L17 12 M11 16 L15 16" stroke="#141414" stroke-width="1.6" fill="none"/>',
    graph:   '<path d="M3 21 L3 3 L5 3 L5 19 L21 19 L21 21 Z"/><path d="M6 15 L11 10 L14 13 L20 5 L20 9 M20 5 L16 5" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    fin:     '<path d="M4 18 Q10 4 14 4 Q13 10 16 18 Z"/><path d="M2 20 Q6 18 10 20 Q14 22 18 20 Q20 19 22 20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
    bandage: '<rect x="2" y="9" width="20" height="7" rx="3.5" transform="rotate(-30 12 12)"/><circle cx="10.5" cy="12.5" r="0.9" fill="#141414"/><circle cx="13.5" cy="10.8" r="0.9" fill="#141414"/><circle cx="12" cy="14" r="0.9" fill="#141414"/>',
    flask:   '<path d="M10 3 L10 9 L4 19 Q3 21 5 21 L19 21 Q21 21 20 19 L14 9 L14 3 Z M8 3 L16 3" fill-rule="evenodd"/><path d="M7.6 15 L16.4 15 L19 19.6 Q19.4 20 19 20 L5 20 Q4.6 20 5 19.6 Z" fill="#141414"/>',
    sherpa:  '<path d="M2 20 L8 8 L12 14 L16 5 L22 20 Z"/><path d="M15 8 L16 5 L17.6 9 L16.5 8.4 Z" fill="#fff" opacity="0.85"/>',
    ghost:   '<path d="M5 11 Q5 4 12 4 Q19 4 19 11 L19 20 L16.6 17.6 L14.3 20 L12 17.6 L9.7 20 L7.4 17.6 L5 20 Z"/><circle cx="9.5" cy="11" r="1.4" fill="#141414"/><circle cx="14.5" cy="11" r="1.4" fill="#141414"/>',
  };
  const BADGES = [
    { id: 'first-blood', icon: 'drop', name: 'First Blood',
      how: 'Get your first drill right.',
      quip: 'One correct answer. The bankroll trembles.',
      check: (m, t, p) => t === 'drill' && m.c.right >= 1 },
    { id: 'hot-streak', icon: 'flame', name: 'Heater',
      how: 'Hit a 10-answer streak in any trainer.',
      quip: 'Someone open a window, it is warm in here.',
      check: (m, t, p) => t === 'drill' && p.streak >= 10 },
    { id: 'unconscious', icon: 'dizzy', name: 'Unconscious',
      how: 'Hit a 25-answer streak in any trainer.',
      quip: 'You stopped thinking twelve answers ago. Do not start now.',
      check: (m, t, p) => t === 'drill' && p.streak >= 25 },
    { id: 'century', icon: 'chip', name: 'Century Club',
      how: 'Answer 100 drills, right or wrong.',
      quip: 'A hundred decisions. Some were even good.',
      check: m => m.c.drills >= 100 },
    { id: 'thousand', icon: 'stack', name: 'Thousand-Hand Stare',
      how: 'Answer 1,000 drills.',
      quip: 'You have seen things. Mostly jack-four offsuit.',
      check: m => m.c.drills >= 1000 },
    { id: 'sharp', icon: 'target', name: 'Sharp',
      how: '90% lifetime drill accuracy over 50+ drills.',
      quip: 'The ranges fear you now.',
      check: m => m.c.drills >= 50 && m.c.right / m.c.drills >= 0.9 },
    { id: 'arcade-rat', icon: 'joystick', name: 'Arcade Rat',
      how: 'Finish your first Arcade run.',
      quip: 'Twenty questions in, and already talking about "one more run."',
      check: m => m.c.arcadeRuns >= 1 },
    { id: 'perfect-20', icon: 'glasses', name: 'Twenty-Twenty',
      how: 'Go 20/20 in an Arcade run.',
      quip: 'A perfect run. Screenshot it — nobody will believe you.',
      check: (m, t, p) => t === 'arcade' && p.correct >= 20 },
    { id: 'speed-demon', icon: 'bolt', name: 'Snap Caller',
      how: 'Average under 4s per question with 15+ correct in an Arcade run.',
      quip: 'Thinking is for people with worse instincts.',
      check: (m, t, p) => t === 'arcade' && p.correct >= 15 && p.avgMs < 4000 },
    { id: 'week-streak', icon: 'sun', name: 'Daily Devotee',
      how: 'Play 7 days in a row.',
      quip: 'Seven straight days. The felt misses you when you leave.',
      check: m => m.dayStreak >= 7 },
    { id: 'fortnight', icon: 'moon', name: 'Fortnight of Felt',
      how: 'Play 14 days in a row.',
      quip: 'Two weeks. Your loved ones have started leaving snacks by the door.',
      check: m => m.dayStreak >= 14 },
    { id: 'bookkeeper', icon: 'ledger', name: 'Bookkeeper',
      how: 'Log your first session in the tracker.',
      quip: 'What gets measured gets less embarrassing.',
      check: m => m.c.sessions >= 1 },
    { id: 'black-ink', icon: 'graph', name: 'Black Ink',
      how: 'Be up money across 10+ logged sessions.',
      quip: 'The graph points the correct direction. Frame it.',
      check: (m, t, p) => t === 'session' && p.count >= 10 && p.totalProfit > 0 },
    { id: 'shark-bite', icon: 'fin', name: 'Shark Bite',
      how: 'Log a single session worth +$500 or more.',
      quip: 'Somewhere out there, a table is telling stories about you.',
      check: (m, t, p) => t === 'session' && p.profit >= 500 },
    { id: 'rebuy-artist', icon: 'bandage', name: 'Rebuy Artist',
      how: 'Log a losing session. Honestly.',
      quip: 'You logged the loss instead of pretending it never happened. Respect.',
      check: (m, t, p) => t === 'session' && p.profit < 0 },
    { id: 'lab-rat', icon: 'flask', name: 'Lab Rat',
      how: 'Run 25 simulations in the Equity Lab.',
      quip: 'AK versus queens again? It is still a flip. It will always be a flip.',
      check: m => m.c.labRuns >= 25 },
    { id: 'sherpa', icon: 'sherpa', name: 'Base Camp',
      how: 'Reach rank 6 — Chip Sherpa.',
      quip: 'Halfway up the mountain. The air (and the competition) thins out.',
      check: m => rankOf(m.xp) >= 6 },
    { id: 'phantom', icon: 'ghost', name: 'Regular Apparition',
      how: 'Reach rank 11 — Felt Phantom.',
      quip: 'You are a story new players get told.',
      check: m => rankOf(m.xp) >= 11 },
  ];

  // ---------- state ----------
  let m = load();

  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(STORE));
      if (d && typeof d.xp === 'number' && d.c) return d;
    } catch (e) { /* fall through */ }
    // adopt an existing arcade name so long-time users keep their identity
    let name = '';
    try { name = (JSON.parse(localStorage.getItem('grinder_arcade')) || {}).name || ''; } catch (e) { /* ok */ }
    return {
      xp: 0, name, avatar: 'blinky', badges: {},
      lastDay: '', dayStreak: 0, bestDayStreak: 0,
      c: { drills: 0, right: 0, bestStreak: 0, arcadeRuns: 0, dailyRuns: 0, labRuns: 0, sessions: 0 },
    };
  }
  function save() { localStorage.setItem(STORE, JSON.stringify(m)); }

  function rankOf(xp) {
    let r = 1;
    for (let i = 0; i < RANK_XP.length; i++) if (xp >= RANK_XP[i]) r = i + 1;
    return r;
  }
  function rankInfo(r) { return RANKS[Math.min(r, MAX_RANK) - 1]; }

  const todayStr = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  // ---------- the one entry point ----------
  // Meta.award('drill',   {correct, streak, source})
  // Meta.award('arcade',  {score, correct, maxStreak, mode, avgMs, firstDailyToday})
  // Meta.award('session', {profit, count, totalProfit})
  // Meta.award('lab',     {})
  function award(type, p = {}) {
    const before = rankOf(m.xp);
    let xp = 0;
    const notes = [];

    if (type === 'drill') {
      m.c.drills++;
      if (p.correct) {
        m.c.right++;
        m.c.bestStreak = Math.max(m.c.bestStreak, p.streak || 0);
        xp += 10;
        if (p.streak > 0 && p.streak % 5 === 0) { xp += 15; notes.push('streak ' + p.streak); }
      } else {
        xp += 2; // showing up still counts
      }
    } else if (type === 'arcade') {
      m.c.arcadeRuns++;
      if (p.mode === 'daily') m.c.dailyRuns++;
      xp += Math.round((p.score || 0) / 20);
      if (p.firstDailyToday) { xp += 50; notes.push('first Showdown of the day'); }
      if (p.firstWeeklyOfWeek) { xp += 50; notes.push('first Grand Prix of the week'); }
    } else if (type === 'session') {
      m.c.sessions++;
      xp += 40;
    } else if (type === 'lab') {
      m.c.labRuns++;
      xp += 5;
    }

    // fresh-felt bonus: first activity of the calendar day feeds the streak
    const today = todayStr();
    if (m.lastDay !== today) {
      const yest = new Date(Date.now() - 86400000);
      const yestStr = yest.getFullYear() + '-' + String(yest.getMonth() + 1).padStart(2, '0') + '-' + String(yest.getDate()).padStart(2, '0');
      m.dayStreak = m.lastDay === yestStr ? m.dayStreak + 1 : 1;
      m.bestDayStreak = Math.max(m.bestDayStreak, m.dayStreak);
      m.lastDay = today;
      xp += 25;
      notes.push('fresh felt +25');
    }

    m.xp += xp;

    // badge checks
    const earned = [];
    for (const b of BADGES) {
      if (!m.badges[b.id] && b.check(m, type, p)) {
        m.badges[b.id] = today;
        earned.push(b);
      }
    }

    const after = rankOf(m.xp);
    save();
    renderSidebar();
    if (document.getElementById('view-locker').classList.contains('active')) renderLocker();

    for (const b of earned) {
      toast(`<span class="toast-icon">${badgeIcon(b)}</span>
        <span><b>Badge earned — ${b.name}</b><br>${b.quip}</span>`);
    }
    if (after > before) rankUp(after);

    return { xp, notes, rankedUp: after > before, badges: earned };
  }

  function badgeIcon(b) {
    return `<svg viewBox="0 0 24 24" fill="currentColor">${ICONS[b.icon]}</svg>`;
  }

  // ---------- toasts ----------
  function toast(html) {
    const layer = document.getElementById('toastLayer');
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = html;
    layer.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
    setTimeout(() => {
      el.classList.remove('in');
      setTimeout(() => el.remove(), 400);
    }, 5200);
  }

  // ---------- rank-up ceremony ----------
  function rankUp(rank) {
    const info = rankInfo(rank);
    const unlocked = AVATARS.filter(a => a.rank === rank);
    const overlay = document.getElementById('rankUpOverlay');
    overlay.innerHTML = `
      <div class="rankup-card">
        <div class="rankup-kicker">Rank up</div>
        <div class="rankup-name">${info.name}</div>
        <div class="rankup-flavor">${info.flavor}</div>
        ${unlocked.map(a => `
          <div class="rankup-unlock">
            <div class="avatar-frame lg">${avatarSVG(a.id)}</div>
            <div class="rankup-unlock-text">New regular unlocked<br><b>${a.name}</b> — ${a.bio}</div>
          </div>`).join('')}
        <button class="btn btn-raise" id="rankUpClose">Let's gooo!</button>
      </div>`;
    overlay.classList.remove('hidden');
    suitRain(overlay);
    document.getElementById('rankUpClose').addEventListener('click', () => {
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
    });
  }

  // Confetti, card-club style: the four suits falling like a dropped deck.
  function suitRain(host) {
    const glyphs = ['♠', '♥', '♦', '♣'];
    const colors = ['#ffd21f', '#ff2f8e', '#00cfe0', '#47e49a'];
    for (let i = 0; i < 44; i++) {
      const s = document.createElement('span');
      const g = Math.floor(Math.random() * 4);
      s.className = 'suit-drop';
      s.textContent = glyphs[g];
      s.style.color = colors[g];
      s.style.left = Math.random() * 100 + '%';
      s.style.fontSize = 14 + Math.random() * 18 + 'px';
      s.style.animationDuration = 2.4 + Math.random() * 2.4 + 's';
      s.style.animationDelay = Math.random() * 1.6 + 's';
      host.appendChild(s);
      setTimeout(() => s.remove(), 7000);
    }
  }

  // ---------- sidebar player card ----------
  function renderSidebar() {
    const rank = rankOf(m.xp);
    const info = rankInfo(rank);
    const floor = RANK_XP[rank - 1];
    const ceil = rank < MAX_RANK ? RANK_XP[rank] : null;
    const pct = ceil === null ? 100 : Math.round(((m.xp - floor) / (ceil - floor)) * 100);
    document.getElementById('playerCard').innerHTML = `
      <div class="pc-row">
        <div class="avatar-frame sm">${avatarSVG(m.avatar)}</div>
        <div class="pc-id">
          <div class="pc-name">${escapeMeta(m.name) || 'Unnamed Reg'}</div>
          <div class="pc-rank">R${rank} · ${info.name}</div>
        </div>
      </div>
      <div class="xp-track" title="${m.xp} XP${ceil !== null ? ' — ' + (ceil - m.xp) + ' to next rank' : ''}">
        <div class="xp-fill" style="width:${pct}%"></div>
      </div>
      <div class="pc-meta">
        <span>${m.xp} xp</span>
        <span>${m.dayStreak > 1 ? m.dayStreak + '-day streak' : (ceil !== null ? (ceil - m.xp) + ' to R' + (rank + 1) : 'max rank')}</span>
      </div>`;
  }

  // ---------- The Locker (view) ----------
  function renderLocker() {
    const rank = rankOf(m.xp);
    const info = rankInfo(rank);
    const floor = RANK_XP[rank - 1];
    const ceil = rank < MAX_RANK ? RANK_XP[rank] : null;
    const pct = ceil === null ? 100 : Math.round(((m.xp - floor) / (ceil - floor)) * 100);
    const badgeCount = Object.keys(m.badges).length;

    document.getElementById('lockerHero').innerHTML = `
      <div class="avatar-frame xl">${avatarSVG(m.avatar)}</div>
      <div class="locker-id">
        <label class="locker-name-label">Table name
          <input type="text" id="lockerName" maxlength="16" placeholder="e.g. Trav" value="${escapeMeta(m.name)}">
        </label>
        <div class="locker-rank">
          <span class="locker-rank-num">Rank ${rank}</span>
          <span class="locker-rank-name">${info.name}</span>
        </div>
        <div class="locker-flavor">${info.flavor}</div>
        <div class="xp-track big"><div class="xp-fill" style="width:${pct}%"></div></div>
        <div class="locker-xp-line">${m.xp} XP${ceil !== null ? ` — ${ceil - m.xp} more to ${rankInfo(rank + 1).name}` : ' — top of the ladder'}</div>
      </div>
      <div class="locker-quickstats">
        <div class="stat-cell"><div class="sc-val">${m.c.drills}</div><div class="sc-label">Drills</div></div>
        <div class="stat-cell"><div class="sc-val">${m.c.arcadeRuns}</div><div class="sc-label">Arcade runs</div></div>
        <div class="stat-cell"><div class="sc-val">${m.dayStreak}</div><div class="sc-label">Day streak</div></div>
        <div class="stat-cell"><div class="sc-val">${badgeCount}/${BADGES.length}</div><div class="sc-label">Badges</div></div>
      </div>`;

    document.getElementById('lockerName').addEventListener('input', e => {
      m.name = e.target.value.trim().slice(0, 16);
      save();
      renderSidebar();
    });

    // rank ladder
    document.getElementById('lockerLadder').innerHTML = RANKS.map((r, i) => {
      const n = i + 1;
      const state = n < rank ? 'done' : n === rank ? 'now' : 'todo';
      return `<div class="ladder-row ${state}">
        <span class="ladder-num">R${n}</span>
        <span class="ladder-name">${r.name}</span>
        <span class="ladder-xp">${RANK_XP[i]} xp</span>
      </div>`;
    }).join('');

    // avatar gallery
    document.getElementById('lockerAvatars').innerHTML = AVATARS.map(a => {
      const unlocked = a.rank <= rank;
      const chosen = a.id === m.avatar;
      return `<button class="avatar-slot ${unlocked ? '' : 'locked'} ${chosen ? 'chosen' : ''}"
        data-id="${a.id}" ${unlocked ? '' : 'disabled'}
        title="${unlocked ? a.bio : 'Unlocks at rank ' + a.rank + ' — ' + rankInfo(a.rank).name}">
        <span class="avatar-frame">${avatarSVG(a.id)}</span>
        <span class="avatar-slot-name">${unlocked ? a.name : 'Rank ' + a.rank}</span>
      </button>`;
    }).join('');

    // badge wall
    document.getElementById('lockerBadges').innerHTML = BADGES.map(b => {
      const when = m.badges[b.id];
      return `<div class="badge-card ${when ? 'earned' : ''}">
        <div class="badge-icon">${badgeIcon(b)}</div>
        <div class="badge-body">
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${when ? b.quip : b.how}</div>
          ${when ? `<div class="badge-date">earned ${when}</div>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  function escapeMeta(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function init() {
    renderSidebar();
    renderLocker();
    document.getElementById('lockerAvatars').addEventListener('click', e => {
      const slot = e.target.closest('.avatar-slot');
      if (!slot || slot.disabled) return;
      m.avatar = slot.dataset.id;
      save();
      renderSidebar();
      renderLocker();
    });
  }

  return {
    init, award,
    getName: () => m.name,
    setName: n => { m.name = String(n || '').trim().slice(0, 16); save(); renderSidebar(); },
    getAvatar: () => m.avatar,
    rank: () => rankOf(m.xp),
    renderLocker,
  };
})();
