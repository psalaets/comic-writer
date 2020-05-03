import { Selector } from 'testcafe';

import { panelCountSelector } from './helpers';

fixture('panel counts')
  .page('http://localhost:3000');

test('page with no panels yet', async t => {
  await t
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')

  const panelCount = panelCountSelector(0);

  await t.expect(panelCount.exists).notOk();
});


test('page with one panel', async t => {
  await t
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')

  const panelCount = panelCountSelector(0);

  await t.expect(panelCount.textContent).eql('(1 panel)');
});

test('page with two panels', async t => {
  await t
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')

  const panelCount = panelCountSelector(0);

  await t.expect(panelCount.textContent).eql('(2 panels)');
});

test('remove one panel from page with two panels', async t => {
  await t
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')
    // delete enough characters to make it no longer a panel
    .pressKey('backspace')
    .pressKey('backspace')

  const panelCount = panelCountSelector(0);

  await t.expect(panelCount.textContent).eql('(1 panel)');
});

test('remove the only panel from page', async t => {
  await t
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')
    // delete enough characters to make it no longer a panel
    .pressKey('backspace')
    .pressKey('backspace')

  const panelCount = panelCountSelector(0);

  await t.expect(panelCount.exists).notOk();
});

test('panel counts are per page', async t => {
  const panelCount = panelCountSelector(0);

  await t
    .typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')

  await t.expect(panelCount.textContent).eql('(2 panels)');

  await t.typeText('[contenteditable=true]', 'page')
    .pressKey('enter')
    // adding a panel to page 2 doesn't affect page 1's panel count
    .typeText('[contenteditable=true]', 'panel')
    .pressKey('enter')

  await t.expect(panelCount.textContent).eql('(2 panels)');
});
