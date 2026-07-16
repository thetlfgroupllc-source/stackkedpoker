// ---- range chart study tab ----

const RangeViewer = (() => {
  let active = 'UTG';
  let mode = 'rfi'; // 'rfi' or a push stack size

  function tabs() {
    const el = document.getElementById('rangeTabs');
    let html = RFI_POSITIONS.map(p =>
      `<button class="range-tab${mode === 'rfi' && active === p ? ' active' : ''}" data-pos="${p}" data-mode="rfi">${p} open</button>`
    ).join('');
    html += PUSH_STACKS.map(bb =>
      `<button class="range-tab${mode === bb ? ' active' : ''}" data-bb="${bb}" data-mode="push">Jam ${bb}bb</button>`
    ).join('');
    el.innerHTML = html;
  }

  function render() {
    tabs();
    const grid = document.getElementById('rangeGrid');
    const info = document.getElementById('rangeInfo');

    if (mode === 'rfi') {
      const r = RFI_RANGES[active];
      renderRangeGrid(grid, r.range, null);
      info.innerHTML = `
        <div class="ri-pct">${rangePercent(r.range).toFixed(1)}%</div>
        <div>of all hands — ${r.label} open-raise</div>
        <div class="ri-desc">${r.desc}</div>
        <div class="ri-desc"><span class="legend-dot" style="background:var(--accent)"></span>Raise
        &nbsp;&nbsp;<span class="legend-dot" style="background:var(--surface-2)"></span>Fold</div>
        <div class="ri-desc" style="color:var(--ink-muted);font-size:13px">6-max, 100bb, folded to you.
        Suited hands are above the diagonal, offsuit below, pairs on it.</div>`;
    } else {
      const bb = mode;
      const r = getPushRange(active, bb);
      renderRangeGrid(grid, r, null);
      info.innerHTML = `
        <div class="ri-pct">${rangePercent(r).toFixed(1)}%</div>
        <div>of all hands — jam from ${active} at ${bb}bb</div>
        <div class="ri-desc">Approximate Nash push range for an unopened pot, no antes. With antes in play, jam a little wider.</div>
        <div class="ri-desc">Position: ${PUSH_POSITIONS.map(p =>
          `<button class="range-tab${active === p ? ' active' : ''}" data-pos="${p}" data-mode="keep" style="margin:2px">${p}</button>`).join('')}</div>
        <div class="ri-desc"><span class="legend-dot" style="background:var(--accent)"></span>All-in
        &nbsp;&nbsp;<span class="legend-dot" style="background:var(--surface-2)"></span>Fold</div>`;
    }
  }

  function init() {
    document.getElementById('view-ranges').addEventListener('click', e => {
      const b = e.target.closest('.range-tab');
      if (!b) return;
      if (b.dataset.mode === 'rfi') { mode = 'rfi'; active = b.dataset.pos; }
      else if (b.dataset.mode === 'push') { mode = +b.dataset.bb; if (!PUSH_POSITIONS.includes(active)) active = 'BTN'; }
      else if (b.dataset.mode === 'keep') { active = b.dataset.pos; }
      render();
    });
    render();
  }

  return { init };
})();
