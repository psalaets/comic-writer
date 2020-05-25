import * as selectors from './selectors';
import { editorLines } from './helpers';

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
    '    CAPTION: caption content',
    'a'
  ]);
});

