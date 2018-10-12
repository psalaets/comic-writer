const fs = require('fs');
const stylelint = require('stylelint');
const junitFormatter = require('stylelint-junit-formatter');

const stylelintOptions = {
  files: './src/**/*.css',
  formatter: junitFormatter,
};

stylelint.lint(stylelintOptions)
  .then((resultObject) => {
  fs.writeFile('cssreport.xml', resultObject.output, (error) => console.error(error));
});
