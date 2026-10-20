/* Rayaan Academy - practice quizzes (quiz.html?quiz=programming) */
(function () {
  'use strict';
  const D = window.RA_DATA, S = window.RAStore, RA = window.RA;
  const app = RA && RA.$('#quizApp');
  if (!D || !S || !app) return;

  const QUIZZES = {
    programming: {
      title: 'Programming Fundamentals', icon: 'bi-code-slash', passMark: 60,
      description: 'Variables, control flow, functions and core web programming ideas.',
      questions: [
        { q: 'Which keyword declares a block-scoped variable that cannot be reassigned in JavaScript?', options: ['var', 'let', 'const', 'static'], answer: 2, explain: 'const creates a block-scoped binding that cannot be reassigned.' },
        { q: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Transfer Machine Language', 'Hyperlink and Text Management Language', 'Home Tool Markup Language'], answer: 0, explain: 'HTML is HyperText Markup Language, used to structure web content.' },
        { q: 'In Python, what is the output of len([1, 2, 3, 4])?', options: ['3', '4', '5', 'An error'], answer: 1, explain: 'len returns the number of items in the list, which is 4.' },
        { q: 'Which loop always runs its body at least once?', options: ['for loop', 'while loop', 'do...while loop', 'for...of loop'], answer: 2, explain: 'A do...while loop checks its condition after running the body.' },
        { q: 'Which SQL statement retrieves data from a table?', options: ['GET', 'SELECT', 'FETCH', 'READ'], answer: 1, explain: 'SELECT is used to query and return rows from a table.' },
        { q: 'What is the purpose of a function?', options: ['To store a single value', 'To group reusable code under a name', 'To style a web page', 'To create a database'], answer: 1, explain: 'Functions package reusable logic that can be called by name.' }
      ]
    },
    english: {
      title: 'English Grammar and Vocabulary', icon: 'bi-translate', passMark: 60,
      description: 'Tenses, sentence structure and everyday vocabulary.',
      questions: [
        { q: 'Choose the correct sentence.', options: ['She go to school every day.', 'She goes to school every day.', 'She going to school every day.', 'She gone to school every day.'], answer: 1, explain: 'Third person singular in the present simple takes -s: she goes.' },
        { q: 'What is the past tense of "write"?', options: ['writed', 'wrote', 'written', 'writing'], answer: 1, explain: 'Write is irregular: write, wrote, written.' },
        { q: 'Which word is a synonym of "rapid"?', options: ['Slow', 'Quick', 'Late', 'Heavy'], answer: 1, explain: 'Rapid and quick both mean fast.' },
        { q: 'Complete: "If it rains tomorrow, we ___ stay at home."', options: ['would', 'will', 'were', 'had'], answer: 1, explain: 'The first conditional uses if + present, then will + verb.' },
        { q: 'Which is the most formal email greeting?', options: ['Hey there,', 'Hi guys,', 'Dear Ms. Ahmed,', 'Yo,'], answer: 2, explain: '"Dear" with a title and surname is the formal standard.' },
        { q: 'Choose the correct article: "She is ___ engineer."', options: ['a', 'an', 'the', 'no article'], answer: 1, explain: 'Use "an" before a vowel sound, as in engineer.' }
      ]
    },
    mathematics: {
      title: 'Mathematics Fundamentals', icon: 'bi-calculator', passMark: 60,
      description: 'Arithmetic, algebra, functions and basic statistics.',
      questions: [
        { q: 'Solve for x: 3x + 5 = 20', options: ['x = 3', 'x = 5', 'x = 6', 'x = 15'], answer: 1, explain: '3x = 15, so x = 5.' },
        { q: 'What is 25% of 240?', options: ['48', '60', '64', '96'], answer: 1, explain: '240 multiplied by 0.25 equals 60.' },
        { q: 'What is the value of 2 to the power of 5?', options: ['10', '25', '32', '64'], answer: 2, explain: '2 x 2 x 2 x 2 x 2 = 32.' },
        { q: 'The mean of 4, 8, 6 and 10 is:', options: ['6', '7', '8', '28'], answer: 1, explain: 'The sum is 28 and there are 4 values, so the mean is 7.' },
        { q: 'If f(x) = 2x - 1, what is f(4)?', options: ['5', '7', '8', '9'], answer: 1, explain: '2 x 4 - 1 = 7.' },
        { q: 'What is the square root of 144?', options: ['11', '12', '14', '72'], answer: 1, explain: '12 x 12 = 144.' }
      ]
    },
    networking: {
      title: 'Networking Essentials', icon: 'bi-diagram-3', passMark: 60,
      description: 'OSI model, IP addressing, devices and core services.',
      questions: [
        { q: 'How many layers does the OSI model have?', options: ['4', '5', '7', '9'], answer: 2, explain: 'The OSI model has seven layers, from Physical to Application.' },
        { q: 'Which device forwards traffic between different networks using IP addresses?', options: ['Hub', 'Switch', 'Router', 'Repeater'], answer: 2, explain: 'Routers operate at Layer 3 and route packets between networks.' },
        { q: 'What does DHCP do?', options: ['Translates domain names to IP addresses', 'Automatically assigns IP configuration to hosts', 'Encrypts network traffic', 'Blocks unwanted traffic'], answer: 1, explain: 'DHCP hands out IP addresses, masks, gateways and DNS servers.' },
        { q: 'How many usable host addresses are in a /24 IPv4 network?', options: ['254', '255', '256', '512'], answer: 0, explain: '256 addresses minus the network and broadcast addresses leaves 254.' },
        { q: 'Which protocol resolves domain names to IP addresses?', options: ['FTP', 'DNS', 'ARP', 'SMTP'], answer: 1, explain: 'DNS maps names such as example.com to IP addresses.' },
        { q: 'Which command tests basic reachability to another host?', options: ['ping', 'ls', 'mkdir', 'chmod'], answer: 0, explain: 'ping sends ICMP echo requests to test connectivity.' }
      ]
    },
    cybersecurity: {
      title: 'Cybersecurity Basics', icon: 'bi-shield-lock', passMark: 60,
      description: 'Core security principles, common threats and safe habits.',
      questions: [
        { q: 'What does the "C" in the CIA triad stand for?', options: ['Control', 'Confidentiality', 'Compliance', 'Certification'], answer: 1, explain: 'CIA stands for Confidentiality, Integrity and Availability.' },
        { q: 'An email that pretends to be from your bank and asks for your password is an example of:', options: ['Phishing', 'Firewalling', 'Hashing', 'Patching'], answer: 0, explain: 'Phishing uses deceptive messages to steal credentials or data.' },
        { q: 'Which is the strongest password practice?', options: ['Reuse one strong password everywhere', 'Use long, unique passphrases with a password manager', 'Use your birthday', 'Write passwords on a sticky note'], answer: 1, explain: 'Long unique passphrases stored in a password manager limit the damage of any single breach.' },
        { q: 'What does multi-factor authentication add?', options: ['A second, independent proof of identity', 'Faster login', 'A longer username', 'Automatic backups'], answer: 0, explain: 'MFA requires something more than a password, such as a code or a security key.' },
        { q: 'Which is a one-way function commonly used to store passwords safely?', options: ['Encoding', 'Compression', 'Hashing', 'Formatting'], answer: 2, explain: 'Passwords should be stored as salted hashes, which cannot be reversed.' },
        { q: 'Ethical hacking must always be done:', options: ['On any public website', 'With explicit written permission', 'Anonymously', 'Only at night'], answer: 1, explain: 'Authorised, written permission is what separates ethical testing from illegal activity.' }
      ]
    }
  };

  const fromCourse = D.getCourseById(RA.getParam('course'));
  let quizId = RA.getParam('quiz');
  let state = null;

  function focusHeading() {
    const h = RA.$('h2', app);
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: false }); }
  }

  /* ---------- Picker ---------- */
  function renderPicker() {
    const results = S.getQuizResults();
    app.innerHTML = '<h2 class="h4 mb-4">Choose a quiz</h2><div class="row g-4">' + Object.keys(QUIZZES).map(function (id) {
      const z = QUIZZES[id];
      const r = results[id];
      return '<div class="col-md-6 col-lg-4"><button type="button" class="ra-quiz-pick" data-start="' + id + '">' +
        '<span class="ra-feature-icon"><i class="bi ' + z.icon + '" aria-hidden="true"></i></span>' +
        '<strong class="h5 mb-1 text-reset">' + RA.esc(z.title) + '</strong><span class="text-muted-ra mb-3">' + RA.esc(z.description) + '</span>' +
        '<span class="mt-auto d-flex justify-content-between w-100 small"><span>' + z.questions.length + ' questions</span>' +
        '<span class="fw-semibold">' + (r ? 'Best: ' + r.best.percent + '%' : 'Not attempted') + '</span></span></button></div>';
    }).join('') + '</div>';
  }

  /* ---------- Quiz ---------- */
  function start(id) {
    quizId = id;
    state = { index: 0, answers: new Array(QUIZZES[id].questions.length).fill(null), submitted: false };
    try { history.replaceState(null, '', 'quiz.html?quiz=' + id + (fromCourse ? '&course=' + fromCourse.id : '')); } catch (e) { /* ignore */ }
    renderQuestion();
    focusHeading();
  }

  function renderQuestion() {
    const quiz = QUIZZES[quizId];
    const q = quiz.questions[state.index];
    const total = quiz.questions.length;
    const answered = state.answers.filter(function (a) { return a !== null; }).length;
    const pct = Math.round((answered / total) * 100);
    const letters = ['A', 'B', 'C', 'D', 'E'];
    app.innerHTML = '<div class="row g-4"><div class="col-lg-8"><div class="ra-quiz-card">' +
      '<div class="d-flex justify-content-between flex-wrap gap-2 mb-2"><span class="ra-badge">' + RA.esc(quiz.title) + '</span><span class="small text-muted-ra">' + answered + ' of ' + total + ' answered</span></div>' +
      '<div class="ra-progress mb-4" role="progressbar" aria-label="Quiz progress" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + pct + '%"></span></div>' +
      '<p class="small fw-semibold text-accent mb-1">Question ' + (state.index + 1) + ' of ' + total + '</p>' +
      '<fieldset><legend class="h4 mb-4" id="qText">' + RA.esc(q.q) + '</legend>' +
      q.options.map(function (opt, i) {
        const sel = state.answers[state.index] === i;
        return '<label class="ra-quiz-option' + (sel ? ' is-selected' : '') + '"><input type="radio" name="answer" value="' + i + '"' + (sel ? ' checked' : '') + '>' +
          '<span class="key" aria-hidden="true">' + letters[i] + '</span><span>' + RA.esc(opt) + '</span></label>';
      }).join('') + '</fieldset>' +
      '<div class="d-flex flex-wrap gap-2 mt-4">' +
        '<button type="button" class="btn btn-ra-ghost" data-q="prev"' + (state.index === 0 ? ' disabled' : '') + '><i class="bi bi-chevron-left" aria-hidden="true"></i> Previous</button>' +
        (state.index < total - 1 ? '<button type="button" class="btn btn-ra-dark ms-auto" data-q="next">Next <i class="bi bi-chevron-right" aria-hidden="true"></i></button>' : '') +
        '<button type="button" class="btn btn-ra-primary' + (state.index < total - 1 ? '' : ' ms-auto') + '" data-q="submit">Submit Quiz</button>' +
      '</div></div></div>' +
      '<div class="col-lg-4"><div class="ra-panel"><h2 class="h6 mb-3">Question navigation</h2><div class="ra-qnav">' +
        quiz.questions.map(function (_, i) {
          const cls = i === state.index ? 'is-current' : (state.answers[i] !== null ? 'is-answered' : '');
          return '<button type="button" class="' + cls + '" data-goto="' + i + '" aria-label="Question ' + (i + 1) + (state.answers[i] !== null ? ', answered' : ', not answered') + '"' + (i === state.index ? ' aria-current="step"' : '') + '>' + (i + 1) + '</button>';
        }).join('') + '</div>' +
        '<hr><p class="small text-muted-ra mb-2">Pass mark: ' + quiz.passMark + '%</p>' +
        '<button type="button" class="btn btn-sm btn-ra-ghost w-100" data-q="exit">Choose another quiz</button></div></div></div>';
  }

  function submit() {
    const quiz = QUIZZES[quizId];
    const unanswered = state.answers.filter(function (a) { return a === null; }).length;
    const proceed = unanswered
      ? RA.confirm({
          title: unanswered === quiz.questions.length ? 'Submit an empty quiz?' : 'Submit with unanswered questions?',
          body: 'You have ' + unanswered + ' unanswered question' + (unanswered === 1 ? '' : 's') + '. Unanswered questions are marked as incorrect.',
          confirmText: 'Submit anyway', cancelText: 'Keep answering'
        })
      : Promise.resolve(true);
    proceed.then(function (ok) {
      if (!ok) return;
      const correct = quiz.questions.filter(function (q, i) { return state.answers[i] === q.answer; }).length;
      const percent = Math.round((correct / quiz.questions.length) * 100);
      state.submitted = true;
      S.saveQuizResult(quizId, { correct: correct, total: quiz.questions.length, percent: percent, date: Date.now() });
      renderResults(correct, percent);
      focusHeading();
    });
  }

  function renderResults(correct, percent) {
    const quiz = QUIZZES[quizId];
    const passed = percent >= quiz.passMark;
    const best = S.getQuizResults()[quizId].best.percent;
    const letters = ['A', 'B', 'C', 'D', 'E'];
    app.innerHTML = '<div class="ra-quiz-card text-center mb-4"><span class="ra-feature-icon mx-auto"><i class="bi ' + (passed ? 'bi-trophy' : 'bi-arrow-repeat') + '" aria-hidden="true"></i></span>' +
      '<h2 class="h3">' + (passed ? 'Well done, you passed' : 'Keep practising') + '</h2>' +
      '<div class="ra-result-score my-3">' + percent + '%</div>' +
      '<p class="text-muted-ra">You answered ' + correct + ' of ' + quiz.questions.length + ' questions correctly. Pass mark ' + quiz.passMark + '%. Your best score is ' + best + '%.</p>' +
      '<div class="d-flex flex-wrap justify-content-center gap-2 mt-3">' +
        '<button type="button" class="btn btn-ra-primary" data-q="retake"><i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i> Retake Quiz</button>' +
        '<button type="button" class="btn btn-ra-ghost" data-q="exit">Other quizzes</button>' +
        (fromCourse ? '<a class="btn btn-ra-outline" href="learn.html?course=' + fromCourse.id + '">Back to course</a>' : '<a class="btn btn-ra-outline" href="dashboard.html">Dashboard</a>') +
      '</div></div>' +
      '<h2 class="h5 mb-3">Answer review</h2>' + quiz.questions.map(function (q, i) {
        const given = state.answers[i];
        const ok = given === q.answer;
        return '<div class="ra-review-item ' + (ok ? 'is-correct' : 'is-wrong') + '"><div class="d-flex gap-2 mb-2"><i class="bi ' + (ok ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-accent') + '" aria-hidden="true"></i>' +
          '<strong>' + (i + 1) + '. ' + RA.esc(q.q) + '</strong><span class="visually-hidden">' + (ok ? 'Correct' : 'Incorrect') + '</span></div>' +
          '<p class="mb-1 small">Your answer: <strong>' + (given === null ? 'Not answered' : letters[given] + '. ' + RA.esc(q.options[given])) + '</strong></p>' +
          (ok ? '' : '<p class="mb-1 small">Correct answer: <strong class="text-success">' + letters[q.answer] + '. ' + RA.esc(q.options[q.answer]) + '</strong></p>') +
          '<p class="mb-0 small text-muted-ra">' + RA.esc(q.explain) + '</p></div>';
      }).join('');
  }

  /* ---------- Events ---------- */
  app.addEventListener('change', function (e) {
    if (e.target.name !== 'answer' || !state || state.submitted) return;
    state.answers[state.index] = Number(e.target.value);
    const idx = state.index;
    renderQuestion();
    const input = RA.$('input[name="answer"][value="' + state.answers[idx] + '"]', app);
    if (input) input.focus();
  });
  app.addEventListener('click', function (e) {
    const startBtn = e.target.closest('[data-start]');
    if (startBtn) { start(startBtn.getAttribute('data-start')); return; }
    const go = e.target.closest('[data-goto]');
    if (go) { state.index = Number(go.getAttribute('data-goto')); renderQuestion(); RA.$('[data-goto="' + state.index + '"]', app).focus(); return; }
    const b = e.target.closest('[data-q]');
    if (!b) return;
    const act = b.getAttribute('data-q');
    if (act === 'prev' && state.index > 0) {
      state.index -= 1;
      renderQuestion();
      const p = RA.$('[data-q="prev"]', app);
      (p.disabled ? RA.$('[data-q="next"]', app) : p).focus();
    }
    else if (act === 'next') { state.index += 1; renderQuestion(); const n = RA.$('[data-q="next"]', app) || RA.$('[data-q="submit"]', app); n.focus(); }
    else if (act === 'submit') submit();
    else if (act === 'retake') start(quizId);
    else if (act === 'exit') {
      const leave = state && !state.submitted && state.answers.some(function (a) { return a !== null; })
        ? RA.confirm({ title: 'Leave this quiz?', body: 'Your current answers will not be saved.', confirmText: 'Leave quiz' })
        : Promise.resolve(true);
      leave.then(function (ok) {
        if (!ok) return;
        state = null; quizId = null;
        try { history.replaceState(null, '', 'quiz.html'); } catch (err) { /* ignore */ }
        renderPicker();
        focusHeading();
      });
    }
  });

  if (quizId && QUIZZES[quizId]) start(quizId); else renderPicker();
})();
