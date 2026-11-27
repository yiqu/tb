import { reactToPixelPalsClick } from '../utils/pixel-pals-click.utils';
import { getPixelPalsAllSpriteUrls } from '../utils/pixel-pals-sprite.utils';
import { PIXEL_PALS_BEHAVIOR } from '../models/pixel-pals-runtime.models';
import { PIXEL_PALS_BUBBLE_FONT, PIXEL_PALS_BALL_RADIUS_PX, PIXEL_PALS_MIN_WORLD_WIDTH_PX } from '../constants/pixel-pals.constants';
import { PIXEL_PALS_MESSAGES } from '../constants/pixel-pals-messages.constants';
import { createPixelPalsBall, stepPixelPalsBall } from '../utils/pixel-pals-ball.utils';
import { PIXEL_PALS_FOODS } from '../constants/pixel-pals-foods.constants';
import { createPixelPalsFood, stepPixelPalsFood, keepPixelPalsFoodInside } from '../utils/pixel-pals-food.utils';
import { drawPixelPalsParticles, stepPixelPalsParticles, setPixelPalsParticleField, createPixelPalsParticleField } from '../utils/pixel-pals-particles.utils';
import { randomItem, randomChance, randomBetween } from '../utils/pixel-pals-random.utils';
import { isOverPixelPalsStone, getPixelPalsIslandSpans } from '../utils/pixel-pals-island.utils';
import { getPixelPalsGreeting, pickPixelPalsConversation, pickPixelPalsMissedBallLine } from '../utils/pixel-pals-speech.utils';
import { renderPixelPalsPet, renderPixelPalsBall, renderPixelPalsFoods, PIXEL_PALS_EMPTY_RENDERED_PET } from '../utils/pixel-pals-render.utils';
import {
  PIXEL_PALS_MAX_FOODS,
  PIXEL_PALS_MAX_FRAME_SECONDS,
  PIXEL_PALS_SPAWN_HOP_VELOCITY,
  PIXEL_PALS_MISSED_BALL_LINE_CHANCE,
  PIXEL_PALS_WAIT_FOR_FRIEND_EXTRA_SECONDS,
  PIXEL_PALS_CONVERSATION_INTERVAL,
  PIXEL_PALS_APPROACH_FRIEND_MAX_SECONDS,
  PIXEL_PALS_CONVERSATION_LINE_SECONDS,
} from '../constants/pixel-pals-behavior.constants';
import {
  stepPixelPalsPet,
  startPixelPalsFall,
  isPixelPalsPetFree,
  showPixelPalsBubble,
  setPixelPalsBehavior,
  canPixelPalsPetMove,
  isPixelPalsPetOnWall,
  getPixelPalsMaxClimbY,
  arePixelPalsPetsClose,
  isPixelPalsPetOnGround,
  getPixelPalsApproachSeconds,
  getPixelPalsJumpVelocity,
  pickNextPixelPalsBehavior,
  createPixelPalsPetRuntime,
  getPixelPalsRandomGroundX,
  keepPixelPalsPetOnGround,
  keepPixelPalsFlightInside,
  startPixelPalsConversation,
  PixelPalsSimulationContext,
} from '../utils/pixel-pals-behavior.utils';

import type {
  ResolvedPixelPet,
  PixelPalsColorMode,
  PixelPalsThemeIsland,
  PixelPalsThemeDefinition,
  PixelPalsParticleEffectId,
} from '../models/pixel-pals.models';
import type {
  PixelPalsBallRuntime,
  PixelPalsParticleField,
  PixelPalsFoodRuntime,
  PixelPalsPetRuntime,
  PixelPalsWorldBounds,
  PixelPalsRenderedPet,
  PixelPalsPetElements,
} from '../models/pixel-pals-runtime.models';

/**
 * Runs Pixel Pals: one `requestAnimationFrame` loop moves every pet, the ball, the food and the weather, then writes
 * the result straight to the DOM nodes the React components registered (the weather is drawn on one canvas). React only renders when a pet is added
 * or removed, never per frame.
 *
 * The engine holds no saved state. `setPets` is fed the pets from the store and builds a runtime pet
 * (position, behavior, bubble) for each new one.
 */
