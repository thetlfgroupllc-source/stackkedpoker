// ---- card primitives ----
// A card is {r, s}: r = 2..14 (14 = ace), s = 0..3 (spade, heart, diamond, club)

const RANK_CHARS = '23456789TJQKA'; // index 0 => rank 2
const SUIT_CHARS = 'shdc';
const SUIT_GLYPHS = ['♠', '♥', '♦', '♣'];
const SUIT_CLASS_COLORS = ['#26201a', '#c04434', '#33619e', '#2c7a50']; // four-color deck, vintage ink

function rankChar(r) { return RANK_CHARS[r - 2]; }
function rankName(r) {
  return { 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace' }[r] || String(r);
}

function makeDeck() {
  const deck = [];
  for (let r = 2; r <= 14; r++)
    for (let s = 0; s < 4; s++) deck.push({ r, s });
  return deck;
}

function parseCard(str) {
  const t = str.trim();
  if (t.length !== 2) return null;
  const r = RANK_CHARS.indexOf(t[0].toUpperCase());
  const s = SUIT_CHARS.indexOf(t[1].toLowerCase());
  if (r < 0 || s < 0) return null;
  return { r: r + 2, s };
}

// Parse a space/comma separated card list like "As Kh" -> array or null on bad input
function parseCards(str) {
  const parts = str.trim().split(/[\s,]+/).filter(Boolean);
  const cards = [];
  for (const p of parts) {
    const c = parseCard(p);
    if (!c) return null;
    cards.push(c);
  }
  return cards;
}

function sameCard(a, b) { return a.r === b.r && a.s === b.s; }

function cardKey(c) { return c.r * 4 + c.s; }

// Draw n distinct random cards from deck (array), excluding `used` (Set of cardKey)
function drawCards(deck, used, n) {
  const out = [];
  while (out.length < n) {
    const c = deck[Math.floor(Math.random() * deck.length)];
    const k = cardKey(c);
    if (used.has(k)) continue;
    used.add(k);
    out.push(c);
  }
  return out;
}

function cardHTML(c, small) {
  const color = SUIT_CLASS_COLORS[c.s];
  return `<div class="playing-card${small ? ' sm' : ''}" style="color:${color}">
    <span class="pc-rank">${rankChar(c.r)}</span><span class="pc-suit">${SUIT_GLYPHS[c.s]}</span>
  </div>`;
}

// 169-hand code like "AKs", "T9o", "QQ" from two cards
function handCode(a, b) {
  const hi = a.r >= b.r ? a : b;
  const lo = a.r >= b.r ? b : a;
  if (hi.r === lo.r) return rankChar(hi.r) + rankChar(lo.r);
  return rankChar(hi.r) + rankChar(lo.r) + (hi.s === lo.s ? 's' : 'o');
}

// Deal a random concrete combo for a hand code like "AKs" / "T9o" / "QQ".
// Pass a seeded rng for reproducible deals (daily challenge).
function comboFromCode(code, rng = Math.random) {
  const r1 = RANK_CHARS.indexOf(code[0]) + 2;
  const r2 = RANK_CHARS.indexOf(code[1]) + 2;
  if (r1 === r2) {
    const s = shuffledSuits(rng);
    return [{ r: r1, s: s[0] }, { r: r2, s: s[1] }];
  }
  const suited = code[2] === 's';
  const s = shuffledSuits(rng);
  return suited
    ? [{ r: r1, s: s[0] }, { r: r2, s: s[0] }]
    : [{ r: r1, s: s[0] }, { r: r2, s: s[1] }];
}

function shuffledSuits(rng = Math.random) {
  const s = [0, 1, 2, 3];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}
