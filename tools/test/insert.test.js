// Through the editor's own execCommand, which is how a real browser does it.
const h = require('./harness.js');
require('./insert.cases.js')(h);

/* And it really went that way. Without this the suite would pass just as
 * happily on the DOM fallback, and the path that matters on the real editor
 * would be the one nothing had ever run. */
h.is('the marker was written with the editor\'s own commands',
     h.window.__commands.join(' ').includes('insertText superscript'), true);
h.is('and the space was not, so no &nbsp; lands in the article',
     h.window.__commands.filter((c) => c === 'insertText').length,
     h.window.__commands.filter((c) => c === 'superscript').length);
h.done();
