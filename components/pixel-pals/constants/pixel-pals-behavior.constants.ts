/**
 * PIXEL PALS TUNING: the one place to adjust how the pets talk, move and play.
 *
 * Units: distances are px, times are seconds, speeds are px per second, chances are 0 to 1 (0 = never, 1 = always).
 * A range is `[min, max]`: each time, a value is picked at random in it, so the pets never move in sync.
 *
 * Sections in this file:
 *   1. Talking
 *   2. Moving speed
 *   3. What a pet does next, and for how long
 *   4. Hops, jumps and gravity
 *   5. Climbing walls
 *   6. Flying
 *   7. Stepping stones (Autumn lake theme)
 *   8. Clicking a pet
 *   9. Ball, and catching things
 *  10. Food
 *  11. Frame loop
 *  12. Weather particles (snow, leaves, debris, rain, fog)
 *
 * Tuned somewhere else:
 *   - each kind's own walking speed (`speed`) and size (`sizeScale`): its entry in `pixel-pals-pets.constants.ts`
 *   - the base sprite size, the height of Pixel Pals, how many pets can be out: `pixel-pals.constants.ts`
 *   - what pets say: `pixel-pals-messages.constants.ts`, and each pet's `voice` in `pixel-pals-pets.constants.ts`
 */

export type PixelPalsRange = readonly [number, number];

/* ================================================================================================================== */
/* 1. TALKING                                                                                                         */
/* ================================================================================================================== */

/**
 * How often two pets start a conversation on their own: the seconds from one conversation to the next, picked at
 * random in this range each time. Higher numbers = they talk less often. A conversation only starts when two pets are
 * free (not chasing a ball, eating, climbing...), so the real gap can be longer.
 */
export const PIXEL_PALS_CONVERSATION_INTERVAL: PixelPalsRange = [25, 50];
/** How long each of the two lines of a conversation stays on screen. */
export const PIXEL_PALS_CONVERSATION_LINE_SECONDS = 2.4;
/** The pause between the first line going away and the answer showing. */
export const PIXEL_PALS_CONVERSATION_REPLY_GAP_SECONDS = 0.2;
/** How long two pets stand together to talk: both lines, the pause, and a moment after. Follows the two above. */
export const PIXEL_PALS_CONVERSATION_SECONDS: number =
  PIXEL_PALS_CONVERSATION_LINE_SECONDS * 2 + PIXEL_PALS_CONVERSATION_REPLY_GAP_SECONDS + 0.2;
/** How close two pets stand to talk, in sprite sizes (1 = one pet wide, middle to middle). */
export const PIXEL_PALS_CONVERSATION_DISTANCE_IN_SPRITES = 1.1;
/** A pet walks over to a friend only if it can get there within this many seconds, so a slow pet picks one nearby. */
export const PIXEL_PALS_APPROACH_FRIEND_MAX_SECONDS = 25;
/** Extra seconds the walk to a friend may take, for the hops between stones on the lake. */
export const PIXEL_PALS_APPROACH_FRIEND_MARGIN_SECONDS = 3;
/** How much longer than the walk the friend waits before it gives up and goes back to what it was doing. */
export const PIXEL_PALS_WAIT_FOR_FRIEND_EXTRA_SECONDS = 1;
/** How long every other speech bubble stays on screen: click lines, greetings, "Yum!", ball lines. */
export const PIXEL_PALS_BUBBLE_SECONDS = 2.2;
/**
 * Chance a pet says one of its own lines (`voice.lines` in the pet list) instead of a shared one, when it is clicked or
 * opens a conversation. 1 = always its own lines, 0 = always shared ones.
 */
export const PIXEL_PALS_OWN_LINE_CHANCE = 0.5;
/** Chance each pet that lost the race to a ball says something about it. 0 = they stay quiet. */
export const PIXEL_PALS_MISSED_BALL_LINE_CHANCE = 0.5;

/* ================================================================================================================== */
/* 2. MOVING SPEED                                                                                                    */
/* ================================================================================================================== */

/**
 * Speeds up or slows down every pet at once: walking, running, chasing, zoomies, flying and climbing. 1 = as set,
 * 0.5 = half speed, 2 = twice as fast. To change one kind of pet only, change its `speed` in the pet list.
 */
