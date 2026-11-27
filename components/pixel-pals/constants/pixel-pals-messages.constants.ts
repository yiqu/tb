/**
 * What every pet can say in its speech bubbles. Each kind also has its own voice (its sound, its greeting and its own
 * lines) in `PIXEL_PALS_PETS`. In every line, `{name}` is replaced by the pet's name and `{sound}` by its sound.
 */
export const PIXEL_PALS_MESSAGES = {
  /** Two pets meet: the first says the first line, the other answers with the second. */
  conversations: [
    ['Hi there!', 'Hey friend!'],
    ['Nice day!', 'Sure is ☀️'],
    ['Wanna play?', 'Yes!! 🎾'],
    ['❤️', '❤️'],
    ['Snack?', 'Always 🍪'],
    ['Zzz...', 'Shh 🤫'],
    ['Did you see that?', 'See what? 👀'],
    ['Race you!', "You're on! 🏁"],
    ['I like your hat', "I'm not wearing one 🤔"],
    ['Bills are due 🧾', 'Not my problem 😌'],
    ['Got reimbursed?', 'Cha-ching 💰'],
    ['👋', '👋'],
  ] as readonly (readonly [string, string])[],
  /** How a pet answers when another one opens a chat with one of its own lines. */
  chatReplies: ['{sound}!', '{sound} {sound}!', '{sound}? 🤔', 'Haha 😄', 'Same!', 'Tell me more 👀'] as readonly string[],
  /** A single click on a pet, mixed with the pet's own lines. */
  clickReactions: ['👋', '❤️', 'Hi!', '😊', '✨', "I'm {name}!", '{sound}!', '🐾'] as readonly string[],
  bigJump: '❤️❤️❤️',
  zoomies: '⚡ Zoomies!',
  zoomiesDone: '😮‍💨',
  fall: 'Whoa!',
  caughtBall: '🎾 Got it!',
  holdingBall: 'Mine! 🎾',
  missedBall: ['Aww', '😢', 'No fair!', 'Next time!'] as readonly string[],
} as const;
