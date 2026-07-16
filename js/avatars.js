// ---- Avatars: sixteen hand-drawn regulars of the Stackked card room ----
// Every one of these is hand-built SVG — no icon fonts, no stock art.
// A player unlocks them by climbing the rank ladder (see meta.js).

const AVATARS = [
  {
    id: 'blinky', name: 'Blinky', rank: 1,
    bio: 'Swims straight into every raise. Calls it "exploring the pool."',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#0f2f24"/>
      <path d="M46 32 L59 21 Q54 32 59 43 Z" fill="#e0762c" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="30" cy="34" rx="18" ry="13" fill="#f08c3a" stroke="#221a10" stroke-width="2"/>
      <path d="M28 22 Q33 14 40 21 L34 26 Z" fill="#e0762c" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M26 40 Q31 47 38 41 L33 37 Z" fill="#e0762c" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="23" cy="32" r="6" fill="#fff8e7" stroke="#221a10" stroke-width="2"/>
      <circle cx="22" cy="33" r="2.6" fill="#221a10"/>
      <path d="M14 38 Q17 41 21 40" fill="none" stroke="#221a10" stroke-width="2" stroke-linecap="round"/>
      <path d="M11 27 Q28 10 47 25 L45 20 Q28 4 12 21 Z" fill="#2f9e5f" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="52" cy="14" r="3" fill="none" stroke="#bfe8d4" stroke-width="2"/>
      <circle cx="57" cy="8" r="2" fill="none" stroke="#bfe8d4" stroke-width="1.6"/>
    `,
  },
  {
    id: 'donk', name: 'Donk', rank: 1,
    bio: 'Leads into the raiser with bottom pair. Proud of it.',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#33261b"/>
      <path d="M13 24 Q4 8 14 5 Q22 4 22 21 Z" fill="#9b8d80" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M51 24 Q60 8 50 5 Q42 4 42 21 Z" fill="#9b8d80" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="32" cy="36" rx="17" ry="16" fill="#b1a396" stroke="#221a10" stroke-width="2"/>
      <ellipse cx="32" cy="45" rx="11" ry="8" fill="#d8cdc1" stroke="#221a10" stroke-width="2"/>
      <rect x="27.5" y="41" width="4" height="6" rx="1" fill="#fff8e7" stroke="#221a10" stroke-width="1.6"/>
      <rect x="32.5" y="41" width="4" height="6" rx="1" fill="#fff8e7" stroke="#221a10" stroke-width="1.6"/>
      <circle cx="27" cy="47" r="1.4" fill="#221a10"/>
      <circle cx="37" cy="47" r="1.4" fill="#221a10"/>
      <circle cx="25" cy="31" r="4.5" fill="#fff8e7" stroke="#221a10" stroke-width="2"/>
      <circle cx="39" cy="31" r="4.5" fill="#fff8e7" stroke="#221a10" stroke-width="2"/>
      <circle cx="26" cy="32" r="2" fill="#221a10"/>
      <circle cx="38" cy="32" r="2" fill="#221a10"/>
      <path d="M18 24 Q32 14 46 24 L46 18 Q32 10 18 18 Z" fill="#c4573b" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M44 21 L56 19 L55 24 L44 24 Z" fill="#c4573b" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'ringring', name: 'Ring-Ring', rank: 1,
    bio: "Has never folded. Physically cannot. It's a phone.",
    svg: `
      <circle cx="32" cy="32" r="30" fill="#1d2836"/>
      <path d="M14 26 Q14 18 22 18 L42 18 Q50 18 50 26 L50 44 Q50 50 44 50 L20 50 Q14 50 14 44 Z" fill="#c4573b" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M12 17 Q12 11 18 11 L21 11 L21 19 L14 21 Z" fill="#a8442c" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M52 17 Q52 11 46 11 L43 11 L43 19 L50 21 Z" fill="#a8442c" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M20 14 Q32 8 44 14" fill="none" stroke="#221a10" stroke-width="3" stroke-linecap="round"/>
      <circle cx="25" cy="30" r="4.5" fill="#fff8e7" stroke="#221a10" stroke-width="2"/>
      <circle cx="39" cy="30" r="4.5" fill="#fff8e7" stroke="#221a10" stroke-width="2"/>
      <circle cx="26" cy="31" r="2" fill="#221a10"/>
      <circle cx="40" cy="31" r="2" fill="#221a10"/>
      <circle cx="32" cy="42" r="6.5" fill="#f3ecd8" stroke="#221a10" stroke-width="2"/>
      <circle cx="32" cy="39" r="1.2" fill="#221a10"/>
      <circle cx="35" cy="41" r="1.2" fill="#221a10"/>
      <circle cx="29" cy="41" r="1.2" fill="#221a10"/>
      <circle cx="32" cy="44.5" r="1.2" fill="#221a10"/>
      <path d="M53 30 Q57 32 53 34" fill="none" stroke="#f3ecd8" stroke-width="2" stroke-linecap="round"/>
      <path d="M56 27 Q62 32 56 37" fill="none" stroke="#f3ecd8" stroke-width="2" stroke-linecap="round"/>
    `,
  },
  {
    id: 'coocoo', name: 'Coo-Coo', rank: 1,
    bio: 'Pecks the Call button. Sometimes twice.',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#2a2233"/>
      <ellipse cx="32" cy="52" rx="13" ry="5" fill="#c4573b" stroke="#221a10" stroke-width="2"/>
      <ellipse cx="32" cy="49" rx="13" ry="5" fill="#e0644b" stroke="#221a10" stroke-width="2"/>
      <ellipse cx="32" cy="36" rx="14" ry="15" fill="#8f96a3" stroke="#221a10" stroke-width="2"/>
      <path d="M22 40 Q32 48 42 40 Q40 47 32 47 Q24 47 22 40 Z" fill="#3d8f8a" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="32" cy="22" r="11" fill="#a7adb8" stroke="#221a10" stroke-width="2"/>
      <path d="M30 26 L34 26 L32 31 Z" fill="#e8a33d" stroke="#221a10" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M20 19 L44 19 L44 23 Q39 26 36 22 L28 22 Q25 26 20 23 Z" fill="#221a10"/>
      <path d="M21 20 L31 20 L30 23 Q26 25 23 22 Z" fill="#5a6472"/>
      <path d="M35 20 L43 20 L42 23 Q38 25 36 22 Z" fill="#5a6472"/>
      <path d="M27 51 L27 55 M31 51 L31 56 M36 51 L36 55" stroke="#e8a33d" stroke-width="2" stroke-linecap="round"/>
    `,
  },
  {
    id: 'bandit', name: 'The Bandit', rank: 2,
    bio: 'Not stealing blinds. "Redistributing" them.',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#20301f"/>
      <ellipse cx="32" cy="28" rx="16" ry="14" fill="#9b9b93" stroke="#221a10" stroke-width="2"/>
      <path d="M17 20 L24 12 L27 20 Z" fill="#7c7c74" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M47 20 L40 12 L37 20 Z" fill="#7c7c74" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M16 26 Q24 20 32 24 Q40 20 48 26 Q46 34 38 32 Q34 30 32 30 Q30 30 26 32 Q18 34 16 26 Z" fill="#33302b" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="25" cy="27" r="3" fill="#fff8e7"/>
      <circle cx="39" cy="27" r="3" fill="#fff8e7"/>
      <circle cx="25.5" cy="27.5" r="1.5" fill="#221a10"/>
      <circle cx="38.5" cy="27.5" r="1.5" fill="#221a10"/>
      <ellipse cx="32" cy="37" rx="7" ry="5" fill="#d8cdc1" stroke="#221a10" stroke-width="2"/>
      <circle cx="32" cy="35" r="1.8" fill="#221a10"/>
      <rect x="10" y="44" width="44" height="10" rx="3" fill="#4a3421" stroke="#221a10" stroke-width="2"/>
      <path d="M21 45 Q21 40 26 40 Q30 40 30 45" fill="#9b9b93" stroke="#221a10" stroke-width="2"/>
      <circle cx="42" cy="42" r="6" fill="#c4573b" stroke="#221a10" stroke-width="2"/>
      <circle cx="42" cy="42" r="3.4" fill="none" stroke="#f3ecd8" stroke-width="1.6" stroke-dasharray="2.4 2.4"/>
    `,
  },
  {
    id: 'pete', name: 'Cactus Pete', rank: 3,
    bio: 'Plays tight. Extremely tight. Nobody hugs him either way.',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#3a2d20"/>
      <rect x="25" y="20" width="14" height="32" rx="7" fill="#4f9e56" stroke="#221a10" stroke-width="2"/>
      <path d="M25 34 Q14 34 15 24 Q19 24 21 28 Q24 30 25 30 Z" fill="#4f9e56" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M39 38 Q50 38 49 28 Q45 28 43 32 Q40 34 39 34 Z" fill="#4f9e56" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M28 24 L28 27 M36 24 L36 27 M27 42 L29 44 M37 42 L35 44" stroke="#2c6b36" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="29" cy="31" r="2" fill="#221a10"/>
      <circle cx="35" cy="31" r="2" fill="#221a10"/>
      <path d="M26 36 Q28 34 30 36 Q32 38 34 36 Q36 34 38 36" fill="none" stroke="#221a10" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="32" cy="17" rx="15" ry="4" fill="#c9a35a" stroke="#221a10" stroke-width="2"/>
      <path d="M24 17 Q24 8 32 8 Q40 8 40 17 Q36 19 32 19 Q28 19 24 17 Z" fill="#c9a35a" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M24 14 Q32 17 40 14" fill="none" stroke="#8a6a33" stroke-width="2"/>
      <path d="M22 52 Q22 48 26 48 L38 48 Q42 48 42 52 L41 56 L23 56 Z" fill="#b3593c" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'toasty', name: 'Toasty', rank: 4,
    bio: 'Grinds daily. Slightly burnt out.',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#2b1e2e"/>
      <path d="M15 26 Q15 12 25 14 Q29 8 35 11 Q42 8 45 15 Q52 16 49 27 L49 48 Q49 52 45 52 L19 52 Q15 52 15 48 Z" fill="#e2b56b" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M19 30 Q19 22 26 22 Q30 18 34 21 Q40 19 42 24 Q46 26 45 31 L45 46 Q45 48 43 48 L21 48 Q19 48 19 46 Z" fill="#f0d9a8"/>
      <path d="M17 24 L47 24 L47 29 L17 29 Z" fill="#c4573b" stroke="#221a10" stroke-width="2"/>
      <circle cx="26" cy="36" r="2.2" fill="#221a10"/>
      <circle cx="38" cy="36" r="2.2" fill="#221a10"/>
      <path d="M23 33 L28 32 M41 33 L36 32" stroke="#221a10" stroke-width="2" stroke-linecap="round"/>
      <path d="M27 44 L37 44" stroke="#221a10" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M27 44 L29 42 M31 44 L33 42 M35 44 L37 42" stroke="#221a10" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M50 34 Q54 37 51 41 Q49 38 50 34 Z" fill="#7fb8d8" stroke="#221a10" stroke-width="1.6" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'octavia', name: 'Octavia', rank: 5,
    bio: 'Eight tables. Eight arms. Zero excuses.',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#14313a"/>
      <path d="M14 34 Q14 14 32 14 Q50 14 50 34 L50 42 L14 42 Z" fill="#8d6bb0" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M14 42 Q11 50 16 52 Q18 46 20 42 Z" fill="#8d6bb0" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M22 42 Q21 52 26 54 Q27 47 28 42 Z" fill="#7a58a0" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M30 42 Q30 54 36 54 Q35 47 36 42 Z" fill="#8d6bb0" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M38 42 Q39 53 44 52 Q42 46 43 42 Z" fill="#7a58a0" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M44 42 Q48 50 52 47 Q48 44 48 42 Z" fill="#8d6bb0" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M13 26 Q32 12 51 26 L51 20 Q32 6 13 20 Z" fill="#2f9e5f" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="26" cy="32" r="4.5" fill="#fff8e7" stroke="#221a10" stroke-width="2"/>
      <circle cx="38" cy="32" r="4.5" fill="#fff8e7" stroke="#221a10" stroke-width="2"/>
      <circle cx="27" cy="33" r="2" fill="#221a10"/>
      <circle cx="37" cy="33" r="2" fill="#221a10"/>
      <rect x="6" y="40" width="9" height="13" rx="2" fill="#f3ecd8" stroke="#221a10" stroke-width="1.8" transform="rotate(-12 10 46)"/>
      <rect x="49" y="40" width="9" height="13" rx="2" fill="#f3ecd8" stroke="#221a10" stroke-width="1.8" transform="rotate(12 54 46)"/>
      <text x="10.5" y="49" font-size="7" font-weight="bold" fill="#c4573b" transform="rotate(-12 10 46)">A</text>
      <text x="51.5" y="49" font-size="7" font-weight="bold" fill="#221a10" transform="rotate(12 54 46)">A</text>
    `,
  },
  {
    id: 'chompers', name: 'Chompers', rank: 6,
    bio: 'Smells a limp from three tables away.',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#152840"/>
      <path d="M32 6 L38 16 L28 16 Z" fill="#5f7d95" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M14 30 Q14 14 32 14 Q50 14 50 30 Q50 42 32 42 Q14 42 14 30 Z" fill="#7391a8" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M17 33 Q32 45 47 33 Q46 40 32 40 Q18 40 17 33 Z" fill="#d8cdc1" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M21 35 L23 39 L25 35.6 L27 40 L29 36 L31 40.5 L33 36 L35 40 L37 35.6 L39 39 L41 35" fill="none" stroke="#221a10" stroke-width="1.6" stroke-linejoin="round"/>
      <rect x="34.5" y="36" width="3.4" height="4" fill="#e8b53d" stroke="#221a10" stroke-width="1"/>
      <circle cx="24" cy="26" r="2.4" fill="#221a10"/>
      <circle cx="40" cy="26" r="2.4" fill="#221a10"/>
      <path d="M20 22 L27 24 M44 22 L37 24" stroke="#221a10" stroke-width="2" stroke-linecap="round"/>
      <path d="M18 44 L26 48 L32 44 L38 48 L46 44 L46 54 L18 54 Z" fill="#33302b" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M30 46 L32 44 L34 46 L33 54 L31 54 Z" fill="#c4573b" stroke="#221a10" stroke-width="1.6" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'professor', name: 'The Professor', rank: 7,
    bio: 'Has a 400-page range binder. Laminated.',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#2e2417"/>
      <path d="M18 14 L26 20 L22 24 Z" fill="#8a6a33" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M46 14 L38 20 L42 24 Z" fill="#8a6a33" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="32" cy="34" rx="17" ry="17" fill="#a5814b" stroke="#221a10" stroke-width="2"/>
      <path d="M32 20 Q22 20 20 30 Q26 26 32 27 Q38 26 44 30 Q42 20 32 20 Z" fill="#8a6a33" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="25" cy="33" r="6.5" fill="#f0e6cd" stroke="#221a10" stroke-width="2.4"/>
      <circle cx="39" cy="33" r="6.5" fill="#f0e6cd" stroke="#221a10" stroke-width="2.4"/>
      <path d="M31.5 33 L32.5 33" stroke="#221a10" stroke-width="2.4"/>
      <circle cx="25.5" cy="34" r="2.4" fill="#221a10"/>
      <circle cx="38.5" cy="34" r="2.4" fill="#221a10"/>
      <path d="M29 42 L32 45 L35 42 Q34 40 32 40 Q30 40 29 42 Z" fill="#e8a33d" stroke="#221a10" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M26 50 L32 46 L38 50 L32 54 Z" fill="#3d8f8a" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'dotty', name: 'Dotty', rank: 8,
    bio: 'Runs pure. Refuses to hear about variance.',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#243318"/>
      <path d="M24 14 Q18 6 14 9 Q17 13 22 17 Z" fill="#221a10"/>
      <path d="M40 14 Q46 6 50 9 Q47 13 42 17 Z" fill="#221a10"/>
      <circle cx="14" cy="8" r="2.6" fill="#c4573b" stroke="#221a10" stroke-width="1.6"/>
      <circle cx="50" cy="8" r="2.6" fill="#c4573b" stroke="#221a10" stroke-width="1.6"/>
      <path d="M14 34 Q14 16 32 16 Q50 16 50 34 Q50 52 32 52 Q14 52 14 34 Z" fill="#cf4938" stroke="#221a10" stroke-width="2"/>
      <path d="M32 16 L32 52" stroke="#221a10" stroke-width="2"/>
      <circle cx="23" cy="27" r="2.8" fill="#221a10"/>
      <circle cx="23" cy="41" r="2.8" fill="#221a10"/>
      <circle cx="41" cy="24" r="2.8" fill="#221a10"/>
      <circle cx="41" cy="34" r="2.8" fill="#221a10"/>
      <circle cx="41" cy="44" r="2.8" fill="#221a10"/>
      <circle cx="27" cy="34" r="4" fill="#fff8e7" stroke="#221a10" stroke-width="1.8"/>
      <circle cx="37" cy="34" r="4" fill="#fff8e7" stroke="#221a10" stroke-width="1.8"/>
      <circle cx="28" cy="34.6" r="1.7" fill="#221a10"/>
      <circle cx="36" cy="34.6" r="1.7" fill="#221a10"/>
      <path d="M29 42 Q32 45 35 42" fill="none" stroke="#221a10" stroke-width="2" stroke-linecap="round"/>
    `,
  },
  {
    id: 'kettle', name: 'Full Tilt', rank: 9,
    bio: 'One bad beat from boiling over. Okay, zero bad beats.',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#3c2020"/>
      <g transform="rotate(14 32 38)">
        <path d="M16 30 Q16 22 24 22 L40 22 Q48 22 48 30 L48 44 Q48 52 40 52 L24 52 Q16 52 16 44 Z" fill="#7fa3b8" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
        <path d="M48 30 Q58 30 56 40 Q54 46 48 44 Z" fill="#7fa3b8" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
        <path d="M16 34 Q8 30 10 24 Q14 24 17 28 Z" fill="#7fa3b8" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
        <rect x="27" y="16" width="10" height="7" rx="2" fill="#5f8398" stroke="#221a10" stroke-width="2"/>
        <circle cx="32" cy="14" r="3.4" fill="#c4573b" stroke="#221a10" stroke-width="2"/>
        <path d="M22 33 L29 36 M42 33 L35 36" stroke="#221a10" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="26" cy="38" r="2" fill="#221a10"/>
        <circle cx="38" cy="38" r="2" fill="#221a10"/>
        <path d="M27 46 Q32 43 37 46" fill="none" stroke="#221a10" stroke-width="2" stroke-linecap="round"/>
      </g>
      <path d="M50 12 Q47 15 50 18 Q53 21 50 24" fill="none" stroke="#e8e2d0" stroke-width="2" stroke-linecap="round"/>
      <path d="M56 10 Q53 13 56 16 Q59 19 56 22" fill="none" stroke="#e8e2d0" stroke-width="2" stroke-linecap="round"/>
    `,
  },
  {
    id: 'rusty', name: 'Rusty the Solver', rank: 10,
    bio: 'Solved poker in 1987. Still waiting for a good spot.',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#1c2b2e"/>
      <line x1="32" y1="6" x2="32" y2="14" stroke="#221a10" stroke-width="2.4"/>
      <path d="M32 4 L34.4 8.4 L32 7.4 L29.6 8.4 Z" fill="#c4573b" stroke="#221a10" stroke-width="1.4" stroke-linejoin="round"/>
      <rect x="14" y="14" width="36" height="30" rx="6" fill="#8f9b8f" stroke="#221a10" stroke-width="2"/>
      <rect x="19" y="20" width="26" height="12" rx="3" fill="#22302a" stroke="#221a10" stroke-width="2"/>
      <circle cx="27" cy="26" r="2.6" fill="#7fe0a8"/>
      <circle cx="37" cy="26" r="2.6" fill="#7fe0a8"/>
      <path d="M24 38 L40 38" stroke="#221a10" stroke-width="2.6" stroke-linecap="round"/>
      <rect x="27" y="36.6" width="7" height="9" rx="1" fill="#f3ecd8" stroke="#221a10" stroke-width="1.6" transform="rotate(6 30 41)"/>
      <text x="29" y="43.5" font-size="5.5" font-weight="bold" fill="#c4573b" transform="rotate(6 30 41)">K</text>
      <rect x="10" y="24" width="4" height="10" rx="2" fill="#6e7a6e" stroke="#221a10" stroke-width="1.8"/>
      <rect x="50" y="24" width="4" height="10" rx="2" fill="#6e7a6e" stroke="#221a10" stroke-width="1.8"/>
      <rect x="20" y="44" width="24" height="10" rx="3" fill="#6e7a6e" stroke="#221a10" stroke-width="2"/>
      <circle cx="26" cy="49" r="1.6" fill="#e8a33d"/>
      <circle cx="32" cy="49" r="1.6" fill="#c4573b"/>
      <circle cx="38" cy="49" r="1.6" fill="#7fe0a8"/>
    `,
  },
  {
    id: 'sheets', name: 'Sheets', rank: 11,
    bio: 'Died on the bubble. Stayed for the cash game.',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#1f1f2e"/>
      <path d="M16 30 Q16 12 32 12 Q48 12 48 30 L48 50 L43 45 L38 51 L32 45 L26 51 L21 45 L16 50 Z" fill="#e8e2d0" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="26" cy="28" r="3" fill="#221a10"/>
      <circle cx="38" cy="28" r="3" fill="#221a10"/>
      <ellipse cx="32" cy="37" rx="3.4" ry="4.6" fill="#221a10"/>
      <path d="M20 22 Q23 19 26 21 M44 22 Q41 19 38 21" fill="none" stroke="#221a10" stroke-width="1.8" stroke-linecap="round"/>
      <rect x="6" y="34" width="11" height="15" rx="2" fill="#f3ecd8" stroke="#221a10" stroke-width="1.8" transform="rotate(-14 11 41)"/>
      <text x="8.5" y="43" font-size="8" font-weight="bold" fill="#221a10" transform="rotate(-14 11 41)">A</text>
      <rect x="47" y="34" width="11" height="15" rx="2" fill="#f3ecd8" stroke="#221a10" stroke-width="1.8" transform="rotate(14 53 41)"/>
      <text x="49.5" y="43" font-size="8" font-weight="bold" fill="#c4573b" transform="rotate(14 53 41)">A</text>
    `,
  },
  {
    id: 'moby', name: 'Moby', rank: 12,
    bio: "Loses a fortune nightly. The game's real winner.",
    svg: `
      <circle cx="32" cy="32" r="30" fill="#122b3d"/>
      <path d="M8 38 Q8 22 30 22 Q52 22 54 36 Q55 44 46 46 L14 46 Q8 46 8 38 Z" fill="#4a7fa5" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M54 38 L61 32 Q60 40 61 46 L53 42 Z" fill="#4a7fa5" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M8 40 Q20 36 30 40 L30 46 L14 46 Q9 46 8 40 Z" fill="#b8d3e3"/>
      <circle cx="20" cy="32" r="5.5" fill="#f0e6cd" stroke="#221a10" stroke-width="2.4"/>
      <circle cx="20.5" cy="33" r="2.2" fill="#221a10"/>
      <path d="M20 37.5 L20 41" stroke="#221a10" stroke-width="1.6"/>
      <path d="M13 44 Q17 47 22 44" fill="none" stroke="#221a10" stroke-width="2" stroke-linecap="round"/>
      <path d="M26 22 L26 12 L40 12 L40 22" fill="#33302b" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <rect x="23" y="19" width="20" height="5" rx="2" fill="#33302b" stroke="#221a10" stroke-width="2"/>
      <rect x="26" y="15" width="14" height="3" fill="#c4573b"/>
      <path d="M46 14 Q49 10 52 14 M44 18 Q49 12 54 18" fill="none" stroke="#b8d3e3" stroke-width="2" stroke-linecap="round"/>
      <circle cx="56" cy="10" r="3.6" fill="#e8a33d" stroke="#221a10" stroke-width="1.8"/>
      <circle cx="56" cy="10" r="1.8" fill="none" stroke="#221a10" stroke-width="0.9" stroke-dasharray="1.4 1.4"/>
    `,
  },
  {
    id: 'gruff', name: 'The G.O.A.T.', rank: 13,
    bio: 'The Greatest Of All Time, per the goat.',
    svg: `
      <circle cx="32" cy="32" r="30" fill="#33280f"/>
      <path d="M18 20 Q8 16 8 8 Q16 10 20 16 Z" fill="#d8cdc1" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M46 20 Q56 16 56 8 Q48 10 44 16 Z" fill="#d8cdc1" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="32" cy="34" rx="16" ry="17" fill="#e8e2d0" stroke="#221a10" stroke-width="2"/>
      <path d="M14 24 L20 14 L26 24 Z" fill="#c9c2b0" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M50 24 L44 14 L38 24 Z" fill="#c9c2b0" stroke="#221a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M24 10 L27 15 L32 11 L37 15 L40 10 L40 17 L24 17 Z" fill="#e8a33d" stroke="#221a10" stroke-width="1.8" stroke-linejoin="round"/>
      <circle cx="26" cy="30" r="2.2" fill="#221a10"/>
      <circle cx="38" cy="30" r="2.2" fill="#221a10"/>
      <ellipse cx="32" cy="40" rx="8" ry="7" fill="#d8cdc1" stroke="#221a10" stroke-width="2"/>
      <circle cx="29" cy="39" r="1.4" fill="#221a10"/>
      <circle cx="35" cy="39" r="1.4" fill="#221a10"/>
      <path d="M32 42 Q32 48 28 52 Q32 51 33 48 Q34 51 36 52 Q33 48 33 44" fill="#d8cdc1" stroke="#221a10" stroke-width="1.8" stroke-linejoin="round"/>
      <rect x="36" y="42" width="8" height="11" rx="1.5" fill="#f3ecd8" stroke="#221a10" stroke-width="1.8" transform="rotate(18 40 47)"/>
      <text x="38" y="49" font-size="6" font-weight="bold" fill="#221a10" transform="rotate(18 40 47)">A</text>
    `,
  },
];

const AVATAR_BY_ID = Object.fromEntries(AVATARS.map(a => [a.id, a]));

// Fallback face for unknown avatar ids (old share codes, tampered data):
// a plain card back, the mark of the unidentified reg.
const AVATAR_CARDBACK = `
  <circle cx="32" cy="32" r="30" fill="#26221c"/>
  <rect x="20" y="14" width="24" height="36" rx="4" fill="#f3ecd8" stroke="#221a10" stroke-width="2"/>
  <rect x="24" y="18" width="16" height="28" rx="2" fill="#c4573b"/>
  <path d="M24 18 L40 46 M40 18 L24 46" stroke="#f3ecd8" stroke-width="1.4"/>
  <circle cx="32" cy="32" r="4" fill="#f3ecd8"/>
`;

// Render an avatar as an inline SVG string. `cls` lands on the svg element.
function avatarSVG(id, cls) {
  const a = AVATAR_BY_ID[id];
  return `<svg class="${cls || ''}" viewBox="0 0 64 64" aria-hidden="true">${a ? a.svg : AVATAR_CARDBACK}</svg>`;
}
