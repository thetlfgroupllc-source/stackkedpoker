// ---- range notation parser + 6-max open-raise ranges + grid renderer ----

const R_ORDER = 'AKQJT98765432'; // grid order, high to low

// Expand a range string like "66+, A9s+, A5s-A2s, KTs+, QJs, AJo+" into a Set of hand codes
function parseRange(str) {
  const set = new Set();
  const ri = ch => RANK_CHARS.indexOf(ch) + 2; // 2..14

  for (const raw of str.split(',')) {
    const t = raw.trim();
    if (!t) continue;
    let m;
    if ((m = t.match(/^([2-9TJQKA])\1\+$/))) {           // 66+
      for (let r = ri(m[1]); r <= 14; r++) set.add(rankChar(r) + rankChar(r));
    } else if ((m = t.match(/^([2-9TJQKA])\1-([2-9TJQKA])\2$/))) { // TT-77
      const hi = ri(m[1]), lo = ri(m[2]);
      for (let r = lo; r <= hi; r++) set.add(rankChar(r) + rankChar(r));
    } else if ((m = t.match(/^([2-9TJQKA])\1$/))) {      // 22
      set.add(m[1] + m[1]);
    } else if ((m = t.match(/^([2-9TJQKA])([2-9TJQKA])([so])\+$/))) { // A9s+ / KTo+
      const hi = ri(m[1]), lo = ri(m[2]);
      for (let r = lo; r < hi; r++) set.add(rankChar(hi) + rankChar(r) + m[3]);
    } else if ((m = t.match(/^([2-9TJQKA])([2-9TJQKA])([so])-([2-9TJQKA])([2-9TJQKA])([so])$/))) { // A5s-A2s
      const hi = ri(m[1]), from = ri(m[5]), to = ri(m[2]);
      for (let r = from; r <= to; r++) set.add(rankChar(hi) + rankChar(r) + m[3]);
    } else if ((m = t.match(/^([2-9TJQKA])([2-9TJQKA])([so])$/))) { // JTs
      set.add(m[1] + m[2] + m[3]);
    } else {
      console.warn('Unparsed range token:', t);
    }
  }
  return set;
}

// Standard-ish 6-max 100bb open-raise (RFI) ranges
const RFI_RANGES = {
  UTG: {
    label: 'UTG (Lojack)',
    desc: 'Tightest open. Big pairs, big aces, strong broadways and the best suited connectors. When 5 players are still behind you, marginal hands bleed money.',
    range: parseRange('55+, A8s+, A5s, A4s, KTs+, QTs+, JTs, T9s, 98s, 87s, 76s, ATo+, KQo'),
  },
  HJ: {
    label: 'Hijack',
    desc: 'One player fewer behind — add the medium suited aces, more suited broadways and middling pairs.',
    range: parseRange('44+, A7s+, A5s-A2s, K9s+, Q9s+, J9s+, T9s, 98s, 87s, ATo+, KJo+, QJo'),
  },
  CO: {
    label: 'Cutoff',
    desc: 'Now you have the button to worry about, but position on the blinds. Open all pairs, all suited aces, most suited connectors and more offsuit broadways.',
    range: parseRange('22+, A2s+, K8s+, Q9s+, J9s+, T8s+, 97s+, 87s, 76s, 65s, A9o+, KTo+, QTo+, JTo'),
  },
  BTN: {
    label: 'Button',
    desc: 'The most profitable seat in poker. You act last on every street, so you can open very wide — over 40% of hands.',
    range: parseRange('22+, A2s+, K2s+, Q5s+, J7s+, T7s+, 96s+, 86s+, 75s+, 65s, 54s, A2o+, K9o+, Q9o+, J9o+, T9o, 98o'),
  },
  SB: {
    label: 'Small blind',
    desc: 'Only the big blind left, but you play the whole hand out of position. Raise-or-fold with a wide but not button-wide range.',
    range: parseRange('22+, A2s+, K4s+, Q6s+, J7s+, T7s+, 97s+, 86s+, 75s+, 65s, 54s, A4o+, K9o+, Q9o+, J9o+, T9o'),
  },
};

const RFI_POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB'];

// All 169 hand codes in grid order
function all169() {
  const out = [];
  for (let i = 0; i < 13; i++)
    for (let j = 0; j < 13; j++) {
      const a = R_ORDER[i], b = R_ORDER[j];
      out.push(i === j ? a + a : (i < j ? a + b + 's' : b + a + 'o'));
    }
  return out;
}
const ALL_HANDS = all169();

// combos represented by a hand code
function comboCount(code) {
  return code.length === 2 ? 6 : (code[2] === 's' ? 4 : 12);
}

function rangePercent(set) {
  let n = 0;
  for (const h of set) n += comboCount(h);
  return (n / 1326) * 100;
}

// Render a 13x13 grid. rangeSet = Set of codes in range; highlight = code to outline (or null)
function renderRangeGrid(el, rangeSet, highlight) {
  let html = '';
  for (let i = 0; i < 13; i++)
    for (let j = 0; j < 13; j++) {
      const code = ALL_HANDS[i * 13 + j];
      const cls = (rangeSet.has(code) ? ' in' : '') + (code === highlight ? ' hl' : '');
      html += `<div class="rg-cell${cls}">${code}</div>`;
    }
  el.innerHTML = html;
}

// Borderline hands: in-range with an out-of-range grid neighbor, or vice versa.
// These are the instructive ones for quizzing.
function borderlineHands(rangeSet) {
  const inGrid = (i, j) => i >= 0 && i < 13 && j >= 0 && j < 13;
  const out = [];
  for (let i = 0; i < 13; i++)
    for (let j = 0; j < 13; j++) {
      const code = ALL_HANDS[i * 13 + j];
      const inR = rangeSet.has(code);
      let border = false;
      for (const [di, dj] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const ni = i + di, nj = j + dj;
        if (inGrid(ni, nj) && rangeSet.has(ALL_HANDS[ni * 13 + nj]) !== inR) { border = true; break; }
      }
      if (border) out.push(code);
    }
  return out;
}
