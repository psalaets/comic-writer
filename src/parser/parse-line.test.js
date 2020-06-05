import {
  parseSpread,
  parsePanel,
  parseMetadata,
  parseParagraph,
  parseCaption,
  parseDialogue,
  parseSfx
} from './parse';

describe('parse lines', () => {
  describe('parseSpread', () => {
    test('single page', () => {
      const result = parseSpread('Page 2', []);

      expect(result).toEqual({
        type: 'spread',
        pageCount: 1,
        children: [],

        panelCount: 0,
        speakers: [],
        dialogueCount: 0,
        captionCount: 0,
        sfxCount: 0,
        dialogueWordCount: 0,
        captionWordCount: 0
      });
    });

    test('double page', () => {
      const result = parseSpread('Pages 2-3', []);

      expect(result).toEqual({
        type: 'spread',
        pageCount: 2,
        children: [],

        panelCount: 0,
        speakers: [],
        dialogueCount: 0,
        captionCount: 0,
        sfxCount: 0,
        dialogueWordCount: 0,
        captionWordCount: 0
      });
    });

    test('3+ page range', () => {
      const result = parseSpread('Pages 3-6', []);

      expect(result).toEqual({
        type: 'spread',
        pageCount: 4,
        children: [],

        panelCount: 0,
        speakers: [],
        dialogueCount: 0,
        captionCount: 0,
        sfxCount: 0,
        dialogueWordCount: 0,
        captionWordCount: 0
      });
    });

    test('partial page range', () => {
      const result = parseSpread('Pages 2-', []);

      expect(result).toEqual({
        type: 'spread',
        pageCount: 1,
        children: [],

        panelCount: 0,
        speakers: [],
        dialogueCount: 0,
        captionCount: 0,
        sfxCount: 0,
        dialogueWordCount: 0,
        captionWordCount: 0
      });
    });

    test('case insensitive', () => {
      const result = parseSpread('PAGE 1', []);

      expect(result).toEqual({
        type: 'spread',
        pageCount: 1,
        children: [],

        panelCount: 0,
        speakers: [],
        dialogueCount: 0,
        captionCount: 0,
        sfxCount: 0,
        dialogueWordCount: 0,
        captionWordCount: 0
      });
    });
  });

  describe('parsePanel', () => {
    test('single', () => {
      const result = parsePanel('Panel 3');

      expect(result).toEqual({
        type: 'panel',
        number: 3,
        children: [],

        speakers: [],
        dialogueCount: 0,
        captionCount: 0,
        sfxCount: 0,
        dialogueWordCount: 0,
        captionWordCount: 0,
      });
    });

    test('case insensitive', () => {
      const result = parsePanel('PANEL 3', []);

      expect(result).toEqual({
        type: 'panel',
        number: 3,
        children: [],

        speakers: [],
        dialogueCount: 0,
        captionCount: 0,
        sfxCount: 0,
        dialogueWordCount: 0,
        captionWordCount: 0,
      });
    });
  });

  describe('parseMetadata', () => {
    test('basic key/value', () => {
      const result = parseMetadata('Issue: 4');

      expect(result).toEqual({
        type: 'metadata',
        name: 'Issue',
        value: '4'
      });
    });

    test('multi word key/value', () => {
      const result = parseMetadata('Written by: First Last');

      expect(result).toEqual({
        type: 'metadata',
        name: 'Written by',
        value: 'First Last'
      });
    });
  });

  describe('parseParagraph', () => {
    test('paragraph', () => {
      const result = parseParagraph('It was a good day.');

      expect(result).toEqual({
        type: 'paragraph',
        content: 'It was a good day.'
      });
    });
  });

  describe('parseCaption', () => {
    test('basic', () => {
      const numbering = {
        nextLetteringNumber: () => 2
      };
      const result = parseCaption('\tCAPTION: It was a good idea.', numbering);

      expect(result).toEqual({
        type: 'caption',
        number: 2,
        modifier: null,
        content: [{
          type: 'text',
          content: 'It was a good idea.'
        }],
        wordCount: 5
      });
    });

    test('with bold', () => {
      const numbering = {
        nextLetteringNumber: () => 5
      };
      const result = parseCaption('\tCAPTION: It **was** a good idea.', numbering);

      expect(result).toEqual({
        type: 'caption',
        number: 5,
        modifier: null,
        content: [{
          type: 'text',
          content: 'It '
        }, {
          type: 'lettering-bold',
          content: 'was'
        }, {
            type: 'text',
            content: ' a good idea.'
        }],
        wordCount: 5
      });
    });

    test('with modifier', () => {
      const numbering = {
        nextLetteringNumber: () => 2
      };
      const result = parseCaption('\tCAPTION (PERSON): It was a good idea.', numbering);

      expect(result).toEqual({
        type: 'caption',
        number: 2,
        modifier: 'PERSON',
        content: [{
          type: 'text',
          content: 'It was a good idea.'
        }],
        wordCount: 5
      });
    });

    test('case insensitive', () => {
      const numbering = {
        nextLetteringNumber: () => 2
      };
      const result = parseCaption('\tcaption: It was a good idea.', numbering);

      expect(result).toEqual({
        type: 'caption',
        number: 2,
        modifier: null,
        content: [{
          type: 'text',
          content: 'It was a good idea.'
        }],
        wordCount: 5
      });
    });

  });

  describe('parseDialogue', () => {
    test('basic', () => {
      const numbering = {
        nextLetteringNumber: () => 2
      };
      const result = parseDialogue('\tBEAU: I thought it was a good idea.', numbering);

      expect(result).toEqual({
        type: 'dialogue',
        number: 2,
        speaker: 'BEAU',
        modifier: null,
        content: [{
          type: 'text',
          content: 'I thought it was a good idea.'
        }],
        wordCount: 7
      });
    });

    test('with bold', () => {
      const numbering = {
        nextLetteringNumber: () => 2
      };
      const result = parseDialogue('\tBEAU: I thought it was a **good** idea.', numbering);

      expect(result).toEqual({
        type: 'dialogue',
        number: 2,
        speaker: 'BEAU',
        modifier: null,
        content: [{
          type: 'text',
          content: 'I thought it was a '
        }, {
          type: 'lettering-bold',
          content: 'good'
        }, {
          type: 'text',
          content: ' idea.'
        }],
        wordCount: 7
      });
    });

    test('with modifier', () => {
      const numbering = {
        nextLetteringNumber: () => 2
      };
      const result = parseDialogue('\tBEAU (OFF): I thought it was a good idea.', numbering);

      expect(result).toEqual({
        type: 'dialogue',
        number: 2,
        speaker: 'BEAU',
        modifier: 'OFF',
        content: [{
          type: 'text',
          content: 'I thought it was a good idea.'
        }],
        wordCount: 7
      });
    });
  });

  describe('parseSfx', () => {
    test('basic', () => {
      const numbering = {
        nextLetteringNumber: () => 2
      };
      const result = parseSfx('\tSFX: BLAM', numbering);

      expect(result).toEqual({
        type: 'sfx',
        number: 2,
        modifier: null,
        content: 'BLAM'
      });
    });

    test('with modifier', () => {
      const numbering = {
        nextLetteringNumber: () => 5
      };
      const result = parseSfx('\tSFX (GLASS): clink', numbering);

      expect(result).toEqual({
        type: 'sfx',
        number: 5,
        modifier: 'GLASS',
        content: 'clink'
      });
    });

    test('case insensitive', () => {
      const numbering = {
        nextLetteringNumber: () => 12
      };
      const result = parseSfx('\tsfx: BLAM', numbering);

      expect(result).toEqual({
        type: 'sfx',
        number: 12,
        modifier: null,
        content: 'BLAM'
      });
    });
  });
});