/* =========================================================
   Rayaan Academy - DEMO authentication UI
   This is NOT real authentication. Passwords are validated in the
   browser for UX only and are never stored or transmitted. Only the
   user's name and email are kept in LocalStorage for the demo session.
   Replace this file with calls to a secure backend in production.
   ========================================================= */
(function () {
  'use strict';
  const S = window.RAStore, RA = window.RA;
  if (!S || !RA) return;

  const DEMO_USER = { name: 'Demo Student', email: 'student@rayaan-academy.example' };

  function showAlert(msg) {
    const a = RA.$('#formAlert');
    if (!a) return;
    a.textContent = msg || '';
    a.classList.toggle('d-none', !msg);
  }
  function nextUrl() {
    const n = RA.getParam('next');
    return n && /^[a-z-]+\.html/.test(n) ? n : 'dashboard.html';
  }
  function finish(user, message) {
    S.setSession(user);
    RA.toast(message, 'success');
    setTimeout(function () { window.location.href = nextUrl(); }, 800);
  }
  function validateEmail(input) {
    const v = input.value.trim();
    return RA.setFieldError(input, !v ? 'Email address is required.' : (!RA.EMAIL_RE.test(v) ? 'Enter a valid email address, for example name@example.com.' : ''));
  }
  function firstInvalid(form) {
    const el = RA.$('.is-invalid', form);
    if (el) el.focus();
  }

  /* ---------- Login ---------- */
  const login = RA.$('#loginForm');
  if (login) {
    const email = RA.$('#loginEmail'), pass = RA.$('#loginPassword');
    login.addEventListener('submit', function (e) {
      e.preventDefault();
      showAlert('');
      const okEmail = validateEmail(email);
      const okPass = RA.setFieldError(pass, !pass.value ? 'Password is required.' : (pass.value.length < 8 ? 'Password must be at least 8 characters.' : ''));
      if (!okEmail || !okPass) { firstInvalid(login); return; }
      const user = S.findUser(email.value.trim().toLowerCase());
      if (!user) {
        showAlert('No demo account found for this email. Create an account first, or use the demo student account.');
        email.focus();
        return;
      }
      pass.value = '';
      finish(user, 'Welcome back, ' + user.name.split(' ')[0] + '.');
    });
    [email, pass].forEach(function (i) { i.addEventListener('input', function () { RA.setFieldError(i, ''); showAlert(''); }); });
    const demoBtn = RA.$('#useDemo');
    if (demoBtn) demoBtn.addEventListener('click', function () {
      S.addUser(DEMO_USER);
      finish(DEMO_USER, 'Signed in to the demo student account.');
    });
  }

  /* ---------- Register ---------- */
  const reg = RA.$('#registerForm');
  if (reg) {
    const name = RA.$('#regName'), email = RA.$('#regEmail'), pass = RA.$('#regPassword'), confirm = RA.$('#regConfirm'), terms = RA.$('#regTerms');
    const bar = RA.$('#strengthBar'), text = RA.$('#strengthText');

    function strength(v) {
      let s = 0;
      if (v.length >= 8) s++;
      if (v.length >= 12) s++;
      if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
      if (/\d/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      return s;
    }
    pass.addEventListener('input', function () {
      const s = strength(pass.value);
      const levels = [['0%', '', 'Use at least 8 characters with letters and numbers.'], ['25%', '#d22a42', 'Weak password'], ['45%', '#d97706', 'Fair password'], ['70%', '#ca8a04', 'Good password'], ['88%', '#18794e', 'Strong password'], ['100%', '#18794e', 'Very strong password']];
      const l = pass.value ? levels[Math.max(1, s)] : levels[0];
      bar.style.width = l[0]; bar.style.background = l[1]; text.textContent = l[2];
      RA.setFieldError(pass, '');
    });

    reg.addEventListener('submit', function (e) {
      e.preventDefault();
      showAlert('');
      const n = name.value.trim();
      const v = pass.value;
      const okName = RA.setFieldError(name, n.length < 2 ? 'Please enter your full name.' : (!/^[\p{L}\s'.-]+$/u.test(n) ? 'Name can contain letters, spaces, apostrophes and hyphens only.' : ''));
      const okEmail = validateEmail(email);
      const okPass = RA.setFieldError(pass, !v ? 'Password is required.' : (v.length < 8 ? 'Password must be at least 8 characters.' : (!/[A-Za-z]/.test(v) || !/\d/.test(v) ? 'Use both letters and numbers.' : '')));
      const okConfirm = RA.setFieldError(confirm, !confirm.value ? 'Please confirm your password.' : (confirm.value !== v ? 'Passwords do not match.' : ''));
      const okTerms = RA.setFieldError(terms, terms.checked ? '' : 'You must accept the terms to continue.');
      if (!(okName && okEmail && okPass && okConfirm && okTerms)) { firstInvalid(reg); return; }
      const user = { name: n, email: email.value.trim().toLowerCase() };
      if (!S.addUser(user)) {
        showAlert('An account with this email already exists in this browser. Log in instead.');
        email.focus();
        return;
      }
      pass.value = ''; confirm.value = '';
      finish(user, 'Account created. Welcome to Rayaan Academy, ' + n.split(' ')[0] + '.');
    });
    [name, email, confirm].forEach(function (i) { i.addEventListener('input', function () { RA.setFieldError(i, ''); }); });
    terms.addEventListener('change', function () { RA.setFieldError(terms, ''); });
  }

  /* ---------- Forgot password ---------- */
  const forgot = RA.$('#forgotForm');
  if (forgot) {
    const email = RA.$('#forgotEmail');
    forgot.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateEmail(email)) { email.focus(); return; }
      const btn = RA.$('button[type="submit"]', forgot);
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Sending';
      setTimeout(function () {
        RA.$('#forgotSentTo').textContent = email.value.trim();
        RA.$('#forgotStep').hidden = true;
        const done = RA.$('#forgotDone');
        done.hidden = false;
        done.focus();
        btn.disabled = false;
        btn.textContent = 'Send reset link';
      }, 700);
    });
    email.addEventListener('input', function () { RA.setFieldError(email, ''); });
    RA.$('#forgotAgain').addEventListener('click', function () {
      RA.$('#forgotDone').hidden = true;
      RA.$('#forgotStep').hidden = false;
      forgot.reset();
      email.focus();
    });
  }
})();
