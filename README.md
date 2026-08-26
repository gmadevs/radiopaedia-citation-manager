<div align="center">

<img src="docs/logo.svg" alt="" width="128">

# Radiopaedia Cite

**A citation picker in the article editor's own toolbar, right beside `H3`.**

Press it and type. The references the article already has, filtered as you write — one press puts
the number in the text, exactly where the caret was, in the shape the house style asks for: spaced,
inside the sentence, joined to the marker beside it rather than doubled. Paste an identifier the
article has not got yet — a DOI, a PMID, a URL — and it is looked up on
[radiopaedia.work/cite](https://radiopaedia.work/cite), shown to you in full, and on your say-so
**added as the next numbered reference and cited in the same press**.

And beside it, a **`Ω`** for the characters that are not on the keyboard: `≤` `≥` `±` `×` `≈` `°`
`µ` `²` `³` `→` `β` `Δ`, found by name.

[![Install](https://img.shields.io/badge/Install-userscript-2ea44f?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://raw.githubusercontent.com/gmadevs/radiopaedia-citation-manager/main/radiopaedia-cite.user.js)

[![Version](https://img.shields.io/github/v/release/gmadevs/radiopaedia-citation-manager?color=blue)](https://github.com/gmadevs/radiopaedia-citation-manager/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-black)](LICENSE)
[![Userscript](https://img.shields.io/badge/userscript-Tampermonkey-00485B?logo=tampermonkey&logoColor=white)](https://www.tampermonkey.net/)
[![No build step](https://img.shields.io/badge/dependencies-none-lightgrey)](radiopaedia-cite.user.js)
[![One file](https://img.shields.io/github/size/gmadevs/radiopaedia-citation-manager/radiopaedia-cite.user.js?label=one%20file&color=lightgrey)](radiopaedia-cite.user.js)
[![Tests](https://img.shields.io/badge/tests-111%20checks-2ea44f)](tools/test)
[![Last commit](https://img.shields.io/github/last-commit/gmadevs/radiopaedia-citation-manager?color=blue)](https://github.com/gmadevs/radiopaedia-citation-manager/commits/main)

</div>

```
caret in the text  →  ❝  →  ⏎                     →  the reference you added last
                           type a word, ⏎         →  the reference that matches it
                           paste a DOI, ⏎ ⏎       →  looked up, added as N, cited as N

                      Ω  →  type a name, ⏎        →  ≤ ≥ ± × ≈ ~ ° µ ² ³ → β Δ …

               …haemangioblastoma) <sup>1</sup>.     a space before, inside the sentence
               <sup>2</sup> + 3   → <sup>2,3</sup>   joined, never doubled
               <sup>2,3</sup> + 4 → <sup>2-4</sup>   and closed up when they run on
```

---

## Contents

- [Installing](#installing)
- [The three ways to cite](#the-three-ways-to-cite)
- [Where the number goes](#where-the-number-goes)
- [Adding a reference you have not got](#adding-a-reference-you-have-not-got)
- [Several at once](#several-at-once)
- [The characters that are not on the keyboard](#the-characters-that-are-not-on-the-keyboard)
- [The keys](#the-keys)
- [What it writes, and what it does not](#what-it-writes-and-what-it-does-not)
- [How it finds the toolbar](#how-it-finds-the-toolbar)
- [When something is not right](#when-something-is-not-right)
- [The tests](#the-tests)
- [Not done, on purpose](#not-done-on-purpose)
- [Settings](#settings)
- [License](#license)

---

## Installing

This is a **userscript**, not an extension. You install a userscript manager once — every major
browser has one, Safari included — and from then on the script updates itself from this repository
and the manager stays out of the way. That is also why there is nothing to install per browser
here: it is the same one file everywhere.

**1. Install a userscript manager.**

<div align="center">

[![Chrome](https://img.shields.io/badge/Chrome-Tampermonkey-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
[![Edge](https://img.shields.io/badge/Edge-Tampermonkey-0078D7?style=for-the-badge&logo=microsoftedge&logoColor=white)](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
[![Firefox](https://img.shields.io/badge/Firefox-Tampermonkey-FF7139?style=for-the-badge&logo=firefoxbrowser&logoColor=white)](https://addons.mozilla.org/firefox/addon/tampermonkey/)
[![Safari](https://img.shields.io/badge/Safari-Userscripts-1B9AF7?style=for-the-badge&logo=safari&logoColor=white)](https://apps.apple.com/app/userscripts/id1463298887)

</div>

| browser | what to install | worth knowing |
| :-- | :-- | :-- |
| Chrome | [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) | nothing extra |
| Edge | [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) | nothing extra |
| Firefox | [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) | nothing extra |
| Safari | [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) — free, macOS and iOS | enable it in Safari → Settings → Extensions, and give it permission on `radiopaedia.org` |

[Violentmonkey](https://violentmonkey.github.io/) works just as well on the first three. Nothing
here is particular to one of them: the script asks for `GM_xmlhttpRequest`, `GM_addStyle` and
`unsafeWindow`, and nothing else.

**2. Open [`radiopaedia-cite.user.js`](https://raw.githubusercontent.com/gmadevs/radiopaedia-citation-manager/main/radiopaedia-cite.user.js).**
The manager recognises any URL ending in `.user.js` and offers to install it; from then on it
checks the same URL for updates on its own. Failing that: Dashboard → **+** (new script) → paste
the file → save.

**3. Open any article's Edit page.** Two buttons appear in the editor's toolbar, next to `H3`.

Nothing to configure, no account, no key. It does nothing at all on any other page.

It sits happily beside **[Radiopaedia Lint](https://github.com/gmadevs/radiopaedia-lint-userscript)**
and the two do not overlap: that one checks what a reference *says*, this one manages what number it
*is*. A citation added here is fetched from the same `radiopaedia.work/cite` that the `Lint citation`
chip checks against, so it lands already agreeing with it.

## The three ways to cite

Put the caret where the citation belongs, press `[1]` (or <kbd>alt</kbd><kbd>shift</kbd><kbd>C</kbd>),
and the panel opens with the words you are citing after shown along the top — so there is never a
question of where the marker is about to land.

**The one you added last.** It is the row the panel opens on, already chosen, because it is the
reference you are most likely to be citing: you are writing the paragraph you added it for. Open,
return, done.

**One you already have.** Type any word of it — an author, the journal, the year, or the number
itself. The list narrows as you write and what matched is lit up in the line. Return cites it.

**One you have not got yet.** Paste [an identifier](#adding-a-reference-you-have-not-got) and it is
looked up.

Paste an identifier you have *already* cited and the panel says so — **Already reference 7** — and
offers you that number instead of a second copy of the same paper. Which is, in practice, the
fastest way of asking "which number was that paper again?". It recognises the paper by its DOI, its
PMID, its PMCID, or by a link the reference already carries.

## Where the number goes

A marker is `<sup>1</sup>`, with **a space in front of it**, and it sits **inside** the sentence:

> …distinguished from other enhancing spinal cord lesions (e.g. ependymoma, astrocytoma and
> haemangioblastoma) <sup>1</sup>.

Both of those are easy to get wrong by hand, so neither is left to the hand:

- **The space** is added when the character before the caret is not one already — and not added at
  the start of a paragraph, or when there is a space there.
- **The full stop** is hopped: a caret parked immediately after the end of a sentence goes back
  inside it, where the marker belongs. Commas, semicolons and colons likewise. A full stop that is
  *not* the end of anything — `e.g.`, `i.e.`, `Fig.` — is left alone, because what follows it is a
  small letter.

And when the caret is already beside a marker, the number **joins** it rather than standing a second
`<sup>` next to the first:

| what is there | you cite | what you get |
|---|---|---|
| `<sup>2</sup>` | 3 | `<sup>2,3</sup>` |
| `<sup>2,3</sup>` | 4 | `<sup>2-4</sup>` |
| `<sup>4,2</sup>` | 9 | `<sup>2,4,9</sup>` |
| `<sup>2</sup>` | 2 | `<sup>2</sup>`, unchanged |

The whole marker is written back out from the numbers, so it also comes back sorted and
deduplicated — which is the other thing hand-typed markers get wrong.

`cm<sup>3</sup>` is a unit and not a citation, and it is left alone. What tells them apart is the
space in front: a marker has one, an exponent never does. (A superscript that already says `1,2` or
`2-4` is a citation wherever it stands — nothing is raised to the power of "1,2".)

## Adding a reference you have not got

It takes anything [radiopaedia.work/cite](https://radiopaedia.work/cite) takes:

| | |
|---|---|
| **DOI** | `10.3174/ajnr.A3292`, `doi:10.3174/…`, or a `doi.org` link |
| **PMID** | `23079405` |
| **PMCID** | `PMC7964488` |
| **PII** | Elsevier's item identifier — `S0140-6736(20)30183-5`, punctuated or not |
| **ISBN** | `9780323393041`, hyphenated or not |
| **Google Books** | a volume id — `zyTCAlFPjgYC` |
| **URL** | a link to the paper, a Wikipedia page, or any other website |

Anything else you type is treated as words: the references you already have are searched first, and
a plain search of the citation tool is offered at the *bottom* of the list rather than the top —
because "ependymoma" is overwhelmingly "cite the ependymoma paper I already have", and a lookup row
standing above that would turn the commonest press in the panel into a web request nobody asked for.

Paste the identifier, press return, and it goes to
[radiopaedia.work/cite](https://radiopaedia.work/cite) — the same worker that resolves a reference
against Crossref, PubMed, Google Books or Elsevier and gives back the canonical form of it.

What comes back is **shown before anything is written**: the title, the journal and the year, and
underneath them the citation itself, word for word, numbered with the number it is about to get.
A mistyped PMID resolves perfectly well to somebody else's paper, and the only person who can tell
is the one who knows which paper they meant.

One more return and three things happen:

1. Radiopaedia's own **Add another reference** is pressed and the new box is filled in with
   `N. …` — their button, so the form fields are numbered the way the server expects;
2. the marker `<sup>N</sup>` goes in at the caret;
3. the line goes to the **clipboard** as well, so a lookup is never lost even if the box could not
   be made.

`N` is the next free number: the number of boxes, or the highest number written in them, whichever
is larger. Handing out a number that is already taken is the one failure that quietly sends a marker
to the wrong paper, so it errs upward.

If the reference list is numbered out of step with itself — a `1, 2, 2, 4` — the panel says so along
the bottom, and cites what is *written* in front of each reference rather than where it sits.
Renumbering is not done here: it would mean rewriting every marker in the article, which is a
different tool with a different appetite for risk.

## Several at once

A paragraph resting on three papers is written `<sup>2,5,9</sup>`, not three markers in a row.
<kbd>⌘</kbd><kbd>⏎</kbd> (<kbd>ctrl</kbd><kbd>⏎</kbd> on Windows) drops the chosen number in the tray
above the search box and clears the box for the next search; <kbd>⏎</kbd> cites the whole tray, in
one marker, in order. <kbd>⌫</kbd> on an empty box takes the last one back.

## The characters that are not on the keyboard

The second button, `Ω`. A report says `≤5 mm`, `±2 SD`, `40 cm³`, `β-hCG`, `T1 → T2` — and every one
of those costs a detour through a system palette, or a key combination that is different on every
keyboard layout.

Same panel, same search, same return key, a grid instead of a list. Each character answers to the
words somebody would actually type looking for it: `lt` and `smaller` find `<`, `cm2` finds `²`,
`at least` finds `≥`, `leads to` finds `→`, `sd` finds `±`. Paste a character and it finds itself.
Six groups — maths and comparison, units and fractions, arrows, typography, Greek, signs — and the
ones you have used lately move to the top and stay there between sessions.

<kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> move through the grid, <kbd>⏎</kbd> writes the
character at the caret, and the foot of the panel names whatever is under the cursor — so `′` and
`″` and `‘` and `’`, which are four different marks and one shape, can be told apart before you
commit to one.

## The keys

| | |
|---|---|
| <kbd>alt</kbd><kbd>shift</kbd><kbd>C</kbd> | open the citations panel (works from inside the editor) |
| <kbd>alt</kbd><kbd>shift</kbd><kbd>X</kbd> | open the characters grid |
| <kbd>↑</kbd> <kbd>↓</kbd> | choose |
| <kbd>⏎</kbd> | cite it — or look it up, or confirm what came back |
| <kbd>⌘</kbd><kbd>⏎</kbd> | put it in the tray and keep searching |
| <kbd>⌫</kbd> | on an empty box: take the last one out of the tray |
| <kbd>esc</kbd> | close |

## What it writes, and what it does not

The marker is written **with the editor's own commands** — `insertText`, then `superscript`, which
is precisely what pressing `x¹` runs. So what lands in the article is the markup *this* editor makes
for a superscript, and markup it will not turn round and undo: an editor that keeps a whitelist and
runs it over its own document whenever something changes it will quietly unwrap a `<sup>` that was
put there behind its back, leaving the number in the text at full size — the one failure that looks
like it worked. Where there is no `execCommand` to call, the node goes in by hand instead. (The
space in front is always written by hand: `insertText` with a space gives a non-breaking one in most
engines, and an `&nbsp;` in the saved article is something somebody has to come and take out again.)

Two places, both of them yours to undo:

- the `<sup>` in the editor — selectable and deletable like any other text, and on TinyMCE it is on
  the undo stack, so <kbd>⌘</kbd><kbd>Z</kbd> takes it back;
- a new box at the bottom of the reference list.

**Nothing is saved.** The form is still sitting there unsubmitted; the Save button is yours to press
as it always was.

The text of a reference is never rewritten — not the ones already there, and not the one it adds
after it has added it. If what is down there differs from what the databases say, that is
[Radiopaedia Lint](https://github.com/gmadevs/radiopaedia-lint-userscript)'s `Lint citation` chip's
business, not this script's.

One request leaves the browser, to `radiopaedia.work`, per lookup you confirm — and a lookup only
ever happens because you typed an identifier and pressed return. Reading the references costs
nothing: they are in the form. The answer is kept for the tab, so pasting the same PMID twice asks
once.

## How it finds the toolbar

**From the text outwards**, which is the opposite of how you would first write it. A contenteditable
is not a matter of opinion: it is found, and then the search walks *up* from it until it meets an
ancestor holding rows of controls standing **before** that text. Among those rows, the one that wins
is **the row with a heading control in it** — not the row with the most in it. Radiopaedia's toolbar
comes in four groups and the first of them (`B` `I` `x₁` `x¹` `T̶`) is the biggest; going by size put
the button beside the strike-out, which is both the wrong place and a place where it is easy not to
notice that it is the wrong place.

Then, inside that row:

| | |
|---|---|
| beside **H3** | recognised by its text, or by the label a screen reader would read out (`aria-label`, `title`, `data-mce-name`) |
| beside **H2** or **H1** | when H3 cannot be recognised |
| at the **end of the row** | when none of them can — which is where the headings are anyway |
| **pinned to the corner** of the window | when there is no row of controls at all. Ugly, and always visible, which is what counts when the alternative is nothing |

The first version of this looked for a control whose text was `H3` and worked back from there. That
is one assumption too many — it takes the toolbar to be made of `<button>`s and the heading control
to carry its name as text rather than as an icon — and when either is wrong there is no button
anywhere on the page and nothing to say why.

The looks are borrowed the same way. The button **is** the control it stands beside, cloned — same
tag, same classes, same padding, same hover — with every attribute except `class` and `style`
stripped off it, on the button and on whatever it wraps. That stripping is the part that matters: an
editor binds its commands through `data-` attributes and ids, and a clone that kept them would be a
button that inserts a citation *and* turns your paragraph into a heading.

The **inside**, though, is emptied and drawn again rather than relabelled. A toolbar of icons hides
its text — a sprite in the background and a text-indent, an icon font and a glyph in `::before`, a
`font-size: 0` — so a clone of one with a word written into it is a button that is there, and takes
the press, and cannot be seen. What goes in instead is an inline SVG of a number in brackets, drawn
in strokes that owe the stylesheet nothing.

## When something is not right

**No button.** Open the console: the script prints one line on every edit page it runs on.

```
[Radiopaedia Cite] active · /articles/…/edit · editor page: true · editable fields: 1
                  · buttons: beside H3 · references: 11
```

No line at all means the script is not running — check it is enabled and that the page is under
`radiopaedia.org`. `editable fields: 0` means it is running and cannot see the editor at all.
`buttons: NONE` means it found the text and could not place anything, which should not happen: there
is a corner to fall back on.

For anything else, ask the page directly:

```js
radiopaediaCite.look()
```

It prints what the script can see — the fields, what it took for a toolbar, what the controls in
that toolbar are called, and which one it decided to stand beside. It reads and returns; it changes
nothing. That output is what an issue about a missing button should carry.

**"click in the text first".** The panel needs to know where the marker goes, and it takes that from
the last place the caret was inside the article text. Click in the text, then press the button.

**"The citation tool could not be reached" / a Cloudflare notice.** Open
[radiopaedia.work](https://radiopaedia.work) in a tab, clear the check, and try again.

**The number went in but it is not raised.** The toast says so when it happens: the editor accepted
the text and refused the superscript. Select the number and press `x¹` — and please open an issue
with the output of `radiopaediaCite.look()`, because that is a case worth handling.

**The reference box did not appear.** The citation is on the clipboard — add the box with
Radiopaedia's own button and paste it in. The marker is not inserted in that case; cite it once the
reference is down there.

## The tests

`tools/test/` mounts a fake edit page — toolbar, contenteditable, reference boxes, "Add another
reference" and all — and drives the real script through it with real clicks and real keys, asserting
on the HTML that comes out the other end. The one answer from `radiopaedia.work` is a saved one, so
the citation parser is tested against the real thing rather than a hand-written idea of it. Nothing
touches the network.

```bash
./tools/test/run.sh
```

Node, and `jsdom` fetched on first run. The userscript itself has no dependencies and no build step:
what you install is the file in this repository.

## Not done, on purpose

**Renumbering.** When a reference list runs `1, 2, 2, 4`, the only real fix is to renumber the list
into the order the markers appear and rewrite every marker to match — and that is the one operation
that touches the whole article at once, silently, in a way that is tedious to check and worse to
undo. It is also not obviously ours to do: whether an article's numbering should be rearranged under
an editor is a question for Radiopaedia's editors, not for a userscript. So the panel *says* when
the numbering is out of step, and cites what is actually written in front of each reference, and
stops there. If the editors want it, it should arrive with a preview of every change before a
single one is made.

**Linking to other articles.** Radiopaedia's own editor already has a picker for it.

**Anything the linter covers.** [Radiopaedia Lint](https://github.com/gmadevs/radiopaedia-lint-userscript)
says what is wrong with the style of a reference and of the prose. This script manages numbers and
characters. Where they start to overlap they will start to contradict each other.

## Settings

At the top of the script, and there are only three:

| | |
|---|---|
| `RANGE_FROM` | how many consecutive numbers close up into a range. `3` — so `2,3` stays and `2,3,4` becomes `2-4`. Set to `2` and a pair closes up too. |
| `HOP_PUNCTUATION` | whether a caret just after a full stop hops back inside the sentence. `true`. |
| `CITE_URL` | the citation worker. |

---

## License

[MIT](LICENSE) © Giorgio Maria Agazzi

Not affiliated with Radiopaedia.org. The citations themselves are resolved by
[radiopaedia.work](https://radiopaedia.work/); this script is the picker, the numbering and the
marker in the text.
