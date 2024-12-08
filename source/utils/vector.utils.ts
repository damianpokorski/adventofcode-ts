export class Vector {
  constructor(
    public x = 0,
    public y = 0
  ) {}

  add(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }
  addInPlace(other: Vector) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }
  subtract(other: Vector) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  subtractInPlace(other: Vector) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  static fromChar(value: string) {
    const { x, y } =
      {
        '^': Vector.Up,
        v: Vector.Down,
        '<': Vector.Left,
        '>': Vector.Right
      }[value] ?? Vector.Zero;
    return new Vector(x, y);
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
    if (grid[this.y] && grid[this.y][this.x]) {
      return grid[this.y][this.x];
    }
    return undefined;
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
