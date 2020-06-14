import * as assert from 'assert';

import * as selectors from './selectors';
import { editorLines, getSelectedText, lettering } from './helpers';

fixture('caption')
  .page('http://localhost:3000');

test('only using keyboard', async t => {
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

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: caption content')
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
    .pressKey('enter')
    .typeText(selectors.editorInput(), ' ')
    .pressKey('shift+9')
    .typeText(selectors.editorInput(), 'BLAH')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'caption content')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION (BLAH): caption content')
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
    .typeText(selectors.editorInput(), 'caption')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'caption content')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: caption content')
  ]);
});

test('selecting caption option with arrows and tab', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // lettering starts here
    .pressKey('tab')
    .pressKey('tab')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: content')
  ]);

  await t.expect(getSelectedText()).eql('');
});


test('selecting caption option with mouse', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // lettering starts here
    .pressKey('tab')
    // click caption hint item
    .click(selectors.letteringHintsItem(0))

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('CAPTION: content')
  ]);

  await t.expect(getSelectedText()).eql('');
});
