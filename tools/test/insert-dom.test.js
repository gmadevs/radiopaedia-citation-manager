// The same rules, with no execCommand to call: the DOM fallback.
process.env.NOCMD = '1';
const h = require('./harness.js');
require('./insert.cases.js')(h);
h.done();
