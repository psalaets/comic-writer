import * as assert from 'assert';

import * as selectors from './selectors';
import { editorLines, getSelectedText } from './helpers';

fixture('lettering snippet common behavior')
  .page('http://localhost:3000');

test('tab enters lettering snippet', async t => {
  const snippet = selectors.activeLetteringSnippet();

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')

  await t.expect(snippet.exists).notOk();

  // this is the start of the lettering stuff
  await t
    .pressKey('tab')

  await t.expect(snippet.exists).ok();
});

test('escape closes hint popup', async t => {
  const popup = selectors.letteringHintsPopup();

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')

  await t.expect(popup.exists).ok();

  await t.
    pressKey('esc')

  await t.expect(popup.exists).notOk();
});

test('escape (with no popup) exits lettering snippet', async t => {
  const snippet = selectors.activeLetteringSnippet();

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // close popup
    .pressKey('esc')

  await t.expect(snippet.exists).ok();

  await t
    // exit snippet
    .pressKey('esc')

  await t.expect(snippet.exists).notOk();
});

test('arrow up (with no popup) exits lettering snippet', async t => {
  const snippet = selectors.activeLetteringSnippet();

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // close popup
    .pressKey('esc')

  await t.expect(snippet.exists).ok();

  await t
    // this keypress moves cursor to start of what was selected
    .pressKey('up')
    // exit snippet
    .pressKey('up')

  await t.expect(snippet.exists).notOk();
});

test('arrow down (with no popup) exits lettering snippet', async t => {
  const snippet = selectors.activeLetteringSnippet();

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // make a line below so there's room to arrow down to
    .pressKey('enter')
    .pressKey('up')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // close popup
    .pressKey('esc')

  await t.expect(snippet.exists).ok();

  await t
    // this moves cursor to end of what was selected
    .pressKey('down')
    // exit snippet
    .pressKey('down')

  await t.expect(snippet.exists).notOk();
});

test('moving to start of line (with no popup) exits lettering snippet', async t => {
  const snippet = selectors.activeLetteringSnippet();

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // close popup
    .pressKey('esc')

  await t.expect(snippet.exists).ok();

  await t
    // this moves cursor to end of what was selected
    .pressKey('left')
    // move to start of line
    .pressKey('left')

  await t.expect(snippet.exists).notOk();
});

test('shift-tab from subject area (with no popup) exits lettering snippet', async t => {
  const snippet = selectors.activeLetteringSnippet();

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // close popup
    .pressKey('esc')

  await t.expect(snippet.exists).ok();

  await t
    .pressKey('shift+tab')

  await t.expect(snippet.exists).notOk();

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    SUBJECT: content'
  ]);
});

test('hint popup selection wraps when arrowing up from first option', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('up')
    .pressKey('enter')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    SFX: content'
  ]);
});

test('hint popup selection wraps when arrowing down from last option', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION: content'
  ]);
});

test('starts with placeholder content', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    SUBJECT: content'
  ]);

  await t.expect(getSelectedText()).eql('SUBJECT');
});

test('tabbing beyond content area exits lettering snippet and adds newline', async t => {
  const snippet = selectors.activeLetteringSnippet();

  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // select item from hint popup
    .pressKey('enter')
    // tab into content area
    .pressKey('tab')
    // tab out of content area
    .pressKey('tab')

  await t.expect(snippet.exists).notOk();

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION: content',
    ''
  ]);
});

test('text is selected when tabbing between subject and content', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // clear hint popup
    .pressKey('esc')

  await t.expect(getSelectedText()).eql('SUBJECT');

  // tab into content area
  await t.pressKey('tab')

  await t.expect(getSelectedText()).eql('content');

  // back to subject area
  await t.pressKey('shift+tab')

  await t.expect(getSelectedText()).eql('SUBJECT');

  // finally back to content area
  await t.pressKey('tab')

  await t.expect(getSelectedText()).eql('content');
});

test('text is selected when tabbing between subject, modifier and content', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // clear hint popup
    .pressKey('esc')

  await t.expect(getSelectedText()).eql('SUBJECT');

  await t
    // move cursor to end of subject area
    .pressKey('right')
    // start adding modifier text
    .pressKey('space')
    .pressKey('shift+9')
    .typeText(selectors.editorContent(), 'OFF')

  // tab into content area
  await t.pressKey('tab')

  await t.expect(getSelectedText()).eql('content');

  // to modifier area
  await t.pressKey('shift+tab')

  await t.expect(getSelectedText()).eql('OFF');

  // to subject area
  await t.pressKey('shift+tab')

  await t.expect(getSelectedText()).eql('SUBJECT');

  // into modifier area
  await t.pressKey('tab')

  await t.expect(getSelectedText()).eql('OFF');

  // finally back into subject area
  await t.pressKey('tab')

  await t.expect(getSelectedText()).eql('content');
});

test('typing ( after selecting subject inserts modifier and moves to modifier tab stop', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // select first hint
    .pressKey('enter')
    .pressKey('shift+9')

  await t.expect(getSelectedText()).eql('MODIFIER');

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION (MODIFIER): content'
  ]);

  // if we're in modifier tab stop, next tab goes into content area
  await t.pressKey('tab')

  await t.expect(getSelectedText()).eql('content');
});

test('typing 1 space then ( after selecting subject inserts modifier and moves to modifier tab stop', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // select first hint
    .pressKey('enter')
    .pressKey('space')
    .pressKey('shift+9')

  await t.expect(getSelectedText()).eql('MODIFIER');

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION (MODIFIER): content'
  ]);

  // if we're in modifier tab stop, next tab goes into content area
  await t.pressKey('tab')

  await t.expect(getSelectedText()).eql('content');
});

test('typing multiple spaces then ( after selecting subject inserts modifier and moves to modifier tab stop', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // select first hint
    .pressKey('enter')
    .pressKey('space')
    .pressKey('space')
    .pressKey('shift+9')

  await t.expect(getSelectedText()).eql('MODIFIER');

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION  (MODIFIER): content'
  ]);

  // if we're in modifier tab stop, next tab goes into content area
  await t.pressKey('tab')

  await t.expect(getSelectedText()).eql('content');
});

test('modifier placeholder is not re-inserted if it is already there', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // select first hint
    .pressKey('enter')
    .pressKey('shift+9')
    .pressKey('shift+9')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION ((): content'
  ]);
});

test('modifier placeholder is not re-inserted if there are empty parens', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // select first hint
    .pressKey('enter')
    // trigger modifier placeholder
    .pressKey('shift+9')
    // clear modifier placeholder, but not parens
    .pressKey('backspace')
    // try another open paren
    .pressKey('shift+9')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION ((): content'
  ]);
});

test('modifier placeholder is not re-inserted if there are parens containing only whitespace', async t => {
  await t
    .typeText(selectors.editorContent(), 'page')
    .pressKey('enter')
    .typeText(selectors.editorContent(), 'panel')
    .pressKey('enter')
    // this is the start of the lettering stuff
    .pressKey('tab')
    // select first hint
    .pressKey('enter')
    // trigger modifier placeholder
    .pressKey('shift+9')
    // put a space between parens
    .pressKey('space')
    // try another open paren
    .pressKey('shift+9')

  const lines = await editorLines();

  await t.expect(lines).eql([
    'Page 1',
    'Panel 1',
    '    CAPTION ( (): content'
  ]);
});

