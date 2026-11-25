import { reactToPetZooClick } from '../utils/pet-zoo-click.utils';
import { getPetZooAllSpriteUrls } from '../utils/pet-zoo-sprite.utils';
import { PET_ZOO_BEHAVIOR } from '../models/pet-zoo-runtime.models';
import { PET_ZOO_BUBBLE_FONT, PET_ZOO_BALL_RADIUS_PX } from '../constants/pet-zoo.constants';
import { PET_ZOO_MESSAGES } from '../constants/pet-zoo-messages.constants';
import { createPetZooBall, stepPetZooBall } from '../utils/pet-zoo-ball.utils';
import { PET_ZOO_FOODS, PET_ZOO_MAX_FOODS } from '../constants/pet-zoo-foods.constants';
import { createPetZooFood, stepPetZooFood, keepPetZooFoodInside } from '../utils/pet-zoo-food.utils';
import { randomItem, randomChance, randomBetween } from '../utils/pet-zoo-random.utils';
import { isOverPetZooStone, getPetZooIslandSpans } from '../utils/pet-zoo-island.utils';
import { getPetZooGreeting, pickPetZooConversation, pickPetZooMissedBallLine } from '../utils/pet-zoo-speech.utils';
import { renderPetZooPet, renderPetZooBall, renderPetZooFoods, PET_ZOO_EMPTY_RENDERED_PET } from '../utils/pet-zoo-render.utils';
import {
  PET_ZOO_HOP_VELOCITY,
  PET_ZOO_MAX_FRAME_SECONDS,
  PET_ZOO_BEHAVIOR_DURATION,
  PET_ZOO_CONVERSATION_INTERVAL,
  PET_ZOO_CONVERSATION_LINE_SECONDS,
} from '../constants/pet-zoo-behavior.constants';
import {
  stepPetZooPet,
  startPetZooFall,
  isPetZooPetFree,
  showPetZooBubble,
  setPetZooBehavior,
  canPetZooPetMove,
  isPetZooPetOnWall,
  getPetZooMaxClimbY,
  arePetZooPetsClose,
  isPetZooPetOnGround,
  getPetZooJumpVelocity,
  pickNextPetZooBehavior,
  createPetZooPetRuntime,
  keepPetZooPetOnGround,
  keepPetZooFlightInside,
  startPetZooConversation,
  PetZooSimulationContext,
} from '../utils/pet-zoo-behavior.utils';

import type { PetZooPet, PetZooThemeIsland, PetZooThemeDefinition } from '../models/pet-zoo.models';
import type {
  PetZooBallRuntime,
  PetZooFoodRuntime,
  PetZooPetRuntime,
  PetZooWorldBounds,
  PetZooRenderedPet,
  PetZooPetElements,
} from '../models/pet-zoo-runtime.models';

/**
 * Runs the zoo: one `requestAnimationFrame` loop moves every pet, the ball and the food, then writes the result
 * straight to the DOM nodes the React components registered. React only renders when a pet is added
 * or removed, never per frame.
 *
 * The engine holds no saved state. `setPets` is fed the pets from the store and builds a runtime pet
 * (position, behavior, bubble) for each new one.
 */
export class PetZooEngine {
  private readonly pets = new Map<string, PetZooPetRuntime>();
  private readonly elements = new Map<string, PetZooPetElements>();
  private readonly rendered = new Map<string, PetZooRenderedPet>();
  private readonly preloadedSprites = new Set<string>();
  private ball: PetZooBallRuntime | null = null;
  private ballElement: HTMLElement | null = null;
  /** Oldest first. The same array is the context's `foods`, so it is only ever changed in place. */
  private readonly foods: PetZooFoodRuntime[] = [];
  private foodElements: readonly HTMLImageElement[] = [];
  private nextFoodId = 1;
  private bounds: PetZooWorldBounds = { width: 0, height: 0, floor: 0, islands: [], waterDepth: 0 };
  private islandDefinitions: readonly PetZooThemeIsland[] | undefined = undefined;
  private frameId: number | null = null;
  private lastFrameAt: number | null = null;
  private clockSeconds = 0;
  private secondsUntilConversation: number = randomBetween(PET_ZOO_CONVERSATION_INTERVAL);
  private hasReceivedPets = false;
  private isWatchingBubbleFont = false;