export const PIXEL_PALS_SPEED_MULTIPLIER = 1;
/** Each pet's speed is its kind's `speed` times a random factor in this range, so two dogs never walk in step. */
export const PIXEL_PALS_SPEED_FACTOR_RANGE: PixelPalsRange = [0.75, 1.25];
/** Running speed = walking speed times this. */
export const PIXEL_PALS_RUN_SPEED_MULTIPLIER = 1.6;
/** Speed when going for the ball or for food = walking speed times this. */
export const PIXEL_PALS_CHASE_SPEED_MULTIPLIER = 1.9;
/** Zoomies speed (5 quick clicks) = walking speed times this. */
export const PIXEL_PALS_ZOOMIES_SPEED_MULTIPLIER = 2.4;
/** Flying speed = walking speed times this. */
export const PIXEL_PALS_FLY_SPEED_MULTIPLIER = 2.5;
/** Climbing speed up a wall, the same for every pet (times `PIXEL_PALS_SPEED_MULTIPLIER`). */
export const PIXEL_PALS_CLIMB_SPEED = 14;

/* ================================================================================================================== */
/* 3. WHAT A PET DOES NEXT, AND FOR HOW LONG                                                                          */
/* ================================================================================================================== */

/**
 * How long each activity lasts, in seconds. When one ends, the pet picks the next (see the weights below).
 * - idle: stands still, lie: lies down, stand: its stand animation (only pets that have one)
 * - walk, run: moves along the ground
 * - wallHang: hangs on a wall at the top of a climb, land: the landing after a fall
 * - swipe: the paw swipe on a click, withBall: plays with a ball it caught, zoomies: runs back and forth
 * - fly: flies around (flying pets only), eat: eats a piece of food
 * - talk: stands with a friend for a conversation, set by the talking settings above
 */
export const PIXEL_PALS_BEHAVIOR_DURATION = {
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
  talk: [PIXEL_PALS_CONVERSATION_SECONDS, PIXEL_PALS_CONVERSATION_SECONDS],
  fly: [3, 7],
  eat: [1.6, 1.6],
} as const satisfies Record<string, PixelPalsRange>;

/**
 * How likely each activity is when a pet picks its next one. These are weights, not percents: only how big one is next
 * to the others counts. Raise idle and lie for calmer pets, raise run for livelier ones.
 */
export const PIXEL_PALS_NEXT_BEHAVIOR_WEIGHTS = {
  walk: 0.38,
  run: 0.16,
  idle: 0.26,
  /** Only pets that have a lie animation. */
  lie: 0.1,
  /** Only pets that have a stand animation. */
  stand: 0.1,
  /** Only pets that can fly, and only when Pixel Pals is tall enough. */
  fly: 0.3,
} as const;

/** Chance a pet that walks into a wall, or to the end of a stone, takes a short rest after turning around. */
export const PIXEL_PALS_REST_AT_EDGE_CHANCE = 0.4;

/* ================================================================================================================== */
/* 4. HOPS, JUMPS AND GRAVITY                                                                                         */
/* ================================================================================================================== */

/** How fast things fall: pets, the ball and food. Higher = quicker, lower jumps; lower = floatier. */
export const PIXEL_PALS_GRAVITY = 700;
/** Chance per second that a walking or running pet does a little hop. 0 = no hops. */
export const PIXEL_PALS_HOP_CHANCE_PER_SECOND = 0.18;
/** Chance per second of a little hop during zoomies. */
export const PIXEL_PALS_ZOOMIES_HOP_CHANCE_PER_SECOND = 0.72;
/** How high the little hops go (take-off speed). */
export const PIXEL_PALS_HOP_VELOCITY = 120;
/** How high a pet you just spawned hops as it says hi. */
export const PIXEL_PALS_SPAWN_HOP_VELOCITY = 168;
/** How high the jump on the third quick click goes. */
export const PIXEL_PALS_BIG_JUMP_VELOCITY = 240;

/* ================================================================================================================== */
/* 5. CLIMBING WALLS                                                                                                  */
/* ================================================================================================================== */

