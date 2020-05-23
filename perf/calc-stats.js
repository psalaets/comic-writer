module.exports.calcStats = function calcStats(values) {
  return {
    count: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    mean: mean(values),
    median: median(values),
    // all: values
  };
}

function median(values) {
  let copy = values
    .slice()
    .sort((a, b) => a - b);

  while (copy.length > 2) {
    copy = copy.slice(1, -1)
  }

  return copy.length === 1 ? copy[0] : mean(copy);
}

function mean(values) {
  if (values.length === 0) return NaN;

  const sum = values.reduce((sum, curr) => sum + curr, 0);
  return sum / values.length;
}
