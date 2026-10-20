/* Rayaan Academy - learning classroom (learn.html?course=...&lesson=...) */
(function () {
  'use strict';
  const D = window.RA_DATA, S = window.RAStore, RA = window.RA;
  if (!D || !S || !RA) return;
  const content = RA.$('#learnContent');
  const nav = RA.$('#curriculumNav');
  if (!content || !nav) return;

  /* Resolve course: URL param, else most recent enrollment */
  let courseId = RA.getParam('course');
  if (!courseId || !D.getCourseById(courseId)) {
    const all = S.getEnrollments();
    courseId = Object.keys(all).filter(function (id) { return D.getCourseById(id); })
      .sort(function (a, b) { return (all[b].lastAccess || 0) - (all[a].lastAccess || 0); })[0] || null;
  }
  const course = courseId ? D.getCourseById(courseId) : null;

  if (!course) {
    RA.$('#learnCourseTitle').textContent = 'No course selected';
    RA.$('#toggleCurriculum').hidden = true;
    RA.$('#curriculumPanel').hidden = true;
    content.innerHTML = '<div class="tw-max-w-2xl mx-auto pt-5">' + RA.emptyState('bi-collection-play', 'Choose a course to start learning',
      'You are not enrolled in any course yet. Pick one from the catalog to open the classroom.', '<a href="courses.html" class="btn btn-ra-primary">Explore courses</a>') + '</div>';
    return;
  }

  const lessons = D.getAllLessons(course);
  const quizId = D.getQuizIdForCourse(course);
  document.title = course.title + ' | Classroom | Rayaan Academy';
  RA.$('#learnCourseTitle').textContent = course.title;

  let current = lessons.find(function (l) { return l.id === RA.getParam('lesson'); });
  if (!current) {
    const rec = S.getEnrollments()[course.id];
    current = (rec && rec.lastLessonId && lessons.find(function (l) { return l.id === rec.lastLessonId; })) ||
      lessons.find(function (l) { return !S.isLessonComplete(course.id, l.id); }) || lessons[0];
  }
  let activeTab = 'overview';

  function moduleOf(lesson) { return course.modules.find(function (m) { return m.lessons.indexOf(lesson) !== -1; }); }
  function canView(lesson) { return S.isEnrolled(course.id) || lesson.preview; }

  /* ---------- Progress header ---------- */
  function renderProgress() {
    const p = S.getProgress(course.id);
    const bar = RA.$('#learnProgressBar');
    bar.setAttribute('aria-valuenow', p.percent);
    bar.querySelector('span').style.width = p.percent + '%';
    RA.$('#learnProgressText').textContent = p.percent + '%';
    RA.$('#curriculumSummary').textContent = p.completed + ' of ' + p.total + ' lessons complete · ' + p.percent + '%';
  }

  /* ---------- Curriculum sidebar ---------- */
  const openModules = {};
  function renderNav() {
    const curModule = moduleOf(current);
    nav.innerHTML = course.modules.map(function (m, mi) {
      const done = m.lessons.filter(function (l) { return S.isLessonComplete(course.id, l.id); }).length;
      const open = openModules[m.id] !== undefined ? openModules[m.id] : m === curModule;
      return '<div><button type="button" class="ra-module-btn" data-module="' + m.id + '" aria-expanded="' + open + '" aria-controls="list-' + m.id + '">' +
        '<span><span class="d-block">' + (mi + 1) + '. ' + RA.esc(m.title) + '</span><small>' + done + ' / ' + m.lessons.length + ' complete</small></span><i class="bi bi-chevron-down" aria-hidden="true"></i></button>' +
        '<ul class="ra-lesson-list" id="list-' + m.id + '"' + (open ? '' : ' hidden') + '>' + m.lessons.map(function (l) {
          const isDone = S.isLessonComplete(course.id, l.id);
          const locked = !canView(l);
          const icon = isDone ? 'bi-check-circle-fill is-done' : (locked ? 'bi-lock' : (l === current ? 'bi-play-circle-fill' : 'bi-circle'));
          return '<li><a href="learn.html?course=' + course.id + '&lesson=' + l.id + '" class="ra-lesson-link' + (l === current ? ' active' : '') + '" data-lesson="' + l.id + '"' + (l === current ? ' aria-current="page"' : '') + '>' +
            '<i class="bi ' + icon + ' state" aria-hidden="true"></i><span>' + RA.esc(l.title) + '<small>' + l.minutes + ' min' + (isDone ? ' · completed' : '') + (locked ? ' · enroll to unlock' : '') + '</small></span></a></li>';
        }).join('') + '</ul></div>';
    }).join('');
  }
  nav.addEventListener('click', function (e) {
    const mod = e.target.closest('[data-module]');
    if (mod) {
      const id = mod.getAttribute('data-module');
      const open = mod.getAttribute('aria-expanded') !== 'true';
      openModules[id] = open;
      mod.setAttribute('aria-expanded', String(open));
      RA.$('#list-' + id).hidden = !open;
      return;
    }
    const link = e.target.closest('[data-lesson]');
    if (link) {
      e.preventDefault();
      const l = lessons.find(function (x) { return x.id === link.getAttribute('data-lesson'); });
      if (l) goTo(l);
      const panel = RA.$('#curriculumPanel');
      if (window.bootstrap && window.innerWidth < 992) {
        const oc = window.bootstrap.Offcanvas.getInstance(panel);
        if (oc) oc.hide();
      }
    }
  });

  /* Toggle curriculum: collapse on desktop, offcanvas on mobile */
  RA.$('#toggleCurriculum').addEventListener('click', function () {
    const panel = RA.$('#curriculumPanel');
    if (window.innerWidth >= 992) {
      const collapsed = panel.classList.toggle('is-collapsed');
      this.setAttribute('aria-expanded', String(!collapsed));
      S.write('curriculum_collapsed', collapsed);
    } else if (window.bootstrap) {
      window.bootstrap.Offcanvas.getOrCreateInstance(panel).toggle();
    }
  });
  if (S.read('curriculum_collapsed', false) && window.innerWidth >= 992) {
    RA.$('#curriculumPanel').classList.add('is-collapsed');
    RA.$('#toggleCurriculum').setAttribute('aria-expanded', 'false');
  }

  /* ---------- Main lesson area ---------- */
  function playerHtml(lesson) {
    if (!canView(lesson)) {
      return '<div class="ra-player"><div class="ra-player-fallback"><i class="bi bi-lock" aria-hidden="true"></i><h2 class="h5 text-white">This lesson is locked</h2>' +
        '<p class="mb-3">Enroll in the course to unlock every lesson. The first lesson is a free preview.</p>' +
        '<button type="button" class="btn btn-ra-primary" data-action="enroll" data-id="' + course.id + '">Enroll now</button></div></div>';
    }
    if (!lesson.videoUrl) return fallbackHtml();
    const autoplay = S.getProfile().autoplay;
    return '<div class="ra-player"><video controls playsinline preload="metadata"' + (autoplay ? ' autoplay muted' : '') + ' src="' + RA.esc(lesson.videoUrl) + '" aria-label="Video for ' + RA.esc(lesson.title) + '"></video></div>';
  }
  function fallbackHtml() {
    return '<div class="ra-player-fallback"><i class="bi bi-camera-video-off" aria-hidden="true"></i><h2 class="h5 text-white">Video unavailable</h2>' +
      '<p class="mb-1">This lesson video could not be loaded. Check your connection, or add a valid video URL.</p>' +
      '<p class="small mb-0">Set <code>videoUrl</code> for this lesson in <code>js/courses-data.js</code>, or place an MP4 in <code>assets/videos/</code> and point to it.</p></div>';
  }

  function tabsHtml(lesson) {
    const tabs = [['overview', 'Overview'], ['notes', 'Notes'], ['resources', 'Resources'], ['quiz', 'Quiz']];
    return '<ul class="nav ra-tabs mb-4" role="tablist">' + tabs.map(function (t) {
      const on = t[0] === activeTab;
      return '<li class="nav-item" role="presentation"><button type="button" class="nav-link' + (on ? ' active' : '') + '" role="tab" id="tab-' + t[0] + '" aria-controls="panel-' + t[0] + '" aria-selected="' + on + '" tabindex="' + (on ? '0' : '-1') + '" data-tab="' + t[0] + '">' + t[1] + '</button></li>';
    }).join('') + '</ul>' +
    '<div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview"' + (activeTab === 'overview' ? '' : ' hidden') + '>' +
      '<p>' + RA.esc(lesson.description) + '</p>' +
      '<h3 class="h6 mt-4">In this course you will</h3><ul class="ra-check-list">' + course.outcomes.map(function (o) { return '<li><i class="bi bi-check2-circle" aria-hidden="true"></i><span>' + RA.esc(o) + '</span></li>'; }).join('') + '</ul></div>' +
    '<div role="tabpanel" id="panel-notes" aria-labelledby="tab-notes"' + (activeTab === 'notes' ? '' : ' hidden') + '>' +
      '<label for="lessonNotes" class="form-label">Your notes for this lesson</label>' +
      '<textarea id="lessonNotes" class="form-control ra-notes" placeholder="Write key points, questions or code snippets. Notes save automatically in this browser."></textarea>' +
      '<div class="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2"><small class="text-muted-ra" id="notesStatus" aria-live="polite"></small>' +
      '<div class="d-flex gap-2"><button type="button" class="btn btn-sm btn-ra-ghost" id="downloadNotes"><i class="bi bi-download" aria-hidden="true"></i> Download</button><button type="button" class="btn btn-sm btn-ra-ghost" id="clearNotes">Clear</button></div></div></div>' +
    '<div role="tabpanel" id="panel-resources" aria-labelledby="tab-resources"' + (activeTab === 'resources' ? '' : ' hidden') + '><div class="row g-3">' +
      [['syllabus', 'bi-file-earmark-text', 'Course syllabus'], ['outcomes', 'bi-list-check', 'Outcomes checklist'], ['study-plan', 'bi-calendar-week', 'Weekly study plan']].map(function (r) {
        return '<div class="col-md-4"><button type="button" class="ra-resource h-100" data-action="resource" data-id="' + course.id + '" data-kind="' + r[0] + '"><i class="bi ' + r[1] + '" aria-hidden="true"></i><span><strong>' + r[2] + '</strong><small>Download (.txt)</small></span></button></div>';
      }).join('') +
      '<div class="col-12"><p class="small text-muted-ra mb-0"><i class="bi bi-info-circle" aria-hidden="true"></i> Lesson slides and exercise files are placeholders in this demo. Add your files to <code>assets/resources/</code> and link them here.</p></div></div></div>' +
    '<div role="tabpanel" id="panel-quiz" aria-labelledby="tab-quiz"' + (activeTab === 'quiz' ? '' : ' hidden') + '>' +
      '<div class="ra-card d-flex flex-wrap gap-3 align-items-center"><span class="ra-feature-icon mb-0"><i class="bi bi-patch-question" aria-hidden="true"></i></span>' +
      '<div class="flex-grow-1"><h3 class="h5 mb-1">Practice quiz</h3><p class="mb-0">Test what you have learned with a short multiple-choice quiz related to this course.</p>' + quizBest() + '</div>' +
      '<a href="quiz.html?quiz=' + quizId + '&course=' + course.id + '" class="btn btn-ra-primary">Start quiz</a></div></div>';
  }
  function quizBest() {
    const r = S.getQuizResults()[quizId];
    return r ? '<small class="text-muted-ra d-block mt-1">Best score: ' + r.best.percent + '% · ' + r.attempts + ' attempt' + (r.attempts === 1 ? '' : 's') + '</small>' : '';
  }

  function render() {
    const idx = lessons.indexOf(current);
    const mod = moduleOf(current);
    const mi = course.modules.indexOf(mod);
    const done = S.isLessonComplete(course.id, current.id);
    const prev = lessons[idx - 1], next = lessons[idx + 1];
    content.innerHTML = playerHtml(current) +
      '<div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mt-4">' +
        '<div><small class="text-muted-ra">Module ' + (mi + 1) + ' · Lesson ' + (idx + 1) + ' of ' + lessons.length + ' · ' + current.minutes + ' min</small>' +
        '<h1 class="h3 mt-1 mb-0">' + RA.esc(current.title) + '</h1></div>' +
        (canView(current) ? '<button type="button" class="btn ' + (done ? 'btn-ra-ghost' : 'btn-ra-primary') + '" id="markComplete" aria-pressed="' + done + '">' +
          (done ? '<i class="bi bi-check-circle-fill text-success" aria-hidden="true"></i> Completed' : '<i class="bi bi-check2" aria-hidden="true"></i> Mark as Complete') + '</button>' : '') +
      '</div>' +
      '<div class="ra-lesson-nav">' +
        '<button type="button" class="btn btn-ra-ghost" id="prevLesson"' + (prev ? '' : ' disabled') + '><i class="bi bi-chevron-left" aria-hidden="true"></i> Previous lesson</button>' +
        '<button type="button" class="btn btn-ra-dark ms-auto" id="nextLesson"' + (next ? '' : ' disabled') + '>Next lesson <i class="bi bi-chevron-right" aria-hidden="true"></i></button>' +
      '</div>' + tabsHtml(current);

    const video = RA.$('video', content);
    if (video) video.addEventListener('error', function () { video.parentElement.innerHTML = fallbackHtml(); });

    // Notes
    const notes = RA.$('#lessonNotes');
    if (notes) {
      notes.value = S.getNote(current.id);
      let t = null;
      notes.addEventListener('input', function () {
        RA.$('#notesStatus').textContent = 'Saving...';
        clearTimeout(t);
        t = setTimeout(function () { S.setNote(current.id, notes.value.trim() ? notes.value : ''); RA.$('#notesStatus').textContent = 'Saved at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }, 500);
      });
      RA.$('#notesStatus').textContent = notes.value ? 'Saved notes loaded.' : '';
    }

    renderNav();
    renderProgress();
    if (S.isEnrolled(course.id)) S.setLastLesson(course.id, current.id);
  }

  function goTo(lesson) {
    current = lesson;
    try { history.replaceState(null, '', 'learn.html?course=' + course.id + '&lesson=' + lesson.id); } catch (e) { /* ignore */ }
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
    const h = RA.$('h1', content);
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  content.addEventListener('click', function (e) {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.id === 'prevLesson') { const i = lessons.indexOf(current); if (lessons[i - 1]) goTo(lessons[i - 1]); }
    else if (t.id === 'nextLesson') { const i = lessons.indexOf(current); if (lessons[i + 1]) goTo(lessons[i + 1]); }
    else if (t.id === 'markComplete') {
      if (!S.isEnrolled(course.id)) S.enroll(course.id);
      const nowDone = !S.isLessonComplete(course.id, current.id);
      S.setLessonComplete(course.id, current.id, nowDone, current.minutes);
      const p = S.getProgress(course.id);
      if (nowDone && p.completed === p.total) RA.toast('Course complete. Your certificate is ready on the Certificates page.', 'success');
      else RA.toast(nowDone ? 'Lesson marked as complete.' : 'Lesson marked as not complete.', nowDone ? 'success' : 'info');
      render();
      const btn = RA.$('#markComplete'); if (btn) btn.focus();
    }
    else if (t.hasAttribute('data-tab')) { setTab(t.getAttribute('data-tab'), true); }
    else if (t.id === 'clearNotes') {
      RA.confirm({ title: 'Clear notes?', body: 'This removes your notes for this lesson from this browser.', confirmText: 'Clear notes', danger: true }).then(function (ok) {
        if (!ok) return;
        S.setNote(current.id, '');
        const n = RA.$('#lessonNotes'); if (n) n.value = '';
        RA.$('#notesStatus').textContent = 'Notes cleared.';
      });
    }
    else if (t.id === 'downloadNotes') {
      const text = S.getNote(current.id);
      if (!text) { RA.toast('There are no notes to download yet.', 'info'); return; }
      RA.downloadText(current.id + '-notes.txt', course.title + '\n' + current.title + '\n\n' + text + '\n');
    }
  });

  function setTab(name, focus) {
    activeTab = name;
    RA.$all('[data-tab]', content).forEach(function (b) {
      const on = b.getAttribute('data-tab') === name;
      b.classList.toggle('active', on); b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    RA.$all('[role="tabpanel"]', content).forEach(function (p) { p.hidden = p.id !== 'panel-' + name; });
  }
  // Arrow-key navigation between tabs
  content.addEventListener('keydown', function (e) {
    if (!e.target.hasAttribute('data-tab') || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
    const tabs = RA.$all('[data-tab]', content);
    const i = tabs.indexOf(e.target);
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    setTab(n.getAttribute('data-tab'), true);
  });

  document.addEventListener('ra:enroll', render);
  render();
})();
