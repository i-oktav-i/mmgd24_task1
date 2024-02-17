import { Vector } from "../Vector";
import { randomNumber } from "../utils";
import { Circle } from "./Circle";

describe("Circle tests", () => {
  describe("contains tests", () => {
    const center = new Vector(randomNumber(), randomNumber());
    const radius = randomNumber();

    const circle = new Circle(center, radius);

    it("inside", () => {
      expect(circle.contains(center)).toBeTruthy();
    });

    it("on border", () => {
      expect(circle.contains(center.add(new Vector(0, radius)))).toBeTruthy();
      expect(circle.contains(center.add(new Vector(0, -radius)))).toBeTruthy();
      expect(circle.contains(center.add(new Vector(radius, 0)))).toBeTruthy();
      expect(circle.contains(center.add(new Vector(-radius, 0)))).toBeTruthy();
    });

    it("far", () => {
      expect(
        circle.contains(center.add(new Vector(0, radius * 2)))
      ).toBeFalsy();
      expect(
        circle.contains(center.add(new Vector(0, -radius * 2)))
      ).toBeFalsy();
      expect(
        circle.contains(center.add(new Vector(radius * 2, 0)))
      ).toBeFalsy();
      expect(
        circle.contains(center.add(new Vector(-radius * 2, 0)))
      ).toBeFalsy();
    });
  });
});
