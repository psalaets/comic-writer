import * as selectors from './selectors';
import { editorLines, lettering } from './helpers';

fixture('bugs')
  .page('http://localhost:3000');

// This is an random bug I came across when testing something else
test('delete page number after first load', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    // wait for value to be stored in localstorage
    .wait(1000)

  await t.eval(() => location.reload(true))

  await t
    .wait(1000)
    .click(selectors.editorInput())
    .pressKey('backspace')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Page ',
    ''
  ]);
});

test('any change in page after undoing deletion of page number', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'caption content')
    .pressKey('tab')
    // move back to top line
    .pressKey('up')
    .pressKey('up')
    .pressKey('up')
    // move over to after last char
    .pressKey('right')
    .pressKey('right')
    .pressKey('right')
    .pressKey('right')
    .pressKey('right')
    .pressKey('right')
    // delete page number
    .pressKey('backspace')
    // undo it
    .pressKey('meta+z')
    // arrow back down into the page and make an edit
    .pressKey('down')
    .pressKey('down')
    .pressKey('down')
    .typeText(selectors.editorInput(), 'a')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: caption content'),
    'a'
  ]);
});

test('existing panel counts are shown after page reload', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    .wait(1000);

  await t.eval(() => location.reload(true))

  const panelCount = selectors.panelCount(0);

  await t.expect(panelCount).ok();
  await t.expect(panelCount.textContent).eql('(1 panel)');
});

test('existing word counts are shown after page reload', async t => {
  const pageWordCount = selectors.wordCount(0);
  const panelWordCount = selectors.wordCount(1);
  const letteringWordCount = selectors.wordCount(2);

  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'caption content here')
    .wait(1000)

  await t.eval(() => location.reload(true))

  await t.expect(pageWordCount).ok();
  await t.expect(pageWordCount.textContent).eql('3');

  await t.expect(panelWordCount).ok();
  await t.expect(panelWordCount.textContent).eql('3');

  await t.expect(letteringWordCount).ok();
  await t.expect(letteringWordCount.textContent).eql('3');
});

test('hyphen after page number leaves cursor in wrong spot', async t => {
  await t
    .typeText(selectors.editorInput(), 'pages 1-2')

  await t.expect(await editorLines()).eql([
    'Pages 1-2'
  ]);
});
