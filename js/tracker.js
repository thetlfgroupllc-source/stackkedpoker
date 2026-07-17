// ---- session / bankroll tracker ----

const Tracker = (() => {
  const STORE = 'grinder_sessions';
  let sessions = load();

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE));
      if (Array.isArray(s)) return s;
    } catch (e) { /* fall through */ }
    return [];
  }
  function save() { localStorage.setItem(STORE, JSON.stringify(sessions)); }

  function profit(s) { return s.cashout - s.buyin; }
  function sorted() { return [...sessions].sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id); }

  const fmt$ = n => (n < 0 ? '-$' : '$') + Math.abs(n).toFixed(Math.abs(n) % 1 ? 2 : 0);

  // ---------- summary ----------
  function renderSummary() {
    const el = document.getElementById('trkSummary');
    if (!sessions.length) {
      el.innerHTML = '<div class="trk-empty">No sessions logged yet — add your first one below.</div>';
      return;
    }
    const total = sessions.reduce((a, s) => a + profit(s), 0);
    const hours = sessions.reduce((a, s) => a + s.hours, 0);
    const wins = sessions.filter(s => profit(s) > 0).length;
    const cash = sessions.filter(s => s.type === 'cash');
    const mtt = sessions.filter(s => s.type === 'tournament');
    const cashProfit = cash.reduce((a, s) => a + profit(s), 0);
    const mttBuyins = mtt.reduce((a, s) => a + s.buyin, 0);
    const mttProfit = mtt.reduce((a, s) => a + profit(s), 0);
    const roi = mttBuyins ? Math.round((mttProfit / mttBuyins) * 100) : null;

    const cells = [
      [fmt$(total), 'Total profit', total >= 0 ? 'var(--good)' : 'var(--bad)'],
      [sessions.length, 'Sessions'],
      [hours.toFixed(1), 'Hours'],
      [hours ? fmt$(total / hours) + '/hr' : '—', 'Hourly'],
      [Math.round((wins / sessions.length) * 100) + '%', 'Winning sessions'],
      [cash.length ? fmt$(cashProfit) : '—', 'Cash profit'],
      [roi === null ? '—' : roi + '%', 'Tournament ROI'],
    ];
    el.innerHTML = cells.map(([v, l, color]) =>
      `<div class="stat-cell"><div class="sc-val"${color ? ` style="color:${color}"` : ''}>${v}</div><div class="sc-label">${l}</div></div>`
    ).join('');
  }

  // ---------- chart ----------
  function renderChart() {
    const el = document.getElementById('trkChart');
    if (sessions.length < 1) {
      el.innerHTML = '<div class="trk-empty">The bankroll graph appears after your first session.</div>';
      return;
    }
    const ss = sorted();
    let cum = 0;
    const pts = [{ label: 'Start', v: 0 }].concat(ss.map(s => {
      cum += profit(s);
      return { label: s.date + ' · ' + s.stakes, v: cum, p: profit(s) };
    }));

    const W = 800, H = 260, PAD_L = 56, PAD_R = 16, PAD_T = 14, PAD_B = 26;
    const lo = Math.min(0, ...pts.map(p => p.v));
    const hi = Math.max(0, ...pts.map(p => p.v));
    const span = (hi - lo) || 1;
    const x = i => PAD_L + (i / Math.max(1, pts.length - 1)) * (W - PAD_L - PAD_R);
    const y = v => PAD_T + (1 - (v - lo) / span) * (H - PAD_T - PAD_B);

    // ~4 clean y ticks
    const rawStep = span / 4;
    const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= rawStep) || rawStep;
    const ticks = [];
    for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) ticks.push(t);

    const path = pts.map((p, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.v).toFixed(1)).join(' ');

    el.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Cumulative profit across sessions">
        ${ticks.map(t => `
          <line x1="${PAD_L}" x2="${W - PAD_R}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"
            stroke="${t === 0 ? '#c9b98e' : '#e7d9b4'}" stroke-width="${t === 0 ? 1.5 : 1}"/>
          <text x="${PAD_L - 8}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end"
            font-size="11" fill="#97865f" style="font-variant-numeric:tabular-nums">${fmt$(t)}</text>`).join('')}
        <path d="${path}" fill="none" stroke="#7b46f0" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
        ${pts.map((p, i) => `
          <circle class="trk-pt" data-i="${i}" cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="4"
            fill="#7b46f0" stroke="#1d1145" stroke-width="2"/>
          <circle class="trk-hit" data-i="${i}" cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="12" fill="transparent"/>`).join('')}
        <text x="${W - PAD_R}" y="${H - 8}" text-anchor="end" font-size="11" fill="#97865f">sessions →</text>
        <g id="trkTip" style="display:none;pointer-events:none">
          <rect id="trkTipBg" rx="8" fill="#fffdf6" stroke="#1d1145" stroke-width="2"/>
          <text id="trkTipT1" font-size="11" fill="#4a3f7d"></text>
          <text id="trkTipT2" font-size="13" font-weight="700" fill="#241b4d"></text>
        </g>
      </svg>`;

    // hover tooltip
    const svg = el.querySelector('svg');
    svg.addEventListener('mousemove', e => {
      const hit = e.target.closest('.trk-hit, .trk-pt');
      const tip = svg.querySelector('#trkTip');
      if (!hit) { tip.style.display = 'none'; return; }
      const i = +hit.dataset.i;
      const p = pts[i];
      const t1 = svg.querySelector('#trkTipT1');
      const t2 = svg.querySelector('#trkTipT2');
      t1.textContent = p.label + (p.p !== undefined ? ` (${p.p >= 0 ? '+' : ''}${fmt$(p.p).replace('$-', '-$')})` : '');
      t2.textContent = 'Total: ' + fmt$(p.v);
      const px = Math.min(Math.max(x(i), PAD_L + 90), W - PAD_R - 90);
      const py = y(p.v) < 70 ? y(p.v) + 18 : y(p.v) - 52;
      t1.setAttribute('x', px - 84); t1.setAttribute('y', py + 16);
      t2.setAttribute('x', px - 84); t2.setAttribute('y', py + 33);
      const bg = svg.querySelector('#trkTipBg');
      bg.setAttribute('x', px - 92); bg.setAttribute('y', py);
      bg.setAttribute('width', 184); bg.setAttribute('height', 42);
      tip.style.display = '';
    });
    svg.addEventListener('mouseleave', () => {
      svg.querySelector('#trkTip').style.display = 'none';
    });
  }

  // ---------- table ----------
  function renderTable() {
    const el = document.getElementById('trkTable');
    if (!sessions.length) { el.innerHTML = ''; return; }
    const rows = sorted().reverse().map(s => {
      const p = profit(s);
      return `<tr>
        <td>${s.date}</td>
        <td>${s.type === 'cash' ? 'Cash' : 'MTT'}</td>
        <td>${escapeHTML(s.stakes)}</td>
        <td class="${p >= 0 ? 'profit-pos' : 'profit-neg'}">${p >= 0 ? '+' : ''}${fmt$(p)}</td>
        <td>${s.hours}h</td>
        <td title="${escapeHTML(s.notes || '')}">${escapeHTML((s.notes || '').slice(0, 24))}${(s.notes || '').length > 24 ? '…' : ''}</td>
        <td><button class="del-btn" data-id="${s.id}" title="Delete session">✕</button></td>
      </tr>`;
    }).join('');
    el.innerHTML = `<thead><tr><th>Date</th><th>Type</th><th>Stakes</th><th>Profit</th><th>Hrs</th><th>Notes</th><th></th></tr></thead><tbody>${rows}</tbody>`;
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function renderAll() {
    renderSummary();
    renderChart();
    renderTable();
    App.updateSidebar();
  }

  function addFromForm(e) {
    e.preventDefault();
    sessions.push({
      id: Date.now(),
      date: document.getElementById('trkDate').value,
      type: document.getElementById('trkType').value,
      stakes: document.getElementById('trkStakes').value.trim(),
      buyin: parseFloat(document.getElementById('trkBuyin').value),
      cashout: parseFloat(document.getElementById('trkCashout').value),
      hours: parseFloat(document.getElementById('trkHours').value),
      notes: document.getElementById('trkNotes').value.trim(),
    });
    save();
    Meta.award('session', {
      profit: profit(sessions[sessions.length - 1]),
      count: sessions.length,
      totalProfit: totalProfit(),
    });
    document.getElementById('trkForm').reset();
    setDefaultDate();
    renderAll();
  }

  function setDefaultDate() {
    document.getElementById('trkDate').value = new Date().toISOString().slice(0, 10);
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'poker-sessions.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data)) throw new Error('not an array');
        sessions = data;
        save();
        renderAll();
      } catch (err) {
        alert('Could not import that file — expected a JSON export from this app.');
      }
    };
    reader.readAsText(file);
  }

  function totalProfit() {
    return sessions.reduce((a, s) => a + profit(s), 0);
  }

  function init() {
    document.getElementById('trkForm').addEventListener('submit', addFromForm);
    document.getElementById('trkTable').addEventListener('click', e => {
      const b = e.target.closest('.del-btn');
      if (!b) return;
      if (!confirm('Delete this session?')) return;
      sessions = sessions.filter(s => s.id !== +b.dataset.id);
      save();
      renderAll();
    });
    document.getElementById('trkExport').addEventListener('click', exportJSON);
    document.getElementById('trkImport').addEventListener('click', () =>
      document.getElementById('trkImportFile').click());
    document.getElementById('trkImportFile').addEventListener('change', e => {
      if (e.target.files[0]) importJSON(e.target.files[0]);
      e.target.value = '';
    });
    setDefaultDate();
    renderAll();
  }

  return { init, totalProfit, count: () => sessions.length };
})();
