import applyChange from './apply-change';

describe('apply change - replace', () => {
  describe('adding single line', () => {
    test('to replace entire single line', () => {
      const lines = ['this'];

      const change = {
        "from": {
          "line": 0,
          "ch": 0
        },
        "to": {
          "line": 0,
          "ch": 4
        },
        "text": [
          "abc"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'abc'
      ]);
    });

    test('to replace left side of line', () => {
      const lines = ['this'];

      const change = {
        "from": {
          "line": 0,
          "ch": 0
        },
        "to": {
          "line": 0,
          "ch": 2
        },
        "text": [
          "abc"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'abcis'
      ]);
    });

    test('to replace middle of line', () => {
      const lines = ['this'];

      const change = {
        "from": {
          "line": 0,
          "ch": 1
        },
        "to": {
          "line": 0,
          "ch": 3
        },
        "text": [
          "abc"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'tabcs'
      ]);
    });

    test('to replace right side of line', () => {
      const lines = ['this'];

      const change = {
        "from": {
          "line": 0,
          "ch": 2
        },
        "to": {
          "line": 0,
          "ch": 4
        },
        "text": [
          "abc"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'thabc'
      ]);
    });

    test('to replace multiple entire lines', () => {
      const lines = ['this', 'that', 'other'];

      const change = {
        "from": {
          "line": 0,
          "ch": 0
        },
        "to": {
          "line": 2,
          "ch": 5
        },
        "text": [
          "abc"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'abc'
      ]);
    });

    test('to replace parts of multiple lines from left', () => {
      const lines = ['this', 'that', 'other'];

      const change = {
        "from": {
          "line": 0,
          "ch": 0
        },
        "to": {
          "line": 2,
          "ch": 2
        },
        "text": [
          "abc"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'abcher'
      ]);
    });

    test('to replace parts of multiple lines from right', () => {
      const lines = ['this', 'that', 'other'];

      const change = {
        "from": {
          "line": 0,
          "ch": 2
        },
        "to": {
          "line": 2,
          "ch": 5
        },
        "text": [
          "abc"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'thabc'
      ]);
    });

    test('to replace parts of multiple lines from middle', () => {
      const lines = ['this', 'that', 'other'];

      const change = {
        "from": {
          "line": 0,
          "ch": 2
        },
        "to": {
          "line": 2,
          "ch": 2
        },
        "text": [
          "abc"
        ],
        "origin": "paste"
      };

      const result = applyChange(lines, change);

      expect(result).toEqual([
        'thabcher'
      ]);
    });
  });

  describe('adding multiple lines', () => {
    test('to replace entire line', () => {
      const lines = ['this'];

      const change = {
        "from": {
          "line": 0,
          "ch": 0
        },
        "to": {
          "line": 0,
          "ch": 4
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
        'one',
        'two',
        'three'
      ]);
    });

    test('to replace left side of line', () => {
      const lines = ['this'];

      const change = {
        "from": {
          "line": 0,
          "ch": 0
        },
        "to": {
          "line": 0,
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
        'one',
        'two',
        'threeis'
      ]);
    });

    test('to replace middle of line', () => {
      const lines = ['this'];

      const change = {
        "from": {
          "line": 0,
          "ch": 1,
          "sticky": "after"
        },
        "to": {
          "line": 0,
          "ch": 3
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
        'tone',
        'two',
        'threes'
      ]);
    });

    test('to replace right side of line', () => {
      const lines = ['this'];

      const change = {
        "from": {
          "line": 0,
          "ch": 2
        },
        "to": {
          "line": 0,
          "ch": 4
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
        'thone',
        'two',
        'three'
      ]);
    });

    test('to replace parts of multiple lines from left', () => {
      const lines = ['this', 'that', 'other'];

      const change = {
        "from": {
          "line": 0,
          "ch": 0
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
        'one',
        'two',
        'threeat',
        'other'
      ]);
    });

    test('to replace parts of multiple lines from right', () => {
      const lines = ['this', 'that', 'other'];

      const change = {
        "from": {
          "line": 0,
          "ch": 2
        },
        "to": {
          "line": 2,
          "ch": 5
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
        'thone',
        'two',
        'three'
      ]);
    });

    test('to replace parts of multiple lines from middle', () => {
      const lines = ['this', 'that', 'other'];

      const change = {
        "from": {
          "line": 0,
          "ch": 2
        },
        "to": {
          "line": 2,
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
        'thone',
        'two',
        'threeher'
      ]);
    });

    test('to replace smaller multiple lines', () => {
      const lines = ['this', 'that'];

      const change = {
        "from": {
          "line": 0,
          "ch": 0
        },
        "to": {
          "line": 1,
          "ch": 4
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
        'one',
        'two',
        'three'
      ]);
    });

    test('to replace bigger multiple lines', () => {
      const lines = ['this', 'that', 'other'];

      const change = {
        "from": {
          "line": 0,
          "ch": 0
        },
        "to": {
          "line": 2,
          "ch": 5
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
        'two'
      ]);
    });
  });
});