export class PixelPalsEngine {
  private readonly pets = new Map<string, PixelPalsPetRuntime>();
  private readonly elements = new Map<string, PixelPalsPetElements>();
  private readonly rendered = new Map<string, PixelPalsRenderedPet>();
  private readonly preloadedSprites = new Set<string>();
  private ball: PixelPalsBallRuntime | null = null;
  private ballElement: HTMLElement | null = null;
  /** Oldest first. The same array is the context's `foods`, so it is only ever changed in place. */
  private readonly foods: PixelPalsFoodRuntime[] = [];
  private foodElements: readonly HTMLImageElement[] = [];
  private nextFoodId = 1;
  private readonly particleField: PixelPalsParticleField = createPixelPalsParticleField();
  private particleContext: CanvasRenderingContext2D | null = null;
  /** Whether the canvas has particles on it, so with none left it is cleared once and then left alone. */
  private hasDrawnParticles = false;
  private bounds: PixelPalsWorldBounds = { width: 0, height: 0, floor: 0, islands: [], waterDepth: 0 };
  private islandDefinitions: readonly PixelPalsThemeIsland[] | undefined = undefined;
  private frameId: number | null = null;
  private lastFrameAt: number | null = null;
  private clockSeconds = 0;
  private secondsUntilConversation: number = randomBetween(PIXEL_PALS_CONVERSATION_INTERVAL);
  private hasReceivedPets = false;
  private isWatchingBubbleFont = false;

  private readonly context: PixelPalsSimulationContext = {
    bounds: this.bounds,
    ball: null,
    foods: this.foods,
    findPet: (id: string) => {
      return this.pets.get(id);
    },
    catchBall: (runtime: PixelPalsPetRuntime) => {
      this.catchBall(runtime);
    },
    eatFood: (runtime: PixelPalsPetRuntime, food: PixelPalsFoodRuntime) => {
      this.eatFood(runtime, food);
    },
    startConversation: (initiator: PixelPalsPetRuntime, partner: PixelPalsPetRuntime) => {
      const lines: readonly [string, string] | undefined = pickPixelPalsConversation(initiator, partner);
      if (lines) {
        startPixelPalsConversation(initiator, partner, lines, PIXEL_PALS_CONVERSATION_LINE_SECONDS);
      }
    },
  };

  start(): void {
    if (this.frameId !== null || typeof window === 'undefined') {
      return;
    }
    this.watchBubbleFont();
    this.lastFrameAt = null;
    this.frameId = window.requestAnimationFrame(this.handleFrame);
  }

  stop(): void {
    if (this.frameId !== null) {
      window.cancelAnimationFrame(this.frameId);
    }
    this.frameId = null;
    this.lastFrameAt = null;
  }

  setWorldSize(width: number, height: number): void {
    // hidden, or squeezed while the nav opens or closes: keep the last real size, so everything keeps its place
    if (width < PIXEL_PALS_MIN_WORLD_WIDTH_PX || height <= 0) {
      return;
    }
    const previousWidth: number = this.bounds.width;
    this.bounds.width = width;
    this.bounds.height = height;
    // the stepping stones are placed by a share of the width
    this.bounds.islands = getPixelPalsIslandSpans(this.islandDefinitions, width);
    if (previousWidth === 0) {
      // the first real size: pets that joined while Pixel Pals was hidden all stood at the left wall, spread them out
      this.pets.forEach((runtime: PixelPalsPetRuntime) => {
        runtime.x = getPixelPalsRandomGroundX(this.bounds, runtime.size);
      });
    } else if (width !== previousWidth) {
      this.stretchWorld(width / previousWidth);
    }
    this.keepPetsInside();
  }

