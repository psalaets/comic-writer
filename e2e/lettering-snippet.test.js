import * as selectors from './selectors';

fixture('lettering snippet common behavior')
  .page('http://localhost:3000');

test('escape closes hint popup', async t => {
  const popup = selectors.letteringHintsPopup();

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')

  await t.expect(popup.exists).ok();

  await t.
    pressKey('esc')

  await t.expect(popup.exists).notOk();
});

test('escape (with no popup) exits lettering snippet', async t => {
  const snippet = selectors.activeLetteringSnippet();

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // close popup
    .pressKey('esc')

  await t.expect(snippet.exists).ok();

  await t
    // exit snippet
    .pressKey('esc')

  await t.expect(snippet.exists).notOk();
});

test('arrow up (with no popup) exits lettering snippet', async t => {
  const snippet = selectors.activeLetteringSnippet();

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // close popup
    .pressKey('esc')

  await t.expect(snippet.exists).ok();

  await t
    // this keypress moves cursor to start of what was selected
    .pressKey('up')
    // exit snippet
    .pressKey('up')

  await t.expect(snippet.exists).notOk();
});

test('arrow down (with no popup) exits lettering snippet', async t => {
  const snippet = selectors.activeLetteringSnippet();

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // make a line below so there's room to arrow down to
    .pressKey('enter')
    .pressKey('up')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // close popup
    .pressKey('esc')

  await t.expect(snippet.exists).ok();

  await t
    // this moves cursor to end of what was selected
    .pressKey('down')
    // exit snippet
    .pressKey('down')

  await t.expect(snippet.exists).notOk();
});

test('moving to start of line (with no popup) exits lettering snippet', async t => {
  const snippet = selectors.activeLetteringSnippet();

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // close popup
    .pressKey('esc')

  await t.expect(snippet.exists).ok();

  await t
    // this moves cursor to end of what was selected
    .pressKey('left')
    // move to start of line
    .pressKey('left')

  await t.expect(snippet.exists).notOk();
});

