import * as selectors from './selectors';
import { editorLines } from './helpers';

fixture('undo / redo')
  .page('http://localhost:3000');

test('add text then undo it', async t => {
  await t
    .typeText(selectors.editorContent(), 'this will be undone')
    .pressKey('meta+z')

  await t.expect(await editorLines()).eql([
    '',
  ]);
});

test('delete text then undo it', async t => {
  await t
    .typeText(selectors.editorContent(), 'text')
    .pressKey('backspace')
    .pressKey('backspace')
    .pressKey('backspace')
    .pressKey('backspace')
    .pressKey('meta+z')

  await t.expect(await editorLines()).eql([
    'text',
  ]);
});

test('add text, undo, then redo', async t => {
  await t
    .typeText(selectors.editorContent(), 'this will come back')
    .pressKey('meta+z')
    .pressKey('shift+meta+z')

  await t.expect(await editorLines()).eql([
    'this will come back',
  ]);
});

test('undo 2 edits, then redo them', async t => {
  await t
    .typeText(selectors.editorContent(), 'first')
    .pressKey('enter')
    // pause to allow history event to be saved
    .wait(1300)
    .typeText(selectors.editorContent(), 'second')
    .pressKey('meta+z')
    .pressKey('meta+z')
    .pressKey('shift+meta+z')
    .pressKey('shift+meta+z')

  await t.expect(await editorLines()).eql([
    'first',
    'second',
  ]);
});

test('extra redos have no effect', async t => {
  await t
    .typeText(selectors.editorContent(), 'first')
    .pressKey('enter')
    // pause to allow history event to be saved
    .wait(1300)
    .typeText(selectors.editorContent(), 'second')
    // undo one edit
    .pressKey('meta+z')
    // and redo the edit
    .pressKey('shift+meta+z')
    // all these extra redos do nothing
    .pressKey('shift+meta+z')
    .pressKey('shift+meta+z')
    .pressKey('shift+meta+z')

  await t.expect(await editorLines()).eql([
    'first',
    'second',
  ]);
});

test('redo with no previous undo does nothing', async t => {
  await t
    .typeText(selectors.editorContent(), 'this is the line')
    .pressKey('shift+meta+z')

  await t.expect(await editorLines()).eql([
    'this is the line',
  ]);
});
