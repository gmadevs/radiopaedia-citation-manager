/* What the panel makes of what you typed.
 *
 * The classification is not cosmetic: an identifier puts the lookup row FIRST,
 * where return looks it up, and words put it LAST, where return cites the
 * reference you already have. Getting that backwards would turn the commonest
 * press in the panel into a web request nobody asked for. */
const h = require('./harness.js');
const { doc, $, setCaret, click, type, key, is } = h;

const btn = () => doc.querySelector('#bar > .rcx-btn');
const rows = () => [...doc.querySelectorAll('.rcx-row')];

function offer(query) {
  if (!$('.rcx-panel')) {
    const p = doc.getElementById('p1').firstChild;
    setCaret(p, p.data.length);
    click(btn());
  }
  type(query);
  const first = rows()[0];
  return {
    first: first?.querySelector('.rcx-lede-row')?.textContent || '',
    lookupIsFirst: !!first?.classList.contains('rcx-row-lookup'),
    lookupIsLast: !!rows()[rows().length - 1]?.classList.contains('rcx-row-lookup'),
  };
}

const kind = (query, want) => is(`${query}  →  ${want}`, offer(query).first, want);

kind('29876543', 'Look up PMID 29876543');
kind('pmid: 29876543', 'Look up PMID pmid: 29876543');
kind('PMC7964488', 'Look up PMCID PMC7964488');
kind('10.1016/j.crad.2020.01.001', 'Look up DOI 10.1016/j.crad.2020.01.001');
kind('https://doi.org/10.1016/j.crad.2020.01.001',
     'Look up DOI https://doi.org/10.1016/j.crad.2020.01.001');
kind('doi:10.1016/j.crad.2020.01.001', 'Look up DOI doi:10.1016/j.crad.2020.01.001');
kind('S0140-6736(20)30183-5', 'Look up PII S0140-6736(20)30183-5');
kind('S0140673620301835', 'Look up PII S0140673620301835');
kind('B978-0-12-374984-0.00001-1', 'Look up PII B978-0-12-374984-0.00001-1');
kind('9780323393041', 'Look up ISBN 9780323393041');
kind('isbn 978-0-323-39304-1', 'Look up ISBN isbn 978-0-323-39304-1');
kind('zyTCAlFPjgYC', 'Look up Google Books zyTCAlFPjgYC');
kind('https://en.wikipedia.org/wiki/Flame_sign',
     'Look up URL https://en.wikipedia.org/wiki/Flame_sign');
kind('www.radiopaedia.org/articles/flame-sign',
     'Look up URL www.radiopaedia.org/articles/flame-sign');
// and one long enough that the row would otherwise wrap
kind('https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7964488/?report=classic',
     'Look up URL https://www.ncbi.nlm.nih.gov/pmc/articles/PMC…');

is('an identifier is offered first', offer('PMC7964488').lookupIsFirst, true);
is('a twelve-letter word is not a Google Books id',
   offer('haemorrhagic').first, 'Search radiopaedia.work for “haemorrhagic”');
is('and where something matches, the search is the way out and not the way',
   offer('ependymoma').lookupIsLast, true);
is('words cite what is already there',
   offer('ependymoma').first, '');
is('the PMID of a reference you have gets that reference',
   offer('23079405').first, 'Already reference 1');
is('and so does its DOI',
   offer('10.3174/ajnr.A3292').first, 'Already reference 1');
is('and so does a link it carries',
   offer('https://www.ncbi.nlm.nih.gov/pubmed/23079405').first, 'Already reference 1');

key($('.rcx-q'), 'Escape');
h.done();
