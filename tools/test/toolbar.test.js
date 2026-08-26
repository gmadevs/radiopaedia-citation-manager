/* Where the button ends up when the toolbar is not the one we drew.
 *
 * The editor's markup belongs to Radiopaedia and can change under us, so what
 * matters is not that H3 is found but that SOMETHING is: beside the heading
 * control when it can be recognised, at the end of the row when it cannot,
 * and in the corner of the window when there is no row at all (that last one
 * is corner.test.js, which needs a page with no toolbar in it). */
const h = require('./harness.js');
const { doc, wait, is } = h;

let n = 0;
function addEditor(bar) {
  const id = `ed${++n}`;
  const wrap = doc.createElement('div');
  wrap.innerHTML =
    `<div class="bar" id="${id}-bar">${bar}</div>` +
    `<div class="area"><div contenteditable="true" id="${id}">Some text to edit here.</div></div>`;
  doc.body.appendChild(wrap);
  return id;
}
const buttonIn = (id) => doc.getElementById(`${id}-bar`).querySelector('.rcx-btn');

(async () => {
  // H3 as an icon, named only where a screen reader would read it
  const icons = addEditor(
    '<a title="Bold"><i>B</i></a><a title="Heading 1"><i>1</i></a><a title="Heading 3"><i>3</i></a>');
  // a toolbar with no headings in it at all
  const flat = addEditor(
    '<button title="Bold">B</button><button title="Italic">I</button><button title="Link">L</button>');
  /* Radiopaedia's own toolbar, as it stands: four groups, and the FIRST is
   * the biggest. Going by size put the button at the end of that one, beside
   * the strike-out, which is what this case exists to keep from happening
   * again. */
  const groups = addEditor(
    '<span class="g"><button>B</button><button>I</button><button>x₁</button>' +
      '<button>x¹</button><button>T̶</button></span>' +
    '<span class="g"><button>1.</button><button>•</button><button>⇤</button><button>⇥</button></span>' +
    '<span class="g"><button>🔗</button><button>⛓</button></span>' +
    '<span class="g" id="heads"><button>P</button><button>H1</button><button>H2</button><button>H3</button></span>');

  await wait(500);   // the observer settles at 250ms

  is('an icon toolbar gets a button', !!buttonIn(icons), true);
  is('beside the control labelled Heading 3',
     buttonIn(icons)?.previousElementSibling?.getAttribute('title'), 'Heading 3');
  is('and it is a clone of it, stripped',
     buttonIn(icons)?.tagName + ':' + buttonIn(icons)?.getAttribute('title'), 'A:' + h.HINT);

  is('a toolbar with no headings still gets one', !!buttonIn(flat), true);
  is('at the end of the row', buttonIn(flat)?.previousElementSibling?.textContent, 'L');

  const heads = doc.getElementById('heads');
  is('a toolbar in groups puts it in the group with the headings, not the biggest one',
     !!heads.querySelector('.rcx-btn'), true);
  is('beside H3, which is the last of them',
     heads.querySelector('.rcx-btn')?.previousElementSibling?.textContent, 'H3');
  is('and the characters button right after it',
     heads.querySelector('.rcx-btn')?.nextElementSibling?.classList.contains('rcx-btn-chars'), true);
  is('and nothing else in that toolbar',
     doc.getElementById(`${groups}-bar`).querySelectorAll('.rcx-btn').length, 2);

  is('one pair per field, and no more',
     doc.querySelectorAll('.rcx-btn-cite').length, 4);
  is('and a characters button with each',
     doc.querySelectorAll('.rcx-btn-chars').length, 4);

  h.done();
})().catch((e) => { console.error(e); process.exit(1); });
