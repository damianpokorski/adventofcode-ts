// Output colouring - might feel a bit awkward, but saves a library import
export const consoleColors = {
  Bright: (input: string, resetAfterwards = true) =>
    ['\x1b[1m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  Dim: (input: string, resetAfterwards = true) =>
    ['\x1b[2m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  Underscore: (input: string, resetAfterwards = true) =>
    ['\x1b[4m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  Blink: (input: string, resetAfterwards = true) =>
    ['\x1b[5m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  Reverse: (input: string, resetAfterwards = true) =>
    ['\x1b[7m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  Hidden: (input: string, resetAfterwards = true) =>
    ['\x1b[8m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgBlack: (input: string, resetAfterwards = true) =>
    ['\x1b[30m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgRed: (input: string, resetAfterwards = true) =>
    ['\x1b[31m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgGreen: (input: string, resetAfterwards = true) =>
    ['\x1b[32m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgYellow: (input: string, resetAfterwards = true) =>
    ['\x1b[33m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgBlue: (input: string, resetAfterwards = true) =>
    ['\x1b[34m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgMagenta: (input: string, resetAfterwards = true) =>
    ['\x1b[35m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgCyan: (input: string, resetAfterwards = true) =>
    ['\x1b[36m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgWhite: (input: string, resetAfterwards = true) =>
    ['\x1b[37m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgGray: (input: string, resetAfterwards = true) =>
    ['\x1b[90m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgBlack: (input: string, resetAfterwards = true) =>
    ['\x1b[40m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgRed: (input: string, resetAfterwards = true) =>
    ['\x1b[41m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgGreen: (input: string, resetAfterwards = true) =>
    ['\x1b[42m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgYellow: (input: string, resetAfterwards = true) =>
    ['\x1b[43m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgBlue: (input: string, resetAfterwards = true) =>
    ['\x1b[44m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgMagenta: (input: string, resetAfterwards = true) =>
    ['\x1b[45m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgCyan: (input: string, resetAfterwards = true) =>
    ['\x1b[46m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgWhite: (input: string, resetAfterwards = true) =>
    ['\x1b[47m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgGray: (input: string, resetAfterwards = true) =>
    ['\x1b[100m', input, resetAfterwards ? '\x1b[0m' : ''].join('')
};

let isSilenced = false;
export const silence = (setting: boolean) => {
  isSilenced = setting;
};

export const wrapLog = (color: string, ...data: unknown[]) => {
  if (isSilenced) {
    return;
  }
  console.log(`${color}%s\x1b[0m`, ...data);
};

export const debug = (...data: unknown[]) =>
  wrapLog(consoleColors.FgGray('', false), ...data);
export const info = (...data: unknown[]) =>
  wrapLog(consoleColors.FgWhite('', false), ...data);
export const warn = (...data: unknown[]) =>
  wrapLog(consoleColors.FgYellow('', false), ...data);
export const error = (...data: unknown[]) =>
  wrapLog(consoleColors.FgRed('', false), ...data);
