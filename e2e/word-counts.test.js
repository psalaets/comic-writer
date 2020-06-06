import * as assert from 'assert';

import * as selectors from './selectors';

fixture('word counts')
  .page('http://localhost:3000');

test('captions have word counts', async t => {
  const wordCount = selectors.wordCount(2);

  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'caption')

  await t.expect(wordCount.textContent).eql('1');

  await t
    .typeText(selectors.editorInput(), ' content')

  await t.expect(wordCount.textContent).eql('2');
});

test('dialogues have word counts', async t => {
  const wordCount = selectors.wordCount(2);

  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'dialogue')

  await t.expect(wordCount.textContent).eql('1');

  await t
    .typeText(selectors.editorInput(), ' content')

  await t.expect(wordCount.textContent).eql('2');
});

test('sfx do not have word counts', async t => {
  const wordCount = selectors.wordCount(2);

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
    .typeText(selectors.editorInput(), 'boom')

  await t.expect(wordCount.exists).notOk();
});

test('apostrophe words are 1 word', async t => {
  const wordCount = selectors.wordCount(2);

  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'it didn\'t')

  await t.expect(wordCount.textContent).eql('2');
});

test('hyphenated words are 2 words', async t => {
  const wordCount = selectors.wordCount(2);

  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'is it Spider-Man?')

  await t.expect(wordCount.textContent).eql('4');
});

test('page has no word count if it has no spoken words', async t => {
  const pageCount = selectors.wordCount(0);

  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')

  await t.expect(pageCount.exists).notOk();
});

test('panel has no word count if it has no spoken words', async t => {
  const panelCount = selectors.wordCount(1);

  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')

  await t.expect(panelCount.exists).notOk();
});

test('panel word count is sum of its lettering spoken word counts', async t => {
  const panelCount = selectors.wordCount(1);

  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // caption
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'caption content') // 2 spoken words
    .pressKey('enter')
    // balloon
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'this is dialogue') // 3 spoken words
    .pressKey('enter')
    // sfx
    .pressKey('tab')
    .pressKey('down')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'boom') // 0 spoken words

  await t.expect(panelCount.textContent).eql('5');
});

test('page word count is sum of its own lettering and its panel word counts', async t => {
  const pageCount = selectors.wordCount(0);

  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    // caption directly in page
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'one two three') // 3 spoken words
    .pressKey('enter')
    // balloon directly in page
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'blah') // 1 spoken word
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // sfx directly in page
    .pressKey('tab')
    .pressKey('down')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'ka pow') // 0 spoken words
    .pressKey('enter')
    // caption
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'caption content') // 2 spoken words
    .pressKey('enter')
    // balloon
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'this is dialogue') // 3 spoken words
    .pressKey('enter')
    // sfx
    .pressKey('tab')
    .pressKey('down')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'boom') // 0 spoken words
    .pressKey('enter')
    // another panel
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // caption
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'another caption') // 2 spoken words
    .pressKey('enter')

  await t.expect(pageCount.textContent).eql('11');
});

test('other panels do not affect a panel\'s word count', async t => {
  const firstPanelCount = selectors.wordCount(1);

  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // caption
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'first panel') // 2 spoken words
    .pressKey('enter')
    // another panel
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // caption
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'and another panel') // 3 spoken words
    .pressKey('enter')

  await t.expect(firstPanelCount.textContent).eql('2');
});

test('other pages do not affect a page\'s word count', async t => {
  const firstPageCount = selectors.wordCount(0);

  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // caption
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'first page') // 2 spoken words
    .pressKey('enter')
    // another page
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    // caption
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'second page') // 2 spoken words
    .pressKey('enter')

  await t.expect(firstPageCount.textContent).eql('2');
});
