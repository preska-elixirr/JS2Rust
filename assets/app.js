/* Builds the shared shell (sidebar, top bar, pager), turns code blocks into
   highlighted panels, and remembers theme and finished lessons. */
(function () {
  'use strict';

  var LESSONS = [
    { file: 'index.html', title: 'Start here', group: 'Getting started', blurb: 'What makes Rust different and how this guide works.' },
    { file: 'setup.html', title: 'Setup and first program', group: 'Getting started', blurb: 'Install Rust, meet Cargo (the npm of Rust), run Hello World.' },
    { file: 'variables.html', title: 'Variables and types', group: 'Core syntax', blurb: 'let, mut, const, shadowing, and the many number types.' },
    { file: 'functions.html', title: 'Functions and closures', group: 'Core syntax', blurb: 'Typed parameters, implicit returns, arrow functions vs closures.' },
    { file: 'control-flow.html', title: 'Conditions and loops', group: 'Core syntax', blurb: 'if as an expression, match vs switch, for, while and loop.' },
    { file: 'ownership.html', title: 'Ownership and borrowing', group: 'The new idea', blurb: 'The one concept JavaScript does not have. Move, borrow, clone.' },
    { file: 'strings.html', title: 'Strings', group: 'The new idea', blurb: 'String vs &str, formatting, and everyday string methods.' },
    { file: 'arrays.html', title: 'Arrays, vectors, iterators', group: 'Data', blurb: 'Vec, slices, and map / filter / reduce the Rust way.' },
    { file: 'objects.html', title: 'Objects, structs, maps', group: 'Data', blurb: 'Structs with impl blocks, HashMap, destructuring.' },
    { file: 'enums.html', title: 'Enums and pattern matching', group: 'Data', blurb: 'Like TypeScript union types, with data inside each case.' },
    { file: 'errors.html', title: 'Null and errors', group: 'Real programs', blurb: 'Option instead of null, Result instead of try / catch.' },
    { file: 'traits.html', title: 'Traits and generics', group: 'Real programs', blurb: 'Interfaces become traits. Generics look familiar.' },
    { file: 'modules.html', title: 'Modules and packages', group: 'Real programs', blurb: 'import / export, npm and package.json in Rust terms.' },
    { file: 'async.html', title: 'Async and fetching data', group: 'Real programs', blurb: 'fetch() becomes reqwest + tokio. JSON with serde.' },
    { file: 'cheatsheet.html', title: 'Cheat sheet', group: 'Reference', blurb: 'Every JS-to-Rust mapping from this guide on one page.' }
  ];

  var DONE_KEY = 'rjs-done';
  var THEME_KEY = 'rjs-theme';

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  function getDone() {
    try { return JSON.parse(store(DONE_KEY) || '[]'); } catch (e) { return []; }
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') node.textContent = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function lessonNumber(i) {
    return i > 0 && i < LESSONS.length - 1 ? String(i).padStart(2, '0') : '';
  }

  var current = document.body.getAttribute('data-page') || 'index.html';
  var currentIndex = LESSONS.findIndex(function (l) { return l.file === current; });

  /* ---------- Syntax highlighting ---------- */

  var R = function (re) { return re.source; };
  var COMMENT = R(/\/\/[^\n]*|\/\*[\s\S]*?\*\//);

  var RULES = {
    rust: [
      ['comment', COMMENT],
      ['string', R(/b?"(?:\\.|[^"\\])*"/)],
      ['string', R(/'(?:\\.|[^'\\\n])'/)],
      ['attr', R(/'[a-z_]\w*\b/)],
      ['attr', R(/#!?\[[^\]\n]*\]/)],
      ['macro', R(/\b[a-z_]\w*!(?!=)/)],
      ['keyword', R(/\b(?:as|async|await|break|const|continue|crate|dyn|else|enum|extern|false|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|true|type|unsafe|use|where|while)\b/)],
      ['type', R(/\b(?:i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str)\b|\b[A-Z][A-Za-z0-9_]*\b/)],
      ['number', R(/\b\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?(?:[iu](?:8|16|32|64|128|size)|f32|f64)?\b/)],
      ['fn', R(/\b[a-z_]\w*(?=\s*(?:::<[^>\n]*>)?\()/)]
    ],
    js: [
      ['comment', COMMENT],
      ['string', R(/"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/)],
      ['keyword', R(/\b(?:as|async|await|break|case|catch|class|const|continue|default|delete|do|else|enum|export|extends|false|finally|for|from|function|if|implements|import|in|instanceof|interface|keyof|let|new|null|of|private|public|readonly|return|satisfies|static|switch|this|throw|true|try|type|typeof|undefined|var|void|while|yield)\b/)],
      ['type', R(/\b(?:string|number|boolean|any|unknown|never|bigint|symbol|object)\b|\b[A-Z][A-Za-z0-9_]*\b/)],
      ['number', R(/\b\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?n?\b/)],
      ['fn', R(/[a-zA-Z_$][\w$]*(?=\s*(?:<[^>\n]*>)?\()/)]
    ],
    toml: [
      ['comment', R(/#[^\n]*/)],
      ['type', R(/^\s*\[[^\]\n]+\]/)],
      ['string', R(/"(?:\\.|[^"\\\n])*"/)],
      ['keyword', R(/^[\w.-]+(?=\s*=)|\b(?:true|false)\b/)],
      ['number', R(/\b\d[\d.]*\b/)]
    ],
    bash: [
      ['comment', R(/(?:^|\s)#[^\n]*/)],
      ['string', R(/"(?:\\.|[^"\\\n])*"|'[^'\n]*'/)],
      ['fn', R(/^[\w.\/-]+/)],
      ['attr', R(/(?<=\s)--?[\w-]+/)]
    ]
  };
  RULES.ts = RULES.js;

  var LABELS = { js: 'JavaScript', ts: 'TypeScript', rust: 'Rust', toml: 'TOML', bash: 'Terminal', output: 'Output', text: 'Text' };
  var BADGES = { js: 'JS', ts: 'TS', rust: 'RS', toml: 'TOML', bash: 'SH', output: 'OUT', text: 'TXT' };

  function escapeHtml(s) {
    return s.replace(/[&<>]/g, function (c) { return c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;'; });
  }

  function highlight(code, lang) {
    var rules = RULES[lang];
    if (!rules) return escapeHtml(code);
    var re = new RegExp(rules.map(function (r) { return '(' + r[1] + ')'; }).join('|'), 'gm');
    var out = '';
    var last = 0;
    var m;
    while ((m = re.exec(code))) {
      if (m[0] === '') { re.lastIndex++; continue; }
      out += escapeHtml(code.slice(last, m.index));
      var i = 1;
      while (m[i] === undefined) i++;
      out += '<span class="tok-' + rules[i - 1][0] + '">' + escapeHtml(m[0]) + '</span>';
      last = re.lastIndex;
    }
    return out + escapeHtml(code.slice(last));
  }

  function tidy(src) {
    var lines = src.replace(/\t/g, '    ').replace(/\r/g, '').split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    var indents = lines.filter(function (l) { return l.trim(); }).map(function (l) { return l.match(/^ */)[0].length; });
    var cut = indents.length ? Math.min.apply(null, indents) : 0;
    return lines.map(function (l) { return l.slice(cut); }).join('\n');
  }

  function copyText(text, button) {
    function done(ok) {
      button.textContent = ok ? 'Copied' : 'Select and copy';
      setTimeout(function () { button.textContent = 'Copy'; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallback(text)); });
    } else {
      done(fallback(text));
    }
  }

  function fallback(text) {
    var ta = el('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  function buildCodeBlocks() {
    var blocks = document.querySelectorAll('script[type="text/x-code"]');
    Array.prototype.forEach.call(blocks, function (s) {
      var lang = s.getAttribute('data-lang') || 'text';
      var source = tidy(s.textContent);
      var title = s.getAttribute('data-title') || LABELS[lang] || lang;
      var copy = el('button', { type: 'button', class: 'copy', text: 'Copy' });
      copy.addEventListener('click', function () { copyText(source, copy); });
      var code = el('code');
      code.innerHTML = highlight(source, lang);
      var fig = el('figure', { class: 'code', 'data-lang': lang }, [
        el('figcaption', null, [
          el('span', { class: 'code-badge', text: BADGES[lang] || lang.toUpperCase() }),
          el('span', { class: 'code-title', text: title }),
          lang === 'output' ? null : copy
        ]),
        el('pre', { tabindex: '0' }, [code])
      ]);
      s.replaceWith(fig);
    });
  }

  /* ---------- Headings and on-page contents ---------- */

  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function buildHeadings() {
    var main = document.querySelector('.lesson');
    if (!main) return;
    var h2s = main.querySelectorAll('h2, h3');
    var used = {};
    Array.prototype.forEach.call(h2s, function (h) {
      if (!h.id) {
        var base = slug(h.textContent) || 'section';
        var id = base;
        var n = 2;
        while (used[id] || document.getElementById(id)) id = base + '-' + n++;
        h.id = id;
      }
      used[h.id] = true;
      h.setAttribute('data-label', h.textContent.trim());
      h.appendChild(el('a', { class: 'h-anchor', href: '#' + h.id, 'aria-label': 'Link to this section', text: '#' }));
    });

    var list = main.querySelectorAll('h2');
    if (list.length < 3 || main.hasAttribute('data-no-toc')) return;
    var ol = el('ol');
    Array.prototype.forEach.call(list, function (h) {
      var label = h.getAttribute('data-short') || h.getAttribute('data-label');
      ol.appendChild(el('li', null, [el('a', { href: '#' + h.id, text: label })]));
    });
    var toc = el('nav', { class: 'toc', 'aria-label': 'On this page' }, [el('p', { text: 'On this page' }), ol]);
    var head = main.querySelector('.lesson-head');
    var after = head && head.nextElementSibling && head.nextElementSibling.classList.contains('learn') ? head.nextElementSibling : head;
    if (after) after.after(toc); else main.prepend(toc);
  }

  /* ---------- Shell ---------- */

  function buildShell() {
    var main = document.querySelector('main');
    var done = getDone();

    var sidebar = el('nav', { class: 'sidebar', id: 'sidebar', 'aria-label': 'Lessons' });
    var brand = el('a', { class: 'brand', href: 'index.html', html: '<span class="brand-mark">js<b>&rarr;</b>rs</span><span class="brand-text"><strong>Rust from JS</strong><span>A guide for TypeScript devs</span></span>' });
    sidebar.appendChild(brand);

    var countable = LESSONS.slice(1, -1);
    var finished = countable.filter(function (l) { return done.indexOf(l.file) !== -1; }).length;
    var bar = el('i');
    bar.style.width = Math.round(finished / countable.length * 100) + '%';
    sidebar.appendChild(el('div', { class: 'progress' }, [
      el('span', { text: finished + ' of ' + countable.length + ' lessons done' }),
      el('div', { class: 'progress-bar' }, [bar])
    ]));

    var groups = {};
    var order = [];
    LESSONS.forEach(function (l, i) {
      if (!groups[l.group]) { groups[l.group] = []; order.push(l.group); }
      groups[l.group].push({ lesson: l, index: i });
    });
    order.forEach(function (g) {
      var box = el('div', { class: 'nav-group' }, [el('p', { class: 'nav-group-title', text: g })]);
      groups[g].forEach(function (item) {
        var l = item.lesson;
        var link = el('a', { class: 'nav-link', href: l.file }, [
          el('span', { class: 'nav-num', text: lessonNumber(item.index) }),
          el('span', { text: l.title }),
          lessonNumber(item.index) ? el('span', { class: 'nav-check' + (done.indexOf(l.file) !== -1 ? ' done' : ''), 'aria-label': done.indexOf(l.file) !== -1 ? 'Done' : '' }) : null
        ]);
        if (l.file === current) link.setAttribute('aria-current', 'page');
        box.appendChild(link);
      });
      sidebar.appendChild(box);
    });

    var themeBtn = el('button', { type: 'button', class: 'btn', id: 'theme-toggle' });
    function effectiveTheme() {
      var t = document.documentElement.getAttribute('data-theme');
      if (t) return t;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    function paintThemeBtn() { themeBtn.textContent = effectiveTheme() === 'dark' ? 'Light theme' : 'Dark theme'; }
    themeBtn.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      store(THEME_KEY, next);
      paintThemeBtn();
    });
    paintThemeBtn();
    sidebar.appendChild(el('div', { class: 'sidebar-foot' }, [themeBtn]));

    var menuBtn = el('button', { type: 'button', class: 'btn', 'aria-controls': 'sidebar', 'aria-expanded': 'false', text: 'Lessons' });
    var topTitle = currentIndex > -1 ? (lessonNumber(currentIndex) ? lessonNumber(currentIndex) + '  ' : '') + LESSONS[currentIndex].title : 'Rust from JS';
    var topbar = el('header', { class: 'topbar' }, [menuBtn, el('span', { class: 'topbar-title', text: topTitle })]);
    var scrim = el('div', { class: 'scrim', hidden: '' });

    function setMenu(open) {
      sidebar.classList.toggle('open', open);
      scrim.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
    }
    menuBtn.addEventListener('click', function () { setMenu(!sidebar.classList.contains('open')); });
    scrim.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

    var col = el('div', { class: 'main-col' });
    var app = el('div', { class: 'app' }, [sidebar, col]);
    main.parentNode.insertBefore(app, main);
    col.appendChild(topbar);
    col.appendChild(main);
    col.appendChild(buildPager(done));
    document.body.appendChild(scrim);
  }

  function buildPager(done) {
    var pager = el('footer', { class: 'pager' });
    if (currentIndex < 0) return pager;
    var lesson = LESSONS[currentIndex];

    if (lessonNumber(currentIndex)) {
      var isDone = done.indexOf(lesson.file) !== -1;
      var btn = el('button', { type: 'button', class: 'btn ' + (isDone ? 'btn-done' : 'btn-primary') });
      var paint = function (d) {
        btn.textContent = d ? 'Done. Click to undo' : 'Mark lesson as done';
        btn.className = 'btn ' + (d ? 'btn-done' : 'btn-primary');
      };
      paint(isDone);
      btn.addEventListener('click', function () {
        var list = getDone();
        var at = list.indexOf(lesson.file);
        if (at === -1) list.push(lesson.file); else list.splice(at, 1);
        store(DONE_KEY, JSON.stringify(list));
        paint(at === -1);
        var check = document.querySelector('.nav-link[aria-current="page"] .nav-check');
        if (check) check.classList.toggle('done', at === -1);
        var countable = LESSONS.slice(1, -1);
        var finished = countable.filter(function (l) { return list.indexOf(l.file) !== -1; }).length;
        document.querySelector('.progress span').textContent = finished + ' of ' + countable.length + ' lessons done';
        document.querySelector('.progress-bar i').style.width = Math.round(finished / countable.length * 100) + '%';
      });
      pager.appendChild(el('div', { class: 'done-row' }, [
        el('p', { text: 'Finished reading? Mark it so the sidebar tracks your progress. This is saved only in this browser.' }),
        btn
      ]));
    }

    var links = el('div', { class: 'pager-links' });
    var prev = LESSONS[currentIndex - 1];
    var next = LESSONS[currentIndex + 1];
    if (prev) links.appendChild(el('a', { href: prev.file, class: 'prev' }, [el('span', { text: 'Previous' }), el('strong', { text: prev.title })]));
    if (next) links.appendChild(el('a', { href: next.file, class: 'next' }, [el('span', { text: 'Next' }), el('strong', { text: next.title })]));
    pager.appendChild(links);
    return pager;
  }

  /* ---------- Home page lesson grid ---------- */

  function buildLessonGrid() {
    var grid = document.getElementById('lesson-grid');
    if (!grid) return;
    var done = getDone();
    LESSONS.forEach(function (l, i) {
      if (i === 0) return;
      var num = lessonNumber(i);
      grid.appendChild(el('a', { class: 'lesson-card', href: l.file }, [
        el('span', { class: 'lc-top' }, [
          el('span', { class: 'lc-num', text: num ? 'Lesson ' + num : 'Reference' }),
          el('span', { class: 'lc-group', text: done.indexOf(l.file) !== -1 ? 'Done' : l.group })
        ]),
        el('strong', { text: l.title }),
        el('span', { class: 'lc-blurb', text: l.blurb })
      ]));
    });
  }

  buildCodeBlocks();
  buildHeadings();
  buildLessonGrid();
  buildShell();

  // Heading ids are created above, after the browser already tried to jump to the hash.
  if (location.hash) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
})();
