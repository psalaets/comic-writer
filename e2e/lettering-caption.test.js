import * as assert from 'assert';

import * as selectors from './selectors';
import { editorLines } from './helpers';

fixture('caption')
  .page('http://localhost:3000');

test('only using keyboard', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'caption content')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION: caption content'
  ]);
});

test('with modifier, only using keyboard', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .typeText(selectors.editorContent(), ' ')
    .pressKey('shift+9')
    .typeText(selectors.editorContent(), 'BLAH')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'caption content')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION (BLAH): caption content'
  ]);
});

test('filter down to a single option and select it', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // lettering starts here
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'caption')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'caption content')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION: caption content'
  ]);
});
