import * as assert from 'assert';

import * as selectors from './selectors';
import { editorLines, getSelectedText, lettering } from './helpers';

fixture('dialogue')
  .page('http://localhost:3000');

test('for new speaker, only using keyboard', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'dialogue content')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('BOB: dialogue content')
  ]);
});

test('with modifier for new speaker, only using keyboard', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
    .typeText(selectors.editorInput(), ' ')
    .pressKey('shift+9')
    .typeText(selectors.editorInput(), 'OFF')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'dialogue content')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('BOB (OFF): dialogue content')
  ]);
});

test('for existing speaker, only using keyboard', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // first balloon
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'first balloon')
    .pressKey('enter')
    // second balloon, select bob from popup
    .pressKey('tab')
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'second balloon')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('BOB: first balloon'),
    lettering('BOB: second balloon'),
  ]);
});

test('with modifier for existing speaker, only using keyboard', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // first balloon
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'first balloon')
    .pressKey('enter')
    // second balloon, select bob from popup
    .pressKey('tab')
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter')
    .typeText(selectors.editorInput(), ' ')
    .pressKey('shift+9')
    .typeText(selectors.editorInput(), 'OFF')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'second balloon')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('BOB: first balloon'),
    lettering('BOB (OFF): second balloon'),
  ]);
});

test('speakers in popup are in abc order', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // first balloon
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'zzz')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'first balloon')
    .pressKey('enter')
    // second balloon
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'aaa')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'second balloon')
    .pressKey('enter')
    // third balloon, need to arrow past aaa to select zzz from popup
    .pressKey('tab')
    .pressKey('down')
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'third balloon')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('ZZZ: first balloon'),
    lettering('AAA: second balloon'),
    lettering('ZZZ: third balloon'),
  ]);
});

test('speakers in popup are filtered as you type', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // first balloon
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'janice')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'first balloon')
    .pressKey('enter')
    // second balloon
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'jonathan')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'second balloon')
    .pressKey('enter')
    // third balloon, filter so janice option is gone and arrow down once to jon
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'jo')
    .pressKey('down')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'third balloon')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('JANICE: first balloon'),
    lettering('JONATHAN: second balloon'),
    lettering('JONATHAN: third balloon'),
  ]);
});

test('filter down to a single option and select it', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // first balloon
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'first balloon')
    .pressKey('enter')
    // second balloon
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'second balloon')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    lettering('BOB: first balloon'),
    lettering('BOB: second balloon'),
  ]);
});


test('selecting character option with arrows and tab', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // create a balloon to get a character name in the hint popup
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
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
    lettering('BOB: content'),
    lettering('BOB: content')
  ]);

  await t.expect(getSelectedText()).eql('');
});

test('selecting character option with mouse', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // create a balloon to get a character name in the hint popup
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
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
    lettering('BOB: content'),
    lettering('BOB: content')
  ]);

  await t.expect(getSelectedText()).eql('');
});
