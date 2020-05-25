import * as assert from 'assert';

import * as selectors from './selectors';
import { editorLines, getSelectedText } from './helpers';

fixture('bold shortcut')
  .page('http://localhost:3000');

test('lettering with content selected', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'content')
    .doubleClick('.cm-lettering-content')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION: **content**'
  ]);

  await t.expect(getSelectedText()).eql('content');
});

test('lettering with partial content selected', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'content')
    .pressKey('shift+left')
    .pressKey('shift+left')
    .pressKey('shift+left')
    // .doubleClick('.cm-lettering-content')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION: cont**ent**'
  ]);

  await t.expect(getSelectedText()).eql('ent');
});

test('lettering with no content selected', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'content')
    .pressKey('meta+b')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION: content****'
  ]);

  // hacky way to check that cursor was between the star pairs
  await t
    .pressKey('backspace')
    .pressKey('backspace')
    .pressKey('backspace')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION: conten**'
  ]);
});

test('lettering with no content', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
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
    '    CAPTION: ****'
  ]);

  // hacky way to check that cursor was between the star pairs
  await t
    .pressKey('backspace')
    .pressKey('backspace')
    .pressKey('backspace')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION:**'
  ]);
});

test('lettering with cursor in middle of a word', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'content')
    .pressKey('left')
    .pressKey('left')
    .pressKey('left')
    .pressKey('meta+b')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION: cont****ent'
  ]);

  // hacky way to check that cursor was between the star pairs
  await t
    .pressKey('backspace')
    .pressKey('backspace')
    .pressKey('backspace')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION: con**ent'
  ]);
});

test('lettering with repeated uses', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'content')
    .doubleClick('.cm-lettering-content')
    .pressKey('meta+b')
    .pressKey('meta+b')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION: ****content****'
  ]);

  await t.expect(getSelectedText()).eql('content');
});

test('undoing bold command', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'content')
    .doubleClick('.cm-lettering-content')
    .pressKey('meta+b')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION: **content**'
  ]);

  await t.expect(getSelectedText()).eql('content');

  await t
    .pressKey('meta+z')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION: content'
  ]);

  await t.expect(getSelectedText()).eql('content');
});

test('paragraph with word selected', async t => {
  await t
    .typeText(selectors.editorContent(), 'blah')
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
    .typeText(selectors.editorContent(), 'blah')
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
    .typeText(selectors.editorContent(), 'blah')
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
    .typeText(selectors.editorContent(), 'blah')
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

