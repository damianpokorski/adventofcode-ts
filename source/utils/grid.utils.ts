import { Vector } from './vector.utils';

/* eslint-disable @typescript-eslint/prefer-for-of */
export class Grid<T extends object | string | number | boolean> {
  constructor(public array: T[][]) {}

  toString(mapper?: (v: T) => string) {
    let rows = ``;
    for (let y = 0; y < this.array[0].length; y++) {
      let row = ``;
      for (let x = 0; x < this.array[y].length; x++) {
        row += mapper ? mapper(this.array[y][x]) : this.array[y][x].toString();
      }
      rows += `${row}\n`;
    }
    return rows;
  }

  log(mapper?: (v: T) => string) {
    console.log(this.toString(mapper));
  }

  find(predicate: (cell: T) => boolean) {
    return this.array.flat().find(predicate);
  }

  filter(predicate: (cell: T) => boolean) {
    return this.array.flat().filter(predicate);
  }

  get(x: number, y: number) {
    return this.array[y][x];
  }

  set(x: number, y: number, value: T) {
    this.array[y][x] = value;
    return this;
  }

  findLocationOf(predicate: (cell: T) => boolean): Vector | undefined {
    for (let y = 0; y < this.array.length; y++) {
      for (let x = 0; x < this.array[y].length; x++) {
        if (predicate(this.array[y][x])) {
          return new Vector(x, y);
        }
      }
    }
  }

  asVectors() {
    const output: [Vector, T][] = [];
    for (let y = 0; y < this.array.length; y++) {
      for (let x = 0; x < this.array[y].length; x++) {
        output.push([new Vector(x, y), this.array[y][x]]);
      }
    }
    return output;
  }

  static createAndFill<T extends object | string | number | boolean>(
    x: number,
    y: number,
    valueFactory: (vector: Vector) => T
  ) {
    return new Grid<T>(
      [...new Array(y)].map((yIndex) =>
        [...new Array(x)].map((xIndex) =>
          valueFactory(new Vector(xIndex, yIndex))
        )
      )
    );
  }

  static fromStrings(input: string[]) {
    return new Grid(input.map((row) => row.split('')));
  }

  transpose() {
    return new Grid(
      this.array[0].map((col, c) =>
        this.array.map((row, r) => this.array[r][c])
      )
    );
  }
}
