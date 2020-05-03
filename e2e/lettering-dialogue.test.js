import * as assert from 'assert';

import * as selectors from './selectors';
import { editorLines } from './helpers';

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
    .typeText(selectors.editorContent(), 'this is the dialogue content')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    bob: this is the dialogue content'
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
    .typeText(selectors.editorContent(), 'this is the dialogue content')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    bob (OFF): this is the dialogue content'
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
    '    bob: first balloon',
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
    '    bob: first balloon',
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
    '    zzz: first balloon',
    '    aaa: second balloon',
    '    ZZZ: third balloon',
  ]);
});
