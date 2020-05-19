import * as selectors from './selectors';

fixture('panel counts')
  .page('http://localhost:3000');

test('page with no panels yet', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')

  const panelCount = selectors.panelCount(0);

  await t.expect(panelCount.exists).notOk();
});


test('page with one panel', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')

  const panelCount = selectors.panelCount(0);

  await t.expect(panelCount.textContent).eql('(1 panel)');
});

test('page with two panels', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')

  const panelCount = selectors.panelCount(0);

  await t.expect(panelCount.textContent).eql('(2 panels)');
});

test('remove one panel from page with two panels', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // delete enough characters to make it no longer a panel
    .pressKey('backspace')
    .pressKey('backspace')

  const panelCount = selectors.panelCount(0);

  await t.expect(panelCount.textContent).eql('(1 panel)');
});

test('remove the only panel from page', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // delete enough characters to make it no longer a panel
    .pressKey('backspace')
    .pressKey('backspace')

  const panelCount = selectors.panelCount(0);

  await t.expect(panelCount.exists).notOk();
});

test('panel counts are per page', async t => {
  const panelCount = selectors.panelCount(0);

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')

  await t.expect(panelCount.textContent).eql('(2 panels)');

  await t.typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    // adding a panel to page 2 doesn't affect page 1's panel count
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')

  await t.expect(panelCount.textContent).eql('(2 panels)');
});

test('panel count goes away when its page line is no longer a page', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // move back to top line
    .pressKey('up')
    .pressKey('up')
    // move over to after last char
    .pressKey('right')
    .pressKey('right')
    .pressKey('right')
    .pressKey('right')
    .pressKey('right')
    .pressKey('right')
    // delete page number which makes that line no longer a page
    .pressKey('backspace')

  const panelCount = selectors.panelCount(0);

  await t.expect(panelCount.exists).notOk();
});
