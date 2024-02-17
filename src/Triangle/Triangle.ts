import { GameObject } from "../GameObject";
import { Vector } from "../Vector";
import { objectEntries, objectFromEntries } from "../utils";

export class Triangle extends GameObject {
  private _edge: number;
  private oneThirdHeight: number;
  private _normalVertices: Readonly<Record<"top" | "left" | "right", Vector>>;
  private _vertices: typeof this._normalVertices;

  /** `(A**2 + B**2) ** 0.5` */
  private distanceDivider: number = 2;
  private leftEdgeFuncConst: number;
  private readonly leftEdgeFunc = (x: number) =>
    Triangle.sqrt3 * x + this.leftEdgeFuncConst;
  private rightEdgeFuncConst: number;
  private readonly rightEdgeFunc = (x: number) =>
    -Triangle.sqrt3 * x + this.rightEdgeFuncConst;

  constructor(center: Vector, radius: number) {
    super(center, radius);

    // const oneThirdHeight = ((3 / 4) * edge ** 2) ** 0.5 / 3;

    this.oneThirdHeight = radius / 2;

    const edge = Triangle.sqrt3 * radius;
    this._edge = edge;

    this._normalVertices = {
      top: new Vector(0, this.oneThirdHeight * 2),
      left: new Vector(-edge / 2, -this.oneThirdHeight),
      right: new Vector(edge / 2, -this.oneThirdHeight),
    };

    this.solve();
  }

  move(delta: Vector) {
    super.move(delta);
    this.solve();
  }

  solve() {
    this._vertices = objectFromEntries(
      objectEntries(this._normalVertices).map(([key, value]) => [
        key,
        value.add(this.center),
      ])
    );

    this.leftEdgeFuncConst =
      this.vertices.left.y - this.vertices.left.x * Triangle.sqrt3;

    this.rightEdgeFuncConst =
      this.vertices.right.y - this.vertices.right.x * -Triangle.sqrt3;
  }

  get edge() {
    return this._edge;
  }

  get vertices() {
    return this._vertices;
  }

  contains = (point: Vector) => {
    return (
      point.y >= this.vertices.left.y &&
      this.leftEdgeFunc(point.x) >= point.y &&
      this.rightEdgeFunc(point.x) >= point.y
    );
  };

  distanceToEdges(point: Vector) {
    return [
      this.vertices.left.y - point.y,
      (point.y - Triangle.sqrt3 * point.x - this.leftEdgeFuncConst) /
        this.distanceDivider,
      (point.y + Triangle.sqrt3 * point.x - this.rightEdgeFuncConst) /
        this.distanceDivider,
    ];
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();

    ctx.moveTo(this.vertices.left.x, this.vertices.left.y);
    const order: (keyof typeof this.vertices)[] = ["top", "right", "left"];

    order.forEach((key) => {
      ctx.lineTo(this.vertices[key].x, this.vertices[key].y);
    });

    ctx.fill();
  };

  private static sqrt3 = 3 ** 0.5;
}
