/* The characters picker: the same panel, a grid, and a search that answers to
 * either language. */
const h = require('./harness.js');
const { window, doc, $, setCaret, click, key, type, is } = h;

const cite = () => doc.querySelector('#bar > .rcx-btn-cite');
const glyphs = () => doc.querySelector('#bar > .rcx-btn-chars');
const tiles = () => [...doc.querySelectorAll('.rcx-tile')];
const chosen = () => doc.querySelector('.rcx-tile.rcx-on')?.textContent;

is('the characters button is beside the citation one', !!glyphs(), true);
is('and stands after it', cite()?.nextElementSibling, glyphs());
is('with an omega drawn in it', glyphs()?.querySelector('svg.rcx-icon')?.querySelectorAll('path').length, 3);

const p = doc.getElementById('p1').firstChild;
setCaret(p, p.data.length);
click(glyphs());
is('the grid opens', !!doc.querySelector('.rcx-chars'), true);
is('it says where the character goes',
   $('.rcx-chars .rcx-where').textContent.startsWith('after'), true);
is('and shows everything until you type', tiles().length > 60, true);

type('greater');
is('an English name finds it', tiles().map((t) => t.textContent).join(''), '>≥');
type('maggiore');
is('and so does the Italian one', tiles().map((t) => t.textContent).join(''), '>≥');
type('≤');
is('a character finds itself', tiles().map((t) => t.textContent).join(''), '≤');

type('freccia');
is('the arrows answer to freccia', tiles().length, 6);
key($('.rcx-chars .rcx-q'), 'ArrowRight');
is('the arrow keys move along the row', chosen(), '←');
key($('.rcx-chars .rcx-q'), 'ArrowDown');
is('and down a whole row, or as far as the row goes', chosen(), '⇒');
// back to the first tile: a row shorter than nine columns clamps rather than
// wrapping, so five lefts from the last one is the whole row
for (let i = 0; i < 5; i++) key($('.rcx-chars .rcx-q'), 'ArrowLeft');
is('and back to the beginning', chosen(), '→');
key($('.rcx-chars .rcx-q'), 'Enter');
is('return writes it at the caret', doc.getElementById('p1').textContent,
   'The flame sign is seen on sagittal post contrast T1 weighted imaging.→');
is('through the editor rather than round the back',
   window.__commands.filter((c) => c === 'insertText').length > 0, true);
is('the grid closed', doc.querySelector('.rcx-chars'), null);

click(glyphs());
is('and it is remembered for next time', doc.querySelector('.rcx-group')?.textContent, 'Lately');
is('at the front of the grid', tiles()[0]?.textContent, '→');

click(cite());
is('opening the citations closes the characters', doc.querySelector('.rcx-chars'), null);
is('and the other way round', !!doc.querySelector('.rcx-panel'), true);
click(glyphs());
is('one panel at a time', doc.querySelectorAll('.rcx-panel').length, 1);
key($('.rcx-chars .rcx-q'), 'Escape');
h.done();
