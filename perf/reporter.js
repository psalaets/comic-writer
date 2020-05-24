const calcStats = require('./calc-stats').calcStats;

const Mustache = require('mustache');
const Tracelib = require('tracelib').default;
const path = require('path');
const fs = require('fs');
const mkdirp = require('make-dir');

module.exports.create = create;

function create() {
  const now = new Date();
  const baseDir = path.resolve(__dirname, 'reports');
  const tests = [];

  return {
    initialize() {

    },
    addTest(testName) {
      const testDir = path.resolve(baseDir, testName);
      const traceDir = path.resolve(testDir, timestampForPath(now));
      mkdirp.sync(traceDir);

      tests.push({
        name: testName,
        traceDirectory: traceDir,
        testDirectory: testDir
      });

      return path.resolve(traceDir, 'trace.json');
    },
    finalize() {


      for (const test of tests) {
        const data = require(path.resolve(test.traceDirectory, 'trace.json'));
        const tracelib = new Tracelib(data.traceEvents);
        const stats = extractStats(tracelib);

        const historyPath = path.resolve(test.testDirectory, 'history.json');
        if (!fs.existsSync(historyPath)) {
          fs.writeFileSync(historyPath, JSON.stringify([]));
        }

        const allHistory = require(historyPath);

        for (const statObj of stats) {
          let existing = allHistory.find(entry => entry.label === statObj.label);

          if (!existing) {
            existing = {
              label: statObj.label,
              history: []
            };

            allHistory.push(existing);
          }

          existing.history.unshift({
            ...statObj.stats,
            date: timestampForHuman(now)
          });
        }

        fs.writeFileSync(historyPath, JSON.stringify(allHistory, null, 2));

        // create html report
        const html = Mustache.render(mustacheTemplate(), {
          testName: test.name,
          history: allHistory
            .slice()
            .sort((a, b) => a.label.localeCompare(b.label))
        });
        const pagePath = path.resolve(test.testDirectory, 'index.html');
        fs.writeFileSync(pagePath, html);
      }
    }
  };
}

/**
 *
 * @param {Tracelib} tracelib Tracelib instance
 */
function extractStats(tracelib) {
  const durationsByMeasure = extractDurationsByMeasure(tracelib);
  const frameStats = extractFrameStats(tracelib);

  // one "update cycle" consists of these 3 measures
  const preprocessLines = durationsByMeasure.preprocessLines;
  const applyPreprocessingChanges = durationsByMeasure['apply-preprocessing-changes'];
  const changeSourceThunk = durationsByMeasure.changeSourceThunk;

  durationsByMeasure._updateCycle = sumByIndex(
    preprocessLines,
    applyPreprocessingChanges,
    changeSourceThunk
  );

  return Object.entries(durationsByMeasure)
    .map(([measure, durations]) => {
      return {
        label: measure,
        stats: calcStats(durations)
      }
    })
    .concat({
      label: '_frameDurations',
      stats: frameStats
    })
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

function timestampForPath(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
    '-',
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
    String(date.getSeconds()).padStart(2, '0'),
  ].join('');
}

function timestampForHuman(date) {
  return [
    date.getFullYear(),
    '-',
    String(date.getMonth() + 1).padStart(2, '0'),
    '-',
    String(date.getDate()).padStart(2, '0'),
    ' ',
    String(date.getHours()).padStart(2, '0'),
    ':',
    String(date.getMinutes()).padStart(2, '0'),
    ':',
    String(date.getSeconds()).padStart(2, '0'),
  ].join('');
}

function mustacheTemplate() {
  const templatePath = path.resolve(__dirname, 'template.mustache.html');
  return fs.readFileSync(templatePath, 'utf8');
}

function sumByIndex(array1, array2, array3) {
  return array1.map((value, index) => {
    return value + array2[index] + array3[index];
  });
}
