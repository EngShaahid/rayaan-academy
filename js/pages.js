/* Rayaan Academy - smaller pages: learning paths, instructors, contact, profile, certificates */
(function () {
  'use strict';
  const D = window.RA_DATA, S = window.RAStore, RA = window.RA;
  if (!D || !S || !RA) return;

  /* =================== Learning paths =================== */
  const pathList = RA.$('#pathList');
  if (pathList) {
    let filter = 'all';
    const renderPaths = function () {
      const items = D.LEARNING_PATHS.map(function (p) {
        const courses = p.courses.map(D.getCourseById).filter(Boolean);
        const done = courses.filter(function (c) { const pr = S.getProgress(c.id); return pr.total && pr.completed === pr.total; }).length;
        const started = courses.some(function (c) { return S.isEnrolled(c.id); });
        const lessonsTotal = courses.reduce(function (s, c) { return s + c.lessons; }, 0);
        const lessonsDone = courses.reduce(function (s, c) { return s + S.getProgress(c.id).completed; }, 0);
        return { p: p, courses: courses, done: done, started: started, pct: lessonsTotal ? Math.round(lessonsDone / lessonsTotal * 100) : 0 };
      }).filter(function (x) { return filter === 'all' || (filter === 'started' ? x.started : !x.started); });

      pathList.innerHTML = items.length ? items.map(function (x) {
        const p = x.p;
        const hours = x.courses.reduce(function (s, c) { return s + c.duration; }, 0);
        const next = x.courses.find(function (c) { const pr = S.getProgress(c.id); return !(pr.total && pr.completed === pr.total); });
        return '<article class="ra-path-card" id="' + p.id + '" tabindex="-1">' +
          '<div class="row g-4 align-items-center">' +
            '<div class="col-lg-4"><div class="d-flex gap-3 align-items-center mb-2"><span class="ra-feature-icon mb-0"><i class="bi ' + p.icon + '" aria-hidden="true"></i></span>' +
              '<div><h2 class="h4 mb-0">' + RA.esc(p.title) + '</h2><small class="text-muted-ra">' + RA.esc(p.level) + '</small></div></div>' +
              '<p class="text-muted-ra">' + RA.esc(p.description) + '</p>' +
              '<div class="d-flex gap-3 small mb-3"><span><i class="bi bi-journal-text text-accent" aria-hidden="true"></i> ' + x.courses.length + ' courses</span><span><i class="bi bi-clock text-accent" aria-hidden="true"></i> ' + hours + ' hours</span></div>' +
              '<div class="d-flex justify-content-between small mb-1"><span>Path progress</span><span>' + x.done + ' / ' + x.courses.length + ' courses</span></div>' +
              '<div class="ra-progress mb-3" role="progressbar" aria-label="' + RA.esc(p.title) + ' path progress" aria-valuenow="' + x.pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + x.pct + '%"></span></div>' +
              (next ? (S.isEnrolled(next.id)
                ? '<a class="btn btn-ra-primary" href="learn.html?course=' + next.id + '">Continue: ' + RA.esc(next.title) + '</a>'
                : '<button type="button" class="btn btn-ra-primary" data-start-path="' + p.id + '" data-course="' + next.id + '">' + (x.started ? 'Enroll in next course' : 'Start this path') + '</button>')
                : '<span class="ra-badge level-beginner"><i class="bi bi-trophy" aria-hidden="true"></i> Path complete</span>') +
            '</div>' +
            '<div class="col-lg-8"><ol class="ra-path-steps my-0">' + x.courses.map(function (c) {
              const pr = S.getProgress(c.id);
              const complete = pr.total && pr.completed === pr.total;
              return '<li class="' + (complete ? 'is-done' : '') + '"><div class="d-flex flex-wrap justify-content-between gap-2"><a href="course-details.html?id=' + c.id + '" class="fw-semibold">' + RA.esc(c.title) + '</a>' +
                '<span class="small text-muted-ra">' + c.level + ' · ' + c.duration + ' h' + (S.isEnrolled(c.id) ? ' · ' + pr.percent + '%' : '') + '</span></div>' +
                '<small class="text-muted-ra d-block">' + RA.esc(c.description) + '</small></li>';
            }).join('') + '</ol></div>' +
          '</div></article>';
      }).join('') : RA.emptyState('bi-signpost', filter === 'started' ? 'No paths started yet' : 'You have started every path', 'Use the filters above to see other paths.');
    };
    RA.$all('[data-path-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        filter = b.getAttribute('data-path-filter');
        RA.$all('[data-path-filter]').forEach(function (x) { const on = x === b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', String(on)); });
        renderPaths();
      });
    });
    pathList.addEventListener('click', function (e) {
      const b = e.target.closest('[data-start-path]');
      if (!b) return;
      const c = D.getCourseById(b.getAttribute('data-course'));
      S.enroll(c.id);
      RA.toast('Enrolled in ' + c.title + '. Opening the classroom.', 'success');
      setTimeout(function () { window.location.href = 'learn.html?course=' + c.id; }, 800);
    });
    renderPaths();
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) { target.scrollIntoView(); target.focus({ preventScroll: true }); }
    }
  }

  /* =================== Instructors =================== */
  const instList = RA.$('#instructorList');
  if (instList) {
    const search = RA.$('#instSearch'), area = RA.$('#instArea');
    const areas = D.INSTRUCTORS.map(function (i) { return i.expertise; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    area.innerHTML += areas.map(function (a) { return '<option value="' + a + '">' + RA.esc(D.getCategory(a).name) + '</option>'; }).join('');
    const renderInst = function () {
      const q = search.value.trim().toLowerCase();
      const list = D.INSTRUCTORS.filter(function (i) {
        return (!area.value || i.expertise === area.value) && (!q || (i.name + ' ' + i.role + ' ' + i.bio).toLowerCase().indexOf(q) !== -1);
      });
      RA.$('#instCount').textContent = list.length + ' instructor' + (list.length === 1 ? '' : 's');
      instList.innerHTML = list.length ? list.map(function (p, idx) {
        const courses = D.COURSES.filter(function (c) { return c.instructor === p.id; });
        const learners = courses.reduce(function (s, c) { return s + c.enrollments; }, 0);
        return '<div class="col-md-6 col-xl-4"><article class="ra-instructor text-start" id="' + p.id + '" tabindex="-1">' +
          '<div class="d-flex gap-3 align-items-center mb-3"><span class="ra-avatar ra-avatar-lg mb-0' + (idx % 2 ? ' is-dark' : '') + '">' + RA.esc(RA.initials(p.name)) + '</span>' +
          '<div><h2 class="h5 mb-0">' + RA.esc(p.name) + '</h2><p class="role mb-1">' + RA.esc(p.role) + '</p><span class="ra-badge">' + RA.esc(D.getCategory(p.expertise).name) + '</span></div></div>' +
          '<p class="text-muted-ra small">' + RA.esc(p.bio) + '</p>' +
          '<div class="d-flex gap-3 small mb-3"><span><i class="bi bi-journal-text text-accent" aria-hidden="true"></i> ' + courses.length + ' courses</span><span><i class="bi bi-people text-accent" aria-hidden="true"></i> ' + RA.formatNumber(learners) + ' learners (demo)</span></div>' +
          '<h3 class="h6">Courses</h3><ul class="list-unstyled small mb-0 d-grid gap-1">' + courses.map(function (c) { return '<li><a href="course-details.html?id=' + c.id + '">' + RA.esc(c.title) + '</a></li>'; }).join('') + '</ul>' +
          '</article></div>';
      }).join('') : '<div class="col-12">' + RA.emptyState('bi-person-x', 'No instructors found', 'Try another name or area.') + '</div>';
    };
    search.addEventListener('input', renderInst);
    area.addEventListener('change', renderInst);
    renderInst();
    if (window.location.hash) {
      const t = document.getElementById(window.location.hash.slice(1));
      if (t) { t.scrollIntoView({ block: 'center' }); t.focus({ preventScroll: true }); t.style.borderColor = 'var(--ra-accent)'; }
    }
  }

  /* =================== Contact =================== */
  const contact = RA.$('#contactForm');
  if (contact) {
    RA.$('#contactEmail').innerHTML = '<a href="mailto:' + RA.esc(D.BRAND.email) + '">' + RA.esc(D.BRAND.email) + '</a>';
    RA.$('#contactPhone').textContent = D.BRAND.phone;
    RA.$('#contactAddress').textContent = D.BRAND.address;
    const f = { name: RA.$('#cName'), email: RA.$('#cEmail'), phone: RA.$('#cPhone'), topic: RA.$('#cTopic'), msg: RA.$('#cMessage') };
    const prof = S.getProfile();
    if (prof.name && prof.name !== 'Guest Learner') f.name.value = prof.name;
    if (prof.email) f.email.value = prof.email;
    f.msg.addEventListener('input', function () { RA.$('#cCount').textContent = f.msg.value.length; RA.setFieldError(f.msg, ''); });
    Object.keys(f).forEach(function (k) { f[k].addEventListener('input', function () { RA.setFieldError(f[k], ''); }); });
    contact.addEventListener('submit', function (e) {
      e.preventDefault();
      const ok = [
        RA.setFieldError(f.name, f.name.value.trim().length < 2 ? 'Please enter your name.' : ''),
        RA.setFieldError(f.email, !RA.EMAIL_RE.test(f.email.value.trim()) ? 'Enter a valid email address.' : ''),
        RA.setFieldError(f.phone, f.phone.value && !/^[+\d\s()-]{7,20}$/.test(f.phone.value.trim()) ? 'Enter a valid phone number or leave it empty.' : ''),
        RA.setFieldError(f.topic, !f.topic.value ? 'Please choose a topic.' : ''),
        RA.setFieldError(f.msg, f.msg.value.trim().length < 20 ? 'Please write at least 20 characters so we can help.' : '')
      ].every(Boolean);
      if (!ok) { const bad = RA.$('.is-invalid', contact); if (bad) bad.focus(); return; }
      const msgs = S.read('contact_messages', []);
      msgs.push({ name: f.name.value.trim(), email: f.email.value.trim(), topic: f.topic.value, message: f.msg.value.trim(), ts: Date.now() });
      S.write('contact_messages', msgs.slice(-20));
      contact.hidden = true;
      const done = RA.$('#contactSuccess');
      done.hidden = false;
      done.focus();
      RA.toast('Message sent (demo).', 'success');
    });
    RA.$('#contactAgain').addEventListener('click', function () {
      contact.reset(); RA.$('#cCount').textContent = '0';
      contact.hidden = false; RA.$('#contactSuccess').hidden = true; f.topic.focus();
    });
  }

  /* =================== Profile =================== */
  const pForm = RA.$('#profileForm');
  if (pForm) {
    const el = {
      name: RA.$('#pName'), email: RA.$('#pEmail'), bio: RA.$('#pBio'), goal: RA.$('#pGoal'), goalVal: RA.$('#pGoalValue'),
      level: RA.$('#pLevel'), notifyEmail: RA.$('#pNotifyEmail'), notifyReminders: RA.$('#pNotifyReminders'), autoplay: RA.$('#pAutoplay'), dark: RA.$('#pDark')
    };
    RA.$('#pInterests').innerHTML = D.CATEGORIES.map(function (c) {
      return '<div class="col"><div class="form-check"><input class="form-check-input" type="checkbox" name="interest" value="' + c.id + '" id="int-' + c.id + '"><label class="form-check-label" for="int-' + c.id + '">' + RA.esc(c.name) + '</label></div></div>';
    }).join('');

    const fill = function () {
      const p = S.getProfile();
      el.name.value = p.name === 'Guest Learner' ? '' : p.name;
      el.email.value = p.email || '';
      el.bio.value = p.bio || '';
      el.goal.value = p.weeklyGoal; el.goalVal.textContent = p.weeklyGoal;
      el.level.value = p.preferredLevel;
      el.notifyEmail.checked = p.notifyEmail; el.notifyReminders.checked = p.notifyReminders; el.autoplay.checked = p.autoplay;
      el.dark.checked = S.getTheme() === 'dark';
      RA.$all('input[name="interest"]').forEach(function (i) { i.checked = p.interests.indexOf(i.value) !== -1; });
      renderCard();
    };
    const renderCard = function () {
      const name = S.displayName();
      const p = S.getProfile();
      const session = S.getSession();
      RA.$('#profileAvatar').textContent = RA.initials(name);
      RA.$('#profileName').textContent = name;
      RA.$('#profileEmail').textContent = p.email || 'No email added';
      const ids = Object.keys(S.getEnrollments());
      const lessons = ids.reduce(function (s, id) { return s + S.getProgress(id).completed; }, 0);
      const done = ids.filter(function (id) { const pr = S.getProgress(id); return pr.total && pr.completed === pr.total; }).length;
      RA.$('#profileStats').innerHTML = [[ids.length, 'Courses'], [lessons, 'Lessons'], [done, 'Certificates']].map(function (s) {
        return '<div class="col-4"><div class="ra-stat-card d-block p-2"><div class="value">' + s[0] + '</div><div class="label">' + s[1] + '</div></div></div>';
      }).join('');
      RA.$('#profileSession').innerHTML = session
        ? 'Signed in to the demo session as ' + RA.esc(session.email) + '.'
        : 'You are browsing as a guest. <a href="login.html?next=profile.html">Log in</a> to use a demo account.';
    };

    el.goal.addEventListener('input', function () { el.goalVal.textContent = el.goal.value; });
    el.dark.addEventListener('change', function () { S.setTheme(el.dark.checked ? 'dark' : 'light'); document.dispatchEvent(new CustomEvent('ra:theme')); });
    document.addEventListener('ra:theme', function () { el.dark.checked = S.getTheme() === 'dark'; });

    pForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const n = el.name.value.trim(), m = el.email.value.trim();
      const ok = RA.setFieldError(el.name, n.length < 2 ? 'Please enter your name (at least 2 characters).' : '') &
        RA.setFieldError(el.email, m && !RA.EMAIL_RE.test(m) ? 'Enter a valid email address or leave it empty.' : '');
      if (!ok) { const bad = RA.$('.is-invalid', pForm); if (bad) bad.focus(); return; }
      const interests = RA.$all('input[name="interest"]:checked').map(function (i) { return i.value; });
      S.saveProfile(Object.assign(S.getProfile(), {
        name: n, email: m, bio: el.bio.value.trim(), weeklyGoal: Number(el.goal.value), preferredLevel: el.level.value, interests: interests,
        notifyEmail: el.notifyEmail.checked, notifyReminders: el.notifyReminders.checked, autoplay: el.autoplay.checked
      }));
      const session = S.getSession();
      if (session) S.write('session', Object.assign(session, { name: n, email: m || session.email }));
      renderCard();
      RA.toast('Profile saved.', 'success');
      const sideName = RA.$('.ra-side-user strong'); if (sideName) sideName.textContent = n;
      const sideAv = RA.$('.ra-side-user .ra-avatar'); if (sideAv) sideAv.textContent = RA.initials(n);
    });
    RA.$('#profileCancel').addEventListener('click', function () {
      fill();
      RA.$all('.is-invalid', pForm).forEach(function (i) { RA.setFieldError(i, ''); });
      RA.toast('Changes discarded.', 'info');
    });
    RA.$('#exportData').addEventListener('click', function () {
      const data = {
        profile: S.getProfile(), enrollments: S.getEnrollments(), wishlist: S.getWishlist(), quizResults: S.getQuizResults(),
        notes: S.read('notes', {}), goals: S.read('goals', []), exportedAt: new Date().toISOString()
      };
      RA.downloadText('rayaan-academy-my-data.json', JSON.stringify(data, null, 2));
      RA.toast('Your data export has started.', 'success');
    });
    RA.$('#resetData').addEventListener('click', function () {
      RA.confirm({ title: 'Reset all demo data?', body: 'This removes your enrollments, progress, notes, goals, quiz results, wishlist and demo session from this browser. Sample progress will be loaded again.', confirmText: 'Reset data', danger: true })
        .then(function (ok) {
          if (!ok) return;
          S.resetAll();
          RA.toast('Demo data reset.', 'info');
          setTimeout(function () { window.location.href = 'dashboard.html'; }, 700);
        });
    });
    fill();
  }

  /* =================== Certificates =================== */
  const earnedList = RA.$('#earnedList');
  if (earnedList) {
    let currentCert = null;
    const certId = function (courseId, ts) {
      let h = 0; const s = courseId + (S.getProfile().email || S.displayName()) + ts;
      for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
      return 'RA-' + new Date(ts).getFullYear() + '-' + Math.abs(h).toString(36).toUpperCase().slice(0, 6);
    };
    const renderCerts = function () {
      const all = S.getEnrollments();
      const ids = Object.keys(all).filter(function (id) { return D.getCourseById(id); });
      const earned = ids.filter(function (id) { const p = S.getProgress(id); return p.total && p.completed === p.total; });
      const pending = ids.filter(function (id) { return earned.indexOf(id) === -1; });

      earnedList.innerHTML = earned.length ? earned.map(function (id) {
        const c = D.getCourseById(id);
        const ts = all[id].completedAt || all[id].lastAccess || Date.now();
        return '<div class="col-md-6 col-xxl-4"><article class="ra-panel"><div class="d-flex gap-3 align-items-start">' +
          '<span class="ra-feature-icon mb-0"><i class="bi bi-award-fill" aria-hidden="true"></i></span><div class="min-w-0">' +
          '<h3 class="h6 mb-1">' + RA.esc(c.title) + '</h3><p class="small text-muted-ra mb-1">Completed ' + new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + '</p>' +
          '<p class="small text-muted-ra mb-3">ID: ' + certId(id, ts) + '</p>' +
          '<button type="button" class="btn btn-sm btn-ra-primary" data-view-cert="' + id + '">View certificate</button></div></div></article></div>';
      }).join('') : '<div class="col-12">' + RA.emptyState('bi-award', 'No certificates yet', 'Finish all lessons in any enrolled course to unlock its certificate.', '<a href="dashboard.html" class="btn btn-ra-primary">Go to my courses</a>') + '</div>';

      RA.$('#progressList').innerHTML = pending.length ? pending.map(function (id) {
        const c = D.getCourseById(id), p = S.getProgress(id);
        return '<div class="col-md-6 col-xxl-4"><article class="ra-panel"><div class="d-flex gap-3"><img src="' + c.thumbnail + '" alt="" width="96" height="54" class="rounded tw-object-cover">' +
          '<div class="flex-grow-1 min-w-0"><h3 class="h6 mb-1">' + RA.esc(c.title) + '</h3><p class="small text-muted-ra mb-2">' + (p.total - p.completed) + ' lessons left to unlock</p>' +
          '<div class="ra-progress mb-3" role="progressbar" aria-label="' + RA.esc(c.title) + ' progress" aria-valuenow="' + p.percent + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + p.percent + '%"></span></div>' +
          '<div class="d-flex flex-wrap gap-2"><a href="learn.html?course=' + id + '" class="btn btn-sm btn-ra-primary">Continue</a>' +
          '<button type="button" class="btn btn-sm btn-ra-ghost" data-demo-complete="' + id + '">Complete instantly (demo)</button></div></div></div></article></div>';
      }).join('') : '<div class="col-12"><p class="text-muted-ra">No courses in progress. <a href="courses.html">Find your next course</a>.</p></div>';
    };

    document.addEventListener('click', function (e) {
      const v = e.target.closest('[data-view-cert]');
      if (v) {
        const id = v.getAttribute('data-view-cert');
        const c = D.getCourseById(id), rec = S.getEnrollments()[id];
        const ts = rec.completedAt || rec.lastAccess || Date.now();
        const inst = D.getInstructor(c.instructor);
        currentCert = certId(id, ts);
        RA.$('#printArea').innerHTML = '<div class="ra-certificate">' +
          '<img src="assets/images/logo.png" alt="Rayaan Academy logo" width="100" height="70">' +
          '<p class="text-uppercase small fw-semibold mt-3 mb-1 tw-tracking-widest">Certificate of Completion</p>' +
          '<h2>This certifies that</h2><div class="cert-name">' + RA.esc(S.displayName()) + '</div>' +
          '<p class="mb-1">has successfully completed the course</p><h3 class="h4" style="color:#B5031D">' + RA.esc(c.title) + '</h3>' +
          '<p class="small mb-0">' + c.lessons + ' lessons · ' + c.duration + ' hours · ' + c.level + ' level</p>' +
          '<div class="cert-foot"><span>Date: ' + new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + '</span>' +
          '<span>Instructor: ' + RA.esc(inst.name) + '</span><span>ID: ' + currentCert + '</span></div>' +
          '<p class="small mt-3 mb-0" style="color:#888">Demo certificate generated by the Rayaan Academy frontend prototype.</p></div>';
        window.bootstrap.Modal.getOrCreateInstance(RA.$('#certModal')).show();
        return;
      }
      const dc = e.target.closest('[data-demo-complete]');
      if (dc) {
        const id = dc.getAttribute('data-demo-complete');
        const c = D.getCourseById(id);
        RA.confirm({ title: 'Complete this course?', body: 'This marks every lesson in ' + c.title + ' as complete so you can preview the certificate. It is a demo shortcut.', confirmText: 'Complete course' })
          .then(function (ok) {
            if (!ok) return;
            D.getAllLessons(c).forEach(function (l) { if (!S.isLessonComplete(id, l.id)) S.setLessonComplete(id, l.id, true, l.minutes); });
            renderCerts();
            RA.toast('Certificate unlocked for ' + c.title + '.', 'success');
          });
      }
    });
    RA.$('#printCert').addEventListener('click', function () { window.print(); });
    RA.$('#copyCertId').addEventListener('click', function () {
      if (!currentCert) return;
      const done = function () { RA.toast('Certificate ID copied: ' + currentCert, 'success'); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(currentCert).then(done, function () { RA.toast('Copy failed. ID: ' + currentCert, 'warning'); });
      else RA.toast('Certificate ID: ' + currentCert, 'info');
    });
    renderCerts();
  }
})();
