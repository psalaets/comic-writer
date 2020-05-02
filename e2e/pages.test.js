import { Selector } from 'testcafe';

import { editorLines } from './helpers';

fixture('pages')
  .page('http://localhost:3000');

test('one page', async t => {
  await t
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Page 1',
    ''
  ]);
});

test('two pages', async t => {
  await t
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Page 2',
    ''
  ]);
});

test('insert page between existing pages', async t => {
  await t
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    .pressKey('up')
    .pressKey('enter')
    .pressKey('up')
    .typeText('[contenteditable=true]', 'page')
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
    .typeText('[contenteditable=true]', 'pages')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Pages 1-2',
    ''
  ]);
});

test('two page ranges', async t => {
  await t
    .typeText('[contenteditable=true]', 'pages')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'pages')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Pages 1-2',
    'Pages 3-4',
    ''
  ]);
});

test('insert page range between existing page ranges', async t => {
  await t
    .typeText('[contenteditable=true]', 'pages')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'pages')
    .pressKey('enter')
    .pressKey('up')
    .pressKey('enter')
    .pressKey('up')
    .typeText('[contenteditable=true]', 'pages')
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
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    .pressKey('up')
    .pressKey('enter')
    .pressKey('up')
    .typeText('[contenteditable=true]', 'pages')
    .pressKey('enter')

  await t.expect(await editorLines()).eql([
    'Page 1',
    'Pages 2-3',
    '',
    'Page 4',
    ''
  ]);
});
