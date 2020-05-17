import * as selectors from './selectors';
import { editorLines } from './helpers';

fixture('pages')
  .page('http://localhost:3000');

test('one page', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Page 1',
    ''
  ]);
});

test('two pages', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Page 2',
    ''
  ]);
});

test('insert page between existing pages', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .pressKey('up')
    .pressKey('enter')
    .pressKey('up')
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Page 2',
    '',
    'Page 3',
    ''
  ]);
});

test('one page range', async t => {
  await t
    .typeText(selectors.editorContent(), 'pages')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Pages 1-2',
    ''
  ]);
});

test('two page ranges', async t => {
  await t
    .typeText(selectors.editorContent(), 'pages')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'pages')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Pages 1-2',
    'Pages 3-4',
    ''
  ]);
});

test('insert page range between existing page ranges', async t => {
  await t
    .typeText(selectors.editorContent(), 'pages')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'pages')
    .pressKey('enter')
    .pressKey('up')
    .pressKey('enter')
    .pressKey('up')
    .typeText(selectors.editorContent(), 'pages')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Pages 1-2',
    'Pages 3-4',
    '',
    'Pages 5-6',
    ''
  ]);
});

test('insert page range between existing single pages', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .pressKey('up')
    .pressKey('enter')
    .pressKey('up')
    .typeText(selectors.editorContent(), 'pages')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Pages 2-3',
    '',
    'Page 4',
    ''
  ]);
});

// This is an random bug I came across when testing something else
test('delete page number after first load', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    // wait for value to be stored in localstorage
    .wait(1000)

  await t.eval(() => location.reload(true))

  await t
    .wait(1000)
    .click(selectors.editorContent())
    .pressKey('backspace')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Page ',
    ''
  ]);
});
