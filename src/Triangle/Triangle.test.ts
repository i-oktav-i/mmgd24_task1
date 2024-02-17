import { Vector } from "../Vector";
import { randomNumber } from "../utils";
import { Triangle } from "./Triangle";

describe("Triangle tests", () => {
  const center = new Vector(randomNumber(1, 10), randomNumber(1, 10));
  const radius = randomNumber(1, 10);
  const height = (radius * 3) / 2;
  const triage = new Triangle(center, radius);

  describe("contains tests", () => {
    it("center", () => {
      expect(triage.contains(triage.center)).toBeTruthy();
    });

    it("vertices", () => {
      const results = Object.values(triage.vertices).map((point) =>
        triage.contains(point)
      );

      expect(results).not.toContain(false);
    });

    it("point on edge", () => {
      const point = new Vector(
        (triage.vertices.left.x + triage.vertices.right.x) / 2,
        triage.vertices.left.y
      );

      expect(triage.contains(point)).toBeTruthy();
    });

    it("far", () => {
      const point = new Vector(center.x + radius, center.y);

      expect(triage.contains(point)).toBeFalsy();
    });
  });

  describe("distance to edges tests", () => {
    it("center", () => {
      expect(triage.distanceToEdges(center)).toEqual(
        expect.arrayContaining([-radius / 2, -radius / 2, -radius / 2])
      );
    });
    it("vertices", () => {
      const results = Object.values(triage.vertices).map((point) =>
        triage.distanceToEdges(point)
      );

      expect(results).toEqual(
        expect.arrayContaining([
          expect.arrayContaining([0, 0, -height]),
          expect.arrayContaining([0, 0, -height]),
          expect.arrayContaining([0, 0, -height]),
        ])
      );
    });

    it("far", () => {
      const point = new Vector(center.x, center.y + radius + height);

      expect(triage.distanceToEdges(point)).toEqual(
        expect.arrayContaining([-2 * height, height / 2, height / 2])
      );
    });
  });
});
