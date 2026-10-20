/* =========================================================
   Rayaan Academy - shared layout, components and utilities
   Safe on every page: each feature checks for its elements.
   ========================================================= */
(function () {
  'use strict';

  const D = window.RA_DATA;
  const S = window.RAStore;
  if (!D || !S) { console.error('Rayaan Academy: data or storage script missing.'); return; }

  S.seedDemo();

  const page = document.body.getAttribute('data-page') || '';
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Utilities ---------- */
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function formatNumber(n) { return Number(n).toLocaleString('en-US'); }
  function initials(name) {
    return String(name || '?').trim().split(/\s+/).slice(0, 2).map(function (p) { return p.charAt(0).toUpperCase(); }).join('');
  }
  function stars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      const icon = rating >= i ? 'bi-star-fill' : (rating >= i - 0.5 ? 'bi-star-half' : 'bi-star');
      html += '<i class="bi ' + icon + '" aria-hidden="true"></i>';
    }
    return '<span class="ra-stars" aria-label="Rated ' + rating + ' out of 5 (demo rating)">' + html + '</span>';
  }
  function timeAgo(ts) {
    const diff = Math.max(0, Date.now() - ts);
    const m = Math.round(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return m + ' min ago';
    const h = Math.round(m / 60);
    if (h < 24) return h + ' h ago';
    const d = Math.round(h / 24);
    return d === 1 ? 'yesterday' : d + ' days ago';
  }
  function getParam(name) { return new URLSearchParams(window.location.search).get(name); }
  function levelClass(level) { return 'level-' + String(level).toLowerCase(); }

  /* ---------- Toasts ---------- */
  function ensureToastStack() {
    let stack = $('#ra-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'ra-toast-stack';
      stack.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      stack.setAttribute('aria-live', 'polite');
      stack.setAttribute('aria-atomic', 'false');
      document.body.appendChild(stack);
    }
    return stack;
  }
  function toast(message, type) {
    const kind = type || 'success';
    const icons = { success: 'bi-check-circle-fill', error: 'bi-exclamation-octagon-fill', info: 'bi-info-circle-fill', warning: 'bi-exclamation-triangle-fill' };
    const el = document.createElement('div');
    el.className = 'toast ra-toast ra-toast-' + kind;
    el.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    el.innerHTML = '<div class="d-flex align-items-start gap-2 p-3"><i class="bi ' + (icons[kind] || icons.info) + ' ra-toast-icon" aria-hidden="true"></i>' +
      '<div class="flex-grow-1">' + esc(message) + '</div>' +
      '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close notification"></button></div>';
    ensureToastStack().appendChild(el);
    if (window.bootstrap) {
      const t = new window.bootstrap.Toast(el, { delay: 3200 });
      el.addEventListener('hidden.bs.toast', function () { el.remove(); });
      t.show();
    } else {
      setTimeout(function () { el.remove(); }, 3200);
    }
  }

  /* ---------- Confirm dialog (returns a Promise<boolean>) ---------- */
  function confirmDialog(opts) {
    const o = Object.assign({ title: 'Are you sure?', body: '', confirmText: 'Confirm', cancelText: 'Cancel', danger: false }, opts);
    return new Promise(function (resolve) {
      const wrap = document.createElement('div');
      wrap.className = 'modal fade';
      wrap.tabIndex = -1;
      wrap.setAttribute('aria-labelledby', 'ra-confirm-title');
      wrap.setAttribute('aria-modal', 'true');
      wrap.setAttribute('role', 'dialog');
      wrap.innerHTML = '<div class="modal-dialog modal-dialog-centered"><div class="modal-content ra-modal">' +
        '<div class="modal-header border-0 pb-0"><h2 class="modal-title h5" id="ra-confirm-title">' + esc(o.title) + '</h2>' +
        '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
        '<div class="modal-body text-muted-ra">' + esc(o.body) + '</div>' +
        '<div class="modal-footer border-0 pt-0"><button type="button" class="btn btn-ra-ghost" data-bs-dismiss="modal">' + esc(o.cancelText) + '</button>' +
        '<button type="button" class="btn ' + (o.danger ? 'btn-danger' : 'btn-ra-primary') + '" data-confirm>' + esc(o.confirmText) + '</button></div></div></div>';
      document.body.appendChild(wrap);
      let result = false;
      const modal = new window.bootstrap.Modal(wrap);
      $('[data-confirm]', wrap).addEventListener('click', function () { result = true; modal.hide(); });
      wrap.addEventListener('hidden.bs.modal', function () { wrap.remove(); resolve(result); });
      modal.show();
    });
  }

  /* ---------- Course card ---------- */
  function courseCard(course, options) {
    const o = options || {};
    const cat = D.getCategory(course.category);
    const inst = D.getInstructor(course.instructor);
    const saved = S.isWishlisted(course.id);
    const enrolled = S.isEnrolled(course.id);
    const progress = enrolled ? S.getProgress(course.id) : null;
    const url = 'course-details.html?id=' + encodeURIComponent(course.id);
    return '<article class="ra-course-card' + (o.list ? ' is-list' : '') + '" data-course-id="' + esc(course.id) + '">' +
      '<a href="' + url + '" class="ra-course-thumb" tabindex="-1" aria-hidden="true"><img src="' + esc(course.thumbnail) + '" alt="" loading="lazy" width="640" height="360"></a>' +
      '<button type="button" class="ra-wish-btn' + (saved ? ' is-active' : '') + '" data-action="wishlist" data-id="' + esc(course.id) + '" aria-pressed="' + saved + '" aria-label="' + (saved ? 'Remove ' : 'Save ') + esc(course.title) + (saved ? ' from' : ' to') + ' wishlist"><i class="bi ' + (saved ? 'bi-heart-fill' : 'bi-heart') + '" aria-hidden="true"></i></button>' +
      '<div class="ra-course-body">' +
        '<div class="d-flex flex-wrap gap-2 mb-2"><span class="ra-badge">' + esc(cat ? cat.name : '') + '</span>' +
        '<span class="ra-badge ' + levelClass(course.level) + '">' + esc(course.level) + '</span>' +
        (course.price === 'Free' ? '<span class="ra-badge badge-free">Free</span>' : '<span class="ra-badge badge-paid">Paid</span>') + '</div>' +
        '<h3 class="ra-course-title"><a href="' + url + '">' + esc(course.title) + '</a></h3>' +
        (o.list ? '<p class="ra-course-desc">' + esc(course.description) + '</p>' : '') +
        '<p class="ra-course-instructor"><i class="bi bi-person-circle" aria-hidden="true"></i> ' + esc(inst ? inst.name : '') + '</p>' +
        '<div class="ra-course-meta"><span><i class="bi bi-clock" aria-hidden="true"></i> ' + course.duration + ' h</span>' +
        '<span><i class="bi bi-play-circle" aria-hidden="true"></i> ' + course.lessons + ' lessons</span>' +
        '<span><i class="bi bi-people" aria-hidden="true"></i> ' + formatNumber(course.enrollments) + '</span></div>' +
        (progress ? '<div class="ra-progress mt-3" role="progressbar" aria-label="Course progress" aria-valuenow="' + progress.percent + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + progress.percent + '%"></span></div><small class="text-muted-ra">' + progress.percent + '% complete</small>' : '') +
        '<div class="ra-course-foot">' + '<span class="ra-rating">' + stars(course.rating) + ' <strong>' + course.rating.toFixed(1) + '</strong></span>' +
        (enrolled
          ? '<a class="btn btn-sm btn-ra-primary" href="learn.html?course=' + encodeURIComponent(course.id) + '">Continue</a>'
          : '<a class="btn btn-sm btn-ra-outline" href="' + url + '">View course</a>') +
        '</div>' +
      '</div></article>';
  }

  /* ---------- Generated downloadable resources ---------- */
  function downloadText(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function courseResource(course, kind) {
    const inst = D.getInstructor(course.instructor);
    const line = '\n' + '='.repeat(56) + '\n';
    let text = D.BRAND.name.toUpperCase() + line + course.title + '\nInstructor: ' + (inst ? inst.name : '') + '\nLevel: ' + course.level + '   Duration: ' + course.duration + ' hours   Lessons: ' + course.lessons + line;
    if (kind === 'syllabus') {
      text += 'COURSE SYLLABUS\n\n' + course.description + '\n\nPrerequisites:\n' + course.prerequisites.map(function (p) { return '  - ' + p; }).join('\n') + '\n\n';
      course.modules.forEach(function (m, i) {
        text += 'Module ' + (i + 1) + ': ' + m.title + '\n' + m.lessons.map(function (l, j) { return '  ' + (i + 1) + '.' + (j + 1) + '  ' + l.title + ' (' + l.minutes + ' min)'; }).join('\n') + '\n\n';
      });
    } else if (kind === 'outcomes') {
      text += 'LEARNING OUTCOMES CHECKLIST\n\n' + course.outcomes.map(function (o) { return '[ ] ' + o; }).join('\n') + '\n\nKey topics: ' + course.tags.join(', ') + '\n';
    } else {
      const weeks = Math.max(2, Math.ceil(course.duration / 4));
      const per = Math.ceil(course.lessons / weeks);
      const all = D.getAllLessons(course);
      text += 'STUDY PLAN (about 4 hours per week)\n\n';
      for (let w = 0; w < weeks; w++) {
        const chunk = all.slice(w * per, (w + 1) * per);
        if (!chunk.length) break;
        text += 'Week ' + (w + 1) + ':\n' + chunk.map(function (l) { return '  - ' + l.title; }).join('\n') + '\n\n';
      }
    }
    text += line + 'Generated from the ' + D.BRAND.name + ' demo platform.\n';
    downloadText(course.id + '-' + kind + '.txt', text);
  }

  function emptyState(icon, title, text, actionHtml) {
    return '<div class="ra-empty"><div class="ra-empty-icon"><i class="bi ' + icon + '" aria-hidden="true"></i></div>' +
      '<h3 class="h5">' + esc(title) + '</h3><p class="text-muted-ra mb-3">' + esc(text) + '</p>' + (actionHtml || '') + '</div>';
  }

  /* ---------- Header ---------- */
  const NAV = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'courses.html', label: 'Explore Courses', key: 'courses' },
    { href: 'learning-paths.html', label: 'Learning Paths', key: 'paths' },
    { href: 'about.html', label: 'About Us', key: 'about' },
    { href: 'contact.html', label: 'Contact', key: 'contact' }
  ];

  function logoImg(variant, cls) {
    const base = variant === 'full' ? 'logo' : 'logo-mark';
    return '<img src="assets/images/' + base + '.png" class="' + cls + ' logo-for-light" alt="' + esc(D.BRAND.name) + ' logo">' +
      '<img src="assets/images/' + base + '-light.png" class="' + cls + ' logo-for-dark" alt="" aria-hidden="true">';
  }

  function renderHeader() {
    const host = $('#site-header');
    if (!host) return;
    const session = S.getSession();
    const showBar = !S.read('announce_closed_v1', false);
    const links = NAV.map(function (n) {
      const active = n.key === page;
      return '<li class="nav-item"><a class="nav-link' + (active ? ' active' : '') + '" href="' + n.href + '"' + (active ? ' aria-current="page"' : '') + '>' + n.label + '</a></li>';
    }).join('');
    const auth = session
      ? '<div class="dropdown"><button class="btn ra-avatar-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Account menu for ' + esc(session.name) + '">' +
          '<span class="ra-avatar ra-avatar-sm">' + esc(initials(session.name)) + '</span><span class="d-lg-none d-xl-inline ms-1">' + esc(session.name.split(' ')[0]) + '</span></button>' +
          '<ul class="dropdown-menu dropdown-menu-end ra-dropdown">' +
          '<li><a class="dropdown-item" href="dashboard.html"><i class="bi bi-grid-1x2 me-2" aria-hidden="true"></i>Dashboard</a></li>' +
          '<li><a class="dropdown-item" href="profile.html"><i class="bi bi-person me-2" aria-hidden="true"></i>Profile</a></li>' +
          '<li><a class="dropdown-item" href="certificates.html"><i class="bi bi-award me-2" aria-hidden="true"></i>Certificates</a></li>' +
          '<li><hr class="dropdown-divider"></li>' +
          '<li><button class="dropdown-item" type="button" data-action="logout"><i class="bi bi-box-arrow-right me-2" aria-hidden="true"></i>Log out</button></li></ul></div>'
      : '<a href="login.html" class="btn btn-ra-ghost">Login</a><a href="register.html" class="btn btn-ra-primary">Join for Free</a>';

    host.innerHTML =
      (showBar ? '<div class="ra-announce" role="region" aria-label="Announcement"><div class="container d-flex align-items-center justify-content-center gap-2">' +
        '<span><span class="ra-announce-pill">New</span> CCNA Preparation and Cloud Computing courses are now open. </span>' +
        '<a href="courses.html?category=networking" class="ra-announce-link">Browse courses <i class="bi bi-arrow-right" aria-hidden="true"></i></a>' +
        '<button type="button" class="ra-announce-close" data-action="close-announce" aria-label="Dismiss announcement"><i class="bi bi-x-lg" aria-hidden="true"></i></button></div></div>' : '') +
      '<nav class="navbar navbar-expand-lg ra-navbar" aria-label="Main navigation"><div class="container">' +
        '<a class="navbar-brand ra-brand" href="index.html">' + logoImg('mark', 'ra-brand-logo') + '<span class="ra-brand-text">Rayaan<span>Academy</span></span></a>' +
        '<div class="d-flex align-items-center gap-1 order-lg-last ms-auto ms-lg-2">' +
          '<button type="button" class="btn ra-icon-btn" data-action="open-search" aria-label="Search courses"><i class="bi bi-search" aria-hidden="true"></i></button>' +
          '<button type="button" class="btn ra-icon-btn" data-action="toggle-theme" aria-label="Switch to dark mode"><i class="bi bi-moon-stars" aria-hidden="true"></i></button>' +
          '<div class="d-none d-lg-flex align-items-center gap-2 ms-1">' + auth + '</div>' +
          '<button class="navbar-toggler ra-icon-btn ms-1" type="button" data-bs-toggle="collapse" data-bs-target="#raNav" aria-controls="raNav" aria-expanded="false" aria-label="Toggle navigation"><i class="bi bi-list" aria-hidden="true"></i></button>' +
        '</div>' +
        '<div class="collapse navbar-collapse" id="raNav"><ul class="navbar-nav mx-lg-auto">' + links + '</ul>' +
          '<div class="d-flex d-lg-none gap-2 py-3 ra-mobile-auth">' + auth + '</div></div>' +
      '</div></nav>';
    updateThemeButtons();
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const host = $('#site-footer');
    if (!host) return;
    const cats = D.CATEGORIES.slice(0, 6).map(function (c) {
      return '<li><a href="courses.html?category=' + c.id + '">' + esc(c.name) + '</a></li>';
    }).join('');
    host.innerHTML = '<footer class="ra-footer"><div class="container">' +
      '<div class="row g-4 g-lg-5">' +
        '<div class="col-lg-4"><a href="index.html" class="d-inline-block mb-3" aria-label="' + esc(D.BRAND.name) + ' home">' + logoImg('full', 'ra-footer-logo') + '</a>' +
          '<p class="ra-footer-text">Practical courses in technology, languages and professional skills for students, beginners and aspiring IT professionals.</p>' +
          '<div class="ra-social">' +
            '<a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook (opens in a new tab)"><i class="bi bi-facebook" aria-hidden="true"></i></a>' +
            '<a href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube (opens in a new tab)"><i class="bi bi-youtube" aria-hidden="true"></i></a>' +
            '<a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn (opens in a new tab)"><i class="bi bi-linkedin" aria-hidden="true"></i></a>' +
            '<a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram (opens in a new tab)"><i class="bi bi-instagram" aria-hidden="true"></i></a>' +
          '</div></div>' +
        '<div class="col-6 col-md-4 col-lg-2"><h2 class="ra-footer-title">Academy</h2><ul class="ra-footer-links">' +
          '<li><a href="about.html">About Us</a></li><li><a href="instructors.html">Instructors</a></li><li><a href="learning-paths.html">Learning Paths</a></li><li><a href="contact.html">Contact</a></li><li><a href="index.html#faq">FAQ</a></li></ul></div>' +
        '<div class="col-6 col-md-4 col-lg-3"><h2 class="ra-footer-title">Categories</h2><ul class="ra-footer-links">' + cats + '</ul></div>' +
        '<div class="col-md-4 col-lg-3"><h2 class="ra-footer-title">Contact</h2><ul class="ra-footer-links ra-footer-contact">' +
          '<li><i class="bi bi-envelope" aria-hidden="true"></i><a href="mailto:' + esc(D.BRAND.email) + '">' + esc(D.BRAND.email) + '</a></li>' +
          '<li><i class="bi bi-telephone" aria-hidden="true"></i><span>' + esc(D.BRAND.phone) + '</span></li>' +
          '<li><i class="bi bi-geo-alt" aria-hidden="true"></i><span>' + esc(D.BRAND.address) + '</span></li></ul></div>' +
      '</div>' +
      '<div class="ra-footer-bottom"><span>&copy; ' + new Date().getFullYear() + ' ' + esc(D.BRAND.name) + '. All rights reserved.</span>' +
      '<span>Frontend demo. Figures shown are sample data.</span></div>' +
      '</div></footer>';
  }

  /* ---------- App sidebar (dashboard, profile, certificates) ---------- */
  function renderAppSidebar() {
    const host = $('#app-sidebar');
    if (!host) return;
    const items = [
      { href: 'dashboard.html', icon: 'bi-grid-1x2', label: 'Dashboard', key: 'dashboard' },
      { href: 'courses.html', icon: 'bi-compass', label: 'Explore Courses', key: 'courses' },
      { href: 'dashboard.html#my-courses', icon: 'bi-journal-bookmark', label: 'My Courses', key: 'my-courses' },
      { href: 'dashboard.html#saved', icon: 'bi-heart', label: 'Saved Courses', key: 'saved' },
      { href: 'quiz.html', icon: 'bi-patch-question', label: 'Quizzes', key: 'quiz' },
      { href: 'certificates.html', icon: 'bi-award', label: 'Certificates', key: 'certificates' },
      { href: 'learning-paths.html', icon: 'bi-signpost-split', label: 'Learning Paths', key: 'paths' },
      { href: 'profile.html', icon: 'bi-person-gear', label: 'Profile', key: 'profile' }
    ];
    const name = S.displayName();
    host.innerHTML =
      '<div class="offcanvas-lg offcanvas-start ra-sidebar" tabindex="-1" id="raSidebar" aria-labelledby="raSidebarLabel">' +
        '<div class="offcanvas-header"><h2 class="offcanvas-title h6 mb-0" id="raSidebarLabel">Menu</h2>' +
        '<button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#raSidebar" aria-label="Close menu"></button></div>' +
        '<div class="offcanvas-body d-flex flex-column">' +
          '<a class="ra-brand mb-4 d-none d-lg-flex" href="index.html">' + logoImg('mark', 'ra-brand-logo') + '<span class="ra-brand-text">Rayaan<span>Academy</span></span></a>' +
          '<nav aria-label="Student navigation"><ul class="ra-side-nav">' + items.map(function (i) {
            const active = i.key === page;
            return '<li><a href="' + i.href + '" class="' + (active ? 'active' : '') + '"' + (active ? ' aria-current="page"' : '') + '><i class="bi ' + i.icon + '" aria-hidden="true"></i>' + i.label + '</a></li>';
          }).join('') + '</ul></nav>' +
          '<div class="ra-side-user mt-auto"><span class="ra-avatar">' + esc(initials(name)) + '</span><div class="min-w-0"><strong class="d-block text-truncate">' + esc(name) + '</strong>' +
          '<a href="profile.html" class="small">Edit profile</a></div></div>' +
        '</div></div>';
  }

  function renderAppTopbar() {
    const host = $('#app-topbar');
    if (!host) return;
    const session = S.getSession();
    host.innerHTML = '<header class="ra-topbar">' +
      '<button class="btn ra-icon-btn d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#raSidebar" aria-controls="raSidebar" aria-label="Open menu"><i class="bi bi-list" aria-hidden="true"></i></button>' +
      '<button type="button" class="ra-topbar-search" data-action="open-search"><i class="bi bi-search" aria-hidden="true"></i><span>Search courses</span></button>' +
      '<div class="d-flex align-items-center gap-1 ms-auto">' +
        '<button type="button" class="btn ra-icon-btn" data-action="toggle-theme" aria-label="Switch to dark mode"><i class="bi bi-moon-stars" aria-hidden="true"></i></button>' +
        '<a href="index.html" class="btn ra-icon-btn" aria-label="Back to website home"><i class="bi bi-house" aria-hidden="true"></i></a>' +
        (session ? '<button type="button" class="btn btn-ra-ghost btn-sm" data-action="logout">Log out</button>' : '<a href="login.html" class="btn btn-ra-primary btn-sm">Login</a>') +
      '</div></header>';
    updateThemeButtons();
  }

  /* ---------- Theme ---------- */
  function updateThemeButtons() {
    const dark = S.getTheme() === 'dark';
    $all('[data-action="toggle-theme"]').forEach(function (b) {
      b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      b.innerHTML = '<i class="bi ' + (dark ? 'bi-sun' : 'bi-moon-stars') + '" aria-hidden="true"></i>';
    });
  }

  /* ---------- Search modal ---------- */
  function buildSearchModal() {
    const wrap = document.createElement('div');
    wrap.className = 'modal fade';
    wrap.id = 'raSearchModal';
    wrap.tabIndex = -1;
    wrap.setAttribute('aria-labelledby', 'raSearchTitle');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('role', 'dialog');
    wrap.innerHTML = '<div class="modal-dialog modal-dialog-scrollable modal-lg"><div class="modal-content ra-modal">' +
      '<div class="modal-header border-0"><h2 class="visually-hidden" id="raSearchTitle">Search courses</h2>' +
      '<form class="ra-search-field w-100" role="search" id="raSearchForm"><i class="bi bi-search" aria-hidden="true"></i>' +
      '<label for="raSearchInput" class="visually-hidden">Search courses</label>' +
      '<input id="raSearchInput" type="search" class="form-control" placeholder="Search by course, skill or topic" autocomplete="off"></form>' +
      '<button type="button" class="btn-close ms-2" data-bs-dismiss="modal" aria-label="Close search"></button></div>' +
      '<div class="modal-body pt-0"><div id="raSearchResults" aria-live="polite"></div></div></div></div>';
    document.body.appendChild(wrap);
    const input = $('#raSearchInput', wrap);
    const results = $('#raSearchResults', wrap);
    function renderResults() {
      const q = input.value.trim().toLowerCase();
      const list = q ? D.COURSES.filter(function (c) {
        return (c.title + ' ' + c.tags.join(' ') + ' ' + c.description).toLowerCase().indexOf(q) !== -1;
      }) : D.COURSES.filter(function (c) { return c.featured; });
      results.innerHTML = '<p class="small text-muted-ra mb-2">' + (q ? list.length + ' result' + (list.length === 1 ? '' : 's') : 'Popular courses') + '</p>' +
        (list.length ? '<ul class="ra-search-list">' + list.slice(0, 8).map(function (c) {
          return '<li><a href="course-details.html?id=' + c.id + '"><img src="' + c.thumbnail + '" alt="" width="64" height="36"><span><strong>' + esc(c.title) + '</strong><small>' + esc(D.getCategory(c.category).name) + ' · ' + c.level + '</small></span><i class="bi bi-chevron-right" aria-hidden="true"></i></a></li>';
        }).join('') + '</ul>' : emptyState('bi-search', 'No matching courses', 'Try a different keyword such as Python, Linux or English.'));
    }
    input.addEventListener('input', renderResults);
    $('#raSearchForm', wrap).addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = 'courses.html?q=' + encodeURIComponent(input.value.trim());
    });
    wrap.addEventListener('shown.bs.modal', function () { input.focus(); renderResults(); });
    return wrap;
  }
  let searchModal = null;
  function openSearch() {
    if (!window.bootstrap) return;
    if (!searchModal) searchModal = new window.bootstrap.Modal(buildSearchModal());
    searchModal.show();
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ra-back-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<i class="bi bi-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(btn);
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
    window.addEventListener('scroll', function () { btn.classList.toggle('is-visible', window.scrollY > 500); }, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal(root) {
    const items = $all('.reveal:not(.is-visible)', root);
    if (reduceMotion || !('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('is-visible'); }); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Forms ---------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function setFieldError(input, message) {
    const id = input.id + '-error';
    let fb = document.getElementById(id);
    if (!fb) {
      fb = document.createElement('div');
      fb.id = id;
      fb.className = 'invalid-feedback';
      (input.closest('.ra-input-group') || input).insertAdjacentElement('afterend', fb);
    }
    fb.textContent = message || '';
    input.classList.toggle('is-invalid', Boolean(message));
    if (message) input.setAttribute('aria-describedby', id); else input.removeAttribute('aria-describedby');
    if (fb) fb.style.display = message ? 'block' : '';
    return !message;
  }

  function initNewsletter() {
    $all('[data-newsletter]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = $('input[type="email"]', form);
        const value = input.value.trim();
        if (!setFieldError(input, !value ? 'Please enter your email address.' : (!EMAIL_RE.test(value) ? 'Please enter a valid email address.' : ''))) { input.focus(); return; }
        const list = S.read('newsletter', []);
        if (list.indexOf(value) !== -1) { toast('This email is already subscribed.', 'info'); return; }
        list.push(value);
        S.write('newsletter', list);
        form.reset();
        toast('Subscribed. You will hear about new courses first (demo).', 'success');
      });
    });
  }

  function initPasswordToggles(root) {
    $all('[data-toggle-password]', root).forEach(function (btn) {
      btn.addEventListener('click', function () {
        const input = document.getElementById(btn.getAttribute('data-toggle-password'));
        if (!input) return;
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        btn.setAttribute('aria-pressed', String(show));
        btn.innerHTML = '<i class="bi ' + (show ? 'bi-eye-slash' : 'bi-eye') + '" aria-hidden="true"></i>';
      });
    });
  }

  /* ---------- Global click handling ---------- */
  function refreshWishButtons(id, saved) {
    $all('[data-action="wishlist"][data-id="' + id + '"]').forEach(function (b) {
      b.classList.toggle('is-active', saved);
      b.setAttribute('aria-pressed', String(saved));
      const icon = b.querySelector('i');
      if (icon) { icon.classList.toggle('bi-heart-fill', saved); icon.classList.toggle('bi-heart', !saved); }
      const label = b.querySelector('[data-label]');
      if (label) label.textContent = saved ? 'Saved to wishlist' : 'Save to wishlist';
      const course = D.getCourseById(id);
      if (!label && course) b.setAttribute('aria-label', (saved ? 'Remove ' : 'Save ') + course.title + (saved ? ' from' : ' to') + ' wishlist');
    });
  }

  document.addEventListener('click', function (e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.getAttribute('data-action');
    if (action === 'wishlist') {
      e.preventDefault();
      const id = target.getAttribute('data-id');
      const saved = S.toggleWishlist(id);
      refreshWishButtons(id, saved);
      toast(saved ? 'Saved to your wishlist.' : 'Removed from your wishlist.', saved ? 'success' : 'info');
      document.dispatchEvent(new CustomEvent('ra:wishlist', { detail: { id: id, saved: saved } }));
    } else if (action === 'enroll') {
      e.preventDefault();
      const cid = target.getAttribute('data-id');
      const course = D.getCourseById(cid);
      if (!course) return;
      if (S.enroll(cid)) toast('You are enrolled in ' + course.title + '.', 'success');
      document.dispatchEvent(new CustomEvent('ra:enroll', { detail: { id: cid } }));
    } else if (action === 'resource') {
      const rc = D.getCourseById(target.getAttribute('data-id'));
      if (rc) { courseResource(rc, target.getAttribute('data-kind')); toast('Download started.', 'success'); }
    } else if (action === 'toggle-theme') {
      S.setTheme(S.getTheme() === 'dark' ? 'light' : 'dark');
      updateThemeButtons();
      document.dispatchEvent(new CustomEvent('ra:theme'));
    } else if (action === 'open-search') {
      openSearch();
    } else if (action === 'close-announce') {
      S.write('announce_closed_v1', true);
      const bar = target.closest('.ra-announce');
      if (bar) bar.remove();
    } else if (action === 'logout') {
      S.clearSession();
      toast('You have been logged out of the demo session.', 'info');
      setTimeout(function () { window.location.href = 'index.html'; }, 700);
    }
  });

  // Keyboard shortcut: "/" opens search when not typing in a field
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey) return;
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || (document.activeElement && document.activeElement.isContentEditable)) return;
    e.preventDefault();
    openSearch();
  });

  /* ---------- Init ---------- */
  renderHeader();
  renderFooter();
  renderAppSidebar();
  renderAppTopbar();
  updateThemeButtons();
  initBackToTop();
  initNewsletter();
  initPasswordToggles();
  document.addEventListener('DOMContentLoaded', function () { initReveal(); });
  initReveal();

  window.RA = {
    esc: esc, $: $, $all: $all, formatNumber: formatNumber, initials: initials, stars: stars,
    timeAgo: timeAgo, getParam: getParam, levelClass: levelClass,
    toast: toast, confirm: confirmDialog, courseCard: courseCard, emptyState: emptyState,
    downloadText: downloadText, courseResource: courseResource,
    initReveal: initReveal, setFieldError: setFieldError, EMAIL_RE: EMAIL_RE,
    refreshWishButtons: refreshWishButtons, page: page
  };
})();
