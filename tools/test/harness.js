const fs = require('fs');
const { JSDOM } = require('jsdom');

const SRC = fs.readFileSync(process.env.SCRIPT, 'utf8');

const REF1 = '1. Rykken JB, Diehn FE, Hunt CH. Rim and flame signs: postgadolinium MRI findings specific for non-CNS intramedullary spinal cord metastases. (2013) AJNR. American journal of neuroradiology. 34 (4): 908-15. &lt;a href="https://doi.org/10.3174/ajnr.A3292"&gt;doi:10.3174/ajnr.A3292&lt;/a&gt; - &lt;a href="https://www.ncbi.nlm.nih.gov/pubmed/23079405"&gt;Pubmed&lt;/a&gt;';
const REF2 = '2. Smith J, Brown K. Ependymoma of the spinal cord: a review. (2019) Neuroradiology. 61 (2): 101-10. &lt;a href="https://doi.org/10.1007/s00234-019-02155-7"&gt;doi:10.1007/s00234-019-02155-7&lt;/a&gt;';
const REF3 = '3. Wilson P. Haemangioblastoma imaging features. (2021) Clinical Radiology. 76 (5): 388-95. &lt;a href="https://www.ncbi.nlm.nih.gov/pubmed/33612345"&gt;Pubmed&lt;/a&gt;';

/* Two pages. The default is shaped like a TinyMCE editor — a toolbar of
 * buttons above an iframe-less contenteditable — and `PAGE=plain` is the same
 * form with no toolbar anywhere, which is how the corner button gets tested. */
const TOOLBAR = `
  <div class="tox-editor-header"><div class="tox-toolbar"><div class="tox-toolbar__group" id="bar">
    <button class="tox-tbtn" data-mce-name="bold" aria-label="Bold"><span class="tox-tbtn__select-label">B</span></button>
    <button class="tox-tbtn" data-mce-name="p" aria-label="Paragraph"><span class="tox-tbtn__select-label">P</span></button>
    <button class="tox-tbtn" data-mce-name="h1" aria-label="Heading 1"><span class="tox-tbtn__select-label">H1</span></button>
    <button class="tox-tbtn" data-mce-name="h2" aria-label="Heading 2"><span class="tox-tbtn__select-label">H2</span></button>
    <button class="tox-tbtn" id="h3" data-mce-name="h3" aria-label="Heading 3"><span class="tox-tbtn__select-label">H3</span></button>
  </div></div></div>`;

const page = `<!doctype html><html><body>
<h1>Edit article</h1>
<div class="tox-tinymce">
  ${process.env.PAGE === 'plain' ? '' : TOOLBAR}
  <div class="tox-sidebar-wrap"><div class="tox-edit-area"><div contenteditable="true" id="body"><p id="p1">The flame sign is seen on sagittal post contrast T1 weighted imaging.</p><p id="p2">Other enhancing lesions <sup id="m1">1</sup> are the differential.</p><p id="p3">A sentence with no stop</p></div></div></div>
</div>
<div id="refs">
  <div class="ref"><textarea>${REF1}</textarea><a href="#">Format citation</a></div>
  <div class="ref"><textarea>${REF2}</textarea><a href="#">Format citation</a></div>
  <div class="ref"><textarea>${REF3}</textarea><a href="#">Format citation</a></div>
  <button id="addref">Add another reference</button>
</div>
</body></html>`;

const dom = new JSDOM(page, {
  url: 'https://radiopaedia.org/articles/flame-sign-spinal-cord-metastasis/edit',
  runScripts: 'dangerously',
  pretendToBeVisual: true,
});
const { window } = dom;
const doc = window.document;

// —— the bits jsdom has not got, and the bits a userscript engine provides ——
window.Element.prototype.getBoundingClientRect = function () {
  return { width: 34, height: 24, top: 120, bottom: 144, left: 60, right: 94, x: 60, y: 120 };
};
window.Element.prototype.scrollIntoView = function () {};
Object.defineProperty(window.navigator, 'clipboard', {
  value: { writeText: (t) => { window.__copied = t; return Promise.resolve(); } },
  configurable: true,
});
window.GM_addStyle = () => {};

/* jsdom has no execCommand, and the script's first choice is to write through
 * the editor's own commands — so a small honest one is provided here, and
 * `NOCMD=1` takes it away again to exercise the DOM fallback instead. Both
 * paths are tested: insert.test.js runs the cases through this, and
 * insert-dom.test.js runs the same cases with it gone. */
if (!process.env.NOCMD) {
  window.__commands = [];
  doc.execCommand = function (command, ui, value) {
    window.__commands.push(command);
    const sel = doc.getSelection();
    if (!sel.rangeCount) return false;
    const range = sel.getRangeAt(0);
    if (command === 'insertText') {
      range.deleteContents();
      const node = doc.createTextNode(String(value));
      range.insertNode(node);
      const after = doc.createRange();
      after.setStart(node, node.data.length);
      after.collapse(true);
      sel.removeAllRanges();
      sel.addRange(after);
      return true;
    }
    if (command === 'superscript') {
      const sup = doc.createElement('sup');
      sup.appendChild(range.extractContents());
      range.insertNode(sup);
      const over = doc.createRange();
      over.selectNodeContents(sup);
      sel.removeAllRanges();
      sel.addRange(over);
      return true;
    }
    return false;
  };
}
window.unsafeWindow = window;
window.__asked = [];
window.GM_xmlhttpRequest = ({ url, onload }) => {
  window.__asked.push(url);
  const answer = window.__answer;
  setTimeout(() => onload({ status: 200, responseText: answer }), 0);
};

// Radiopaedia's own "add another reference": a new empty box at the end.
doc.getElementById('addref').addEventListener('click', () => {
  const box = doc.createElement('div');
  box.className = 'ref';
  box.innerHTML = '<textarea></textarea><a href="#">Format citation</a>';
  doc.getElementById('refs').insertBefore(box, doc.getElementById('addref'));
});

window.eval(SRC);

// —— the driving ——
const $ = (sel) => doc.querySelector(sel);
const body = doc.getElementById('body');

function setCaret(node, offset) {
  const sel = doc.getSelection();
  const r = doc.createRange();
  r.setStart(node, offset);
  r.collapse(true);
  sel.removeAllRanges();
  sel.addRange(r);
  doc.dispatchEvent(new window.Event('selectionchange'));
}
const click = (el, init = {}) =>
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, ...init }));
const key = (el, k, init = {}) =>
  el.dispatchEvent(new window.KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init }));
function type(text) {
  const q = $('.rcx-q');
  q.value = text;
  q.dispatchEvent(new window.Event('input', { bubbles: true }));
}
const wait = (ms = 30) => new Promise((r) => setTimeout(r, ms));

let failed = 0;
function is(what, got, want) {
  const ok = got === want;
  if (!ok) failed++;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${what}`);
  if (!ok) console.log(`         got:  ${JSON.stringify(got)}\n         want: ${JSON.stringify(want)}`);
}
function ok(what, cond) { is(what, !!cond, true); }

const HINT = /\/\/ @description[\s\S]*?\n/.test(SRC)
  ? (SRC.match(/const HINT = ([\s\S]*?);\n/) || [])[1]
  : null;

module.exports = { window, doc, $, body, setCaret, click, key, type, wait, is, ok,
                   HINT: HINT ? eval(HINT) : null,
                   done: () => process.exit(failed ? 1 : 0) };
