// ---- app shell: navigation + sidebar summary ----

const App = {
  updateSidebar() {
    const pf = PreflopTrainer.getStats();
    const ph = PushFoldTrainer.getStats();
    const oq = OddsQuiz.getStats();
    const total = pf.total + ph.total + oq.total;
    const right = pf.right + ph.right + oq.right;
    const acc = total ? Math.round((right / total) * 100) : 0;
    const profit = Tracker.totalProfit();
    const profitStr = (profit < 0 ? '-$' : '$') + Math.abs(profit).toFixed(0);
    document.getElementById('sidebarStats').innerHTML =
      `<b>${total}</b> drills · <b>${acc}%</b> accuracy<br>` +
      (Tracker.count() ? `bankroll <b style="color:${profit >= 0 ? 'var(--good)' : 'var(--bad)'}">${profitStr}</b> over ${Tracker.count()} sessions` : 'no sessions logged yet');
  },
};

document.addEventListener('DOMContentLoaded', () => {
  // nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('view-' + btn.dataset.view).classList.add('active');
    });
  });

  // keyboard shortcuts: 1/f answer left button, 2/j answer right, n/enter next
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, select, textarea')) return;
    const view = document.querySelector('.view.active');
    const visible = b => !b.disabled && b.offsetParent !== null;
    const answers = [...view.querySelectorAll('.answer-row .btn')].filter(visible);
    const next = [...view.querySelectorAll('.btn-next:not(.hidden)')].filter(visible)[0];
    if ((e.key === '1' || e.key === 'r' || e.key === 'c') && answers[0]) answers[0].click();
    else if ((e.key === '2' || e.key === 'f') && answers[1]) answers[1].click();
    else if ((e.key === 'n' || e.key === 'Enter') && next) next.click();
  });

  Tracker.init();       // first: others read its totals for the sidebar
  PreflopTrainer.init();
  PushFoldTrainer.init();
  OddsQuiz.init();
  EquityLab.init();
  RangeViewer.init();
  CheatSheet.init();
  Challenge.init();
  App.updateSidebar();
});
