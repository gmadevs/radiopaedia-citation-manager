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
is('and the citation button wears a quotation mark',
   cite()?.querySelector('svg.rcx-icon')?.querySelectorAll('path[fill="currentColor"]').length, 2);

const p = doc.getElementById('p1').firstChild;
setCaret(p, p.data.length);
click(glyphs());
is('the grid opens', !!doc.querySelector('.rcx-chars'), true);
is('it says where the character goes',
   $('.rcx-chars .rcx-where').textContent.startsWith('after'), true);
is('and shows everything until you type', tiles().length > 60, true);

type('greater');
is('an English name finds it', tiles().map((t) => t.textContent).join(''), '>≥');
type('bigger');
is('and so does a word somebody might actually type',
   tiles().map((t) => t.textContent).join(''), '>');
type('cm3');
is('cm3 finds the cubed sign', tiles().map((t) => t.textContent).join(''), '³');
type('≤');
is('a character finds itself', tiles().map((t) => t.textContent).join(''), '≤');

type('arrow');
is('arrow finds all six of them', tiles().length, 6);
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
