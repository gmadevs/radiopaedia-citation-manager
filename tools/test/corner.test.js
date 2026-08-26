/* No toolbar anywhere: the button still has to appear. */
process.env.PAGE = 'plain';
const h = require('./harness.js');
const { doc, $, setCaret, click, type, key, is } = h;

const button = doc.querySelector('.rcx-btn');
is('there is a button', !!button, true);
is('pinned in the corner', button?.classList.contains('rcx-solo'), true);
is('and it is on the body, not in the form', button?.parentElement?.tagName, 'BODY');
is('only one of them', doc.querySelectorAll('.rcx-btn').length, 1);

// and it still does the job
const p = doc.getElementById('p1').firstChild;
setCaret(p, p.data.length);
click(button);
is('the panel opens from it', !!$('.rcx-panel'), true);
type('ependymoma');
key($('.rcx-q'), 'Enter');
is('and cites', doc.getElementById('p1').innerHTML,
   'The flame sign is seen on sagittal post contrast T1 weighted imaging <sup>2</sup>.');
h.done();
