/* Rayaan Academy - homepage rendering */
(function () {
  'use strict';
  const D = window.RA_DATA, S = window.RAStore, RA = window.RA;
  if (!D || !S || !RA) return;

  /* Categories with live course counts */
  const catHost = RA.$('#homeCategories');
  if (catHost) {
    catHost.innerHTML = D.CATEGORIES.map(function (c, i) {
      const count = D.COURSES.filter(function (x) { return x.category === c.id; }).length;
      return '<div class="col-sm-6 col-lg-4 col-xl-3 reveal reveal-delay-' + (i % 4) + '">' +
        '<a class="ra-cat-card" href="courses.html?category=' + c.id + '"><span class="ra-cat-icon"><i class="bi ' + c.icon + '" aria-hidden="true"></i></span>' +
        '<span><strong>' + RA.esc(c.name) + '</strong><small>' + count + ' course' + (count === 1 ? '' : 's') + '</small></span></a></div>';
    }).join('');
  }

  /* Featured courses with quick filter */
  const featuredHost = RA.$('#featuredCourses');
  function renderFeatured(filter) {
    if (!featuredHost) return;
    let list = D.COURSES.filter(function (c) { return c.featured; });
    if (filter === 'Free') list = D.COURSES.filter(function (c) { return c.price === 'Free'; });
    if (filter === 'Beginner') list = D.COURSES.filter(function (c) { return c.level === 'Beginner'; });
    list = list.slice().sort(function (a, b) { return b.enrollments - a.enrollments; }).slice(0, 6);
    featuredHost.innerHTML = list.map(function (c) {
      return '<div class="col-md-6 col-lg-4 reveal">' + RA.courseCard(c) + '</div>';
    }).join('');
    RA.initReveal(featuredHost);
  }
  RA.$all('[data-featured-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      RA.$all('[data-featured-filter]').forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      renderFeatured(btn.getAttribute('data-featured-filter'));
    });
  });
  renderFeatured('all');
  document.addEventListener('ra:enroll', function () {
    const active = RA.$('[data-featured-filter].active');
    renderFeatured(active ? active.getAttribute('data-featured-filter') : 'all');
  });

  /* Learning paths (first three) */
  const pathHost = RA.$('#homePaths');
  if (pathHost) {
    pathHost.innerHTML = D.LEARNING_PATHS.slice(0, 3).map(function (p, i) {
      const hours = p.courses.reduce(function (sum, id) { const c = D.getCourseById(id); return sum + (c ? c.duration : 0); }, 0);
      return '<div class="col-md-6 col-lg-4 reveal reveal-delay-' + i + '"><article class="ra-path-card">' +
        '<div class="d-flex align-items-center gap-3 mb-2"><span class="ra-feature-icon mb-0"><i class="bi ' + p.icon + '" aria-hidden="true"></i></span>' +
        '<div><h3 class="h5 mb-0">' + RA.esc(p.title) + '</h3><small class="text-muted-ra">' + p.courses.length + ' courses · ' + hours + ' hours</small></div></div>' +
        '<p class="text-muted-ra mb-0">' + RA.esc(p.description) + '</p>' +
        '<ol class="ra-path-steps">' + p.courses.map(function (id) { const c = D.getCourseById(id); return '<li>' + RA.esc(c ? c.title : id) + '</li>'; }).join('') + '</ol>' +
        '<a href="learning-paths.html#' + p.id + '" class="btn btn-ra-outline mt-auto">View path</a></article></div>';
    }).join('');
  }

  /* Instructors (first four) */
  const instHost = RA.$('#homeInstructors');
  if (instHost) {
    instHost.innerHTML = D.INSTRUCTORS.slice(0, 4).map(function (p, i) {
      const count = D.COURSES.filter(function (c) { return c.instructor === p.id; }).length;
      return '<div class="col-sm-6 col-lg-3 reveal reveal-delay-' + i + '"><article class="ra-instructor">' +
        '<span class="ra-avatar ra-avatar-lg' + (i % 2 ? ' is-dark' : '') + '">' + RA.esc(RA.initials(p.name)) + '</span>' +
        '<h3>' + RA.esc(p.name) + '</h3><p class="role">' + RA.esc(p.role) + '</p>' +
        '<span class="ra-badge">' + count + ' course' + (count === 1 ? '' : 's') + '</span>' +
        '<div class="mt-3"><a href="instructors.html#' + p.id + '" class="small fw-semibold">View profile <i class="bi bi-arrow-right" aria-hidden="true"></i></a></div></article></div>';
    }).join('');
  }

  /* Stats derived from the data file */
  const totalEnroll = D.COURSES.reduce(function (s, c) { return s + c.enrollments; }, 0);
  const totalLessons = D.COURSES.reduce(function (s, c) { return s + c.lessons; }, 0);
  const free = D.COURSES.filter(function (c) { return c.price === 'Free'; }).length;
  const learners = RA.$('#statLearners'); if (learners) learners.setAttribute('data-count', totalEnroll);
  const lessons = RA.$('#statLessons'); if (lessons) lessons.setAttribute('data-count', totalLessons);
  const freeEl = RA.$('#heroFreeCount'); if (freeEl) freeEl.textContent = free;

  const counters = RA.$all('[data-count]');
  function runCounter(el) {
    const target = Number(el.getAttribute('data-count')) || 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { el.textContent = RA.formatNumber(target); return; }
    const start = performance.now();
    const dur = 1400;
    (function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = RA.formatNumber(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  RA.initReveal();
})();
