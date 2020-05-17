
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const EditorObject = require('./editor-object').EditorObject;

describe('typing performance', () => {
  let page, browser, editor;

  beforeAll(() => ensureTraceDirectory());

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
    await page.tracing.start(traceOptions('typing-at-top-of-script.json'));

    await editor.type('abc '.repeat(15), 0);

    await page.tracing.stop();
  });

  test('typing lettering words', async () => {
    await page.tracing.start(traceOptions('typing-in-caption.json'));

    await editor.scrollDownBy(3200);

    await editor.type('abc '.repeat(15), 1);

    await page.tracing.stop();
  });

  test('typing panel description words', async () => {
    await page.tracing.start(traceOptions('typing-in-panel-description.json'));

    await editor.scrollDownBy(2900);

    await editor.type('abc '.repeat(15), 1);

    await page.tracing.stop();
  });

  // Based on how the parser works right now, I think this is the worst case
  // edit (aside from pasting an entirely new script). It causes all pages to be
  // re-numbered which means all pages need to be re-parsed.
  test('toggle page at top of script', async () => {
    await page.tracing.start(traceOptions('toggle-page-at-top-of-script.json'));

    await editor.pressEnter(0);
    await editor.pressEnter(1);

    await editor.type('page', 2);

    for (let i = 0; i < 15; i++) {
      await editor.pressEnter(2);
      await sleep(125);
      await editor.pressBackspace(3);
      await sleep(125);
      await editor.pressBackspace(2);
      await sleep(125);
    }

    await page.tracing.stop();
  });
});

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

function ensureTraceDirectory() {
  if (!fs.existsSync(traceDirectory())) {
    fs.mkdirSync(traceDirectory());
  }
}

function traceOptions(traceFile) {
  return {
    path: path.resolve(traceDirectory(), traceFile),
    screenshots: false,
  };
}

function traceDirectory() {
  return path.resolve(__dirname, 'traces');
}
