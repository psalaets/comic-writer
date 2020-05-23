const calcStats = require('./calc-stats').calcStats;
const Tracelib = require('tracelib').default;
const path = require('path');
const fs = require('fs');
const mkdirp = require('make-dir');

module.exports.create = create;

function create() {
  const now = new Date();
  const datetimeStamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    '-',
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');

  const baseDir = path.resolve(__dirname, 'reports');
  const traceDirs = [];

  return {
    initialize() {

    },
    addTest(testName) {
      const traceDir = path.resolve(baseDir, testName, datetimeStamp);
      mkdirp.sync(traceDir);

      traceDirs.push(traceDir);

      return path.resolve(traceDir, 'trace.json');
    },
    finalize() {
      for (const traceDir of traceDirs) {
        const data = require(path.resolve(traceDir, 'trace.json'));
        const tracelib = new Tracelib(data.traceEvents);

        const statsByMeasure = extractStatsByMeasure(tracelib);
        const frameStats = extractFrameStats(tracelib);

        const testStats = {
          measures: statsByMeasure,
          frames: frameStats
        };

        const json = JSON.stringify(testStats, null, 2);
        fs.writeFileSync(path.resolve(traceDir, 'stats.json'), json);
      }



      // extract from its trace.json:
      //   - frame durations
      //   - user timing api measures
      // use perf-stats thing to get count, min, max, mean, median
      // store that in a stats.json for each test
      // then combine those into an aggregate-stats.json for each test type (outside of date dirs)
      // ascii table showing delta?
      // generate an index.html with a table?
    }
  };
}

/**
 *
 * @param {Tracelib} tracelib Tracelib instance
 */
function extractStatsByMeasure(tracelib) {
  const durationsByMeasure = extractDurationsByMeasure(tracelib);

  return Object.entries(durationsByMeasure)
    .map(([measure, durations]) => {
      return {
        measure,
        stats: calcStats(durations)
      }
    });
}

function extractDurationsByMeasure(tracelib) {
  return tracelib.getMainTrackEvents()
    // just the user timing events
    .filter(event => event.categoriesString === 'blink.user_timing')
    // only events with a duration, which are the performance.measure() events
    .filter(event => 'duration' in event)
    // group durations by measure name
    .reduce((byMeasure, event) => {
      const measure = event.name;
      byMeasure[measure] = byMeasure[measure] || [];
      byMeasure[measure].push(event.duration);
      return byMeasure;
    }, {});
}

function extractFrameStats(tracelib) {
  const times = tracelib.getFPS().times;
  const durations = [];

  // every 2 times is a single duration
  for (let i = 0; i < times.length; i += 2) {
    const start = times[i];
    const end = times[i + 1];

    // TODO figure out why there are sometimes an odd number of times
    if (start != null && end != null) {
      durations.push(end - start);
    }
  }

  return calcStats(durations);
}
