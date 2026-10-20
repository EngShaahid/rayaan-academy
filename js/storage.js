/* =========================================================
   Rayaan Academy - LocalStorage layer (demo data only)
   Loaded in <head> so the saved theme applies before paint.
   Never store passwords or other sensitive data here.
   ========================================================= */
(function () {
  'use strict';

  const PREFIX = 'ra_';
  const DAY = 86400000;

  function read(key, fallback) {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function remove(key) {
    try { window.localStorage.removeItem(PREFIX + key); } catch (e) { /* storage unavailable */ }
  }

  /* ---------- Theme ---------- */
  function getTheme() {
    const saved = read('theme', null);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
  function setTheme(theme) { write('theme', theme); applyTheme(theme); }
  applyTheme(getTheme());

  /* ---------- Wishlist ---------- */
  function getWishlist() { return read('wishlist', []); }
  function isWishlisted(id) { return getWishlist().indexOf(id) !== -1; }
  function toggleWishlist(id) {
    const list = getWishlist();
    const i = list.indexOf(id);
    if (i === -1) list.push(id); else list.splice(i, 1);
    write('wishlist', list);
    return i === -1;
  }

  /* ---------- Enrollment and progress ---------- */
  function getEnrollments() { return read('enrollments', {}); }
  function isEnrolled(id) { return Object.prototype.hasOwnProperty.call(getEnrollments(), id); }
  function enroll(id) {
    const all = getEnrollments();
    if (all[id]) return false;
    all[id] = { enrolledAt: Date.now(), completed: [], lastLessonId: null, lastAccess: Date.now() };
    write('enrollments', all);
    logActivity({ type: 'enroll', courseId: id, minutes: 0 });
    return true;
  }
  function unenroll(id) {
    const all = getEnrollments();
    delete all[id];
    write('enrollments', all);
  }
  function getProgress(courseId) {
    const course = window.RA_DATA ? window.RA_DATA.getCourseById(courseId) : null;
    const total = course ? course.lessons : 0;
    const record = getEnrollments()[courseId];
    const completed = record ? record.completed.length : 0;
    return { completed: completed, total: total, percent: total ? Math.round((completed / total) * 100) : 0 };
  }
  function isLessonComplete(courseId, lessonId) {
    const record = getEnrollments()[courseId];
    return Boolean(record && record.completed.indexOf(lessonId) !== -1);
  }
  function setLessonComplete(courseId, lessonId, done, minutes) {
    const all = getEnrollments();
    if (!all[courseId]) all[courseId] = { enrolledAt: Date.now(), completed: [], lastLessonId: null, lastAccess: Date.now() };
    const list = all[courseId].completed;
    const i = list.indexOf(lessonId);
    if (done && i === -1) {
      list.push(lessonId);
      if (list.length === (window.RA_DATA.getCourseById(courseId) || { lessons: -1 }).lessons) {
        all[courseId].completedAt = Date.now();
      }
      write('enrollments', all);
      logActivity({ type: 'lesson', courseId: courseId, lessonId: lessonId, minutes: minutes || 10 });
    } else if (!done && i !== -1) {
      list.splice(i, 1);
      delete all[courseId].completedAt;
      write('enrollments', all);
    }
  }
  function setLastLesson(courseId, lessonId) {
    const all = getEnrollments();
    if (!all[courseId]) return;
    all[courseId].lastLessonId = lessonId;
    all[courseId].lastAccess = Date.now();
    write('enrollments', all);
  }

  /* ---------- Notes ---------- */
  function getNote(lessonId) { return read('notes', {})[lessonId] || ''; }
  function setNote(lessonId, text) {
    const notes = read('notes', {});
    if (text) notes[lessonId] = text; else delete notes[lessonId];
    write('notes', notes);
  }

  /* ---------- Activity log ---------- */
  function getActivity() { return read('activity', []); }
  function logActivity(entry) {
    const list = getActivity();
    list.unshift(Object.assign({ ts: Date.now() }, entry));
    write('activity', list.slice(0, 200));
  }

  /* ---------- Demo session (NOT real authentication) ---------- */
  function getUsers() { return read('demo_users', []); }
  function addUser(user) {
    const users = getUsers();
    if (users.some(function (u) { return u.email === user.email; })) return false;
    users.push({ name: user.name, email: user.email, createdAt: Date.now() });
    write('demo_users', users);
    return true;
  }
  function findUser(email) { return getUsers().find(function (u) { return u.email === email; }) || null; }
  function getSession() { return read('session', null); }
  function setSession(user) {
    write('session', { name: user.name, email: user.email, since: Date.now() });
    const profile = getProfile();
    profile.name = user.name;
    profile.email = user.email;
    saveProfile(profile);
  }
  function clearSession() { remove('session'); }

  /* ---------- Profile and preferences ---------- */
  const DEFAULT_PROFILE = {
    name: 'Guest Learner', email: '', bio: '', weeklyGoal: 5,
    interests: ['web-development', 'cybersecurity'], preferredLevel: 'Beginner',
    notifyEmail: true, notifyReminders: true, autoplay: false
  };
  function getProfile() { return Object.assign({}, DEFAULT_PROFILE, read('profile', {})); }
  function saveProfile(p) { write('profile', p); }
  function displayName() {
    const s = getSession();
    return (s && s.name) || getProfile().name || 'Guest Learner';
  }

  /* ---------- Quiz results ---------- */
  function getQuizResults() { return read('quiz_results', {}); }
  function saveQuizResult(quizId, result) {
    const all = getQuizResults();
    const prev = all[quizId];
    all[quizId] = {
      last: result,
      best: prev && prev.best && prev.best.percent >= result.percent ? prev.best : result,
      attempts: (prev ? prev.attempts : 0) + 1
    };
    write('quiz_results', all);
    logActivity({ type: 'quiz', quizId: quizId, minutes: 5, score: result.percent });
  }

  /* ---------- Demo seed ---------- */
  function seedDemo() {
    if (read('seeded', false) || !window.RA_DATA) return;
    const D = window.RA_DATA;
    const now = Date.now();
    const plan = [
      { id: 'html-css-fundamentals', done: 9 },
      { id: 'python-programming', done: 5 },
      { id: 'cybersecurity-fundamentals', done: 2 }
    ];
    const enrollments = {};
    const activity = [];
    plan.forEach(function (p, pi) {
      const course = D.getCourseById(p.id);
      if (!course) return;
      const lessons = D.getAllLessons(course).slice(0, p.done);
      enrollments[p.id] = {
        enrolledAt: now - (14 - pi * 3) * DAY,
        completed: lessons.map(function (l) { return l.id; }),
        lastLessonId: lessons.length ? lessons[lessons.length - 1].id : null,
        lastAccess: now - pi * DAY
      };
      lessons.forEach(function (l, li) {
        activity.push({ type: 'lesson', courseId: p.id, lessonId: l.id, minutes: l.minutes,
          ts: now - ((li + pi * 2) % 7) * DAY - (li + 1) * 3600000 });
      });
    });
    activity.sort(function (a, b) { return b.ts - a.ts; });
    write('enrollments', enrollments);
    write('activity', activity);
    write('wishlist', ['data-science-ml', 'linux-system-administration']);
    write('seeded', true);
  }

  function resetAll() {
    try {
      Object.keys(window.localStorage)
        .filter(function (k) { return k.indexOf(PREFIX) === 0 && k !== PREFIX + 'theme'; })
        .forEach(function (k) { window.localStorage.removeItem(k); });
    } catch (e) { /* storage unavailable */ }
  }

  window.RAStore = {
    read: read, write: write, remove: remove,
    getTheme: getTheme, setTheme: setTheme,
    getWishlist: getWishlist, isWishlisted: isWishlisted, toggleWishlist: toggleWishlist,
    getEnrollments: getEnrollments, isEnrolled: isEnrolled, enroll: enroll, unenroll: unenroll,
    getProgress: getProgress, isLessonComplete: isLessonComplete, setLessonComplete: setLessonComplete,
    setLastLesson: setLastLesson,
    getNote: getNote, setNote: setNote,
    getActivity: getActivity, logActivity: logActivity,
    getUsers: getUsers, addUser: addUser, findUser: findUser,
    getSession: getSession, setSession: setSession, clearSession: clearSession,
    getProfile: getProfile, saveProfile: saveProfile, displayName: displayName,
    getQuizResults: getQuizResults, saveQuizResult: saveQuizResult,
    seedDemo: seedDemo, resetAll: resetAll, DAY: DAY
  };
})();
