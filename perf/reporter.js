const Tracelib = require('tracelib').default;
const path = require('path');
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
      const data = require(path.resolve(traceDirs[0], 'trace.json'))
      const measures = extractUserTimingMeasures(data);

      console.log(measures);


      // for every test that was added
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
 * @param {???} traceData Value parsed out of trace.json
 */
function extractUserTimingMeasures(traceData) {
  const tasks = new Tracelib(traceData.traceEvents);
  return tasks.getMainTrackEvents()
    // just the user timing events
    .filter(event => event.categoriesString === 'blink.user_timing')
    // only events with a duration, which are the performance.measure() events
    .filter(event => 'duration' in event);
}
