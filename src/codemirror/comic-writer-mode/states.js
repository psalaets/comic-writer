// This exports the states object for the comic writer simple mode.
// https://codemirror.net/demo/simplemode.html

export default {
  start: [
    {
      regex: /^page \d+/i,
      sol: true,
      token: 'page'
    },
    {
      regex: /^panel \d+/i,
      sol: true,
      token: 'panel'
    },
    {
      regex: /^\t[^]+ ?(\([^]+\))?: ?[^]+/,
      sol: true,
      token: 'dialogue'
    },
    {
      regex: /^\tsfx ?(\([^]+\))?: ?[^]+/i,
      sol: true,
      token: 'sfx'
    },
    {
      regex: /^\tcaption ?(\([^]+\))?: ?[^]+/i,
      sol: true,
      token: 'caption'
    },
    {
      regex: /^[^]+: ?[^]+/,
      sol: true,
      token: 'meta'
    }
  ],
};