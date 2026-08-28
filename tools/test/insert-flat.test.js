// An editor that types the number and then will not raise it: the marker has
// to come out superscript all the same, wrapped by hand.
process.env.NOSUP = '1';
const h = require('./harness.js');
require('./insert.cases.js')(h);

h.is('the number was typed with the editor\'s own command',
     h.window.__commands.includes('insertText'), true);
h.is('and the superscript it refused was asked for first',
     h.window.__commands.includes('superscript'), true);
h.done();
