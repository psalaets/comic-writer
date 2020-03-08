import applyChange from './apply-change';

describe('apply change - insert', () => {
  describe('insert single line', () => {
    test('into left of single line', () => {
      const lines = [
        'this'
      ];
      const change = {
        "from": {
          "line": 0,
          "ch": 0
        },
        "to": {
          "line": 0,
          "ch": 0
        },
        "text": [
          "a"
        ],
        "origin": "+input"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'athis'
      ]);
    });

    test('into middle of single line', () => {
      const lines = ['this'];
      const change = {
        "from": {
          "line": 0,
          "ch": 2
        },
        "to": {
          "line": 0,
          "ch": 2
        },
        "text": [
          "a"
        ],
        "origin": "+input"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'thais'
      ]);
    });

    test('into right of single line', () => {
      const lines = ['this'];
      const change = {
        "from": {
          "line": 0,
          "ch": 4
        },
        "to": {
          "line": 0,
          "ch": 4
        },
        "text": [
          "a"
        ],
        "origin": "+input"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'thisa'
      ]);
    });

    test('into left of interior line, of multi line', () => {
      const lines = [
        'this',
        'that',
        'other'
      ];
      const change = {
        "from": {
          "line": 1,
          "ch": 0
        },
        "to": {
          "line": 1,
          "ch": 0
        },
        "text": [
          "abc"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'this',
        'abcthat',
        'other'
      ]);
    });

    test('into middle of interior line, of multi line', () => {
      const lines = [
        'this',
        'that',
        'other'
      ];
      const change = {
        "from": {
          "line": 1,
          "ch": 2
        },
        "to": {
          "line": 1,
          "ch": 2
        },
        "text": [
          "abc"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'this',
        'thabcat',
        'other'
      ]);
    });

    test('into right of interior line, of multi line', () => {
      const lines = [
        'this',
        'that',
        'other'
      ];
      const change = {
        "from": {
          "line": 1,
          "ch": 4
        },
        "to": {
          "line": 1,
          "ch": 4
        },
        "text": [
          "abc"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'this',
        'thatabc',
        'other'
      ]);
    });
  });

  describe('insert multi line', () => {
    test('into left of single line', () => {
      const lines = ['this'];
      const change = {
        "from": {
          "line": 0,
          "ch": 0
        },
        "to": {
          "line": 0,
          "ch": 0
        },
        "text": [
          "one",
          "two"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'one',
        'twothis'
      ]);
    });

    test('into middle of single line', () => {
      const lines = ['this'];
      const change = {
        "from": {
          "line": 0,
          "ch": 2
        },
        "to": {
          "line": 0,
          "ch": 2
        },
        "text": [
          "one",
          "two"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'thone',
        'twois'
      ]);
    });

    test('into right of single line', () => {
      const lines = ['this'];
      const change = {
        "from": {
          "line": 0,
          "ch": 4
        },
        "to": {
          "line": 0,
          "ch": 4
        },
        "text": [
          "one",
          "two"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'thisone',
        'two'
      ]);
    });

    test('into middle of interior line, of multi line', () => {
      const lines = [
        'this',
        'that',
        'other'
      ];
      const change = {
        "from": {
          "line": 1,
          "ch": 2
        },
        "to": {
          "line": 1,
          "ch": 2
        },
        "text": [
          "one",
          "two",
          "three"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'this',
        'thone',
        'two',
        'threeat',
        'other'
      ]);
    });
  });
});
