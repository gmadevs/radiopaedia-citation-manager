const h = require('./harness.js');
const { window, doc, $, body, setCaret, click, key, type, wait, is, ok } = h;

const tidy = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();

const answerFor = (citation, extra = {}) => {
  const data = { search: 'x', citation, error: null,
    result: [{ meta: [Object.assign({ title: 'Rim and flame signs', journal: 'AJNR', year: 2013, pmid: '23079405', doi: '10.3174/ajnr.a3292' }, extra), { s: 'arr' }] }, { s: 'arr' }] };
  const json = JSON.stringify({ data }).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return `<html><body><div wire:snapshot="${json}"></div></body></html>`;
};

(async () => {
  // ——— mounting
  const btn = doc.querySelector('#bar > .rcx-btn');
  ok('button mounted in the toolbar', !!btn);
  is('button stands right after H3', btn?.previousElementSibling?.id, 'h3');
  is('button wears H3s classes', btn?.classList.contains('tox-tbtn'), true);
  is('every command attribute is stripped', btn?.getAttribute('data-mce-name'), null);
  is('it carries a drawn icon, not a word that a class could hide',
     btn?.querySelector('svg.rcx-icon')?.querySelectorAll('path').length, 4);
  is('and nothing of the icon it was cloned from', tidy(btn?.textContent), '');

  // ——— the panel, and "cite the last one" on open+return
  const p1 = doc.getElementById('p1').firstChild;   // "…imaging."
  setCaret(p1, p1.data.length);                     // after the full stop
  click(btn);
  ok('panel opened', !!$('.rcx-panel'));
  is('it says where the marker goes',
     $('.rcx-where').textContent.endsWith('post contrast T1 weighted imaging.'), true);
  is('the first row is the last reference', $('.rcx-row .rcx-lede-row')?.textContent, 'Last reference');
  is('and it is chosen', $('.rcx-row').classList.contains('rcx-on'), true);
  key($('.rcx-q'), 'Enter');
  is('cited the last reference, inside the sentence and spaced',
     doc.getElementById('p1').innerHTML,
     'The flame sign is seen on sagittal post contrast T1 weighted imaging <sup>3</sup>.');
  is('the panel closed', $('.rcx-panel'), null);

  // ——— merging into a marker that is already there
  const m1 = doc.getElementById('m1');
  setCaret(m1.nextSibling, 0);                      // right after </sup>
  click(btn);
  type('ependymoma');
  is('search narrows to the one reference (and a way out)', $$('.rcx-row').length, 2);
  is('the reference comes first, not the web search', $('.rcx-row .rcx-n').textContent, '2');
  is('the way out comes last', $$('.rcx-row')[1].classList.contains('rcx-row-lookup'), true);
  key($('.rcx-q'), 'Enter');
  is('merged rather than doubled', doc.getElementById('p2').innerHTML,
     'Other enhancing lesions <sup id="m1">1,2</sup> are the differential.');

  // ——— a run of three closes up into a range
  setCaret(m1.firstChild, 1);                       // inside the marker
  click(btn);
  type('haemangioblastoma');
  key($('.rcx-q'), 'Enter');
  is('1,2 and 3 becomes 1-3', doc.getElementById('m1').textContent, '1-3');

  // ——— several at once, from the tray
  const p3 = doc.getElementById('p3').firstChild;
  setCaret(p3, p3.data.length);
  click(btn);
  type('ependymoma');
  key($('.rcx-q'), 'Enter', { metaKey: true });     // to the tray
  is('the tray shows it', $('.rcx-chip')?.textContent, '2 ×');
  type('rykken');
  key($('.rcx-q'), 'Enter', { metaKey: true });
  key($('.rcx-q'), 'Enter');
  is('one marker, in order', doc.getElementById('p3').innerHTML,
     'A sentence with no stop <sup>1,2</sup>');

  // ——— the lookup: a PMID that is not down there yet
  window.__answer = require('fs').readFileSync(require('path').join(__dirname, 'cite-23079405.html'), 'utf8');
  const p1b = doc.getElementById('p1').firstChild;
  setCaret(p1b, 10);
  click(btn);
  type('99999999');
  is('offers the lookup first', $('.rcx-row-lookup .rcx-lede-row')?.textContent, 'Look up PMID 99999999');
  is('and promises the next number', $('.rcx-row-lookup .rcx-n')?.textContent, '4');
  key($('.rcx-q'), 'Enter');
  await wait(60);
  ok('asked radiopaedia.work', window.__asked.some((u) => u.includes('cite?search=99999999')));
  is('shows what came back', $('.rcx-found-head')?.textContent,
     'Rim and flame signs: postgadolinium MRI findings specific for non-CNS intramedullary spinal cord metastases.');
  is('and its meta line', $('.rcx-found-meta')?.textContent, 'AJNR Am J Neuroradiol · 2013 · PMID 23079405');
  key($('.rcx-q'), 'Enter');                        // confirm
  await wait(120);
  const boxes = [...doc.querySelectorAll('#refs textarea')];
  is('a fourth reference box, numbered and filled', boxes.length, 4);
  is('with the citation in it, links and all', boxes[3].value,
     '4. Rykken J, Diehn F, Hunt C et al. Rim and Flame Signs: Postgadolinium MRI Findings Specific ' +
     'for Non-CNS Intramedullary Spinal Cord Metastases. AJNR Am J Neuroradiol. 2013;34(4):908-15. ' +
     '<a href="https://doi.org/10.3174/ajnr.A3292">doi:10.3174/ajnr.A3292</a> - ' +
     '<a href="https://www.ncbi.nlm.nih.gov/pubmed/23079405">Pubmed</a>');
  is('and on the clipboard too', window.__copied, boxes[3].value);
  is('cited where the caret was', doc.getElementById('p1').innerHTML,
     'The flame <sup>4</sup>sign is seen on sagittal post contrast T1 weighted imaging <sup>3</sup>.');

  // ——— a PMID that IS down there already
  click(btn);
  type('23079405');
  is('offers the reference instead of a second copy',
     $('.rcx-row .rcx-lede-row')?.textContent, 'Already reference 1');
  key($('.rcx-q'), 'Escape');

  h.done();
})().catch((e) => { console.error(e); process.exit(1); });

function $$(sel) { return [...doc.querySelectorAll(sel)]; }