  private readonly context: PetZooSimulationContext = {
    bounds: this.bounds,
    ball: null,
    foods: this.foods,
    findPet: (id: string) => {
      return this.pets.get(id);
    },
    catchBall: (runtime: PetZooPetRuntime) => {
      this.catchBall(runtime);
    },
    eatFood: (runtime: PetZooPetRuntime, food: PetZooFoodRuntime) => {
      this.eatFood(runtime, food);
    },
    startConversation: (initiator: PetZooPetRuntime, partner: PetZooPetRuntime) => {
      const lines: readonly [string, string] | undefined = pickPetZooConversation(initiator, partner);
      if (lines) {
        startPetZooConversation(initiator, partner, lines, PET_ZOO_CONVERSATION_LINE_SECONDS);
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
    this.bounds.width = width;
    this.bounds.height = height;
    // the stepping stones are placed by a share of the width
    this.bounds.islands = getPetZooIslandSpans(this.islandDefinitions, width);
    this.keepPetsInside();
  }

  /** The theme's ground: how high it is, and on the lake, the stepping stones. */
  setTheme(theme: PetZooThemeDefinition): void {
    this.bounds.floor = theme.floorPx;
    this.bounds.waterDepth = theme.waterDepthPx ?? 0;
    this.islandDefinitions = theme.islands;
    this.bounds.islands = getPetZooIslandSpans(theme.islands, this.bounds.width);
    this.keepPetsInside();
  }

  /** Syncs the runtime pets with the saved pets: new ones join the zoo, removed ones leave it. */
  setPets(pets: readonly PetZooPet[]): void {
    const nextIds = new Set<string>(
      pets.map((pet: PetZooPet) => {
        return pet.id;
      }),
    );

    this.pets.forEach((runtime: PetZooPetRuntime, id: string) => {
      if (!nextIds.has(id)) {
        this.removePet(id);
      }
    });

    pets.forEach((pet: PetZooPet) => {
      const existing: PetZooPetRuntime | undefined = this.pets.get(pet.id);
      if (existing) {
        existing.pet = pet;
        return;
      }
      const runtime: PetZooPetRuntime = createPetZooPetRuntime(pet, this.bounds);
      this.preloadSprites(runtime);
      // pets loaded with the page are already there, a pet spawned later hops in and says hi
      if (this.hasReceivedPets) {
        runtime.vy = getPetZooJumpVelocity(PET_ZOO_HOP_VELOCITY * 1.4, this.bounds, runtime.size);
        showPetZooBubble(runtime, getPetZooGreeting(runtime));
        if (this.ball && this.ball.heldByPetId === null && canPetZooPetMove(runtime)) {
          setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.chase);
        }
      }
      this.pets.set(pet.id, runtime);
    });

    this.hasReceivedPets = true;
  }

  /** Called by a pet's component once its DOM nodes exist. Returns the cleanup. */
  attachPetElements(id: string, elements: PetZooPetElements): () => void {
    this.elements.set(id, elements);
    this.rendered.set(id, PET_ZOO_EMPTY_RENDERED_PET);
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

  /** The image slots the food is drawn in, one per piece up to `PET_ZOO_MAX_FOODS`. */
  attachFoodElements(elements: readonly HTMLImageElement[]): void {
    this.foodElements = elements;
  }

  /**
   * Drops a random piece of food in. Every pet that is free (not playing, talking or eating) goes for the nearest
   * piece; the others join once they are done. Past `PET_ZOO_MAX_FOODS` the oldest piece goes.
   */
  feed(): void {
    this.foods.push(createPetZooFood(this.nextFoodId, this.bounds));
    this.nextFoodId += 1;
    if (this.foods.length > PET_ZOO_MAX_FOODS) {
      this.foods.shift();
    }
    this.pets.forEach((runtime: PetZooPetRuntime) => {
      if (!canPetZooPetMove(runtime) || !isPetZooPetFree(runtime)) {
        return;
      }
      runtime.friendId = null;
      setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.forage);
    });
  }

  /** Drops a ball in. Every pet that can, stops what it is doing and runs after it. */
  throwBall(): void {
    this.ball = createPetZooBall(this.bounds);
    this.pets.forEach((runtime: PetZooPetRuntime) => {
      if (!canPetZooPetMove(runtime) || isPetZooPetOnWall(runtime)) {
        // pets on a wall join the chase once they are back on the ground
        return;
      }
      runtime.friendId = null;
      runtime.pendingBubble = null;
      setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.chase);
    });
  }

