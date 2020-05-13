import * as assert from 'assert';

import * as selectors from './selectors';
import { editorLines, getSelectedText } from './helpers';

fixture('dialogue')
  .page('http://localhost:3000');

test('for new speaker, only using keyboard', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'dialogue content')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    BOB: dialogue content'
  ]);
});

test('with modifier for new speaker, only using keyboard', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'bob')
    .typeText(selectors.editorContent(), ' ')
    .pressKey('shift+9')
    .typeText(selectors.editorContent(), 'OFF')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'dialogue content')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    BOB (OFF): dialogue content'
  ]);
});

test('for existing speaker, only using keyboard', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // first balloon
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'first balloon')
    .pressKey('enter')
    // second balloon, select bob from popup
    .pressKey('tab')
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'second balloon')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    BOB: first balloon',
    '    BOB: second balloon',
  ]);
});

test('with modifier for existing speaker, only using keyboard', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // first balloon
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'first balloon')
    .pressKey('enter')
    // second balloon, select bob from popup
    .pressKey('tab')
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter')
    .typeText(selectors.editorContent(), ' ')
    .pressKey('shift+9')
    .typeText(selectors.editorContent(), 'OFF')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'second balloon')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    BOB: first balloon',
    '    BOB (OFF): second balloon',
  ]);
});

test('speakers in popup are in abc order', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // first balloon
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'zzz')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'first balloon')
    .pressKey('enter')
    // second balloon
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'aaa')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'second balloon')
    .pressKey('enter')
    // third balloon, need to arrow past aaa to select zzz from popup
    .pressKey('tab')
    .pressKey('down')
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'third balloon')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    ZZZ: first balloon',
    '    AAA: second balloon',
    '    ZZZ: third balloon',
  ]);
});

test('speakers in popup are filtered as you type', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // first balloon
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'janice')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'first balloon')
    .pressKey('enter')
    // second balloon
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'jonathan')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'second balloon')
    .pressKey('enter')
    // third balloon, filter so janice option is gone and arrow down once to jon
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'jo')
    .pressKey('down')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'third balloon')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    JANICE: first balloon',
    '    JONATHAN: second balloon',
    '    JONATHAN: third balloon',
  ]);
});

test('filter down to a single option and select it', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // first balloon
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'first balloon')
    .pressKey('enter')
    // second balloon
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'bob')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'second balloon')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    BOB: first balloon',
    '    BOB: second balloon',
  ]);
});


test('selecting character option with arrows and tab', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // create a balloon to get a character name in the hint popup
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'bob')
    .pressKey('tab')
    .pressKey('tab')
    // lettering starts here
    .pressKey('tab')
    .pressKey('down')
    .pressKey('down')
    .pressKey('tab')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    BOB: content',
    '    BOB: content'
  ]);

  await t.expect(getSelectedText()).eql('');
});

test('selecting character option with mouse', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // create a balloon to get a character name in the hint popup
    .pressKey('tab')
    .typeText(selectors.editorContent(), 'bob')
    .pressKey('tab')
    .pressKey('tab')
    // lettering starts here
    .pressKey('tab')
    // click character hint item
    .click(selectors.letteringHintsItem(2))

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    BOB: content',
    '    BOB: content'
  ]);

  await t.expect(getSelectedText()).eql('');
});
