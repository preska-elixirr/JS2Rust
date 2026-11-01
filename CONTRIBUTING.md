# Contributing to JS2Rust basics

Thanks for helping. This guide shows how to send a change. You do not need any special access. Anyone with a GitHub account can contribute.

## What helps most

- **A Rust example that does not compile.** Nobody has compiled every sample yet, so these fixes matter most.
- **Wrong or unclear explanations.** If a sentence confused you, it will confuse the next reader too.
- **Typos and broken links.**
- **A missing topic.** Open an issue first so we can agree on the lesson before you write it.

If you only want to report a problem, open an [issue](https://github.com/preska-elixirr/JS2Rust/issues). Include the lesson name and, for code, the compiler error.

## How to send a change

Every change goes in through a pull request. The maintainer reviews it and merges it or closes it.

### Small fix, all in the browser

Good for a typo or a one-line fix.

1. Open the file on GitHub, for example `strings.html`.
2. Click the pencil icon. GitHub makes a fork (your own copy) for you.
3. Make the change.
4. Click **Commit changes**, then **Propose changes**.
5. Click **Create pull request**.

### Bigger change, on your computer

1. Click **Fork** at the top of the repository page.
2. Clone your fork. Replace `YOUR-NAME` with your GitHub user name.

   ```bash
   git clone https://github.com/YOUR-NAME/JS2Rust.git
   ```

3. Make a branch for your change.

   ```bash
   git checkout -b fix-strings-example
   ```

4. Edit the files and check them (see below).
5. Commit and push to your fork.

   ```bash
   git add .
   git commit -m "Fix the split example in the strings lesson"
   git push -u origin fix-strings-example
   ```

6. Open your fork on GitHub and click **Contribute → Open pull request**.

## Check your change before you send it

1. Open `index.html` in your browser and go to the page you changed.
2. Switch between the light and dark theme with the button at the bottom of the sidebar. Check that the text is easy to read in both.
3. Make the browser window narrow, about phone width. Nothing should stick out to the side.
4. If you changed Rust code, compile it. Paste it into the [Rust Playground](https://play.rust-lang.org), or put it in a project and run `cargo run`.

After you open the pull request, Vercel adds a preview link to it. Click it to see your change on a real copy of the site.

## How to write for this guide

The readers know JavaScript and TypeScript well and know no Rust. Keep that in mind on every page.

- **Show the JavaScript first, then the Rust.** Put the two side by side in a `compare` block when they do the same job.
- **Use short sentences and plain words.** Explain a Rust word the first time it shows up.
- **Write headings in sentence case.** For example "Shadowing a variable", not "Shadowing A Variable".
- **Make code examples small and real.** Use names like `user`, `price` and `items`, not `foo` and `bar`.
- **Quote real compiler errors.** Copy them from `cargo` output instead of writing them from memory.

How the pages are built, and how to add a new lesson, is in the [README](README.md#add-or-change-a-lesson).

## Pull request checklist

- [ ] The page opens with no errors in the browser console.
- [ ] It looks right in light and dark theme.
- [ ] It works at phone width.
- [ ] Every Rust example I added or changed compiles.
- [ ] A new lesson is in the `LESSONS` list in `assets/app.js`.
