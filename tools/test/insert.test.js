// Through the editor's own execCommand, which is how a real browser does it.
const h = require('./harness.js');
require('./insert.cases.js')(h);

/* And it really went that way. Without this the suite would pass just as
 * happily on the DOM fallback, and the path that matters on the real editor
 * would be the one nothing had ever run. */
h.is('the marker was written with the editor\'s own commands',
     h.window.__commands.join(' ').includes('insertText superscript'), true);
/* And the space was not: every space in this script goes in as a text node,
 * because `insertText` with one at the end of a run gives a non-breaking space
 * in most engines, and an `&nbsp;` in a saved article is a thing somebody has
 * to come and take out again. */
h.is('and no space was ever typed, so no &nbsp; lands in the article',
     h.window.__typed.every((t) => !/\s/.test(t)), true);
h.done();
