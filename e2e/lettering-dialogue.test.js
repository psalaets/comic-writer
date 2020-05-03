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
