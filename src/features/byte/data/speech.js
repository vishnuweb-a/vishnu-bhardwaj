// BYTE's vocabulary.
//
// Copy rules from CLAUDE.md section 7 apply here as much as anywhere else: no
// emoji, no placeholder names, no "Elevate"/"Seamless" register. BYTE is a
// small, dry, slightly tired developer's pet. Every line is lower-case and
// under about thirty characters, because the bubble is sized for one short
// sentence and a longer string would either wrap badly or overflow the safe
// area near a viewport edge.

// Section keys are the real section IDs already in the markup. They are read
// from the DOM, never rewritten for BYTE's benefit.
export const SECTION_IDS = [
  'home',
  'work',
  'service',
  'experience',
  'about',
  'contact',
];

export const speech = {
  // Fired once per page load when the hero first resolves.
  welcome: ["hey, i'm byte."],

  // Ambient lines, used sparingly between gestures.
  idle: [
    'still here.',
    'nice scroll.',
    'keep building.',
    'interesting.',
    'more coffee?',
    'oh?',
  ],

  // The cursor came close.
  curious: ['oh?', 'hello.', 'you found me.', 'what are you building?'],

  // Single click or Enter/Space.
  happy: ['hehe', 'boop', 'hi.', 'again.', 'nice click.'],

  // Double click.
  celebrate: ['love attack', 'full send'],

  // Petting - a slow back-and-forth over the body.
  petted: ['mmmm...', 'yes.', 'hehe.'],

  // Picked up and carried.
  dragged: ['whee', 'put me down', 'this is fine'],

  // Sleep and waking.
  sleep: ['zzz', 'five more mins...'],
  wake: ['oh.', "i'm up.", 'hey.'],

  // Per-section reactions, keyed by section id.
  section: {
    home: ['welcome.', 'scroll on.'],
    work: ['things were shipped.', 'this one was fun.', "i've seen these."],
    service: [
      'need something built?',
      'he can build that.',
      'yes, backend too.',
    ],
    experience: ['actual work happened.', 'he leaves the editor sometimes.'],
    about: ["that's the human.", 'apparently he codes a lot.'],
    contact: ['say hi.', "don't be shy."],
  },

  // Footer, in order: the second line only after the first has been used.
  footer: ["that's all.", 'you can scroll up, you know.'],
};

// Rare events. Each is checked against its own probability inside the idle
// gesture tick, so adding one here never makes the others more likely.
//
// `follow` is a second line shown after the first clears, which is the whole
// joke in the outage one - the correction has to land separately.
export const easterEggs = [
  {
    id: 'outage',
    chance: 0.02,
    line: 'production is down.',
    follow: 'kidding.',
  },
  { id: 'semicolon', chance: 0.02, line: "where's the semicolon?" },
  { id: 'spin', chance: 0.02, line: null, gesture: 'spin' },
];

export default speech;
