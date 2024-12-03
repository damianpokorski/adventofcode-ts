An unnecessarily complicated workbench for running advent of code puzzles.

```sh
npm run start -- --help
```

```sh
Usage: adventofcode solve [options] [year] [day] [part]

Begins solving specific advent of code issue

Arguments:
  year                 Year to pick puzzles from (choices: "2023", "2024")
  day                  Day to solve puzle off (choices: "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25")
  part                 Day to solve puzle off (choices: "1", "2", ".")

Options:
  --tests-required     Requires tests to run before executing against real data (default: true)
  --no-tests-required  Does not require tests to be passing before running
  -h, --help           display help for command
```

Rules broken so far - just for fun :) :

- ✅ Global objects & states - using some of them to hook in puzzle & test data 'registration'
- ✅ Utility functions & global class extensions - just cause i want to be able to do `[1,2,3].sum()` etc.