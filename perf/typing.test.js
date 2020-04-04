const playwright = require('playwright');
const perfStats = require('./stats').perfStats;
const EditorObject = require('./editor-object').EditorObject;

describe('typing performance', () => {
  let page, browser;

  beforeEach(async () => {
    const headless = true;
    browser = await playwright.chromium.launch({ headless });
    const context = await browser.newContext();

    page = await context.newPage();
    await page.goto('http://localhost:3000');
  });

  afterEach(async () => {
    await browser.close();

    page = null;
    browser = null;
  });

  test('typing into script', async () => {
    const editor = new EditorObject(page);
    await editor.loadBitchPlanet();

    await editor.type('blah!'.repeat(20), 5, 10)

    await page.waitFor(1000);

    const durations = await page.evaluate(() => {
      return performance.getEntriesByName('change-round-trip')
        .map(entry => entry.duration);
    });

    // await page.screenshot({path: 'screenie.png'})

    perfStats(durations);
  });
});
