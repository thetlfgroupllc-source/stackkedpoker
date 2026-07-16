// ---- cheat sheet content ----

const CheatSheet = (() => {
  const CARDS = [
    {
      tag: 'cash + mtt', title: 'Bankroll management',
      items: [
        '<b>Cash:</b> keep 25–30 buy-ins for your stake. $1/$2 with a $200 buy-in → $5,000–6,000 bankroll.',
        '<b>Tournaments:</b> 75–100 average buy-ins. Variance in MTTs is brutal even for great players.',
        '<b>Move down without ego</b> when the roll dips below the line. Moving down is a skill.',
        'Never play a session with money you can\'t emotionally afford to lose — scared money plays badly.',
      ],
    },
    {
      tag: 'preflop', title: 'Preflop discipline',
      items: [
        '<b>Never open-limp.</b> Raise or fold. Limping caps your range and builds pots you don\'t control.',
        'Facing limpers: <b>iso-raise big</b> — 4bb + 1bb per limper. Small-stakes limpers call too wide, then fold too much later.',
        'Facing a raise: mostly <b>3-bet or fold</b>. Flat-calling with hands like KJo bleeds money out of position.',
        'Open size: 2.2–2.5bb online, <b>3–4bb live</b> (live players call too much — charge them).',
      ],
    },
    {
      tag: 'small stakes', title: 'Exploits that print at low stakes',
      items: [
        '<b>Value bet bigger and thinner.</b> Low-stakes players call with any pair. Bet 75% pot with top pair good kicker.',
        '<b>Bluff less.</b> They don\'t fold. Save the triple-barrel bluffs for tougher games.',
        '<b>Believe the raise.</b> A river raise at small stakes is almost never a bluff. Top pair is a fold.',
        'Don\'t slow-play big hands — they\'ll pay you off anyway, so build the pot yourself.',
      ],
    },
    {
      tag: 'math', title: 'Rule of 2 and 4',
      items: [
        '<b>Two cards to come</b> (all-in on flop): equity ≈ outs × 4.',
        '<b>One card to come:</b> equity ≈ outs × 2.',
        'Flush draw = 9 outs, open-ender = 8, gutshot = 4, two overcards ≈ 6, flush draw + gutshot = 12.',
        'Equity needed vs. a bet: ⅓ pot → 20%, ½ pot → 25%, ⅔ pot → 28.5%, pot → 33%.',
      ],
    },
    {
      tag: 'fundamentals', title: 'Position is money',
      items: [
        'The button wins more than every other seat combined for most players. <b>Play more hands in position, fewer out of position.</b>',
        'In position you see their action first, control pot size, and realize your equity. Out of position everything is harder.',
        'Marginal hand + out of position = fold. The same hand on the button is a raise.',
      ],
    },
    {
      tag: 'mtt', title: 'Tournament stack strategy',
      items: [
        '<b>40bb+:</b> play close to cash-game poker.',
        '<b>20–40bb:</b> tighten calls, favor 3-bet shoves over flat calls with strong hands.',
        '<b>10–20bb:</b> re-shove territory — attack opens from late-position raisers.',
        '<b>Under 10bb:</b> push/fold. Use the trainer — first-in shoving is solved math, not feel.',
        '<b>Bubble/ICM:</b> tighten calls dramatically near pay jumps; keep shoving if you cover the table.',
      ],
    },
    {
      tag: 'postflop', title: 'C-betting made simple',
      items: [
        'Bet small (⅓ pot) on <b>dry boards</b> (K72 rainbow) with your whole range as the preflop raiser.',
        'On <b>wet boards</b> (JT9 two-tone), bet bigger (⅔–¾ pot) with a stronger, tighter range.',
        'Check back weak hands with showdown value — don\'t turn ace-high into a bluff for no reason.',
        'Barrel turns that improve your range: aces, kings, and flush-completing cards when you have it covered.',
      ],
    },
    {
      tag: 'mindset', title: 'Session discipline',
      items: [
        '<b>Stop-loss:</b> quit after losing 2–3 buy-ins. You\'re rarely playing your A-game after that.',
        'Log <b>every</b> session in the tracker, especially the bad ones. The graph keeps you honest.',
        'Review 2–3 hands after each session: one you lost big, one you won big, one you weren\'t sure about.',
        'Tired, tilted, or distracted = quit. The game runs tomorrow too.',
      ],
    },
  ];

  function init() {
    document.getElementById('cheatGrid').innerHTML = CARDS.map(c => `
      <div class="cheat-card">
        <div class="tag">${c.tag}</div>
        <h3>${c.title}</h3>
        <ul>${c.items.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>`).join('');
  }

  return { init };
})();
