/* Rayaan Academy - course details page (course-details.html?id=...) */
(function () {
  'use strict';
  const D = window.RA_DATA, S = window.RAStore, RA = window.RA;
  if (!D || !S || !RA) return;
  const host = RA.$('#courseDetail');
  if (!host) return;

  const id = RA.getParam('id');
  const course = id ? D.getCourseById(id) : null;

  if (!course) {
    document.title = 'Course not found | Rayaan Academy';
    host.innerHTML = '<section class="ra-section"><div class="container tw-max-w-2xl">' +
      RA.emptyState('bi-journal-x', 'Course not found', 'The course link may be incorrect or the course is no longer available.',
        '<a href="courses.html" class="btn btn-ra-primary">Browse all courses</a>') + '</div></section>';
    return;
  }

  const cat = D.getCategory(course.category);
  const inst = D.getInstructor(course.instructor);
  document.title = course.title + ' | Rayaan Academy';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', course.description);

  function enrollBlock() {
    const enrolled = S.isEnrolled(course.id);
    const saved = S.isWishlisted(course.id);
    const prog = S.getProgress(course.id);
    const record = S.getEnrollments()[course.id];
    const resumeUrl = 'learn.html?course=' + course.id + (record && record.lastLessonId ? '&lesson=' + record.lastLessonId : '');
    return (enrolled
      ? '<div class="mb-3"><div class="d-flex justify-content-between small mb-1"><span class="fw-semibold">Your progress</span><span>' + prog.completed + ' / ' + prog.total + ' lessons</span></div>' +
        '<div class="ra-progress" role="progressbar" aria-label="Course progress" aria-valuenow="' + prog.percent + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + prog.percent + '%"></span></div></div>' +
        '<a href="' + resumeUrl + '" class="btn btn-ra-primary btn-lg w-100 mb-2">' + (prog.completed ? 'Continue learning' : 'Start first lesson') + ' <i class="bi bi-arrow-right" aria-hidden="true"></i></a>'
      : '<div class="d-flex align-items-baseline gap-2 mb-3"><span class="h3 mb-0">' + (course.price === 'Free' ? 'Free' : 'Paid course') + '</span><span class="ra-badge badge-demo">Demo</span></div>' +
        '<button type="button" class="btn btn-ra-primary btn-lg w-100 mb-2" data-action="enroll" data-id="' + course.id + '">Enroll Now</button>') +
      '<button type="button" class="btn btn-ra-ghost w-100' + (saved ? ' is-active' : '') + '" data-action="wishlist" data-id="' + course.id + '" aria-pressed="' + saved + '"><i class="bi ' + (saved ? 'bi-heart-fill' : 'bi-heart') + ' text-accent" aria-hidden="true"></i> <span data-label>' + (saved ? 'Saved to wishlist' : 'Save to wishlist') + '</span></button>';
  }

  const modulesHtml = course.modules.map(function (m, mi) {
    const mins = m.lessons.reduce(function (s, l) { return s + l.minutes; }, 0);
    const cid = 'mod-' + mi;
    return '<div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button' + (mi ? ' collapsed' : '') + '" type="button" data-bs-toggle="collapse" data-bs-target="#' + cid + '" aria-expanded="' + (mi ? 'false' : 'true') + '" aria-controls="' + cid + '">' +
      '<span class="me-3">Module ' + (mi + 1) + ': ' + RA.esc(m.title) + '</span><small class="text-muted-ra fw-normal ms-auto me-3 d-none d-sm-inline">' + m.lessons.length + ' lessons · ' + mins + ' min</small></button></h3>' +
      '<div id="' + cid + '" class="accordion-collapse collapse' + (mi ? '' : ' show') + '"><div class="accordion-body pt-0" data-module-lessons="' + mi + '"></div></div></div>';
  }).join('');

  function lessonRows() {
    course.modules.forEach(function (m, mi) {
      const box = host.querySelector('[data-module-lessons="' + mi + '"]');
      if (!box) return;
      const enrolled = S.isEnrolled(course.id);
      box.innerHTML = m.lessons.map(function (l) {
        const done = S.isLessonComplete(course.id, l.id);
        const icon = done ? '<i class="bi bi-check-circle-fill is-done" aria-label="Completed"></i>' : '<i class="bi bi-play-circle" aria-hidden="true"></i>';
        const title = (enrolled || l.preview)
          ? '<a href="learn.html?course=' + course.id + '&lesson=' + l.id + '">' + RA.esc(l.title) + '</a>'
          : '<span>' + RA.esc(l.title) + '</span>';
        return '<div class="ra-lesson-row">' + icon + title + (l.preview && !enrolled ? '<span class="ra-badge badge-free">Preview</span>' : '') +
          '<span class="ms-auto">' + l.minutes + ' min' + (!enrolled && !l.preview ? ' <i class="bi bi-lock" aria-label="Locked until you enroll"></i>' : '') + '</span></div>';
      }).join('');
    });
  }

  const related = D.COURSES.filter(function (c) { return c.id !== course.id && (c.category === course.category || c.tags.some(function (t) { return course.tags.indexOf(t) !== -1; })); })
    .concat(D.COURSES.filter(function (c) { return c.id !== course.id && c.level === course.level; }))
    .filter(function (c, i, arr) { return arr.findIndex(function (x) { return x.id === c.id; }) === i; })
    .slice(0, 3);
  const instCourses = D.COURSES.filter(function (c) { return c.instructor === course.instructor; }).length;

  host.innerHTML =
    '<section class="ra-detail-hero"><div class="container"><div class="row"><div class="col-lg-8">' +
      '<nav aria-label="Breadcrumb"><ol class="breadcrumb ra-breadcrumb"><li class="breadcrumb-item"><a href="index.html">Home</a></li><li class="breadcrumb-item"><a href="courses.html">Courses</a></li>' +
      '<li class="breadcrumb-item"><a href="courses.html?category=' + cat.id + '">' + RA.esc(cat.name) + '</a></li><li class="breadcrumb-item active" aria-current="page">' + RA.esc(course.title) + '</li></ol></nav>' +
      '<div class="d-flex flex-wrap gap-2 mb-3"><span class="ra-badge ' + RA.levelClass(course.level) + '">' + course.level + '</span>' + (course.price === 'Free' ? '<span class="ra-badge badge-free">Free</span>' : '<span class="ra-badge badge-paid">Paid</span>') + '</div>' +
      '<h1>' + RA.esc(course.title) + '</h1><p class="lead">' + RA.esc(course.description) + '</p>' +
      '<div class="ra-detail-meta mt-3"><span>' + RA.stars(course.rating) + ' <strong class="ms-1">' + course.rating.toFixed(1) + '</strong> <small>(demo)</small></span>' +
      '<span><i class="bi bi-people" aria-hidden="true"></i>' + RA.formatNumber(course.enrollments) + ' learners (demo)</span>' +
      '<span><i class="bi bi-person-circle" aria-hidden="true"></i>' + RA.esc(inst.name) + '</span>' +
      '<span><i class="bi bi-clock" aria-hidden="true"></i>' + course.duration + ' hours</span>' +
      '<span><i class="bi bi-collection-play" aria-hidden="true"></i>' + course.modules.length + ' modules, ' + course.lessons + ' lessons</span></div>' +
    '</div></div></div></section>' +

    '<section class="ra-section-sm"><div class="container"><div class="row g-4 g-lg-5 flex-lg-row-reverse">' +
      '<aside class="col-lg-4"><div class="ra-enroll-wrap ra-sticky"><div class="ra-enroll-card">' +
        '<img src="' + course.thumbnail + '" alt="' + RA.esc(course.title) + ' course cover" width="640" height="360">' +
        '<div class="p-4"><div id="enrollBlock">' + enrollBlock() + '</div>' +
        '<ul class="list-unstyled small mt-4 mb-0 d-grid gap-2 text-muted-ra">' +
          '<li><i class="bi bi-bar-chart text-accent me-2" aria-hidden="true"></i>Level: ' + course.level + '</li>' +
          '<li><i class="bi bi-clock text-accent me-2" aria-hidden="true"></i>' + course.duration + ' hours of content</li>' +
          '<li><i class="bi bi-collection-play text-accent me-2" aria-hidden="true"></i>' + course.lessons + ' lessons in ' + course.modules.length + ' modules</li>' +
          '<li><i class="bi bi-patch-question text-accent me-2" aria-hidden="true"></i>Practice quiz included</li>' +
          '<li><i class="bi bi-award text-accent me-2" aria-hidden="true"></i>Certificate on completion</li></ul></div></div></div></aside>' +

      '<div class="col-lg-8">' +
        '<div class="ra-card mb-4"><h2 class="h4 mb-3">What you will learn</h2><ul class="ra-check-list row row-cols-1 row-cols-md-2 g-2">' +
          course.outcomes.map(function (o) { return '<li class="col"><i class="bi bi-check2-circle" aria-hidden="true"></i><span>' + RA.esc(o) + '</span></li>'; }).join('') + '</ul></div>' +

        '<div class="mb-4"><div class="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3"><h2 class="h4 mb-0">Curriculum</h2>' +
          '<div class="d-flex gap-2"><button type="button" class="btn btn-sm btn-ra-ghost" data-curr="expand">Expand all</button><button type="button" class="btn btn-sm btn-ra-ghost" data-curr="collapse">Collapse all</button></div></div>' +
          '<div class="accordion ra-accordion" id="curriculum">' + modulesHtml + '</div></div>' +

        '<div class="ra-card mb-4"><h2 class="h4 mb-3">Prerequisites</h2><ul class="ra-check-list">' +
          course.prerequisites.map(function (p) { return '<li><i class="bi bi-arrow-right-circle text-accent" aria-hidden="true"></i><span>' + RA.esc(p) + '</span></li>'; }).join('') + '</ul></div>' +

        '<div class="mb-4"><h2 class="h4 mb-3">Course resources</h2><div class="row g-3">' +
          [['syllabus', 'bi-file-earmark-text', 'Course syllabus', 'All modules and lessons'],
           ['outcomes', 'bi-list-check', 'Outcomes checklist', 'Track your learning goals'],
           ['study-plan', 'bi-calendar-week', 'Weekly study plan', 'A suggested schedule']].map(function (r) {
            return '<div class="col-md-4"><button type="button" class="ra-resource h-100" data-action="resource" data-id="' + course.id + '" data-kind="' + r[0] + '"><i class="bi ' + r[1] + '" aria-hidden="true"></i><span><strong>' + r[2] + '</strong><small>' + r[3] + ' (.txt)</small></span></button></div>';
          }).join('') + '</div></div>' +

        '<div class="ra-card mb-4"><h2 class="h4 mb-3">Your instructor</h2><div class="d-flex gap-3 align-items-start">' +
          '<span class="ra-avatar ra-avatar-lg">' + RA.esc(RA.initials(inst.name)) + '</span><div><h3 class="h5 mb-0">' + RA.esc(inst.name) + '</h3>' +
          '<p class="small mb-2">' + RA.esc(inst.role) + ' · ' + instCourses + ' course' + (instCourses === 1 ? '' : 's') + '</p><p>' + RA.esc(inst.bio) + '</p>' +
          '<a href="instructors.html#' + inst.id + '" class="small fw-semibold">View profile</a></div></div></div>' +

        '<div><h2 class="h4 mb-3">Tags</h2><div class="d-flex flex-wrap gap-2">' + course.tags.map(function (t) {
          return '<a class="ra-badge" href="courses.html?q=' + encodeURIComponent(t) + '">' + RA.esc(t) + '</a>';
        }).join('') + '</div></div>' +
      '</div>' +
    '</div></div></section>' +

    '<section class="ra-section-sm bg-soft"><div class="container"><h2 class="h3 mb-4">Related courses</h2><div class="row g-4">' +
      related.map(function (c) { return '<div class="col-md-6 col-lg-4">' + RA.courseCard(c) + '</div>'; }).join('') +
    '</div></div></section>';

  lessonRows();

  host.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-curr]');
    if (!btn || !window.bootstrap) return;
    const expand = btn.getAttribute('data-curr') === 'expand';
    RA.$all('#curriculum .accordion-collapse', host).forEach(function (el) {
      const inst = window.bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
      if (expand) inst.show(); else inst.hide();
    });
  });

  document.addEventListener('ra:enroll', function (e) {
    if (e.detail.id !== course.id) return;
    RA.$('#enrollBlock').innerHTML = enrollBlock();
    lessonRows();
  });
})();
