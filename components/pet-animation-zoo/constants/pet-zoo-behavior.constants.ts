/**
 * Timing and physics of the simulation. Distances are px, times are seconds, speeds are px per second.
 * Ranges are `[min, max]`, every pet draws its own value so they never move in sync.
 */

export type PetZooRange = readonly [number, number];

export const PET_ZOO_BEHAVIOR_DURATION = {
  idle: [1.5, 4],
  lie: [3, 7],
  stand: [2, 4],
  walk: [2, 5],
  run: [1.2, 3],
  wallHang: [1, 3],
  land: [0.25, 0.25],
  swipe: [0.7, 0.7],
  withBall: [3, 4],
  zoomies: [3, 3],
  approachFriend: [8, 8],
  talk: [5.2, 5.2],
  fly: [3, 7],
  eat: [1.6, 1.6],
} as const satisfies Record<string, PetZooRange>;

/** How likely each next behavior is once a pet finishes what it was doing. Lie and stand only apply when the pet has that sprite. */
export const PET_ZOO_NEXT_BEHAVIOR_WEIGHTS = {
  walk: 0.38,
  run: 0.16,
  idle: 0.26,
  lie: 0.1,
  stand: 0.1,
  /** Only pets that can fly, and only when the zoo is tall enough. */
  fly: 0.3,
} as const;

/** Each pet moves at its speed times a random factor in this range. */
export const PET_ZOO_SPEED_FACTOR_RANGE: PetZooRange = [0.75, 1.25];
export const PET_ZOO_RUN_SPEED_MULTIPLIER = 1.6;
export const PET_ZOO_CHASE_SPEED_MULTIPLIER = 1.9;
export const PET_ZOO_ZOOMIES_SPEED_MULTIPLIER = 2.4;

export const PET_ZOO_GRAVITY = 700;
/** Little hops while walking or running. */
export const PET_ZOO_HOP_CHANCE_PER_SECOND = 0.18;
export const PET_ZOO_HOP_VELOCITY = 120;
/** The jump on the third quick click. */
export const PET_ZOO_BIG_JUMP_VELOCITY = 240;

/** A pet flies at its walking speed times this. */
export const PET_ZOO_FLY_SPEED_MULTIPLIER = 2.5;
/** No flying around when the free height above the ground is less than this many sprite sizes. */
export const PET_ZOO_MIN_FLY_HEIGHT_IN_SPRITES = 1;

/** Chance that a pet walking into a wall climbs it instead of turning around. */
export const PET_ZOO_CLIMB_CHANCE = 0.4;
export const PET_ZOO_CLIMB_SPEED = 14;
/** How far up the free height a climb goes. */
export const PET_ZOO_CLIMB_HEIGHT_FACTOR_RANGE: PetZooRange = [0.35, 0.9];
/** No climbing when the free height above the ground is less than this many sprite sizes. */
export const PET_ZOO_MIN_CLIMB_HEIGHT_IN_SPRITES = 1.5;

/** On the lake: chance that a pet walking to the end of its stone hops to the next one instead of turning around. */
export const PET_ZOO_SKIP_CHANCE = 0.6;
export const PET_ZOO_ZOOMIES_SKIP_CHANCE = 0.85;
/** The slowest take-off of a hop between stones, so even a short hop has an arc. */
export const PET_ZOO_SKIP_MIN_VELOCITY = 110;
/** How far onto the next stone a hop lands. */
export const PET_ZOO_SKIP_LANDING_INSET_PX = 6;
/** On the lake, a pet can reach this much further for a ball floating next to its stone. */
export const PET_ZOO_ISLAND_CATCH_REACH_PX = 6;

/** Seconds between two pets starting a conversation. */
export const PET_ZOO_CONVERSATION_INTERVAL: PetZooRange = [9, 22];
export const PET_ZOO_CONVERSATION_LINE_SECONDS = 2.4;
/** Pets talk once they are this close, in sprite sizes. */
export const PET_ZOO_CONVERSATION_DISTANCE_IN_SPRITES = 1.1;

export const PET_ZOO_BUBBLE_SECONDS = 2.2;

/** Clicks less than this far apart count as one streak. */
export const PET_ZOO_CLICK_STREAK_SECONDS = 1.2;
export const PET_ZOO_CLICKS_FOR_BIG_JUMP = 3;
export const PET_ZOO_CLICKS_FOR_ZOOMIES = 5;

export const PET_ZOO_BALL_THROW_SPEED_RANGE: PetZooRange = [60, 150];
export const PET_ZOO_BALL_BOUNCE_DAMPING = 0.7;
export const PET_ZOO_BALL_WALL_DAMPING = 0.9;
/** How fast a ball rolling on the ground slows down, per second. */
export const PET_ZOO_BALL_ROLL_FRICTION = 1.4;
/** A ball floating in the water drifts to the nearest stone at this speed. */
export const PET_ZOO_BALL_DRIFT_SPEED = 10;
/** A ball nobody catches disappears after this long. */
export const PET_ZOO_BALL_LIFETIME_SECONDS = 12;

/** The longest frame the simulation steps at once, so a background tab does not teleport the pets. */
export const PET_ZOO_MAX_FRAME_SECONDS = 0.1;
