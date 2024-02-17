import { Circle } from "./Circle";
import { Collider } from "./Collider";
import { Hexagon } from "./Hexagon";
import { Triangle } from "./Triangle";
import { Vector } from "./Vector";
import Rectangle from "./rectangle";
import { randomNumber } from "./utils";

const canvas = document.querySelector<HTMLCanvasElement>("#cnvs");

const getParams = (count: number) =>
  Array.from(
    Array(count),
    () =>
      [
        new Vector(
          randomNumber(70, innerWidth - 70),
          randomNumber(70, innerHeight - 70)
        ),
        randomNumber(5, 15),
      ] as const
  );

const items = [Circle, Hexagon, Triangle]
  .flatMap((objectType) =>
    getParams(75).map((params) => new objectType(params[0], params[1]))
  )
  .map(
    (gm) =>
      new Collider(gm, new Vector(randomNumber(-2, 2), randomNumber(-2, 2)))
  );

console.log("items", items);
const gameState = {
  rects: items,
  lastTick: 0,
  tickLength: 0,
  stopCycle: 0,
  lastRender: 0,
};

function queueUpdates(numTicks) {
  for (let i = 0; i < numTicks; i++) {
    gameState.lastTick = gameState.lastTick + gameState.tickLength;
    update(gameState.lastTick);
  }
}

function draw(tFrame) {
  if (!canvas) return;

  const context = canvas.getContext("2d");

  if (!context) return;

  // clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw
  gameState.rects.forEach((r) => {
    r.draw(context);
  });
}

function update(tick: number) {
  gameState.rects.forEach((r) => {
    r.move();
  });

  gameState.rects.forEach((r) => {
    if (
      r.checkBoundsCollision(
        new Vector(0, canvas?.height || 0),
        new Vector(canvas?.width || 0, 0)
      )
    ) {
      r.invertVelocity();
    }
  });

  gameState.rects.forEach((gameObject, index) => {
    gameState.rects.slice(index + 1).forEach((otherGameObject) => {
      if (gameObject.checkCollision(otherGameObject)) {
        gameObject.invertVelocity();
        gameObject.dealDamage();
        otherGameObject.invertVelocity();
        otherGameObject.dealDamage();
      }
    });
  });

  gameState.rects = gameState.rects.filter((item) => item.hp > 0);
}

function run(tFrame: number) {
  gameState.stopCycle = window.requestAnimationFrame(run);

  const nextTick = gameState.lastTick + gameState.tickLength;
  let numTicks = 0;

  if (tFrame > nextTick) {
    const timeSinceTick = tFrame - gameState.lastTick;
    numTicks = Math.floor(timeSinceTick / gameState.tickLength);
  }
  queueUpdates(numTicks);
  draw(tFrame);
  gameState.lastRender = tFrame;
}

function stopGame(handle) {
  window.cancelAnimationFrame(handle);
}

function setup() {
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gameState.lastTick = performance.now();
  gameState.lastRender = gameState.lastTick;
  gameState.tickLength = 15; //ms
}

setup();
run(0);
