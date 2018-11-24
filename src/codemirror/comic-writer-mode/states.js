// This exports the states object for the comic writer simple mode.
// https://codemirror.net/demo/simplemode.html

export default {
  start: [
    {
      regex: /^page \d+/i,
      sol: true,
      token: 'cw-page'
    },
    {
      regex: /^panel \d+/i,
      sol: true,
      token: 'cw-panel'
    },
    {
      regex: /^> [^]+ ?\([^]+\)?: ?[^]+/,
      sol: true,
      token: 'cw-dialogue'
    },
    {
      regex: /^> sfx ?\([^]+\)?: ?[^]+/i,
      sol: true,
      token: 'cw-sfx'
    },
    {
      regex: /^> caption ?\([^]+\)?: ?[^]+/i,
      sol: true,
      token: 'cw-caption'
    },
    {
      regex: /^[^]+: ?[^]+/,
      sol: true,
      token: 'cw-meta'
    }
  ],
};