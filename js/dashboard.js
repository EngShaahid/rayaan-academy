/* Rayaan Academy - student dashboard (all figures come from stored demo data) */
(function () {
  'use strict';
  const D = window.RA_DATA, S = window.RAStore, RA = window.RA;
  if (!D || !S || !RA || !RA.$('#statCards')) return;

  const DAY = S.DAY;
  function dayKey(ts) { const d = new Date(ts); return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); }

  function computeStats() {
    const enrollments = S.getEnrollments();
    const ids = Object.keys(enrollments).filter(function (id) { return D.getCourseById(id); });
    const activity = S.getActivity();
    let completedLessons = 0, totalLessons = 0;
    const completedCourses = [];
    ids.forEach(function (id) {
      const p = S.getProgress(id);
      completedLessons += p.completed;
      totalLessons += p.total;
      if (p.total && p.completed === p.total) completedCourses.push(id);
    });
    const minutes = activity.reduce(function (s, a) { return s + (a.minutes || 0); }, 0);

    // Streak: consecutive active days ending today (or yesterday)
    const activeDays = {};
    activity.forEach(function (a) { if (a.type !== 'enroll') activeDays[dayKey(a.ts)] = true; });
    let streak = 0;
    let cursor = Date.now();
    if (!activeDays[dayKey(cursor)]) cursor -= DAY;
    while (activeDays[dayKey(cursor)]) { streak += 1; cursor -= DAY; }

    return { ids: ids, enrollments: enrollments, activity: activity, completedLessons: completedLessons, totalLessons: totalLessons,
      completedCourses: completedCourses, minutes: minutes, streak: streak, activeDays: activeDays };
  }

  function renderWelcome(st) {
    const name = S.displayName().split(' ')[0];
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : (hour < 17 ? 'Good afternoon' : 'Good evening');
    RA.$('#welcomeTitle').textContent = greet + ', ' + name;
    RA.$('#welcomeDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    RA.$('#welcomeText').textContent = st.streak
      ? 'You are on a ' + st.streak + '-day learning streak. Keep it going today.'
      : 'Complete one lesson today to start a new learning streak.';
    const last = st.ids.map(function (id) { return { id: id, r: st.enrollments[id] }; })
      .filter(function (x) { const p = S.getProgress(x.id); return p.completed < p.total; })
      .sort(function (a, b) { return (b.r.lastAccess || 0) - (a.r.lastAccess || 0); })[0];
    const cta = RA.$('#welcomeCta');
    if (last) {
      cta.href = 'learn.html?course=' + last.id + (last.r.lastLessonId ? '&lesson=' + last.r.lastLessonId : '');
      cta.innerHTML = 'Resume ' + RA.esc(D.getCourseById(last.id).title.split(' ').slice(0, 3).join(' ')) + ' <i class="bi bi-arrow-right" aria-hidden="true"></i>';
    } else {
      cta.href = 'courses.html';
      cta.innerHTML = 'Find a course <i class="bi bi-arrow-right" aria-hidden="true"></i>';
    }
  }

  function renderStats(st) {
    const hours = (st.minutes / 60);
    const cards = [
      ['bi-journal-bookmark', st.ids.length, 'Enrolled courses', ''],
      ['bi-check2-square', st.completedLessons, 'Completed lessons', 'is-dark'],
      ['bi-hourglass-split', hours < 10 ? hours.toFixed(1) : Math.round(hours), 'Hours learned', ''],
      ['bi-award', st.completedCourses.length, 'Certificates earned', 'is-dark']
    ];
    RA.$('#statCards').innerHTML = cards.map(function (c) {
      return '<div class="col-6 col-xl-3"><div class="ra-stat-card"><span class="icon ' + c[3] + '"><i class="bi ' + c[0] + '" aria-hidden="true"></i></span><div><div class="value">' + c[1] + '</div><div class="label">' + c[2] + '</div></div></div></div>';
    }).join('');
  }

  function renderContinue(st) {
    const list = st.ids.filter(function (id) { const p = S.getProgress(id); return p.completed < p.total; })
      .sort(function (a, b) { return (st.enrollments[b].lastAccess || 0) - (st.enrollments[a].lastAccess || 0); }).slice(0, 3);
    const host = RA.$('#continueList');
    if (!list.length) {
      host.innerHTML = RA.emptyState('bi-play-circle', 'Nothing in progress', 'Enroll in a course to see it here.', '<a href="courses.html" class="btn btn-ra-primary">Explore courses</a>');
      return;
    }
    host.innerHTML = list.map(function (id) {
      const c = D.getCourseById(id), p = S.getProgress(id), r = st.enrollments[id];
      const lessons = D.getAllLessons(c);
      const next = lessons.find(function (l) { return r.completed.indexOf(l.id) === -1; }) || lessons[0];
      return '<div class="ra-continue"><img src="' + c.thumbnail + '" alt="" width="112" height="63"><div class="flex-grow-1 min-w-0">' +
        '<h3><a href="course-details.html?id=' + c.id + '" class="text-reset">' + RA.esc(c.title) + '</a></h3>' +
        '<p class="small mb-2 text-truncate">Next: ' + RA.esc(next.title) + '</p>' +
        '<div class="d-flex align-items-center gap-2"><div class="ra-progress flex-grow-1" role="progressbar" aria-label="' + RA.esc(c.title) + ' progress" aria-valuenow="' + p.percent + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + p.percent + '%"></span></div><small class="fw-semibold">' + p.percent + '%</small></div></div>' +
        '<a href="learn.html?course=' + c.id + '&lesson=' + next.id + '" class="btn btn-ra-primary btn-sm flex-shrink-0">Continue</a></div>';
    }).join('');
  }

  function renderRing(st) {
    const pct = st.totalLessons ? Math.round((st.completedLessons / st.totalLessons) * 100) : 0;
    const r = 62, c = 2 * Math.PI * r;
    RA.$('#overallRing').innerHTML = '<div class="ra-ring" role="img" aria-label="Overall progress ' + pct + ' percent"><svg viewBox="0 0 150 150" aria-hidden="true">' +
      '<circle class="track" cx="75" cy="75" r="' + r + '" fill="none" stroke-width="12"/>' +
      '<circle class="bar" cx="75" cy="75" r="' + r + '" fill="none" stroke-width="12" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + c.toFixed(1) + '"/></svg>' +
      '<div class="label"><strong>' + pct + '%</strong><span>complete</span></div></div>';
    requestAnimationFrame(function () {
      const bar = RA.$('#overallRing .bar');
      if (bar) bar.setAttribute('stroke-dashoffset', (c * (1 - pct / 100)).toFixed(1));
    });
    RA.$('#overallText').textContent = st.completedLessons + ' of ' + st.totalLessons + ' lessons completed across ' + st.ids.length + ' course' + (st.ids.length === 1 ? '' : 's') + '.';
  }

  function renderWeek(st) {
    const days = [];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 6; i >= 0; i--) {
      const start = today.getTime() - i * DAY;
      const mins = st.activity.filter(function (a) { return a.ts >= start && a.ts < start + DAY; })
        .reduce(function (s, a) { return s + (a.minutes || 0); }, 0);
      days.push({ label: new Date(start).toLocaleDateString('en-US', { weekday: 'short' }), mins: mins, today: i === 0 });
    }
    const max = Math.max(30, Math.max.apply(null, days.map(function (d) { return d.mins; })));
    const total = days.reduce(function (s, d) { return s + d.mins; }, 0);
    RA.$('#weekTotal').textContent = total + ' min this week';
    RA.$('#weekChart').innerHTML = '<div class="ra-chart">' + days.map(function (d) {
      return '<div class="ra-chart-col"><div class="ra-chart-bar' + (d.mins ? '' : ' is-zero') + '" style="height:' + Math.max(3, Math.round((d.mins / max) * 100)) + '%"><span class="tip">' + (d.mins ? d.mins + 'm' : '') + '</span></div>' +
        '<span class="ra-chart-day' + (d.today ? ' is-today' : '') + '">' + d.label + '</span></div>';
    }).join('') + '</div>' +
    '<table class="visually-hidden"><caption>Minutes learned per day</caption><tbody>' + days.map(function (d) { return '<tr><th scope="row">' + d.label + '</th><td>' + d.mins + ' minutes</td></tr>'; }).join('') + '</tbody></table>';
  }

  function renderStreak(st) {
    const cells = [];
    for (let i = 6; i >= 0; i--) {
      const ts = Date.now() - i * DAY;
      const on = st.activeDays[dayKey(ts)];
      cells.push('<div class="ra-streak-day' + (on ? ' is-on' : '') + '"><span>' + (on ? '<i class="bi bi-check-lg" aria-hidden="true"></i>' : '') + '</span>' +
        new Date(ts).toLocaleDateString('en-US', { weekday: 'narrow' }) + '<span class="visually-hidden">' + (on ? ' active' : ' inactive') + '</span></div>');
    }
    const goal = S.getProfile().weeklyGoal || 5;
    const weekMins = st.activity.filter(function (a) { return a.ts > Date.now() - 7 * DAY; }).reduce(function (s, a) { return s + (a.minutes || 0); }, 0);
    const pct = Math.min(100, Math.round((weekMins / (goal * 60)) * 100));
    RA.$('#streakBox').innerHTML = '<div class="d-flex align-items-baseline gap-2"><span class="ra-stat-card p-0 border-0 bg-transparent"><span class="value">' + st.streak + '</span></span><span class="text-muted-ra">day' + (st.streak === 1 ? '' : 's') + ' in a row</span></div>' +
      '<div class="ra-streak-days">' + cells.join('') + '</div>' +
      '<div class="mt-4"><div class="d-flex justify-content-between small mb-1"><span>Weekly goal</span><span>' + Math.round(weekMins / 6) / 10 + ' / ' + goal + ' h</span></div>' +
      '<div class="ra-progress" role="progressbar" aria-label="Weekly goal progress" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + pct + '%"></span></div>' +
      '<a href="profile.html" class="small d-inline-block mt-2">Change weekly goal</a></div>';
  }

  let mcFilter = 'progress';
  function renderMyCourses(st) {
    const list = st.ids.filter(function (id) {
      const p = S.getProgress(id);
      if (mcFilter === 'progress') return p.completed < p.total;
      if (mcFilter === 'completed') return p.total && p.completed === p.total;
      return true;
    });
    const host = RA.$('#myCourses');
    host.innerHTML = list.length
      ? list.map(function (id) { return '<div class="col-md-6 col-xxl-4">' + RA.courseCard(D.getCourseById(id)) + '</div>'; }).join('')
      : '<div class="col-12">' + RA.emptyState(mcFilter === 'completed' ? 'bi-trophy' : 'bi-journal-plus',
          mcFilter === 'completed' ? 'No completed courses yet' : 'No courses here yet',
          mcFilter === 'completed' ? 'Finish every lesson in a course to see it here.' : 'Enroll in a course to start learning.',
          '<a href="courses.html" class="btn btn-ra-primary">Explore courses</a>') + '</div>';
  }

  function renderAchievements(st) {
    const quiz = S.getQuizResults();
    const quizKeys = Object.keys(quiz);
    const items = [
      ['bi-flag', 'First Steps', st.completedLessons >= 1],
      ['bi-123', '10 Lessons', st.completedLessons >= 10],
      ['bi-gem', '25 Lessons', st.completedLessons >= 25],
      ['bi-fire', '3-Day Streak', st.streak >= 3],
      ['bi-calendar-check', '7-Day Streak', st.streak >= 7],
      ['bi-compass', 'Explorer', st.ids.length >= 3],
      ['bi-patch-question', 'Quiz Taker', quizKeys.length >= 1],
      ['bi-star', 'Quiz Ace', quizKeys.some(function (k) { return quiz[k].best.percent >= 80; })],
      ['bi-mortarboard', 'Graduate', st.completedCourses.length >= 1],
      ['bi-heart', 'Collector', S.getWishlist().length >= 3]
    ];
    const earned = items.filter(function (i) { return i[2]; }).length;
    RA.$('#badgeCount').textContent = earned + ' of ' + items.length + ' earned';
    RA.$('#achievements').innerHTML = items.map(function (i) {
      return '<div class="ra-achievement' + (i[2] ? '' : ' is-locked') + '"><i class="bi ' + i[0] + '" aria-hidden="true"></i>' + i[1] +
        '<span class="visually-hidden">' + (i[2] ? ' earned' : ' locked') + '</span></div>';
    }).join('');
  }

  /* Goals (editable, persisted) */
  function getGoals() {
    let goals = S.read('goals', null);
    if (!goals) {
      goals = [
        { id: 'g1', text: 'Finish the Layout and Responsive Design module', done: false },
        { id: 'g2', text: 'Take the Programming practice quiz', done: false },
        { id: 'g3', text: 'Study for 30 minutes on three days this week', done: true }
      ];
      S.write('goals', goals);
    }
    return goals;
  }
  function renderGoals() {
    const goals = getGoals();
    RA.$('#goalList').innerHTML = goals.length ? goals.map(function (g) {
      return '<div class="ra-goal' + (g.done ? ' is-done' : '') + '"><input class="form-check-input mt-0" type="checkbox" id="goal-' + g.id + '" data-goal-toggle="' + g.id + '"' + (g.done ? ' checked' : '') + '>' +
        '<label for="goal-' + g.id + '">' + RA.esc(g.text) + '</label><button type="button" class="btn-remove" data-goal-remove="' + g.id + '" aria-label="Remove goal: ' + RA.esc(g.text) + '"><i class="bi bi-trash3" aria-hidden="true"></i></button></div>';
    }).join('') : '<p class="text-muted-ra small mb-0 py-3">No goals yet. Add one above to plan your week.</p>';
  }
  RA.$('#goalForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const input = RA.$('#goalInput');
    const text = input.value.trim();
    if (!RA.setFieldError(input, text.length < 3 ? 'Please write a goal of at least 3 characters.' : '')) return;
    const goals = getGoals();
    goals.push({ id: 'g' + Date.now(), text: text, done: false });
    S.write('goals', goals);
    input.value = '';
    renderGoals();
    RA.toast('Goal added.', 'success');
  });
  RA.$('#goalList').addEventListener('change', function (e) {
    const id = e.target.getAttribute('data-goal-toggle');
    if (!id) return;
    const goals = getGoals().map(function (g) { if (g.id === id) g.done = e.target.checked; return g; });
    S.write('goals', goals);
    renderGoals();
    if (e.target.checked) RA.toast('Goal completed. Well done.', 'success');
  });
  RA.$('#goalList').addEventListener('click', function (e) {
    const btn = e.target.closest('[data-goal-remove]');
    if (!btn) return;
    const id = btn.getAttribute('data-goal-remove');
    S.write('goals', getGoals().filter(function (g) { return g.id !== id; }));
    renderGoals();
    RA.toast('Goal removed.', 'info');
  });

  function miniRow(c, actionHtml) {
    return '<div class="ra-mini-course"><img src="' + c.thumbnail + '" alt="" width="64" height="36"><div class="flex-grow-1 min-w-0">' +
      '<a class="title" href="course-details.html?id=' + c.id + '">' + RA.esc(c.title) + '</a><small>' + c.level + ' · ' + c.duration + ' h</small></div>' + (actionHtml || '') + '</div>';
  }

  function renderSaved() {
    const list = S.getWishlist().map(D.getCourseById).filter(Boolean);
    RA.$('#savedList').innerHTML = list.length
      ? list.map(function (c) { return miniRow(c, '<button type="button" class="ra-icon-btn btn text-accent" data-action="wishlist" data-id="' + c.id + '" aria-label="Remove ' + RA.esc(c.title) + ' from wishlist"><i class="bi bi-heart-fill" aria-hidden="true"></i></button>'); }).join('')
      : '<p class="text-muted-ra small mb-0 py-3">No saved courses. Tap the heart on any course to save it for later.</p>';
  }

  function renderRecommended(st) {
    const prof = S.getProfile();
    const interests = prof.interests || [];
    const enrolledCats = st.ids.map(function (id) { return D.getCourseById(id).category; });
    const list = D.COURSES.filter(function (c) { return st.ids.indexOf(c.id) === -1; })
      .map(function (c) {
        let score = c.rating;
        if (interests.indexOf(c.category) !== -1) score += 3;
        if (enrolledCats.indexOf(c.category) !== -1) score += 1.5;
        if (c.level === prof.preferredLevel) score += 1;
        return { c: c, score: score };
      })
      .sort(function (a, b) { return b.score - a.score; }).slice(0, 4).map(function (x) { return x.c; });
    RA.$('#recList').innerHTML = list.map(function (c) {
      return miniRow(c, '<button type="button" class="btn btn-sm btn-ra-outline" data-action="enroll" data-id="' + c.id + '">Enroll</button>');
    }).join('');
  }

  function renderActivity(st) {
    const icons = { lesson: 'bi-check2-circle', enroll: 'bi-journal-plus', quiz: 'bi-patch-question' };
    const list = st.activity.slice(0, 6);
    RA.$('#activityList').innerHTML = list.length ? list.map(function (a) {
      let text = '';
      const c = a.courseId ? D.getCourseById(a.courseId) : null;
      if (a.type === 'lesson') {
        const l = c ? D.getAllLessons(c).find(function (x) { return x.id === a.lessonId; }) : null;
        text = 'Completed <strong>' + RA.esc(l ? l.title : 'a lesson') + '</strong>';
      } else if (a.type === 'enroll') {
        text = 'Enrolled in <strong>' + RA.esc(c ? c.title : 'a course') + '</strong>';
      } else if (a.type === 'quiz') {
        text = 'Scored <strong>' + a.score + '%</strong> on the ' + RA.esc(a.quizId) + ' quiz';
      }
      return '<li><span class="dot"><i class="bi ' + (icons[a.type] || 'bi-dot') + '" aria-hidden="true"></i></span><div>' + text + '<small>' + RA.timeAgo(a.ts) + '</small></div></li>';
    }).join('') : '<li class="text-muted-ra small">No activity yet.</li>';
  }

  function renderCertQuick(st) {
    const n = st.completedCourses.length;
    RA.$('#certQuickText').textContent = n
      ? 'You have earned ' + n + ' certificate' + (n === 1 ? '' : 's') + '. View, print or share them.'
      : 'Complete all lessons in a course to unlock your first certificate.';
  }

  function renderAll() {
    const st = computeStats();
    renderWelcome(st); renderStats(st); renderContinue(st); renderRing(st); renderWeek(st); renderStreak(st);
    renderMyCourses(st); renderAchievements(st); renderGoals(); renderSaved(); renderRecommended(st); renderActivity(st); renderCertQuick(st);
  }

  RA.$all('[data-mc]').forEach(function (b) {
    b.addEventListener('click', function () {
      mcFilter = b.getAttribute('data-mc');
      RA.$all('[data-mc]').forEach(function (x) { const on = x === b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', String(on)); });
      renderMyCourses(computeStats());
    });
  });

  document.addEventListener('ra:enroll', renderAll);
  document.addEventListener('ra:wishlist', function () { renderSaved(); renderAchievements(computeStats()); });
  renderAll();
})();
