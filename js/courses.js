/* Rayaan Academy - course catalog: search, filter, sort, view, load more */
(function () {
  'use strict';
  const D = window.RA_DATA, S = window.RAStore, RA = window.RA;
  if (!D || !S || !RA) return;

  const grid = RA.$('#courseGrid');
  const form = RA.$('#filterForm');
  if (!grid || !form) return;

  const PAGE_SIZE = 9;
  const searchInput = RA.$('#courseSearch');
  const sortSelect = RA.$('#courseSort');
  const countEl = RA.$('#courseCount');
  const chipsEl = RA.$('#activeChips');
  const loadMoreBtn = RA.$('#loadMore');
  const filterCountEl = RA.$('#filterCount');

  const state = {
    q: '', categories: [], levels: [], duration: 'any', price: 'all', sort: 'popular',
    view: S.read('catalog_view', 'grid'), visible: PAGE_SIZE
  };

  /* Category checkboxes from data */
  RA.$('#categoryFilters').innerHTML = D.CATEGORIES.map(function (c) {
    const n = D.COURSES.filter(function (x) { return x.category === c.id; }).length;
    return '<div class="form-check"><input class="form-check-input" type="checkbox" name="category" value="' + c.id + '" id="cat-' + c.id + '">' +
      '<label class="form-check-label d-flex justify-content-between w-100" for="cat-' + c.id + '"><span>' + RA.esc(c.name) + '</span><small class="text-muted-ra">' + n + '</small></label></div>';
  }).join('');

  /* Read initial state from URL */
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) state.q = params.get('q');
  if (params.get('category')) state.categories = params.get('category').split(',').filter(function (id) { return D.getCategory(id); });
  if (params.get('level')) state.levels = params.get('level').split(',');
  if (params.get('price') === 'Free' || params.get('price') === 'Paid') state.price = params.get('price');
  if (params.get('duration')) state.duration = params.get('duration');
  if (params.get('sort')) state.sort = params.get('sort');

  function syncControls() {
    searchInput.value = state.q;
    sortSelect.value = state.sort;
    RA.$all('input[name="category"]', form).forEach(function (i) { i.checked = state.categories.indexOf(i.value) !== -1; });
    RA.$all('input[name="level"]', form).forEach(function (i) { i.checked = state.levels.indexOf(i.value) !== -1; });
    RA.$all('input[name="duration"]', form).forEach(function (i) { i.checked = i.value === state.duration; });
    RA.$all('input[name="price"]', form).forEach(function (i) { i.checked = i.value === state.price; });
    RA.$all('[data-view]').forEach(function (b) {
      const on = b.getAttribute('data-view') === state.view;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }

  function readControls() {
    state.categories = RA.$all('input[name="category"]:checked', form).map(function (i) { return i.value; });
    state.levels = RA.$all('input[name="level"]:checked', form).map(function (i) { return i.value; });
    const d = RA.$('input[name="duration"]:checked', form); state.duration = d ? d.value : 'any';
    const p = RA.$('input[name="price"]:checked', form); state.price = p ? p.value : 'all';
  }

  function matchesDuration(h) {
    if (state.duration === 'short') return h < 15;
    if (state.duration === 'medium') return h >= 15 && h <= 30;
    if (state.duration === 'long') return h > 30;
    return true;
  }

  function filtered() {
    const q = state.q.trim().toLowerCase();
    const list = D.COURSES.filter(function (c) {
      if (q) {
        const inst = D.getInstructor(c.instructor);
        const hay = [c.title, c.description, c.tags.join(' '), D.getCategory(c.category).name, inst ? inst.name : ''].join(' ').toLowerCase();
        if (q.split(/\s+/).some(function (word) { return hay.indexOf(word) === -1; })) return false;
      }
      if (state.categories.length && state.categories.indexOf(c.category) === -1) return false;
      if (state.levels.length && state.levels.indexOf(c.level) === -1) return false;
      if (state.price !== 'all' && c.price !== state.price) return false;
      return matchesDuration(c.duration);
    });
    const sorters = {
      popular: function (a, b) { return b.enrollments - a.enrollments; },
      rating: function (a, b) { return b.rating - a.rating || b.enrollments - a.enrollments; },
      title: function (a, b) { return a.title.localeCompare(b.title); },
      'duration-asc': function (a, b) { return a.duration - b.duration; },
      'duration-desc': function (a, b) { return b.duration - a.duration; }
    };
    return list.sort(sorters[state.sort] || sorters.popular);
  }

  function updateUrl() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.categories.length) p.set('category', state.categories.join(','));
    if (state.levels.length) p.set('level', state.levels.join(','));
    if (state.price !== 'all') p.set('price', state.price);
    if (state.duration !== 'any') p.set('duration', state.duration);
    if (state.sort !== 'popular') p.set('sort', state.sort);
    const qs = p.toString();
    try { history.replaceState(null, '', qs ? '?' + qs : window.location.pathname); } catch (e) { /* file:// may block this */ }
  }

  function renderChips() {
    const chips = [];
    if (state.q) chips.push({ type: 'q', value: state.q, label: 'Search: ' + state.q });
    state.categories.forEach(function (id) { chips.push({ type: 'category', value: id, label: D.getCategory(id).name }); });
    state.levels.forEach(function (l) { chips.push({ type: 'level', value: l, label: l }); });
    const durLabels = { short: 'Under 15 h', medium: '15 to 30 h', long: 'Over 30 h' };
    if (state.duration !== 'any') chips.push({ type: 'duration', value: state.duration, label: durLabels[state.duration] });
    if (state.price !== 'all') chips.push({ type: 'price', value: state.price, label: state.price });
    chipsEl.innerHTML = chips.map(function (c) {
      return '<button type="button" class="ra-chip" data-chip-type="' + c.type + '" data-chip-value="' + RA.esc(c.value) + '" aria-label="Remove filter ' + RA.esc(c.label) + '">' + RA.esc(c.label) + '<i class="bi bi-x" aria-hidden="true"></i></button>';
    }).join('') + (chips.length > 1 ? '<button type="button" class="btn btn-sm btn-link text-accent p-0 ms-1" data-clear-filters>Clear all</button>' : '');
    const n = chips.filter(function (c) { return c.type !== 'q'; }).length;
    if (filterCountEl) { filterCountEl.hidden = n === 0; filterCountEl.textContent = n; }
  }

  function render() {
    const list = filtered();
    const shown = list.slice(0, state.visible);
    countEl.innerHTML = '<strong>' + list.length + '</strong> course' + (list.length === 1 ? '' : 's') + ' found';
    renderChips();
    if (!list.length) {
      grid.innerHTML = '<div class="col-12">' + RA.emptyState('bi-search', 'No courses match your filters', 'Try removing a filter or searching with a different keyword.',
        '<button type="button" class="btn btn-ra-primary" data-clear-filters>Clear all filters</button>') + '</div>';
    } else {
      const colClass = state.view === 'list' ? 'col-12' : 'col-md-6 col-xl-4';
      grid.innerHTML = shown.map(function (c) {
        return '<div class="' + colClass + '">' + RA.courseCard(c, { list: state.view === 'list' }) + '</div>';
      }).join('');
    }
    const remaining = list.length - shown.length;
    loadMoreBtn.hidden = remaining <= 0;
    loadMoreBtn.textContent = 'Load more courses (' + remaining + ' remaining)';
    updateUrl();
  }

  function resetAll() {
    state.q = ''; state.categories = []; state.levels = []; state.duration = 'any'; state.price = 'all'; state.sort = 'popular';
    state.visible = PAGE_SIZE;
    syncControls();
    render();
    RA.toast('All filters cleared.', 'info');
  }

  /* Events */
  let timer = null;
  searchInput.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { state.q = searchInput.value.trim(); state.visible = PAGE_SIZE; render(); }, 180);
  });
  form.addEventListener('change', function () { readControls(); state.visible = PAGE_SIZE; render(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  sortSelect.addEventListener('change', function () { state.sort = sortSelect.value; render(); });
  RA.$all('[data-view]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.view = btn.getAttribute('data-view');
      S.write('catalog_view', state.view);
      syncControls();
      render();
    });
  });
  loadMoreBtn.addEventListener('click', function () {
    const firstNew = state.visible;
    state.visible += PAGE_SIZE;
    render();
    const card = grid.children[firstNew] && grid.children[firstNew].querySelector('.ra-course-title a');
    if (card) card.focus();
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-clear-filters]')) { e.preventDefault(); resetAll(); return; }
    const chip = e.target.closest('[data-chip-type]');
    if (!chip) return;
    const type = chip.getAttribute('data-chip-type');
    const value = chip.getAttribute('data-chip-value');
    if (type === 'q') state.q = '';
    if (type === 'category') state.categories = state.categories.filter(function (v) { return v !== value; });
    if (type === 'level') state.levels = state.levels.filter(function (v) { return v !== value; });
    if (type === 'duration') state.duration = 'any';
    if (type === 'price') state.price = 'all';
    syncControls();
    render();
  });
  document.addEventListener('ra:enroll', render);

  syncControls();
  render();
})();
