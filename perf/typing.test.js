const playwright = require('playwright');
const EditorObject = require('./editor-object').EditorObject;

describe('typing performance', () => {
  let page, browser, editor;

  beforeEach(async () => {
    const headless = false;
    browser = await playwright.chromium.launch({ headless });
    const context = await browser.newContext();

    page = await context.newPage();

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

  test('typing into script', async () => {
    await editor.type('1234'.repeat(20), 5)

    // await page.waitFor(1000);

    const stats = await editor.getStats('change-round-trip');
    console.log(stats);
  });
});
