# JS2Rust basics

A free guide that teaches Rust to people who already know JavaScript and TypeScript.

**Live site: https://js2rustbasics.vercel.app**

Every lesson puts the JavaScript or TypeScript code you already write next to the Rust code that does the same job. You read the left side to remember what you know, and the right side to see how Rust does it.

## What is inside

| # | Lesson | What it covers |
|---|--------|----------------|
| 01 | Setup and first program | Installing Rust, Cargo as the npm of Rust, Hello World |
| 02 | Variables and types | `let`, `mut`, `const`, shadowing, number types |
| 03 | Functions and closures | Typed parameters, implicit returns, closures vs arrow functions |
| 04 | Conditions and loops | `if` as an expression, `match` vs `switch`, `for`, `while`, `loop` |
| 05 | Ownership and borrowing | The one idea JavaScript does not have: move, borrow, clone |
| 06 | Strings | `String` vs `&str`, formatting, string methods |
| 07 | Arrays, vectors, iterators | `Vec`, slices, `map` / `filter` / `reduce` in Rust |
| 08 | Objects, structs, maps | Structs, `impl` blocks, `HashMap` |
| 09 | Enums and pattern matching | Union types with data inside each case |
| 10 | Null and errors | `Option` instead of null, `Result` instead of try / catch |
| 11 | Traits and generics | Interfaces become traits |
| 12 | Modules and packages | `import` / `export`, `package.json` vs `Cargo.toml` |
| 13 | Async and fetching data | `fetch()` becomes `reqwest` + `tokio`, JSON with `serde` |
| | Cheat sheet | Every JS-to-Rust mapping on one page |

Each lesson ends with a few quiz questions. The sidebar remembers which lessons you marked as done. It saves this in your browser only.

## How the site works

The site is plain HTML, CSS and JavaScript. It has no framework and no build step.

- Each page is one `.html` file in the root folder.
- `assets/style.css` holds all styles, including the light and dark themes.
- `assets/app.js` builds the parts every page shares: the sidebar, the top bar on phones, the previous and next links, the "On this page" list, and the syntax highlighting.

```
.
├── index.html          home page
├── setup.html          lesson 01
├── variables.html      lesson 02
├── ...                 lessons 03 to 13
├── cheatsheet.html     reference page
└── assets/
    ├── style.css
    └── app.js
```

## Run it on your computer

Double-click `index.html`. It opens in your browser and works offline. Without internet the fonts fall back to your system fonts.

If you want a local server instead, run this in the project folder:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Add or change a lesson

1. Copy an existing lesson, for example `variables.html`, and give it a new name.
2. Set `data-page` on the `<body>` tag to the new file name.
3. Add the page to the `LESSONS` list at the top of `assets/app.js`. The sidebar, the home page cards and the previous and next links all read from that list.

Code examples go inside a `<script type="text/x-code">` tag. You can paste code as it is, so `<`, `>` and `&` need no escaping. `app.js` turns each block into a highlighted panel with a copy button.

```html
<div class="compare">
<script type="text/x-code" data-lang="ts">
const name = "Ana";
</script>
<script type="text/x-code" data-lang="rust">
let name = "Ana";
</script>
</div>
```

`data-lang` accepts `js`, `ts`, `rust`, `toml`, `bash`, `output` and `text`. Add `data-title="main.rs"` to show a file name in the panel header. A `compare` wrapper puts two panels side by side. On a phone they stack.

## Deploying

Vercel hosts the site. It deploys from this repository: every push to `main` updates the live site within about a minute. Vercel needs no build settings for this project. The framework preset is "Other" and the build command is empty.

## A note on the Rust examples

Nobody has compiled every code sample yet. They were checked by reading. If an example does not compile, please open an issue with the lesson name and the error message.