  /** Pixel Pals got wider or narrower: everything keeps its place across the width, as the stepping stones do. */
  private stretchWorld(ratio: number): void {
    this.pets.forEach((runtime: PixelPalsPetRuntime) => {
      runtime.x = (runtime.x + runtime.size / 2) * ratio - runtime.size / 2;
      if (runtime.flight) {
        runtime.flight.targetX *= ratio;
      }
    });
    this.foods.forEach((food: PixelPalsFoodRuntime) => {
      food.x *= ratio;
    });
    if (this.ball) {
      this.ball.x *= ratio;
    }
  }

  /** The theme's ground: how high it is, and on the lake, the stepping stones. */
  setTheme(theme: PixelPalsThemeDefinition): void {
    this.bounds.floor = theme.floorPx;
    this.bounds.waterDepth = theme.waterDepthPx ?? 0;
    this.islandDefinitions = theme.islands;
    this.bounds.islands = getPixelPalsIslandSpans(theme.islands, this.bounds.width);
    this.keepPetsInside();
  }

  /** Syncs the runtime pets with the store's pets: new ones join Pixel Pals, removed ones leave it. */
  setPets(pets: readonly ResolvedPixelPet[]): void {
    const nextIds = new Set<string>(
      pets.map((pet: ResolvedPixelPet) => {
        return pet.id;
      }),
    );

    this.pets.forEach((runtime: PixelPalsPetRuntime, id: string) => {
      if (!nextIds.has(id)) {
        this.removePet(id);
      }
    });

    pets.forEach((pet: ResolvedPixelPet) => {
      const existing: PixelPalsPetRuntime | undefined = this.pets.get(pet.id);
      if (existing) {
        existing.pet = pet;
        return;
      }
      const runtime: PixelPalsPetRuntime = createPixelPalsPetRuntime(pet, this.bounds);
      this.preloadSprites(runtime);
      // pets loaded with the page are already there, a pet spawned later hops in and says hi
      if (this.hasReceivedPets) {
        runtime.vy = getPixelPalsJumpVelocity(PIXEL_PALS_SPAWN_HOP_VELOCITY, this.bounds, runtime.size);
        showPixelPalsBubble(runtime, getPixelPalsGreeting(runtime));
        if (this.ball && this.ball.heldByPetId === null && canPixelPalsPetMove(runtime)) {
          setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.chase);
        }
      }
      this.pets.set(pet.id, runtime);
    });

