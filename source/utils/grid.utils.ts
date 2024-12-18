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
      rows += row + '\n';
    }
    return rows;
  }

  log(mapper?: (v: T) => string) {
    console.log(this.toString(mapper));
  }

  static createAndFill<T extends object | string | number | boolean>(x: number, y: number, value: T) {
    return new Grid<T>([...new Array(y)].map(() => [...new Array(x)].map(() => value)));
  }
}
