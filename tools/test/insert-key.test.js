// The editor that will not take the browser's superscript command and does
// carry the shortcut: the marker comes out raised through ⌘. / ctrl-.
process.env.NOSUP = '1';
process.env.KEY = '1';
const h = require('./harness.js');
require('./insert.cases.js')(h);

h.is('the shortcut was actually pressed', h.window.__keys.length > 0, true);
h.is('and the superscript command was asked first, and refused',
     h.window.__commands.includes('superscript'), true);
h.done();