/** Chance that a pet walking into the left or right wall climbs it instead of turning around. 0 = no climbing. */
export const PIXEL_PALS_CLIMB_CHANCE = 0.4;
/** How far up a climb goes, as a share of the free height above the ground (0.5 = halfway up). */
export const PIXEL_PALS_CLIMB_HEIGHT_FACTOR_RANGE: PixelPalsRange = [0.35, 0.9];
/** No climbing when the free height above the ground is less than this many sprite sizes. */
export const PIXEL_PALS_MIN_CLIMB_HEIGHT_IN_SPRITES = 1.5;

/* ================================================================================================================== */
/* 6. FLYING                                                                                                          */
/* ================================================================================================================== */

/** No flying around when the free height above the ground is less than this many sprite sizes. */
export const PIXEL_PALS_MIN_FLY_HEIGHT_IN_SPRITES = 1;
/** The lowest a pet flying around aims, in sprite sizes above the ground. */
export const PIXEL_PALS_MIN_FLIGHT_HEIGHT_IN_SPRITES = 0.3;
/** How close a flying pet's middle gets to a ball or a piece of food to catch it, in sprite sizes. */
export const PIXEL_PALS_FLY_CATCH_REACH_IN_SPRITES = 0.6;

/* ================================================================================================================== */
/* 7. STEPPING STONES (AUTUMN LAKE THEME)                                                                             */
/* ================================================================================================================== */

/** Chance that a pet walking to the end of its stone hops to the next one instead of turning around. */
export const PIXEL_PALS_SKIP_CHANCE = 0.6;
/** The same during zoomies. */
export const PIXEL_PALS_ZOOMIES_SKIP_CHANCE = 0.85;
/** The slowest take-off of a hop between stones, so even a short hop has an arc. */
export const PIXEL_PALS_SKIP_MIN_VELOCITY = 110;
/** How far onto the next stone a hop lands, in px from its edge. */
export const PIXEL_PALS_SKIP_LANDING_INSET_PX = 6;
/** How much further a pet on a stone can reach for a ball or food floating next to it, in px. */
export const PIXEL_PALS_ISLAND_CATCH_REACH_PX = 6;

/* ================================================================================================================== */
/* 8. CLICKING A PET                                                                                                  */
/* ================================================================================================================== */

/** Clicks on the same pet less than this many seconds apart count as one streak. */
export const PIXEL_PALS_CLICK_STREAK_SECONDS = 1.2;
/** The click in a streak that makes the pet do a big jump. */
export const PIXEL_PALS_CLICKS_FOR_BIG_JUMP = 3;
/** The click in a streak that starts zoomies. */
export const PIXEL_PALS_CLICKS_FOR_ZOOMIES = 5;

/* ================================================================================================================== */
/* 9. BALL, AND CATCHING THINGS                                                                                       */
/* ================================================================================================================== */

/** How fast the ball flies sideways when thrown. */
export const PIXEL_PALS_BALL_THROW_SPEED_RANGE: PixelPalsRange = [60, 150];
/** How much speed the ball keeps on each bounce off the ground (1 = bounces forever, 0 = no bounce). */
export const PIXEL_PALS_BALL_BOUNCE_DAMPING = 0.7;
/** How much speed the ball keeps when it hits a wall. */
export const PIXEL_PALS_BALL_WALL_DAMPING = 0.9;
/** The ball stops bouncing once it hits the ground slower than this. */
export const PIXEL_PALS_BALL_MIN_BOUNCE_SPEED = 40;
/** How fast a ball rolling on the ground slows down, per second. */
export const PIXEL_PALS_BALL_ROLL_FRICTION = 1.4;
/** How fast a ball in the water drifts to the nearest stone. */
export const PIXEL_PALS_BALL_DRIFT_SPEED = 10;
/** A ball nobody catches disappears after this many seconds. */
export const PIXEL_PALS_BALL_LIFETIME_SECONDS = 12;
/** How close a pet on the ground gets to a ball or food to catch it, sideways, in sprite sizes from its middle. */
export const PIXEL_PALS_CATCH_REACH_IN_SPRITES = 0.45;
/** How low a ball or food has to be for a pet on the ground to catch it, in sprite sizes above the ground. */
export const PIXEL_PALS_CATCH_HEIGHT_IN_SPRITES = 0.7;

/* ================================================================================================================== */
/* 10. FOOD                                                                                                           */
/* ================================================================================================================== */

