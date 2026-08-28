// The editor that will not take the browser's superscript command and does
// carry the shortcut: the marker comes out raised through ⌘. / ctrl-.
process.env.NOSUP = '1';
process.env.KEY = '1';
const h = require('./harness.js');
require('./insert.cases.js')(h);

h.is('the shortcut was actually pressed', h.window.__keys.length > 0, true);
/* And it was enough on its own: the shortcut goes first now, so the browser's
 * command — the one this editor refuses — is never reached. */
h.is('and the browser\'s command was never needed',
     h.window.__commands.includes('superscript'), false);
h.done();
