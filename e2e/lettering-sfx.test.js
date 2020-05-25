import * as assert from 'assert';

import * as selectors from './selectors';
import { editorLines, getSelectedText } from './helpers';

fixture('sfx')
  .page('http://localhost:3000');

test('only using keyboard', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('down')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'deet')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    SFX: deet'
  ]);
});

test('with modifier, only using keyboard', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('down')
    .pressKey('enter')
    .typeText(selectors.editorInput(), ' ')
    .pressKey('shift+9')
    .typeText(selectors.editorInput(), 'DOOR')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'CREAK')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    SFX (DOOR): CREAK'
  ]);
});

test('filter down to a single option and select it', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // lettering starts here
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'sfx')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'BLAM')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    SFX: BLAM'
  ]);
});

test('selecting sfx option with arrows and tab', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // lettering starts here
    .pressKey('tab')
    .pressKey('down')
    .pressKey('tab')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    SFX: content'
  ]);

  await t.expect(getSelectedText()).eql('');
});


test('selecting sfx option with mouse', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // lettering starts here
    .pressKey('tab')
    // click sfx hint item
    .click(selectors.letteringHintsItem(1))

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    SFX: content'
  ]);

  await t.expect(getSelectedText()).eql('');
});
