const stylelint = require('stylelint');
const junitFormatter = require('stylelint-junit-formatter');

const stylelintOptions = {
  files: './src/**/*.css',
  formatter: junitFormatter,
};

stylelint.lint(stylelintOptions)
  .then((resultObject) => {
    // Do something with the result, e.g. write a report.xml to disk:
  console.log(resultObject.output);
});