/** How many pieces of food can be out at once. Feeding past it removes the oldest piece. */
export const PIXEL_PALS_MAX_FOODS = 5;
/** Food nobody eats disappears after this many seconds. */
export const PIXEL_PALS_FOOD_LIFETIME_SECONDS = 30;

/* ================================================================================================================== */
/* 11. FRAME LOOP                                                                                                     */
/* ================================================================================================================== */

/** The longest step the simulation takes at once, so pets do not jump ahead after the tab was in the background. */
export const PIXEL_PALS_MAX_FRAME_SECONDS = 0.1;

/* ================================================================================================================== */
/* 12. WEATHER PARTICLES                                                                                              */
/* ================================================================================================================== */

/**
 * The weather a theme can have (its `particles` in the theme master list). The slider in the Change theme dialog sets
 * how many particles there are, never how big they are: at 100 there are `maxPer10kPx` of them for every 10,000 px² of
 * Pixel Pals (the default size, 240 × 150, is 3.6 of those), at 50 half that, at 0 none.
 *
 * - `size`: in px. A pixel or two, so they match the art. Fog wisps are `size` wide and `thickness` tall.
 * - `fallSpeed`: px per second downward (negative goes up). `drift`: px per second sideways (negative goes left).
 * - `sway`: how far each one swings from side to side, in px, and `swaySeconds`: how long one swing takes.
 */
export interface PixelPalsParticleTuning {
  maxPer10kPx: number;
  size: PixelPalsRange;
  fallSpeed: PixelPalsRange;
  drift: PixelPalsRange;
  sway: PixelPalsRange;
  swaySeconds: PixelPalsRange;
  /** Rain only: how long each streak is, in px. */
  streakLength?: PixelPalsRange;
  /** Fog only: how tall each wisp is, in px. */
  thickness?: PixelPalsRange;
}

/**
 * How fast rain falls on every theme with rain (Overgrown city, Karst peaks), in px per second. Each drop gets its own
 * speed in this range. Higher = faster. At the default, a drop takes about 1.3 seconds to fall to the ground of the
 * default 150 px tall Pixel Pals (it was 190 to 260, about 0.5 seconds, which looked too fast).
 */
export const PIXEL_PALS_RAIN_FALL_SPEED: PixelPalsRange = [80, 110];
/** How much the rain slants: px to the left for every px it falls (0 = straight down). The angle stays the same when the speed changes. */
export const PIXEL_PALS_RAIN_SLANT = 0.1;

export const PIXEL_PALS_PARTICLE_TUNING = {
  // 1 px flakes, a few 2 px ones, drifting down slowly
  snow: { maxPer10kPx: 40, size: [1, 2], fallSpeed: [10, 24], drift: [-2, 4], sway: [1.5, 4], swaySeconds: [1.6, 3.2] },
  // 2 px leaves that tumble and swing wide on the way down
  leaves: { maxPer10kPx: 9, size: [2, 2], fallSpeed: [12, 22], drift: [-4, 6], sway: [6, 12], swaySeconds: [1.8, 3.4] },
  // 1 px specks blowing away from the portal, to the left
  debris: { maxPer10kPx: 24, size: [1, 2], fallSpeed: [6, 16], drift: [-16, -6], sway: [1, 3], swaySeconds: [0.8, 1.8] },
  // 1 px wide streaks, slanting a little; the speed is PIXEL_PALS_RAIN_FALL_SPEED above
  rain: {
    maxPer10kPx: 30,
    size: [1, 1],
    fallSpeed: PIXEL_PALS_RAIN_FALL_SPEED,
    drift: [-PIXEL_PALS_RAIN_FALL_SPEED[1] * PIXEL_PALS_RAIN_SLANT, -PIXEL_PALS_RAIN_FALL_SPEED[0] * PIXEL_PALS_RAIN_SLANT],
    sway: [0, 0],
    swaySeconds: [1, 1],
    streakLength: [3, 5],
  },
  // thin wisps drifting slowly sideways, mostly in the lower half
  fog: { maxPer10kPx: 6, size: [22, 44], fallSpeed: [0, 0], drift: [3, 8], sway: [0.5, 1.5], swaySeconds: [5, 9], thickness: [3, 6] },
} as const satisfies Record<string, PixelPalsParticleTuning>;

/** How long the little splash shows where a raindrop hits the ground. */
export const PIXEL_PALS_RAIN_SPLASH_SECONDS = 0.12;

