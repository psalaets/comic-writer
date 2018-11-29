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
      token: 'dialogue',
      dedent: true
    },
    {
      regex: /^\tsfx ?(\([^]+\))?: ?[^]+/i,
      sol: true,
      token: 'sfx',
      dedent: true
    },
    {
      regex: /^\tcaption ?(\([^]+\))?: ?[^]+/i,
      sol: true,
      token: 'caption',
      dedent: true
    },
    {
      regex: /^[^]+: ?[^]+/,
      sol: true,
      token: 'meta'
    }
  ],
};