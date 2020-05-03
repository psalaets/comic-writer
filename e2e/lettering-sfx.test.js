import * as assert from 'assert';

import * as selectors from './selectors';
import { editorLines } from './helpers';

fixture('sfx')
  .page('http://localhost:3000');

test('only using keyboard', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('down')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'deet')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    SFX: deet'
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
    .pressKey('down')
    .pressKey('enter')
    .typeText(selectors.editorContent(), ' ')
    .pressKey('shift+9')
    .typeText(selectors.editorContent(), 'DOOR')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'CREAK')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    SFX (DOOR): CREAK'
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
    .typeText(selectors.editorContent(), 'sfx')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'BLAM')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    SFX: BLAM'
  ]);
});
