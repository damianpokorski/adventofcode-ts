import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Validators
  const requiredFields = [`byr`, `iyr`, `eyr`, `hgt`, `hcl`, `ecl`, `pid`];
  const hairColourRegex = /^#([\dabcdef]{6})$/;
  const pidRegex = /^([\d]{9})$/;
  const validEyeColours = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
  const inRange = (value: string | undefined, min: number, max: number) => {
    if (value == undefined) {
      return false;
    }
    const v = parseInt(value);
    return v >= min && v <= max;
  };

  return input
    .join('\n')
    .split('\n\n')
    .map((passportLines) =>
      passportLines
        .split('\n')
        .join(' ')
        .split(' ')
        .map((field) => field.split(':'))
        .reduce(
          (props, [key, value]) => {
            props[key] = value;
            return props;
          },
          {} as Record<string, string>
        )
    )
    .filter((passport) => {
      if (
        requiredFields.every((required) => passport[required] !== undefined) ==
        false
      ) {
        return false;
      }
      if (part == 1) {
        return true;
      }

      // Years
      if (
        inRange(passport.byr, 1920, 2002) == false ||
        inRange(passport.iyr, 2010, 2020) == false ||
        inRange(passport.eyr, 2020, 2030) == false
      ) {
        return false;
      }
      // Height, defined & in cm or in
      if (
        passport.hgt == undefined ||
        (passport.hgt.endsWith('cm') == false &&
          passport.hgt.endsWith('in') == false) ||
        (passport.hgt.endsWith('cm') &&
          inRange(passport.hgt.replace('cm', ''), 150, 193) == false) ||
        (passport.hgt.endsWith('in') &&
          inRange(passport.hgt.replace('in', ''), 59, 76) == false)
      ) {
        return false;
      }

      // hair colour
      if (hairColourRegex.test(passport.hcl ?? '') == false) {
        return false;
      }

      // eye colour
      if (validEyeColours.includes(passport.ecl) == false) {
        return false;
      }

      // PID
      if (pidRegex.test(passport.pid ?? '') == false) {
        return false;
      }
      return true;
    }).length;
}).tests(
  `eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`.split('\n'),
  4,
  0
);