  clickPet(id: string): void {
    const runtime: PetZooPetRuntime | undefined = this.pets.get(id);
    if (runtime) {
      reactToPetZooClick(runtime, this.clockSeconds, this.bounds);
    }
  }

  private readonly handleFrame = (timestamp: number): void => {
    const seconds: number = this.lastFrameAt === null ? 0 : Math.min(PET_ZOO_MAX_FRAME_SECONDS, (timestamp - this.lastFrameAt) / 1000);
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
      stepPetZooBall(this.ball, seconds, this.bounds);
      if (this.ball.heldByPetId === null && this.ball.secondsLeft <= 0) {
        this.ball = null;
      }
    }

    this.secondsUntilConversation -= seconds;
    if (this.secondsUntilConversation <= 0) {
      this.secondsUntilConversation = randomBetween(PET_ZOO_CONVERSATION_INTERVAL);
      this.tryStartConversation();
    }

    this.foods.forEach((food: PetZooFoodRuntime) => {
      stepPetZooFood(food, seconds);
    });
    this.removeFoods((food: PetZooFoodRuntime) => {
      return food.secondsLeft <= 0;
    });

    this.context.ball = this.ball;
    this.pets.forEach((runtime: PetZooPetRuntime) => {
      stepPetZooPet(runtime, seconds, this.context);
    });

