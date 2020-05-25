import * as selectors from './selectors';
import { editorLines } from './helpers';

fixture('panels')
  .page('http://localhost:3000');

test('one panel', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Panel 1',
    ''
  ]);
});

test('two panels', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
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
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    .pressKey('up')
    .pressKey('enter')
    .pressKey('up')
    .typeText(selectors.editorInput(), 'panel')
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
