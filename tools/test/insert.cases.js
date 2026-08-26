/* The house rules for where a marker lands, run twice: once through the
 * editor's own commands and once through the DOM fallback. */
module.exports = (h) => {
const { window, doc, $, setCaret, click, key, type, is } = h;
const btn = () => doc.querySelector('#bar > .rcx-btn');
const body = doc.getElementById('body');

// cite reference 2 at a caret, and give back what the block looks like after
function citeAt(html, place) {
  body.innerHTML = `<p id="t">${html}</p>`;
  const p = doc.getElementById('t');
  place(p);
  click(btn());
  type('ependymoma');            // reference 2
  key($('.rcx-q'), 'Enter');
  return doc.getElementById('t').innerHTML;
}
const endOf = (node) => (p) => { const n = node(p); setCaret(n, n.data.length); };

is('a full stop is hopped',
   citeAt('It enhances avidly.', endOf((p) => p.firstChild)),
   'It enhances avidly <sup>2</sup>.');

is('a comma is hopped',
   citeAt('It enhances avidly, and then fades.',
          (p) => setCaret(p.firstChild, 'It enhances avidly,'.length)),
   'It enhances avidly <sup>2</sup>, and then fades.');

// The marker stays AFTER the stop — the stop was not the end of anything.
is('"e.g." is not the end of a sentence',
   citeAt('Other lesions (e.g. ependymoma) enhance.',
          (p) => setCaret(p.firstChild, 'Other lesions (e.g.'.length)),
   'Other lesions (e.g. <sup>2</sup> ependymoma) enhance.');

is('a full stop before a capital is',
   citeAt('It enhances. Then it fades.',
          (p) => setCaret(p.firstChild, 'It enhances.'.length)),
   'It enhances <sup>2</sup>. Then it fades.');

is('no space is added at the start of a paragraph',
   citeAt('Enhancement is avid.', (p) => setCaret(p.firstChild, 0)),
   '<sup>2</sup>Enhancement is avid.');

is('cm<sup>3</sup> is a unit, not a citation',
   citeAt('The lesion measured 40 cm<sup>3</sup> in all.',
          (p) => setCaret(p.childNodes[2], 0)),
   'The lesion measured 40 cm<sup>3</sup> <sup>2</sup> in all.');

is('a marker already carrying a list is a citation wherever it stands',
   citeAt('The lesion<sup>1,3</sup> enhances.', (p) => setCaret(p.childNodes[1].firstChild, 1)),
   'The lesion<sup>1-3</sup> enhances.');

is('citing a number that is already in the marker changes nothing',
   citeAt('Lesions <sup>2</sup> enhance.', (p) => setCaret(p.childNodes[2], 0)),
   'Lesions <sup>2</sup> enhance.');

is('a marker before the caret is joined from the left as well',
   citeAt('Lesions <sup>5</sup> enhance.', (p) => setCaret(p.firstChild, 'Lesions '.length)),
   'Lesions <sup>2,5</sup> enhance.');

// no caret in the editor at all
doc.getSelection().removeAllRanges();
body.innerHTML = '<p id="t">Untouched.</p>';
doc.dispatchEvent(new window.Event('selectionchange'));
};