    // the ball is gone once the pet that caught it is done playing with it
    if (this.ball && this.ball.heldByPetId !== null) {
      const holder: PetZooPetRuntime | undefined = this.pets.get(this.ball.heldByPetId);
      if (!holder || holder.behavior !== PET_ZOO_BEHAVIOR.withBall) {
        this.ball = null;
      }
    }
  }

  private render(): void {
    this.pets.forEach((runtime: PetZooPetRuntime, id: string) => {
      const elements: PetZooPetElements | undefined = this.elements.get(id);
      if (!elements) {
        return;
      }
      const previous: PetZooRenderedPet = this.rendered.get(id) ?? PET_ZOO_EMPTY_RENDERED_PET;
      this.rendered.set(id, renderPetZooPet(runtime, elements, previous, this.bounds));
    });
    if (this.ballElement) {
      renderPetZooBall(this.ball, this.ballElement, this.bounds);
    }
    renderPetZooFoods(this.foods, this.foodElements, this.bounds);
  }

  /** Removes the food that matches, in place (see `foods`). */
  private removeFoods(shouldRemove: (food: PetZooFoodRuntime) => boolean): void {
    for (let index = this.foods.length - 1; index >= 0; index -= 1) {
      if (shouldRemove(this.foods[index])) {
        this.foods.splice(index, 1);
      }
    }
  }

  /** A pet got to a piece of food first: it eats it and says so. The others go for another piece, if there is one. */
  private eatFood(runtime: PetZooPetRuntime, food: PetZooFoodRuntime): void {
    this.removeFoods((candidate: PetZooFoodRuntime) => {
      return candidate === food;
    });
    setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.eat);
    showPetZooBubble(runtime, PET_ZOO_FOODS[food.kind].line);
  }

  private catchBall(runtime: PetZooPetRuntime): void {
    if (!this.ball || this.ball.heldByPetId !== null) {
      return;
    }
    this.ball.heldByPetId = runtime.pet.id;
    setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.withBall);
    showPetZooBubble(runtime, PET_ZOO_MESSAGES.caughtBall);

    this.pets.forEach((other: PetZooPetRuntime) => {
      if (other === runtime || other.behavior !== PET_ZOO_BEHAVIOR.chase) {
        return;
      }
      setPetZooBehavior(other, PET_ZOO_BEHAVIOR.idle);
      const message: string | undefined = pickPetZooMissedBallLine(other);
      if (message && randomChance(0.5)) {
        showPetZooBubble(other, message);
      }
    });
  }

  /** Two free pets on the ground meet: one walks over to the other, then they talk. */
  private tryStartConversation(): void {
    if (this.ball) {
      return;
    }
    const candidates: PetZooPetRuntime[] = Array.from(this.pets.values()).filter((runtime: PetZooPetRuntime) => {
      return isPetZooPetFree(runtime) && isPetZooPetOnGround(runtime);
    });
    const initiator: PetZooPetRuntime | undefined = randomItem(candidates.filter(canPetZooPetMove));
    const partner: PetZooPetRuntime | undefined = randomItem(
      candidates.filter((runtime: PetZooPetRuntime) => {
        return runtime !== initiator;
      }),
    );
    if (!initiator || !partner) {
      return;
    }

    if (arePetZooPetsClose(initiator, partner)) {
      this.context.startConversation(initiator, partner);
      return;
    }
    setPetZooBehavior(initiator, PET_ZOO_BEHAVIOR.approachFriend);
    initiator.friendId = partner.pet.id;
    // the partner waits a little longer than the walk can take, then gives up
    setPetZooBehavior(partner, PET_ZOO_BEHAVIOR.waitForFriend, PET_ZOO_BEHAVIOR_DURATION.approachFriend[1] + 1);
    partner.friendId = initiator.pet.id;
  }

  private removePet(id: string): void {
    this.pets.delete(id);
    this.rendered.delete(id);
    if (this.ball?.heldByPetId === id) {
      this.ball = null;
    }
    // a pet that was talking to or walking up to it finds something else to do
    this.pets.forEach((runtime: PetZooPetRuntime) => {
      if (runtime.friendId === id) {
        pickNextPetZooBehavior(runtime, this.context);
      }
    });
  }

  /**
   * After a resize or a theme change: pulls pets back inside and onto the ground they can stand on (a stepping stone
   * on the lake), and off a wall that is now too short or that has no ground next to it.
   */
  private keepPetsInside(): void {
    const hasIslands: boolean = this.bounds.islands.length > 0;
    this.pets.forEach((runtime: PetZooPetRuntime) => {
      // a hop between stones aims at where a stone was, it lands where it is instead
      runtime.skip = null;
      // the stones are away from the walls: a pet on a wall lets go
      if (hasIslands && runtime.wall) {
        startPetZooFall(runtime);
      }
      if (runtime.wall) {
        runtime.x = runtime.wall === 'right' ? Math.max(0, this.bounds.width - runtime.size) : 0;
      } else if (runtime.flight) {
        // in the air it can be over the water
        keepPetZooFlightInside(runtime, this.bounds);
      } else {
        keepPetZooPetOnGround(runtime, this.bounds);
      }
      const maxClimbY: number = getPetZooMaxClimbY(this.bounds, runtime.size);
      if (runtime.y > maxClimbY) {
        runtime.y = maxClimbY;
        // a pet in the air stops rising and falls from the new top
        runtime.vy = Math.min(runtime.vy, 0);
      }
      // a pet still climbing stops at the new top, even when it is below it right now
      runtime.climbTargetY = Math.min(runtime.climbTargetY, maxClimbY);
    });
    this.foods.forEach((food: PetZooFoodRuntime) => {
      keepPetZooFoodInside(food, this.bounds);
    });
    if (this.ball) {
      this.ball.x = Math.min(this.bounds.width, Math.max(0, this.ball.x));
      // a stone moved under a ball floating in the water: it sits on the stone now
      if (hasIslands && isOverPetZooStone(this.bounds, this.ball.x) && this.ball.y < PET_ZOO_BALL_RADIUS_PX) {
        this.ball.y = PET_ZOO_BALL_RADIUS_PX;
        this.ball.vy = 0;
      }
    }
  }

  /**
   * A bubble is measured once per text and a name tag once, to keep them inside the zoo. The pixel font may arrive
   * after they were measured in the fallback font, so measure them again once it is loaded.
   */
  private watchBubbleFont(): void {
    if (this.isWatchingBubbleFont || typeof document === 'undefined' || !document.fonts) {
      return;
    }
    this.isWatchingBubbleFont = true;
    document.fonts
      .load(PET_ZOO_BUBBLE_FONT)
      .then(() => {
        this.rendered.forEach((rendered: PetZooRenderedPet, id: string) => {
          const elements: PetZooPetElements | undefined = this.elements.get(id);
          // a hidden zoo (e.g. a collapsed nav) measures 0, keep the earlier size rather than cache that
          if (!elements || elements.nameTag.offsetWidth === 0) {
            return;
          }
          const next: PetZooRenderedPet = { ...rendered, nameTagWidth: elements.nameTag.offsetWidth };
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

  private preloadSprites(runtime: PetZooPetRuntime): void {
    if (typeof window === 'undefined') {
      return;
    }
    getPetZooAllSpriteUrls(runtime.pet, runtime.definition).forEach((url: string) => {
      if (this.preloadedSprites.has(url)) {
        return;
      }
      this.preloadedSprites.add(url);
      const image = new Image();
      image.src = url;
    });
  }
}
