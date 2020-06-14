import * as assert from 'assert';

import * as selectors from './selectors';
import { editorLines, getSelectedText, lettering } from './helpers';

fixture('bold shortcut')
  .page('http://localhost:3000');

test('lettering with content selected', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'content')
    .doubleClick('.cm-lettering-content')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: **content**')
  ]);

  await t.expect(getSelectedText()).eql('content');
});

test('lettering with partial content selected', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'content')
    .pressKey('shift+left')
    .pressKey('shift+left')
    .pressKey('shift+left')
    // .doubleClick('.cm-lettering-content')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: cont**ent**')
  ]);

  await t.expect(getSelectedText()).eql('ent');
});

test('lettering with no content selected', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'content')
    .pressKey('meta+b')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: content****')
  ]);

  // hacky way to check that cursor was between the star pairs
  await t
    .pressKey('backspace')
    .pressKey('backspace')
    .pressKey('backspace')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: conten**')
  ]);
});

test('lettering with no content', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .pressKey('backspace')
    .pressKey('meta+b')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: ****')
  ]);

  // hacky way to check that cursor was between the star pairs
  await t
    .pressKey('backspace')
    .pressKey('backspace')
    .pressKey('backspace')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION:**')
  ]);
});

test('lettering with cursor in middle of a word', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'content')
    .pressKey('left')
    .pressKey('left')
    .pressKey('left')
    .pressKey('meta+b')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: cont****ent')
  ]);

  // hacky way to check that cursor was between the star pairs
  await t
    .pressKey('backspace')
    .pressKey('backspace')
    .pressKey('backspace')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: con**ent')
  ]);
});

test('lettering with repeated uses', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'content')
    .doubleClick('.cm-lettering-content')
    .pressKey('meta+b')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: ****content****')
  ]);

  await t.expect(getSelectedText()).eql('content');
});

test('undoing bold command', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'content')
    .doubleClick('.cm-lettering-content')
    .pressKey('meta+b')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: **content**')
  ]);

  await t.expect(getSelectedText()).eql('content');

  await t
    .pressKey('meta+z')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: content')
  ]);

  await t.expect(getSelectedText()).eql('content');
});

test('paragraph with word selected', async t => {
  await t
    .typeText(selectors.editorInput(), 'blah')
    .pressKey('shift+left')
    .pressKey('shift+left')
    .pressKey('shift+left')
    .pressKey('shift+left')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    '**blah**'
  ]);

  await t.expect(getSelectedText()).eql('blah');
});

test('paragraph with word partially selected', async t => {
  await t
    .typeText(selectors.editorInput(), 'blah')
    .pressKey('shift+left')
    .pressKey('shift+left')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'bl**ah**'
  ]);

  await t.expect(getSelectedText()).eql('ah');
});

test('paragraph with nothing selected', async t => {
  await t
    .typeText(selectors.editorInput(), 'blah')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'blah****'
  ]);

  // hacky way to check that cursor was between the star pairs
  await t
    .pressKey('backspace')
    .pressKey('backspace')
    .pressKey('backspace')

  await t.expect(await editorLines()).eql([
    'bla**'
  ]);
});

test('on an empty line', async t => {
  await t
    .typeText(selectors.editorInput(), 'blah')
    .pressKey('enter')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'blah',
    '****'
  ]);

  // hacky way to check that cursor was between the star pairs
  await t
    .pressKey('backspace')
    .pressKey('backspace')
    .pressKey('backspace')

  await t.expect(await editorLines()).eql([
    'blah**'
  ]);
});

test('cannot bold a page line', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .pressKey('up')
    .pressKey('shift+right')
    .pressKey('shift+right')
    .pressKey('shift+right')
    .pressKey('shift+right')
    .pressKey('shift+right')
    .pressKey('shift+right')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    ''
  ]);
});

test('cannot bold a panel line', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    .pressKey('up')
    .pressKey('shift+right')
    .pressKey('shift+right')
    .pressKey('shift+right')
    .pressKey('shift+right')
    .pressKey('shift+right')
    .pressKey('shift+right')
    .pressKey('shift+right')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    ''
  ]);
});

test('cannot bold across multiple lines', async t => {
  await t
    .typeText(selectors.editorInput(), 'one')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'two')
    .pressKey('enter')
    .pressKey('up')
    .pressKey('shift+up')
    .pressKey('shift+up')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'one',
    'two',
    ''
  ]);
});

test('cannot bold in a metadata line', async t => {
  await t
    .typeText(selectors.editorInput(), 'key: value')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'key: value'
  ]);
});

test('cannot bold in lettering meta', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'foo')
    // move to the left of the :
    .pressKey('left')
    .pressKey('left')
    .pressKey('left')
    .pressKey('left')
    .pressKey('left')
    // select some meta tokens
    .pressKey('shift+left')
    .pressKey('shift+left')
    .pressKey('shift+left')
    // try to bold them
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: foo')
  ]);
});

test('cannot bold if part of selection is in lettering meta', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'foo')
    // move to the left of the :
    .pressKey('left')
    .pressKey('left')
    .pressKey('shift+left')
    .pressKey('shift+left')
    .pressKey('shift+left')
    // select some meta tokens
    .pressKey('shift+left')
    .pressKey('shift+left')
    .pressKey('shift+left')
    // try to bold them
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: foo')
  ]);
});
