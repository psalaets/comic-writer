import { Selector } from 'testcafe';

import { editorLines } from './helpers';

fixture('panels')
  .page('http://localhost:3000');

test('one panel', async t => {
  await t
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    ''
  ]);
});

test('two panels', async t => {
  await t
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    'Panel 2',
    ''
  ]);
});

test('insert panel between existing panels', async t => {
  await t
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')
    .pressKey('up')
    .pressKey('enter')
    .pressKey('up')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    'Panel 2',
    '',
    'Panel 3',
    ''
  ]);
});
