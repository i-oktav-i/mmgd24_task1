import { GameObject } from "../GameObject";
import { Vector } from "../Vector";
import { objectEntries, objectFromEntries } from "../utils";

export class Hexagon extends GameObject {
  private _edge: number;

  private triageHeight: number;
  private halfEdge: number;

  private _normalVertices: Readonly<
    Record<Uncapitalize<`${"bottom" | "" | "top"}${"Left" | "Right"}`>, Vector>
  >;
  private _vertices: typeof this._normalVertices;

  /** `(A**2 + B**2) ** 0.5` */
  private distanceDivider: number = 2;

  private leftTopEdgeFuncConst: number;
  private rightTopEdgeFuncConst: number;

  private leftTiltedEdgesFunc = (x: number) => {
    const topValue = Hexagon.sqrt3 * x + this.leftTopEdgeFuncConst;

    return [topValue, topValue - 4 * this.triageHeight];
  };
  private rightTiltedEdgesFunc = (x) => {
    const topValue = -Hexagon.sqrt3 * x + this.rightTopEdgeFuncConst;

    return [topValue, topValue - 4 * this.triageHeight];
  };

  constructor(center: Vector, edge: number) {
    super(center, edge);
    this.triageHeight = (Hexagon.sqrt3 * edge) / 2;
    // this.triageHeight = ((3 / 4) * edge ** 2) ** 0.5 / 2;
    this.halfEdge = edge / 2;

    this._edge = edge;

    this._normalVertices = {
      bottomLeft: new Vector(-this.halfEdge, -this.triageHeight),
      bottomRight: new Vector(this.halfEdge, -this.triageHeight),
      left: new Vector(-edge, 0),
      right: new Vector(edge, 0),
      topLeft: new Vector(-this.halfEdge, this.triageHeight),
      topRight: new Vector(this.halfEdge, this.triageHeight),
    };

    this.solve();
  }

  move(delta: Vector) {
    super.move(delta);
    this.solve();
  }

  solve = () => {
    this._vertices = objectFromEntries(
      objectEntries(this._normalVertices).map(([key, value]) => [
        key,
        value.add(this.center),
      ])
    );

    this.leftTopEdgeFuncConst =
      this.vertices.left.y - this.vertices.left.x * Hexagon.sqrt3;

    this.rightTopEdgeFuncConst =
      this.vertices.right.y + this.vertices.right.x * Hexagon.sqrt3;
  };

  public get edge(): number {
    return this._edge;
  }

  public get vertices() {
    return this._vertices;
  }

  contains = (point: Vector) => {
    if (
      point.y < this.vertices.bottomLeft.y ||
      point.y > this.vertices.topLeft.y
    ) {
      return false;
    }

    const leftTiltedEdges = this.leftTiltedEdgesFunc(point.x);

    if (point.y > leftTiltedEdges[0] || point.y < leftTiltedEdges[1]) {
      return false;
    }

    const rightTiltedEdges = this.rightTiltedEdgesFunc(point.x);

    if (point.y > rightTiltedEdges[0] || point.y < rightTiltedEdges[1]) {
      return false;
    }

    return true;
  };

  distanceToEdges(point: Vector) {
    return [
      this.vertices.bottomLeft.y - point.y,
      -(this.vertices.topLeft.y - point.y),
      (point.y - Hexagon.sqrt3 * point.x - this.leftTopEdgeFuncConst) /
        this.distanceDivider,
      (-point.y +
        Hexagon.sqrt3 * point.x +
        this.leftTopEdgeFuncConst -
        this.triageHeight * 4) /
        this.distanceDivider,
      (point.y + Hexagon.sqrt3 * point.x - this.rightTopEdgeFuncConst) /
        this.distanceDivider,
      (point.y +
        Hexagon.sqrt3 * point.x -
        this.rightTopEdgeFuncConst +
        this.triageHeight * 4) /
        this.distanceDivider,
    ];
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();

    ctx.moveTo(this.vertices.left.x, this.vertices.left.y);
    const order: (keyof typeof this.vertices)[] = [
      "topLeft",
      "topRight",
      "right",
      "bottomRight",
      "bottomLeft",
      "left",
    ];

    order.forEach((key) => {
      ctx.lineTo(this.vertices[key].x, this.vertices[key].y);
    });

    ctx.fill();
  };

  static sqrt3 = 3 ** 0.5;
}
