import * as selectors from './selectors';
import * as helpers from './helpers';
import { preloadBitchPlanetScript } from './helpers';

fixture('outline')
  .page('http://localhost:3000');

test('has Top item, even when script is blank', async t => {
  const allOutlineItems = selectors.outlineItem('Top');

  await t.expect(allOutlineItems.count).eql(1);
});

test('each page gets an item in the outline', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')

  const allOutlineItems = selectors.allOutlineItems();

  // 2 spread items and Top item
  await t.expect(allOutlineItems.count).eql(3);

  const firstPageItem = allOutlineItems.nth(1);
  const secondPageItem = allOutlineItems.nth(2);

  await t.expect(firstPageItem.textContent).eql('Page 1');
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

  const firstPanelItem = selectors.outlineItem('1.(no description)');
  const secondPanelItem = selectors.outlineItem('2.(no description)');

  await t.expect(firstPanelItem.count).eql(1);
  await t.expect(secondPanelItem.count).eql(1);
});

test('panel description is shown in outline, if panel has one', async t => {
  await t
    .typeText(selectors.editorInput(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'panel')
    .pressKey('enter')
    .typeText(selectors.editorInput(), 'It is a dark and stormy night.')
    .pressKey('enter')

  const panelItem = selectors.outlineItem('1.It is a dark and stormy night.');

  await t.expect(panelItem.count).eql(1);
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

  const panelItem = selectors.outlineItem('before');

  await t.expect(panelItem.count).eql(1);
  await t.expect(panelItem.textContent).eql('1.before');
});

test('clicking page in outline scrolls editor to that page', async t => {
  await preloadBitchPlanetScript();

  const spreadItem = selectors.outlineItem('Page 5');

  await t.click(spreadItem);

  // clicked item becomes current
  const currentSpreadItem = selectors.currentOutlineItem();

  await t.expect(currentSpreadItem.count).eql(1);
  await t.expect(currentSpreadItem.textContent).eql('Page 5');

  // editor was scrolled to show page
  await t.expect(selectors.pageLine('Page 5').exists).ok();
});

test('clicking panel in outline scrolls editor to that panel', async t => {
  await preloadBitchPlanetScript();

  const page4Panel3 = selectors.outlineItem('Grandma, looks up at Penny');

  await t.click(page4Panel3);

  // clicked item becomes current
  const currentPanelItem = selectors.currentOutlineItem();

  await t.expect(currentPanelItem.count).eql(1);
  await t.expect(currentPanelItem.textContent).eql('3.Grandma, looks up at Penny while she stirs.');

  // editor was scrolled to show panel
  await t.expect(selectors.paragraphLine('Grandma, looks up at Penny while she stirs.').exists).ok();
});

// this was a bug from an earlier version of the outline
test('click an item, scroll editor away, click same item again puts editor back on the item', async t => {
  await preloadBitchPlanetScript();

  const spreadItem = selectors.outlineItem('Page 2');

  await t.click(spreadItem);

  // page visible after clicking page item
  await t.expect(selectors.pageLine('Page 2').exists).ok();

  await helpers.scrollEditorBy(2000);

  await t.click(spreadItem);

  // page visible after clicking page item again
  await t.expect(selectors.pageLine('Page 2').exists).ok();
});

test.only('current item changes as editor scrolls through pages and panels', async t => {
  await preloadBitchPlanetScript();

  const currentOutlineItem = selectors.currentOutlineItem();
  const startingItem = selectors.outlineItem('2.Inset detail: pop out a panel of just her eyes.');

  await t.click(startingItem);

  // panel 1.2 is current
  await t.expect(currentOutlineItem.count).eql(1);
  await t.expect(currentOutlineItem.textContent).contains('2.Inset detail: pop out a panel of just her eyes.');

  await helpers.scrollEditorBy(300);

  // page 2 is current
  await t.expect(currentOutlineItem.count).eql(1);
  await t.expect(currentOutlineItem.textContent).contains('Page 2');

  await helpers.scrollEditorBy(300);

  // panel 2.1 is current
  await t.expect(currentOutlineItem.count).eql(1);
  await t.expect(currentOutlineItem.textContent).contains('1.One screen. Some kind of static line indicating it is coming on-line.');

  await helpers.scrollEditorBy(300);

  // panel 2.2 is current
  await t.expect(currentOutlineItem.count).eql(1);
  await t.expect(currentOutlineItem.textContent).contains('2.FATHER DAVIDSON pops up on the screen.');

  await helpers.scrollEditorBy(100);

  // panel 2.3 is current
  await t.expect(currentOutlineItem.count).eql(1);
  await t.expect(currentOutlineItem.textContent).contains('3.Glasses on now, he puffs his cheeks out as he reads her list of offenses.');

  await helpers.scrollEditorBy(300);

  // panel 2.4 is current
  await t.expect(currentOutlineItem.count).eql(1);
  await t.expect(currentOutlineItem.textContent).contains('4.Father Davidson looks at camera/Penny.');
});

test('scrolling editor to bottom moves outline to bottom', async t => {
  await preloadBitchPlanetScript();

  // scroll down to the bottom
  await repeat(11, async () => await helpers.scrollEditorBy(3000));

  // let outline catch up to editor's jump to bottom
  await t.wait(1000)

  // check current item
  const currentPanelItem = selectors.currentOutlineItem(selectors.allOutlineItems());

  await t.expect(currentPanelItem.count).eql(1);
  await t.expect(currentPanelItem.textContent).contains('It flops back down right where it was.  She grins huge.');

  // check that outline is at bottom
  const bottomPage = selectors.outlineItem('Page 24');
  const isVisible = await helpers.isItemVisibleInOutline(bottomPage);
  await t.expect(isVisible).ok();
});

// similar to the "scroll to bottom" test except this uses keyboard
test('jumping editor to bottom moves outline to bottom', async t => {
  await preloadBitchPlanetScript();

  await t
    .click(selectors.editorInput())
    .pressKey('meta+down')
    // let outline catch up to editor's jump to bottom
    .wait(1000)

  // check current item
  const currentPanelItem = selectors.currentOutlineItem(selectors.allOutlineItems());

  await t.expect(currentPanelItem.count).eql(1);
  await t.expect(currentPanelItem.textContent).contains('Penny\'s face. Grinning. She wins.');

  // check that outline is at bottom
  const bottomPage = selectors.outlineSpreadItemByText('Page 24');
  const isVisible = await helpers.isItemVisibleInOutline(bottomPage);
  await t.expect(isVisible).ok();
});

test('scrolling editor to top moves outline to top', async t => {
  await preloadBitchPlanetScript();

  await t
    .click(selectors.editorInput())
    .pressKey('meta+down')

  // scroll back up incrementally because CM doesn't seem to detect when it
  // scrolls too much at once
  await repeat(11, async () => await helpers.scrollEditorBy(-3000));

  // let outline catch up to editor's scroll
  await t.wait(2500)

  const currentSpreadItem = selectors.currentOutlineItem(selectors.allOutlineItems());

  await t.expect(currentSpreadItem.count).eql(1);
  await t.expect(currentSpreadItem.textContent).contains('Top');

  // check that outline is at top
  const topPage = selectors.outlineItem('Page 1');
  const isVisible = await helpers.isItemVisibleInOutline(topPage);
  await t.expect(isVisible).ok();
});

// similar to the "scroll to top" test except this uses keyboard
test('jumping editor to top moves outline to top', async t => {
  await preloadBitchPlanetScript();

  await t
    .click(selectors.editorInput())
    .pressKey('meta+down')
    .pressKey('meta+up')
    // let outline catch up to editor's jump to top
    .wait(1000)

  const currentSpreadItem = selectors.currentOutlineItem(selectors.allOutlineItems());

  await t.expect(currentSpreadItem.count).eql(1);
  await t.expect(currentSpreadItem.textContent).contains('Top');

  // check that outline is at top
  const topPage = selectors.outlineItem('Page 1');
  const isVisible = await helpers.isItemVisibleInOutline(topPage);
  await t.expect(isVisible).ok();
});

test('clicking item near edge of viewport auto scrolls to get current item near middle of viewport', async t => {
  await preloadBitchPlanetScript();

  const page4Panel4 = selectors.outlineItem('Penny is leaning over another');

  await t.click(page4Panel4);

  // let outline catch up
  await t.wait(1000)

  // Page 6 is now visible because outline auto-scrolled
  const page6 = selectors.outlineItem('Page 6');
  const isVisible = await helpers.isItemVisibleInOutline(page6);
  await t.expect(isVisible).ok();

  // Top is no longer visible because outline auto-scrolled
  const topPage = selectors.outlineSpreadItemByText('Top');
  const topVisible = await helpers.isItemVisibleInOutline(topPage);
  await t.expect(topVisible).notOk();
});

test('current item near edge of viewport auto scrolls to get current item near middle of viewport', async t => {
  await preloadBitchPlanetScript();

  const page4Panel3 = selectors.outlineItem('Grandma, looks up at Penny');

  await t.click(page4Panel3);

  await helpers.scrollEditorBy(200);

  // let outline catch up to editor
  await t.wait(1000)

  // check that page 6 is now visible
  const page6 = selectors.outlineItem('Page 6');
  const isVisible = await helpers.isItemVisibleInOutline(page6);
  await t.expect(isVisible).ok();

  // Top is no longer visible because outline auto-scrolled
  const topPage = selectors.outlineSpreadItemByText('Top');
  const topVisible = await helpers.isItemVisibleInOutline(topPage);
  await t.expect(topVisible).notOk();
});

async function repeat(times, fn) {
  for (let i = 0; i < times; i++) {
    await fn();
  }
}