    this.hasReceivedPets = true;
  }

  /** Called by a pet's component once its DOM nodes exist. Returns the cleanup. */
  attachPetElements(id: string, elements: PixelPalsPetElements): () => void {
    this.elements.set(id, elements);
    this.rendered.set(id, PIXEL_PALS_EMPTY_RENDERED_PET);
    return () => {
      if (this.elements.get(id) === elements) {
        this.elements.delete(id);
        this.rendered.delete(id);
      }
    };
  }

  attachBallElement(element: HTMLElement | null): void {
    this.ballElement = element;
  }

  /** The image slots the food is drawn in, one per piece up to `PIXEL_PALS_MAX_FOODS`. */
  attachFoodElements(elements: readonly HTMLImageElement[]): void {
    this.foodElements = elements;
  }

  /** The canvas the weather is drawn on. The engine sizes it to the world, 1 canvas px per CSS px. */
  attachParticleCanvas(canvas: HTMLCanvasElement | null): void {
    this.particleContext = canvas?.getContext('2d') ?? null;
    this.hasDrawnParticles = true;
  }

  /** The background's weather (null for none), how much of it (0 to 100, the count only) and the colors to use. */
  setParticles(effect: PixelPalsParticleEffectId | null, level: number, colorMode: PixelPalsColorMode): void {
    setPixelPalsParticleField(this.particleField, effect, level, colorMode);
  }

  /**
   * Drops a random piece of food in. Every pet that is free (not playing, talking or eating) goes for the nearest
   * piece; the others join once they are done. Past `PIXEL_PALS_MAX_FOODS` the oldest piece goes.
   */
  feed(): void {
    this.foods.push(createPixelPalsFood(this.nextFoodId, this.bounds));
    this.nextFoodId += 1;
    if (this.foods.length > PIXEL_PALS_MAX_FOODS) {
      this.foods.shift();
    }
    this.pets.forEach((runtime: PixelPalsPetRuntime) => {
      if (!canPixelPalsPetMove(runtime) || !isPixelPalsPetFree(runtime)) {
        return;
      }
      runtime.friendId = null;
      setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.forage);
    });
  }

  /** Drops a ball in. Every pet that can, stops what it is doing and runs after it. */
  throwBall(): void {
    this.ball = createPixelPalsBall(this.bounds);
    this.pets.forEach((runtime: PixelPalsPetRuntime) => {
      if (!canPixelPalsPetMove(runtime) || isPixelPalsPetOnWall(runtime)) {
        // pets on a wall join the chase once they are back on the ground
        return;
      }
      runtime.friendId = null;
      runtime.pendingBubble = null;
      setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.chase);
    });
  }

  clickPet(id: string): void {
    const runtime: PixelPalsPetRuntime | undefined = this.pets.get(id);
    if (runtime) {
      reactToPixelPalsClick(runtime, this.clockSeconds, this.bounds);
    }
  }

  private readonly handleFrame = (timestamp: number): void => {
    const seconds: number = this.lastFrameAt === null ? 0 : Math.min(PIXEL_PALS_MAX_FRAME_SECONDS, (timestamp - this.lastFrameAt) / 1000);
    this.lastFrameAt = timestamp;
    if (seconds > 0 && this.bounds.width > 0) {
      this.step(seconds);
    }
    this.render();
    this.frameId = window.requestAnimationFrame(this.handleFrame);
  };

  private step(seconds: number): void {
    this.clockSeconds += seconds;

    if (this.ball) {
      stepPixelPalsBall(this.ball, seconds, this.bounds);
      if (this.ball.heldByPetId === null && this.ball.secondsLeft <= 0) {
        this.ball = null;
      }
    }

    this.secondsUntilConversation -= seconds;
    if (this.secondsUntilConversation <= 0) {
      this.secondsUntilConversation = randomBetween(PIXEL_PALS_CONVERSATION_INTERVAL);
      this.tryStartConversation();
    }

    stepPixelPalsParticles(this.particleField, seconds, this.bounds);

    this.foods.forEach((food: PixelPalsFoodRuntime) => {
      stepPixelPalsFood(food, seconds);
    });
    this.removeFoods((food: PixelPalsFoodRuntime) => {
      return food.secondsLeft <= 0;
    });

    this.context.ball = this.ball;
    this.pets.forEach((runtime: PixelPalsPetRuntime) => {
      stepPixelPalsPet(runtime, seconds, this.context);
    });

    // the ball is gone once the pet that caught it is done playing with it
    if (this.ball && this.ball.heldByPetId !== null) {
      const holder: PixelPalsPetRuntime | undefined = this.pets.get(this.ball.heldByPetId);
      if (!holder || holder.behavior !== PIXEL_PALS_BEHAVIOR.withBall) {
        this.ball = null;
      }
    }
  }

  private render(): void {
    this.pets.forEach((runtime: PixelPalsPetRuntime, id: string) => {
      const elements: PixelPalsPetElements | undefined = this.elements.get(id);
      if (!elements) {
        return;
      }
      const previous: PixelPalsRenderedPet = this.rendered.get(id) ?? PIXEL_PALS_EMPTY_RENDERED_PET;
      this.rendered.set(id, renderPixelPalsPet(runtime, elements, previous, this.bounds));
    });
    if (this.ballElement) {
      renderPixelPalsBall(this.ball, this.ballElement, this.bounds);
    }
    renderPixelPalsFoods(this.foods, this.foodElements, this.bounds);
    this.renderParticles();
  }

  private renderParticles(): void {
    const context: CanvasRenderingContext2D | null = this.particleContext;
    if (!context) {
      return;
    }
    const width: number = Math.round(this.bounds.width);
    const height: number = Math.round(this.bounds.height);
    if (context.canvas.width !== width || context.canvas.height !== height) {
      // resizing a canvas clears it
      context.canvas.width = width;
      context.canvas.height = height;
    }
    if (this.particleField.particles.length === 0) {
      if (this.hasDrawnParticles) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        this.hasDrawnParticles = false;
      }
      return;
    }
    drawPixelPalsParticles(context, this.particleField, this.bounds);
    this.hasDrawnParticles = true;
  }

  /** Removes the food that matches, in place (see `foods`). */
  private removeFoods(shouldRemove: (food: PixelPalsFoodRuntime) => boolean): void {
    for (let index = this.foods.length - 1; index >= 0; index -= 1) {
      if (shouldRemove(this.foods[index])) {
        this.foods.splice(index, 1);
      }
    }
  }

  /** A pet got to a piece of food first: it eats it and says so. The others go for another piece, if there is one. */
  private eatFood(runtime: PixelPalsPetRuntime, food: PixelPalsFoodRuntime): void {
    this.removeFoods((candidate: PixelPalsFoodRuntime) => {
      return candidate === food;
    });
    setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.eat);
    showPixelPalsBubble(runtime, PIXEL_PALS_FOODS[food.kind].line);
  }

  private catchBall(runtime: PixelPalsPetRuntime): void {
    if (!this.ball || this.ball.heldByPetId !== null) {
      return;
    }
    this.ball.heldByPetId = runtime.pet.id;
    setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.withBall);
    showPixelPalsBubble(runtime, PIXEL_PALS_MESSAGES.caughtBall);

    this.pets.forEach((other: PixelPalsPetRuntime) => {
      if (other === runtime || other.behavior !== PIXEL_PALS_BEHAVIOR.chase) {
        return;
      }
      setPixelPalsBehavior(other, PIXEL_PALS_BEHAVIOR.idle);
      const message: string | undefined = pickPixelPalsMissedBallLine(other);
      if (message && randomChance(PIXEL_PALS_MISSED_BALL_LINE_CHANCE)) {
        showPixelPalsBubble(other, message);
      }
    });
  }

  /** Two free pets on the ground meet: one walks over to the other, then they talk. */
  private tryStartConversation(): void {
    if (this.ball) {
      return;
    }
    const candidates: PixelPalsPetRuntime[] = Array.from(this.pets.values()).filter((runtime: PixelPalsPetRuntime) => {
      return isPixelPalsPetFree(runtime) && isPixelPalsPetOnGround(runtime);
    });
    const initiator: PixelPalsPetRuntime | undefined = randomItem(candidates.filter(canPixelPalsPetMove));
    if (!initiator) {
      return;
    }
    // a friend it can walk to in time: a slow pet picks one nearby
    const partner: PixelPalsPetRuntime | undefined = randomItem(
      candidates.filter((runtime: PixelPalsPetRuntime) => {
        return runtime !== initiator && getPixelPalsApproachSeconds(initiator, runtime) <= PIXEL_PALS_APPROACH_FRIEND_MAX_SECONDS;
      }),
    );
    if (!partner) {
      return;
    }

    if (arePixelPalsPetsClose(initiator, partner)) {
      this.context.startConversation(initiator, partner);
      return;
    }
    const seconds: number = getPixelPalsApproachSeconds(initiator, partner);
    setPixelPalsBehavior(initiator, PIXEL_PALS_BEHAVIOR.approachFriend, seconds);
    initiator.friendId = partner.pet.id;
    // the partner waits a little longer than the walk can take, then gives up
    setPixelPalsBehavior(partner, PIXEL_PALS_BEHAVIOR.waitForFriend, seconds + PIXEL_PALS_WAIT_FOR_FRIEND_EXTRA_SECONDS);
    partner.friendId = initiator.pet.id;
  }

  private removePet(id: string): void {
    this.pets.delete(id);
    this.rendered.delete(id);
    if (this.ball?.heldByPetId === id) {
      this.ball = null;
    }
    // a pet that was talking to or walking up to it finds something else to do
    this.pets.forEach((runtime: PixelPalsPetRuntime) => {
      if (runtime.friendId === id) {
        pickNextPixelPalsBehavior(runtime, this.context);
      }
    });
  }

  /**
   * After a resize or a theme change: pulls pets back inside and onto the ground they can stand on (a stepping stone
   * on the lake), and off a wall that is now too short or that has no ground next to it.
   */
  private keepPetsInside(): void {
    const hasIslands: boolean = this.bounds.islands.length > 0;
    this.pets.forEach((runtime: PixelPalsPetRuntime) => {
      // a hop between stones aims at where a stone was, it lands where it is instead
      runtime.skip = null;
      // the stones are away from the walls: a pet on a wall lets go
      if (hasIslands && runtime.wall) {
        startPixelPalsFall(runtime);
      }
      if (runtime.wall) {
        runtime.x = runtime.wall === 'right' ? Math.max(0, this.bounds.width - runtime.size) : 0;
      } else if (runtime.flight) {
        // in the air it can be over the water
        keepPixelPalsFlightInside(runtime, this.bounds);
      } else {
        keepPixelPalsPetOnGround(runtime, this.bounds);
      }
      const maxClimbY: number = getPixelPalsMaxClimbY(this.bounds, runtime.size);
      if (runtime.y > maxClimbY) {
        runtime.y = maxClimbY;
        // a pet in the air stops rising and falls from the new top
        runtime.vy = Math.min(runtime.vy, 0);
      }
      // a pet still climbing stops at the new top, even when it is below it right now
      runtime.climbTargetY = Math.min(runtime.climbTargetY, maxClimbY);
    });
    this.foods.forEach((food: PixelPalsFoodRuntime) => {
      keepPixelPalsFoodInside(food, this.bounds);
    });
    if (this.ball) {
      this.ball.x = Math.min(this.bounds.width, Math.max(0, this.ball.x));
      // a stone moved under a ball floating in the water: it sits on the stone now
      if (hasIslands && isOverPixelPalsStone(this.bounds, this.ball.x) && this.ball.y < PIXEL_PALS_BALL_RADIUS_PX) {
        this.ball.y = PIXEL_PALS_BALL_RADIUS_PX;
        this.ball.vy = 0;
      }
    }
  }

  /**
   * A bubble is measured once per text and a name tag once, to keep them inside Pixel Pals. A size of 0 (Pixel Pals was
   * hidden) is not kept: `renderPixelPalsPet` measures again on the next frames until it is set. The pixel font may
   * arrive after they were measured in the fallback font, so measure them again once it is loaded.
   */
  private watchBubbleFont(): void {
    if (this.isWatchingBubbleFont || typeof document === 'undefined' || !document.fonts) {
      return;
    }
    this.isWatchingBubbleFont = true;
    document.fonts
      .load(PIXEL_PALS_BUBBLE_FONT)
      .then(() => {
        this.rendered.forEach((rendered: PixelPalsRenderedPet, id: string) => {
          const elements: PixelPalsPetElements | undefined = this.elements.get(id);
          // a hidden Pixel Pals (e.g. a collapsed nav) measures 0, keep the earlier size rather than cache that
          if (!elements || elements.nameTag.offsetWidth === 0) {
            return;
          }
          const next: PixelPalsRenderedPet = { ...rendered, nameTagWidth: elements.nameTag.offsetWidth };
          if (rendered.bubbleText !== null && elements.bubble.offsetWidth > 0) {
            next.bubbleWidth = elements.bubble.offsetWidth;
            next.bubbleHeight = elements.bubble.offsetHeight;
          }
          this.rendered.set(id, next);
        });
      })
      .catch(() => {
        // the fallback font stays, and so do the sizes measured with it
      });
  }

  private preloadSprites(runtime: PixelPalsPetRuntime): void {
    if (typeof window === 'undefined') {
      return;
    }
    getPixelPalsAllSpriteUrls(runtime.pet, runtime.definition).forEach((url: string) => {
      if (this.preloadedSprites.has(url)) {
        return;
      }
      this.preloadedSprites.add(url);
      const image = new Image();
      image.src = url;
    });
  }
}
