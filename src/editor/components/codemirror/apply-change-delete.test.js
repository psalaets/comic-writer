import applyChange from './apply-change';

describe('apply change - delete', () => {
  test('all of the only line', () => {
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
        ""
      ],
      "origin": "+delete"
    };

    const result = applyChange(lines, change);

    expect(result).toEqual([
      ''
    ]);
  });

  test('all of many lines', () => {
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
        ""
      ],
      "origin": "+delete"
    };

    const result = applyChange(lines, change);

    expect(result).toEqual([
      ''
    ]);
  });

  test('some of many lines', () => {
    const lines = ['this', 'that', 'other'];

    const change = {
      "from": {
        "line": 0,
        "ch": 0
      },
      "to": {
        "line": 2,
        "ch": 0
      },
      "text": [
        ""
      ],
      "origin": "+delete"
    };

    const result = applyChange(lines, change);

    expect(result).toEqual([
      'other'
    ]);
  });

  test('left side of line', () => {
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
        ""
      ],
      "origin": "+delete"
    };

    const result = applyChange(lines, change);

    expect(result).toEqual([
      'is'
    ]);
  });

  test('middle of line', () => {
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
        ""
      ],
      "origin": "+delete"
    };

    const result = applyChange(lines, change);

    expect(result).toEqual([
      'ts'
    ]);
  });

  test('right side of line', () => {
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
        ""
      ],
      "origin": "+delete"
    };

    const result = applyChange(lines, change);

    expect(result).toEqual([
      'th'
    ]);
  });

  test('parts of multiple lines from left', () => {
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
        ""
      ],
      "origin": "+delete"
    };

    const result = applyChange(lines, change);

    expect(result).toEqual([
      'at',
      'other'
    ]);
  });

  test('parts of multiple lines from right', () => {
    const lines = ['this', 'that', 'other'];

    const change = {
      "from": {
        "line": 1,
        "ch": 2
      },
      "to": {
        "line": 2,
        "ch": 5
      },
      "text": [
        ""
      ],
      "origin": "+delete"
    };

    const result = applyChange(lines, change);

    expect(result).toEqual([
      'this',
      'th'
    ]);
  });

  test('parts of multiple lines from middle', () => {
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
        ""
      ],
      "origin": "+delete"
    };

    const result = applyChange(lines, change);

    expect(result).toEqual([
      'thher'
    ]);
  });
});
