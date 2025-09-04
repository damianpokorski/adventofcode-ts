export enum VectorFacing {
  U = 'U',
  R = 'R',
  D = 'D',
  L = 'L'
}

export class Vector {
  constructor(
    public x = 0,
    public y = 0
  ) {}

  add(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }
  subtract(other: Vector) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  divide(other: Vector) {
    return new Vector(this.x / other.x, this.y / other.y);
  }
  multiply(other: Vector) {
    return new Vector(this.x * other.x, this.y * other.y);
  }
  floor() {
    return new Vector(Math.floor(this.x), Math.floor(this.y));
  }

  findIntersectionFrequency(secondVector: Vector, target: Vector) {
    const thisRepeats =
      (target.x * secondVector.y - target.y * secondVector.x) /
      (this.x * secondVector.y - this.y * secondVector.x);
    const secondVectorRepeats =
      (target.x - this.x * thisRepeats) / secondVector.x;
    return [thisRepeats, secondVectorRepeats];
  }

  static fromChar(
    value: string,
    directions: { up: string; down: string; left: string; right: string } = {
      up: '^',
      down: 'v',
      left: '<',
      right: '>'
    }
  ) {
    const { x, y } =
      {
        [directions.up]: Vector.Up,
        [directions.down]: Vector.Down,
        [directions.left]: Vector.Left,
        [directions.right]: Vector.Right
      }[value] ?? Vector.Zero;
    return new Vector(x, y);
  }
  static fromUDLR(value: string) {
    return Vector.fromChar(value, {
      up: 'U',
      down: 'D',
      left: 'L',
      right: 'R'
    });
  }
  static fromSingle(value: number) {
    return new Vector(value, value);
  }
  toChar() {
    if (this.equals(Vector.Up)) {
      return '^';
    }
    if (this.equals(Vector.Right)) {
      return '>';
    }
    if (this.equals(Vector.Down)) {
      return 'V';
    }
    if (this.equals(Vector.Left)) {
      return '<';
    }
    return '';
  }
  toString() {
    return `${this.x},${this.y}`;
  }
  copy() {
    return new Vector(this.x, this.y);
  }

  static Zero = new Vector(0, 0);
  static Up = new Vector(0, -1);
  static Down = new Vector(0, 1);
  static Left = new Vector(-1, 0);
  static Right = new Vector(1, 0);

  getGridValue<T>(grid: T[][]): T | undefined {
    if (grid[this.y] !== undefined && grid[this.y][this.x] !== undefined) {
      return grid[this.y][this.x];
    }
    return undefined;
  }

  adjecents() {
    return [
      this.add(Vector.Up),
      this.add(Vector.Right),
      this.add(Vector.Down),
      this.add(Vector.Left)
    ];
  }
  omnidirectionalAdjecents() {
    return [
      this.add(Vector.Up),
      this.add(Vector.Up).add(Vector.Right),
      this.add(Vector.Up).add(Vector.Left),
      this.add(Vector.Right),
      this.add(Vector.Down),
      this.add(Vector.Down).add(Vector.Left),
      this.add(Vector.Down).add(Vector.Right),
      this.add(Vector.Left)
    ];
  }

  isHorizontal() {
    return this.x !== 0 && this.y == 0;
  }

  isVertical() {
    return this.x == 0 && this.y !== 0;
  }

  isOrthogonal() {
    return this.isHorizontal() || this.isVertical();
  }

  isDiagonal() {
    return this.isOrthogonal() == false && Math.abs(this.x) == Math.abs(this.y);
  }

  min(other: Vector) {
    return new Vector(Math.min(this.x, other.x), Math.min(this.y, other.y));
  }
  max(other: Vector) {
    return new Vector(Math.max(this.x, other.x), Math.max(this.y, other.y));
  }
  ceil() {
    return new Vector(Math.round(this.x), Math.round(this.y));
  }

  toFacing(other: Vector) {
    return (
      {
        [Vector.Up.toString()]: VectorFacing.U,
        [Vector.Down.toString()]: VectorFacing.D,
        [Vector.Left.toString()]: VectorFacing.L,
        [Vector.Right.toString()]: VectorFacing.R
      }[this.subtract(other).toString()] ?? undefined
    );
  }

  distance(other: Vector): number {
    const { x, y } = this.subtract(other);
    return Math.sqrt(x * x + y * y);
  }

  gridDistance(other: Vector): number {
    const { x, y } = this.subtract(other);
    return Math.abs(x) + Math.abs(y);
  }

  turnClockwise() {
    if (this.x == Vector.Up.x && this.y == Vector.Up.y) {
      return Vector.Right;
    }
    if (this.x == Vector.Right.x && this.y == Vector.Right.y) {
      return Vector.Down;
    }
    if (this.x == Vector.Down.x && this.y == Vector.Down.y) {
      return Vector.Left;
    }
    if (this.x == Vector.Left.x && this.y == Vector.Left.y) {
      return Vector.Up;
    }
    return Vector.Zero;
  }
  turnCounterClockwise() {
    if (this.x == Vector.Up.x && this.y == Vector.Up.y) {
      return Vector.Left;
    }
    if (this.x == Vector.Right.x && this.y == Vector.Right.y) {
      return Vector.Up;
    }
    if (this.x == Vector.Down.x && this.y == Vector.Down.y) {
      return Vector.Right;
    }
    if (this.x == Vector.Left.x && this.y == Vector.Left.y) {
      return Vector.Down;
    }
    return Vector.Zero;
  }

  equals(other: Vector) {
    return this.x == other.x && this.y == other.y;
  }
  static from(x: number, y: number) {
    return new Vector(x, y);
  }

  hash() {
    return (this.x << 16) + this.y;
  }
}
