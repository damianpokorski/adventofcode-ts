import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const parseTimeStamp = (line: string) => line.slice(1, 17);
  const events = input
    .filter((line) => line.includes('Guard #') == false)
    .map((line) => ({
      awake: line.includes('up'),
      asleep: line.includes('up') == false,
      timestamp: new Date(parseTimeStamp(line))
    }));

  const shifts = input
    .filter((line) => line.includes('Guard #'))
    .map((line) => ({
      start: parseTimeStamp(line),
      id: parseInt(line.slice(26).split(' ').shift()!),
      dateStart: new Date(parseTimeStamp(line))
    }))
    // Sort shifts by order
    .sort((a, b) => a.start.localeCompare(b.start))
    // Link previous dates up
    .map((shift, index, other) => ({
      ...shift,
      dateEnd: other[index + 1]?.dateStart ?? null
    }))
    .map((shift) => ({
      ...shift,
      // Extend only with events that are relevant to the shift
      events: events.filter(
        (event) =>
          event.timestamp > shift.dateStart &&
          (shift.dateEnd == null || event.timestamp < shift.dateEnd)
      )
    }))
    .map((shift) => ({
      ...shift,
      // Create minute by minute play based on the events within the first hour of the shiftshift
      timeline: [...new Array(60)]
        .map((_, i) => new Date(shift.dateStart.getTime() + i * 60 * 1000))
        .filter((date) => date.getHours() == 0)
        .map(
          (date) =>
            [
              date.getMinutes(),
              shift.events
                .filter((event) => event.timestamp <= date && event)
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                ?.shift()?.awake ?? true
            ] as [number, boolean]
        )
    }))
    .map((shift) => ({
      ...shift,
      // Tally up total asleep & awake time for convenient
      awake: shift.timeline.filter((e) => e[1] == true).length,
      asleep: shift.timeline.filter((e) => e[1] == false).length
    }));

  const shiftsByGuards = Object.entries(shifts.groupBy((shift) => shift.id));

  if (part == 1) {
    // Find our go to guy
    const mostAsleepGuard = shiftsByGuards
      .sort(
        (a, b) =>
          b[1].map((aShift) => aShift.asleep).sum() -
          a[1].map((bShift) => bShift.asleep).sum()
      )
      .shift()!;

    // Find out when is he most likely to be asleep
    const [mostCommonMinute, _, id] = mostAsleepGuard![1]
      .flatMap((shift) =>
        shift.timeline
          .filter(([minute, awake]) => awake == false)
          .map(([minute]) => [shift.id, minute])
      )
      .map(([id, minute], _, others) => [
        minute,
        others.filter((other) => other[1] == minute).length,
        id
      ])
      .sort(([_, a], [__, b]) => b - a)
      .shift()!;

    return mostCommonMinute * id;
  }
  // Find out the most likely time any of the guards are asleep
  const [_, mostCommonMinute, id] = shiftsByGuards
    .map(([id, shifts]) => {
      return [
        ...([
          ...(shifts
            .flatMap((shift) =>
              shift.timeline
                .filter((x) => x[1] == false)
                .map(([minute, _]) => minute)
            )
            .groupByToEntries((minute) => minute)
            .map(([minute, matches]) => [
              matches.length,
              parseInt(minute.toString())
            ])
            .sort(([a], [b]) => b - a) ?? [0, 0])
        ].shift() ?? [0, 0]),
        parseInt(id)
      ] as [number, number, number];
    })
    .sort(([a], [b]) => b - a)
    .shift()!;
  return mostCommonMinute * id;
}).tests(
  `[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up`.split('\n'),
  240,
  4455
);
