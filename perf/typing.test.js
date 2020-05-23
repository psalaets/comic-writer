const puppeteer = require('puppeteer');

const createReporter = require('./reporter').create;
const EditorObject = require('./editor-object').EditorObject;

describe('typing performance', () => {
  let page, browser, editor;
  let reporter;

  beforeAll(() => {
    reporter = createReporter();
  });

  afterAll(()=> {
    try {
      reporter.finalize();
    }
    catch(e) {
      console.error(e);
    }
  });

  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();

    await page.setViewport({
      width: 1200,
      height: 800
    });

    editor = new EditorObject(page);

    await page.goto('http://localhost:3000');
    await editor.preLoadBitchPlanet();
    await page.reload();
  });

  afterEach(async () => {
    await browser.close();

    page = null;
    browser = null;
    editor = null;
  });

  test('typing top of script', async () => {
    await page.tracing.start(traceOptions(reporter.addTest('typing-at-top-of-script')));

    await editor.type('abc '.repeat(15), 0);

    await page.tracing.stop();
  });

  test('typing lettering words', async () => {
    await page.tracing.start(traceOptions(reporter.addTest('typing-in-caption')));

    await editor.scrollDownBy(3200);

    await editor.type('abc '.repeat(15), 1);

    await page.tracing.stop();
  });

  test('typing panel description words', async () => {
    await page.tracing.start(traceOptions(reporter.addTest('typing-in-panel-description')));

    await editor.scrollDownBy(2900);

    await editor.type('abc '.repeat(15), 1);

    await page.tracing.stop();
  });

  // Based on how the parser works right now, I think this is the worst case
  // edit (aside from pasting an entirely new script). It causes all pages to be
  // re-numbered which means all pages need to be re-parsed.
  test('toggle page at top of script', async () => {
    await page.tracing.start(traceOptions(reporter.addTest('toggle-page-at-top-of-script')));

    // move down a bit to guarantee this happens on a blank line
    await editor.pressEnter(0);
    await editor.pressEnter(1);

    await editor.type('page 1', 2);

    for (let i = 0; i < 15; i++) {
      await sleep(125);
      await editor.pressBackspace(2);
      await sleep(125);
      await editor.type('1', 2);
    }

    await page.tracing.stop();
  });
});

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

function traceOptions(tracePath) {
  return {
    path: tracePath,
    screenshots: false,
  };
}
