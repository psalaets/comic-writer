import * as selectors from './selectors';
import * as helpers from './helpers';
import { preloadBitchPlanetScript } from './helpers';

fixture('outline')
  .page('http://localhost:3000');

test('each page gets an item in the outline', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')

  const firstPageItem = selectors.outlineSpreadItem(0);
  const secondPageItem = selectors.outlineSpreadItem(1);

  await t.expect(firstPageItem.exists).ok();
  await t.expect(firstPageItem.textContent).eql('Page 1');

  await t.expect(secondPageItem.exists).ok();
  await t.expect(secondPageItem.textContent).eql('Page 2');
});

test('each panel gets an item in the outline', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')

  const firstPanelItem = selectors.outlinePanelItem(0, 0);
  const secondPanelItem = selectors.outlinePanelItem(0, 1);

  await t.expect(firstPanelItem.exists).ok();
  await t.expect(firstPanelItem.textContent).eql('1.(no description)');

  await t.expect(secondPanelItem.exists).ok();
  await t.expect(secondPanelItem.textContent).eql('2.(no description)');
});

test('panel description is shown in outline, if panel has one', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'It is a dark and stormy night.')
    .pressKey('enter')

  const panelItem = selectors.outlinePanelItem(0, 0);

  await t.expect(panelItem.exists).ok();
  await t.expect(panelItem.textContent).eql('1.It is a dark and stormy night.');
});

test('only paragraphs before lettering are considered the panel description', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'before')
    .pressKey('enter')
    // lettering starts here
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'bob')
    .pressKey('tab')
    .typeText(selectors.editorInput(), 'blah blah blah')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'after')

  const panelItem = selectors.outlinePanelItem(0, 0);

  await t.expect(panelItem.exists).ok();
  await t.expect(panelItem.textContent).eql('1.before');
});

test('clicking page in outline scrolls editor to that page', async t => {
  await preloadBitchPlanetScript();

  const spreadItem = selectors.outlineSpreadItem(4);

  await t.click(spreadItem);

  // clicked item becomes current
  const currentSpreadItem = spreadItem.withAttribute('class', /c-outline__spread-item--current/);

  await t.expect(currentSpreadItem.exists).ok();
  await t.expect(currentSpreadItem.textContent).eql('Page 5');

  // editor was scrolled to show page
  await t.expect(selectors.pageLine('Page 5').exists).ok();
});

test('clicking panel in outline scrolls editor to that panel', async t => {
  await preloadBitchPlanetScript();

  const panelItem = selectors.outlinePanelItem(3, 2);

  await t.click(panelItem);

  // clicked item becomes current
  const currentPanelItem = panelItem.withAttribute('class', /c-outline__panel-list-item--current/);

  await t.expect(currentPanelItem.exists).ok();
  await t.expect(currentPanelItem.textContent).eql('3.Grandma, looks up at Penny while she stirs.');

  // editor was scrolled to show panel
  await t.expect(selectors.paragraphLine('Grandma, looks up at Penny while she stirs.').exists).ok();
});

// this was a bug from an earlier version of the outline
test('click an item, scroll editor away, click same item again puts editor back on the item', async t => {
  await preloadBitchPlanetScript();

  const spreadItem = selectors.outlineSpreadItem(1);

  await t.click(spreadItem);

  // page visible after clicking page item
  await t.expect(selectors.pageLine('Page 2').exists).ok();

  await helpers.scrollEditorBy(2000);

  await t.click(spreadItem);

  // page visible after clicking page item again
  await t.expect(selectors.pageLine('Page 2').exists).ok();
});
