/* Portfolio Alpha Yaya Traoré
   Le contenu vient de /content/site.json (modifiable depuis /admin).
   Ce fichier transforme ce contenu en page : chaque "section" du fichier devient une section du site. */
(function () {
  'use strict';

  /* ---------- Petits outils ---------- */
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    add(el, children);
    return el;
  }
  function add(el, children) {
    if (children === null || children === undefined || children === false) return;
    if (!Array.isArray(children)) children = [children];
    children.forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      if (Array.isArray(c)) { add(el, c); return; }
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
  }
  function svg(markup) {
    var t = document.createElement('template');
    t.innerHTML = markup.trim();
    return t.content.firstChild;
  }
  function has(v) { return typeof v === 'string' ? v.trim() !== '' : !!v; }
  function list(v) { return Array.isArray(v) ? v : []; }
  function slug(s, i) {
    var out = String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return out || 'section-' + (i + 1);
  }
  /* Texte avec paragraphes : une ligne vide = nouveau paragraphe */
  function paragraphs(text, cls) {
    if (!has(text)) return null;
    var box = h('div', { class: cls || 'prose' });
    String(text).split(/\n\s*\n/).forEach(function (p) {
      if (p.trim()) box.appendChild(h('p', { style: 'white-space:pre-line', text: p.trim() }));
    });
    return box;
  }
  /* Met un mot du titre en couleur */
  function titleWith(tag, cls, title, highlight) {
    var el = h(tag, { class: cls });
    title = String(title || '');
    var i = has(highlight) ? title.indexOf(highlight) : -1;
    if (i < 0) { el.textContent = title; return el; }
    add(el, [title.slice(0, i), h('span', { class: 'accent', text: highlight }), title.slice(i + highlight.length)]);
    return el;
  }
  function head(s, extra) {
    var box = h('div', { class: 'section-head' + (extra ? ' section-head--row' : '') });
    var inner = extra ? h('div', { class: 'section-head__text' }) : box;
    if (has(s.label)) inner.appendChild(h('p', { class: 'label', text: s.label }));
    if (has(s.title)) inner.appendChild(titleWith('h2', 'h2', s.title, s.highlight));
    if (has(s.intro)) inner.appendChild(h('p', { class: 'lead', text: s.intro }));
    if (extra) { box.appendChild(inner); box.appendChild(extra); }
    return box;
  }
  function section(s, cls, content) {
    return h('section', { id: s._id, class: 'section ' + (cls || ''), 'aria-labelledby': null }, h('div', { class: 'wrap' }, content));
  }
  function button(label, link, cls) {
    if (!has(label) || !has(link)) return null;
    var ext = /^https?:/i.test(link);
    return h('a', { class: 'btn ' + cls, href: link, target: ext ? '_blank' : null, rel: ext ? 'noopener' : null, text: label });
  }

  var ICONS = {
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    video: '<path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    megaphone: '<path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>'
  };
  function icon(name) {
    var p = ICONS[name] || ICONS.star;
    return svg('<svg class="card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>');
  }
  var PLAY = '<span class="play__btn"><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="#1A1410"/></svg></span>';

  /* ---------- Vidéos : reconnaissance du lien et du format ---------- */
  function videoInfo(url) {
    if (!has(url)) return null;
    var u;
    try { u = new URL(url.trim()); } catch (e) { return null; }
    var host = u.hostname.replace(/^www\.|^m\./, '');
    var parts = u.pathname.split('/').filter(Boolean);
    var id = null, isShort = false;
    if (host === 'youtu.be') id = parts[0];
    else if (/youtube(-nocookie)?\.com$/.test(host)) {
      if (parts[0] === 'shorts') { id = parts[1]; isShort = true; }
      else if (parts[0] === 'embed' || parts[0] === 'live' || parts[0] === 'v') id = parts[1];
      else id = u.searchParams.get('v');
    }
    if (!id || !/^[A-Za-z0-9_-]{6,20}$/.test(id)) return null;
    return { id: id, isShort: isShort };
  }
  function videoFormat(item, info) {
    if (item.format === 'vertical' || item.format === 'horizontal') return item.format;
    return info.isShort ? 'vertical' : 'horizontal';
  }
  function embedUrl(id, opts) {
    var q = 'rel=0&playsinline=1&modestbranding=1' + (opts && opts.autoplay ? '&autoplay=1' : '') +
      (opts && opts.muted ? '&mute=1&loop=1&playlist=' + id : '');
    return 'https://www.youtube-nocookie.com/embed/' + id + '?' + q;
  }
  function iframe(id, title, opts) {
    return h('iframe', {
      src: embedUrl(id, opts), title: title || 'Vidéo',
      allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowfullscreen: true, loading: 'lazy'
    });
  }

  /* ---------- Visionneuse d'images ---------- */
  var lightbox = document.getElementById('lightbox');
  function openImage(src, alt) {
    var img = lightbox.querySelector('img');
    img.src = src; img.alt = alt || '';
    if (lightbox.showModal) lightbox.showModal(); else window.open(src, '_blank');
  }
  lightbox.querySelector('.lightbox__close').addEventListener('click', function () { lightbox.close(); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });

  /* ---------- Pagination "Voir plus" ---------- */
  function paged(container, items, render, initial, step, word) {
    var shown = 0;
    var moreWrap = h('div', { class: 'more' });
    var btn = h('button', { type: 'button', class: 'btn btn--outline' });
    moreWrap.appendChild(btn);
    function next() {
      var end = Math.min(items.length, shown + (shown === 0 ? initial : step));
      for (var i = shown; i < end; i++) container.appendChild(render(items[i], i));
      shown = end;
      var left = items.length - shown;
      btn.textContent = 'Voir plus de ' + word + ' (' + left + ')';
      moreWrap.hidden = left <= 0;
    }
    btn.addEventListener('click', next);
    next();
    return moreWrap;
  }

  /* ---------- Les types de section ---------- */
  var R = {};

  R.hero = function (s) {
    var text = h('div', { class: 'hero__text' }, [
      has(s.label) ? h('p', { class: 'label label--or', text: s.label }) : null,
      titleWith('h1', 'h1', s.title, s.highlight),
      has(s.text) ? h('p', { class: 'lead', style: 'max-width:60ch', text: s.text }) : null,
      h('div', { class: 'btn-row', style: 'padding-top:8px' }, [
        button(s.button1_label, s.button1_link, 'btn--primary'),
        button(s.button2_label, s.button2_link, 'btn--outline')
      ])
    ]);
    var photo = has(s.photo) ? h('div', { class: 'hero__photo' }, h('img', { src: s.photo, alt: s.photo_alt || '', width: 440, height: 550 })) : null;
    var frag = document.createDocumentFragment();
    frag.appendChild(h('section', { id: s._id }, h('div', { class: 'wrap hero' }, [text, photo])));
    frag.appendChild(h('div', { class: 'bogolan', 'aria-hidden': 'true' }));
    return frag;
  };

  R.video = function (s) {
    var info = videoInfo(s.url);
    if (!info) return null;
    var fmt = videoFormat(s, info);
    var box = h('div', { class: 'feature-video feature-video--' + (fmt === 'vertical' ? 'v' : 'h') },
      iframe(info.id, s.caption || 'Vidéo', s.autoplay ? { autoplay: true, muted: true } : null));
    return section(s, 'section--deep', [
      has(s.label) ? h('p', { class: 'label', style: 'margin-bottom:24px', text: s.label }) : null,
      has(s.title) ? h('h2', { class: 'h2', style: 'margin-bottom:24px', text: s.title }) : null,
      box,
      has(s.caption) ? h('p', { class: 'feature-caption', text: s.caption }) : null
    ]);
  };

  R.apropos = function (s) {
    var side = h('div', { class: 'split__side' }, [
      has(s.label) ? h('p', { class: 'label', text: s.label }) : null,
      titleWith('h2', 'h2', s.title, s.highlight)
    ]);
    var main = h('div', { class: 'split__main' }, [paragraphs(s.text)]);
    if (list(s.values).length) {
      main.appendChild(h('div', { class: 'cards' }, list(s.values).map(function (v) {
        return h('div', { class: 'card' }, [h('h3', { class: 'h3', text: v.title }), has(v.text) ? h('p', { text: v.text }) : null]);
      })));
    }
    var facts = h('div', { class: 'facts' });
    if (list(s.formation).length) {
      facts.appendChild(h('div', null, [
        h('p', { class: 'label label--or', text: s.formation_title || 'Formation' }),
        h('ul', { class: 'timeline-mini' }, list(s.formation).map(function (f) {
          return h('li', null, [h('b', { text: f.year || '' }), h('span', { text: f.text || '' })]);
        }))
      ]));
    }
    if (list(s.tools).length || has(s.languages)) {
      facts.appendChild(h('div', null, [
        list(s.tools).length ? h('p', { class: 'label label--or', text: s.tools_title || 'Outils' }) : null,
        list(s.tools).length ? h('ul', { class: 'chips' }, list(s.tools).map(function (t) { return h('li', { class: 'chip', text: t.name }); })) : null,
        has(s.languages) ? h('p', { class: 'label label--or', style: 'margin-top:8px', text: s.languages_title || 'Langues' }) : null,
        has(s.languages) ? h('span', { text: s.languages }) : null
      ]));
    }
    if (facts.children.length) main.appendChild(facts);
    return section(s, '', h('div', { class: 'split' }, [side, main]));
  };

  R.experiences = function (s) {
    var items = list(s.items);
    if (!items.length) return null;
    var cats = [];
    items.forEach(function (e) { if (has(e.category) && cats.indexOf(e.category) < 0) cats.push(e.category); });
    var listBox = h('div', { class: 'exp-list' });
    var moreSlot = h('div');
    var current = null;
    function renderExp(e) {
      return h('article', { class: 'exp' }, [
        h('div', { class: 'exp__meta' }, [
          e.current ? h('span', { class: 'badge', text: 'En cours' }) : null,
          has(e.period) ? h('span', { class: 'exp__period', text: e.period }) : null,
          has(e.category) ? h('span', { class: 'label label--or', text: e.category }) : null
        ]),
        h('div', { class: 'exp__body' }, [
          h('h3', { class: 'h3', text: e.role || '' }),
          has(e.company) ? h('span', { class: 'exp__company', text: e.company }) : null,
          list(e.points).length ? h('ul', null, list(e.points).map(function (p) { return h('li', { text: p.text || '' }); })) : null,
          paragraphs(e.description, 'muted')
        ])
      ]);
    }
    function show(cat) {
      current = cat;
      listBox.textContent = '';
      moreSlot.textContent = '';
      var filtered = items.filter(function (e) { return !cat || e.category === cat; });
      var n = parseInt(s.initial, 10) || 4;
      moreSlot.appendChild(paged(listBox, filtered, renderExp, n, n, 'expériences'));
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b._cat === cat)); });
    }
    var filterBtns = [];
    var filters = null;
    if (cats.length > 1) {
      filters = h('div', { class: 'filters', role: 'group', 'aria-label': 'Filtrer les expériences' });
      [null].concat(cats).forEach(function (c) {
        var b = h('button', { type: 'button', class: 'filter', text: c || 'Toutes', onclick: function () { show(c); } });
        b._cat = c; filterBtns.push(b); filters.appendChild(b);
      });
    }
    show(null);
    return section(s, 'section--raised', [head(s, filters), listBox, moreSlot]);
  };

  R.projets = function (s) {
    var videos = list(s.videos).map(function (v) {
      var info = videoInfo(v.url);
      return info ? Object.assign({}, v, { _info: info, _fmt: videoFormat(v, info) }) : null;
    }).filter(Boolean);
    var visuels = list(s.visuels).filter(function (v) { return has(v.image); });
    var captures = list(s.captures).filter(function (v) { return has(v.image); });

    function body(item, extra) {
      return h('div', { class: 'tile__body' }, [
        has(item.title) ? h('h4', { class: 'tile__title', text: item.title }) : null,
        has(item.client) ? h('span', { class: 'tile__client', text: item.client }) : null,
        has(item.description) ? h('p', { class: 'tile__desc', text: item.description }) : null,
        extra
      ]);
    }
    function videoTile(v) {
      var media = h('div', { class: 'tile__media tile__media--' + (v._fmt === 'vertical' ? 'v' : 'h') });
      var thumb = 'https://i.ytimg.com/vi/' + v._info.id + '/hqdefault.jpg';
      var playBtn = h('button', { type: 'button', class: 'play', 'aria-label': 'Lire la vidéo' + (has(v.title) ? ' : ' + v.title : '') }, [
        h('img', { src: thumb, alt: '', loading: 'lazy' }), svg(PLAY)
      ]);
      playBtn.addEventListener('click', function () {
        media.textContent = '';
        media.appendChild(iframe(v._info.id, v.title, { autoplay: true }));
      });
      media.appendChild(playBtn);
      return h('article', { class: 'tile' }, [media, body(v)]);
    }
    function imageTile(v, kind) {
      var img = h('img', { src: v.image, alt: v.alt || v.title || '', loading: 'lazy' });
      var zoom = h('button', { type: 'button', class: 'zoom', 'aria-label': 'Agrandir l’image' + (has(v.title) ? ' : ' + v.title : ''), onclick: function () { openImage(v.image, v.alt || v.title); } }, img);
      var extra = null;
      if (kind === 'cap') {
        var pts = list(v.points).filter(function (p) { return has(p.label) || has(p.value); });
        extra = [
          pts.length ? h('dl', { class: 'stats' }, pts.map(function (p) { return h('div', null, [h('dt', { text: p.label || '' }), h('dd', { text: p.value || '' })]); })) : null,
          has(v.comment) ? h('p', { class: 'tile__comment', text: v.comment }) : null
        ];
      }
      return h('article', { class: 'tile' }, [h('div', { class: 'tile__media tile__media--' + kind }, zoom), body(v, extra)]);
    }

    var groups = [];
    if (videos.length) groups.push({ key: 'videos', title: s.videos_title || 'Vidéos', build: function (box) {
      var vert = videos.filter(function (v) { return v._fmt === 'vertical'; });
      var hori = videos.filter(function (v) { return v._fmt !== 'vertical'; });
      if (vert.length) { var g1 = h('div', { class: 'grid grid--v' }); box.appendChild(g1); box.appendChild(paged(g1, vert, videoTile, 8, 8, 'vidéos')); }
      if (hori.length) { var g2 = h('div', { class: 'grid grid--h', style: vert.length ? 'margin-top:32px' : null }); box.appendChild(g2); box.appendChild(paged(g2, hori, videoTile, 4, 4, 'vidéos')); }
    } });
    if (visuels.length) groups.push({ key: 'visuels', title: s.visuels_title || 'Visuels', build: function (box) {
      var g = h('div', { class: 'grid grid--img' }); box.appendChild(g);
      box.appendChild(paged(g, visuels, function (v) { return imageTile(v, 'img'); }, 8, 8, 'visuels'));
    } });
    if (captures.length) groups.push({ key: 'captures', title: s.captures_title || 'Captures d’écran', build: function (box) {
      var g = h('div', { class: 'grid grid--cap' }); box.appendChild(g);
      box.appendChild(paged(g, captures, function (v) { return imageTile(v, 'cap'); }, 6, 6, 'captures'));
    } });
    if (!groups.length) return null;

    var groupEls = groups.map(function (g) {
      var box = h('div', { class: 'group' }, h('div', { class: 'group__head' }, h('h3', { class: 'h3', text: g.title })));
      g.build(box);
      box._key = g.key;
      return box;
    });
    var filters = null;
    if (groups.length > 1) {
      var btns = [];
      filters = h('div', { class: 'filters', role: 'group', 'aria-label': 'Filtrer les projets' });
      [{ key: null, title: 'Tous' }].concat(groups).forEach(function (g) {
        var b = h('button', { type: 'button', class: 'filter', 'aria-pressed': String(g.key === null), text: g.title });
        b.addEventListener('click', function () {
          groupEls.forEach(function (el) { el.hidden = g.key !== null && el._key !== g.key; });
          btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        });
        btns.push(b); filters.appendChild(b);
      });
    }
    return section(s, '', [head(s, filters)].concat(groupEls, [has(s.note) ? h('p', { class: 'note', text: s.note }) : null]));
  };

  R.references = function (s) {
    var logos = list(s.logos).filter(function (l) { return has(l.name) || has(l.image); });
    var pages = list(s.pages).filter(function (p) { return has(p.name); });
    if (!logos.length && !pages.length) return null;
    var content = [head(s)];
    if (logos.length) {
      content.push(h('div', { class: 'logos' }, logos.map(function (l) {
        var inner = has(l.image) ? h('img', { src: l.image, alt: l.name || '', loading: 'lazy' }) : (l.name || '');
        return has(l.link) ? h('a', { class: 'logo-tile', href: l.link, target: '_blank', rel: 'noopener' }, inner) : h('div', { class: 'logo-tile' }, inner);
      })));
    }
    if (pages.length) {
      if (has(s.pages_title)) content.push(h('h3', { class: 'h3', style: 'margin-top:56px;font-size:28px', text: s.pages_title }));
      content.push(h('div', { class: 'pages' }, pages.map(function (p) {
        return h('article', { class: 'page-card' }, [
          h('div', { class: 'page-card__head' }, [
            h('div', { class: 'avatar' }, has(p.logo) ? h('img', { src: p.logo, alt: '' }) : (p.name || '?').trim().charAt(0).toUpperCase()),
            h('div', { style: 'display:flex;flex-direction:column;gap:2px;min-width:0' }, [
              h('span', { class: 'page-card__name', text: p.name }),
              has(p.period) ? h('span', { class: 'muted', style: 'font-size:14px', text: p.period }) : null
            ])
          ]),
          list(p.networks).length ? h('ul', { class: 'chips' }, list(p.networks).map(function (n) { return h('li', { class: 'chip chip--soft', text: n.name }); })) : null,
          has(p.description) ? h('p', { text: p.description }) : null,
          has(p.link) ? h('a', { class: 'link-strong', href: p.link, target: '_blank', rel: 'noopener', text: 'Voir la page' }) : null
        ]);
      })));
    }
    return section(s, 'section--raised', content);
  };

  R.cartes = function (s) {
    var items = list(s.items);
    return section(s, '', [
      head(s),
      h('div', { class: 'cards', style: 'gap:20px' }, items.map(function (c) {
        return h('div', { class: 'card', style: 'padding:28px' }, [
          has(c.icon) && c.icon !== 'aucune' ? icon(c.icon) : null,
          h('h3', { class: 'h3', text: c.title || '' }),
          has(c.text) ? h('p', { text: c.text }) : null
        ]);
      }))
    ]);
  };

  R.texte = function (s) {
    return section(s, s.dark ? 'section--deep' : '', [
      head(s), paragraphs(s.text),
      h('div', { class: 'btn-row', style: 'margin-top:24px' }, button(s.button_label, s.button_link, s.dark ? 'btn--primary' : 'btn--deep'))
    ]);
  };

  R.texte_image = function (s) {
    return section(s, '', h('div', { class: 'ti' + (s.reverse ? ' ti--reverse' : '') }, [
      h('div', { class: 'ti__text' }, [
        has(s.label) ? h('p', { class: 'label', text: s.label }) : null,
        titleWith('h2', 'h2', s.title, s.highlight),
        paragraphs(s.text),
        h('div', { class: 'btn-row' }, button(s.button_label, s.button_link, 'btn--deep'))
      ]),
      has(s.image) ? h('div', { class: 'ti__img' }, h('img', { src: s.image, alt: s.image_alt || '', loading: 'lazy' })) : null
    ]));
  };

  R.temoignages = function (s) {
    var items = list(s.items).filter(function (q) { return has(q.quote); });
    if (!items.length) return null;
    return section(s, 'section--raised', [head(s), h('div', { class: 'quotes' }, items.map(function (q) {
      return h('figure', { class: 'quote' }, [
        h('blockquote', { text: '« ' + q.quote + ' »' }),
        h('figcaption', null, [h('b', { text: q.name || '' }), q.role || ''])
      ]);
    }))]);
  };

  R.cta = function (s) {
    return section(s, s.dark === false ? 'section--raised' : 'section--deep', h('div', { class: 'cta' }, [
      has(s.label) ? h('p', { class: 'label', text: s.label }) : null,
      titleWith('h2', 'h2', s.title, s.highlight),
      has(s.text) ? h('p', { class: 'lead', text: s.text }) : null,
      button(s.button_label, s.button_link, 'btn--primary')
    ]));
  };

  R.contact = function (s) {
    var rows = [];
    if (has(s.email)) rows.push(['E-mail', s.email, 'mailto:' + s.email.trim()]);
    if (has(s.phone)) rows.push(['Téléphone', s.phone, 'tel:' + s.phone.replace(/[^+\d]/g, '')]);
    if (has(s.whatsapp)) rows.push(['WhatsApp', s.phone || ('+' + s.whatsapp), 'https://wa.me/' + s.whatsapp.replace(/\D/g, '')]);
    list(s.socials).forEach(function (so) { if (has(so.url)) rows.push([so.name || 'Lien', so.display || so.url.replace(/^https?:\/\/(www\.)?/, ''), so.url]); });
    var main = h('div', { class: 'contact__main' }, [
      has(s.label) ? h('p', { class: 'label', text: s.label }) : null,
      titleWith('h2', 'h2 h2--big', s.title, s.highlight),
      has(s.text) ? h('p', { class: 'lead', text: s.text }) : null,
      h('div', { class: 'btn-row', style: 'padding-top:8px' }, [
        has(s.email) ? button(s.button_label || 'Écrire un e-mail', 'mailto:' + s.email.trim(), 'btn--primary') : null,
        has(s.whatsapp) ? h('a', { class: 'btn btn--on-deep', href: 'https://wa.me/' + s.whatsapp.replace(/\D/g, ''), target: '_blank', rel: 'noopener', text: s.whatsapp_label || 'WhatsApp' }) : null
      ])
    ]);
    var ul = h('ul', { class: 'contact__list' }, rows.map(function (r) {
      var ext = /^https?:/.test(r[2]);
      return h('li', null, h('a', { href: r[2], target: ext ? '_blank' : null, rel: ext ? 'noopener' : null }, [h('span', { text: r[0] }), h('span', { text: r[1] })]));
    }));
    return section(s, 'section--deep', h('div', { class: 'contact' }, [main, rows.length ? ul : null]));
  };

  /* ---------- Montage de la page ---------- */
  function build(data) {
    var st = data.settings || {};
    if (has(st.page_title)) document.title = st.page_title;
    if (has(st.description)) { var m = document.querySelector('meta[name="description"]'); if (m) m.setAttribute('content', st.description); }
    document.querySelectorAll('[data-bind]').forEach(function (el) {
      var v = st[el.getAttribute('data-bind')];
      if (has(v)) el.textContent = v; else if (el.getAttribute('data-bind') === 'tagline') el.hidden = true;
    });
    var cta = document.getElementById('nav-cta');
    if (has(st.nav_cta_label)) { cta.textContent = st.nav_cta_label; cta.href = st.nav_cta_link || '#contact'; } else cta.hidden = true;
    document.getElementById('year').textContent = new Date().getFullYear();

    var app = document.getElementById('app');
    var nav = document.getElementById('nav-links');
    app.textContent = ''; nav.textContent = '';
    var used = {};
    list(data.sections).forEach(function (s, i) {
      if (!s || s.visible === false) return;
      var render = R[s.type];
      if (!render) return;
      var id = slug(s.id || s.menu || s.title || s.type, i);
      while (used[id]) id += '-2';
      used[id] = true;
      s._id = id;
      var el;
      try { el = render(s); } catch (e) { console.error('Section non affichée :', s.type, e); el = null; }
      if (!el) return;
      app.appendChild(el);
      if (has(s.menu)) nav.appendChild(h('li', null, h('a', { href: '#' + id, text: s.menu })));
    });
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }

  /* Menu mobile */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('menu');
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  fetch('/content/site.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(build)
    .catch(function (e) {
      console.error(e);
      document.getElementById('app').appendChild(h('div', { class: 'wrap load-error' }, [
        h('h1', { class: 'h2', text: 'Le contenu n’a pas pu se charger.' }),
        h('p', { class: 'muted', style: 'margin:16px auto 0', text: 'Rechargez la page dans un instant.' })
      ]));
    });
})();
