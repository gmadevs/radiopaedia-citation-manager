// The page with TinyMCE on it: the marker goes in through the editor's own
// insert, and comes out in the same place as everywhere else.
process.env.TINY = '1';
const h = require('./harness.js');
require('./insert.cases.js')(h);

h.is('the marker went in through the editor\'s own insert',
     h.window.__mce.includes('mceInsertContent'), true);
h.is('and the browser was never asked to raise anything',
     h.window.__commands.includes('superscript'), false);
h.done();
