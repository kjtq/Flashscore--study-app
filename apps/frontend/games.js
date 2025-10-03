mkdir -p game quiz && \
cat > service-worker.js <<'SW'
/* service-worker.js - cached assets + FORCE_OFFLINE toggle + push + sync */
const CACHE_NAME = 'sports-central-v2.0';
const DYNAMIC_CACHE = 'sports-central-dynamic-v1';
let FORCE_OFFLINE = false;

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/offline-sports.html',
  '/offline-quiz.html',
  '/game/sports.js',
  '/game/sports.css',
  '/quiz/quiz.js',
  '/quiz/quiz.css',
  '/quiz/questions.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(names => Promise.all(
      names.map(n => {
        if (n !== CACHE_NAME && n !== DYNAMIC_CACHE) {
          console.log('[SW] Deleting old cache', n);
          return caches.delete(n);
        }
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'ENABLE_OFFLINE') {
    FORCE_OFFLINE = true;
    console.log('[SW] FORCE_OFFLINE = true');
  } else if (data.type === 'DISABLE_OFFLINE') {
    FORCE_OFFLINE = false;
    console.log('[SW] FORCE_OFFLINE = false');
  } else if (data.type === 'CLEAR_CACHE') {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => console.log('[SW] caches cleared')));
  } else if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  event.respondWith((async () => {
    if (FORCE_OFFLINE) {
      if (req.destination === 'document') {
        const cached = await caches.match('/offline.html');
        if (cached) return cached;
      }
      const c = await caches.match(req);
      return c || (await caches.match('/offline.html'));
    }

    const cached = await caches.match(req);
    if (cached) return cached;

    try {
      const networkResponse = await fetch(req);
      if (url.origin === location.origin && !url.pathname.startsWith('/api/')) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(req, networkResponse.clone());
      }
      return networkResponse;
    } catch (err) {
      if (req.destination === 'document') {
        return caches.match('/offline.html');
      }
      const fallback = await caches.match(req);
      return fallback || new Response('', { status: 503, statusText: 'Service Unavailable' });
    }
  })());
});

self.addEventListener('sync', (event) => {
  console.log('[SW] sync', event.tag);
  if (event.tag === 'sync-predictions') {
    event.waitUntil(syncPredictions());
  }
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Sports Central';
  const options = {
    body: data.body || 'New update',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: { url: data.url || '/' },
    actions: data.actions || [{ action: 'open', title: 'Open App' }]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});

async function syncPredictions() {
  try {
    console.log('[SW] syncPredictions stub');
    // Implement queued sync logic if needed
  } catch (err) {
    console.error('[SW] syncPredictions error', err);
  }
}
SW

&& cat > register-sw.js <<'REG'
/* register-sw.js - include this in your app bootstrap */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => {
      console.log('[Client] Service Worker registered', reg);
      navigator.serviceWorker.addEventListener('message', (evt) => {
        console.log('[Client] SW message', evt.data);
      });
    })
    .catch(err => console.error('[Client] SW registration failed', err));
}

function postToSW(msg) {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(msg);
  } else {
    console.warn('No active service worker to message');
  }
}

// Helpers to call from UI
function enableOfflineMode() { postToSW({ type: 'ENABLE_OFFLINE' }); }
function disableOfflineMode() { postToSW({ type: 'DISABLE_OFFLINE' }); }
function clearAllCaches() { postToSW({ type: 'CLEAR_CACHE' }); }

// Export for module systems or attach to window
if (typeof window !== 'undefined') {
  window.enableOfflineMode = enableOfflineMode;
  window.disableOfflineMode = disableOfflineMode;
  window.clearAllCaches = clearAllCaches;
}
REG

&& cat > offline.html <<'OFF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Offline — Sports Central</title>
  <style>
    body{font-family:system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;background:#0f172a;color:#e6eef6;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
    .card{background:linear-gradient(180deg,#111827,#0b1220);padding:20px;border-radius:12px;width:100%;max-width:520px;box-shadow:0 6px 24px rgba(0,0,0,0.6)}
    h1{margin:0 0 8px;font-size:20px}
    p{margin:0 0 12px;color:#aebbd1}
    .row{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
    button{padding:10px 14px;border-radius:8px;border:0;cursor:pointer;font-weight:600}
    .primary{background:#00ff88;color:#062017}
    .muted{background:#1f2937;color:#cbd5e1}
    .toggle{display:flex;align-items:center;gap:8px;margin-top:10px}
    .note{font-size:13px;color:#94a3b8;margin-top:10px}
    a{color:inherit;text-decoration:none}
  </style>
</head>
<body>
  <div class="card" role="main">
    <h1>You’re offline</h1>
    <p>Your connection is unavailable. Choose an offline experience below or enable forced offline mode.</p>

    <div class="row">
      <a href="/offline-sports.html"><button class="primary">🎮 Play Sports Quiz</button></a>
      <a href="/offline-quiz.html"><button class="primary">📘 Take JAMB Quiz</button></a>
      <button id="retryBtn" class="muted">Retry Connection</button>
      <button id="clearCacheBtn" class="muted">Clear Cache</button>
    </div>

    <div class="toggle">
      <label for="forceOffline">Force Offline Mode</label>
      <input id="forceOffline" type="checkbox" />
    </div>

    <div class="note">Force Offline mode makes the app serve only cached assets (useful for testing or saving data).</div>
  </div>

  <script>
    function sendSWMessage(msg) {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(msg);
      } else {
        console.warn('No active service worker to message');
      }
    }

    document.getElementById('retryBtn').addEventListener('click', () => location.reload());
    document.getElementById('clearCacheBtn').addEventListener('click', () => { sendSWMessage({ type:'CLEAR_CACHE' }); alert('Clearing caches...'); });

    const chk = document.getElementById('forceOffline');
    chk.addEventListener('change', (e) => {
      if (e.target.checked) sendSWMessage({ type: 'ENABLE_OFFLINE' });
      else sendSWMessage({ type: 'DISABLE_OFFLINE' });
    });
  </script>
</body>
</html>
OFF

&& cat > offline-sports.html <<'SOS'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Sports Quiz — Sports Central</title>
  <link rel="stylesheet" href="/game/sports.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>Sports Quiz</h1>
      <div class="controls">
        <button id="startBtn">Start</button>
        <button id="nextBtn" disabled>Next</button>
        <button id="backBtn">Back</button>
        <span id="score">Score: 0</span>
      </div>
    </header>

    <main id="main">
      <div id="loader">Loading questions…</div>
      <div id="quiz" class="hidden">
        <div id="qText"></div>
        <div id="options"></div>
      </div>
    </main>
  </div>

  <script src="/game/sports.js"></script>
  <script>
    document.getElementById('backBtn').addEventListener('click', () => location.href = '/');
  </script>
</body>
</html>
SOS

&& cat > offline-quiz.html <<'QOFF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>JAMB / SS3 Quiz — Sports Central</title>
  <link rel="stylesheet" href="/quiz/quiz.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>SS3 / JAMB Quiz</h1>
      <div class="controls">
        <select id="subjectSelect">
          <option value="maths">Maths</option>
          <option value="english">English</option>
        </select>
        <button id="startBtn">Start</button>
        <button id="nextBtn" disabled>Next</button>
        <button id="backBtn">Back</button>
        <span id="score">Score: 0</span>
      </div>
    </header>

    <main id="main">
      <div id="loader">Loading questions…</div>
      <div id="quiz" class="hidden">
        <div id="qText"></div>
        <div id="options"></div>
      </div>
    </main>
  </div>

  <script src="/quiz/quiz.js"></script>
  <script>
    document.getElementById('backBtn').addEventListener('click', () => location.href = '/');
  </script>
</body>
</html>
QOFF

&& cat > game/sports.css <<'GSC'
/* styles for sports quiz */
body{margin:0;font-family:system-ui, -apple-system, 'Segoe UI', Roboto;background:#071029;color:#e6eef6;display:flex;align-items:flex-start;justify-content:center;padding:28px}
.container{width:100%;max-width:880px}
header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
h1{color:#9be7c4;margin:0}
.controls{display:flex;gap:8px;align-items:center}
.controls button{padding:8px 12px;border-radius:6px;border:0;background:#00ff88;color:#042016;font-weight:700;cursor:pointer}
#loader{color:#9fb3c8}
.hidden{display:none}
#qText{font-size:18px;margin-bottom:12px;color:#dbeef0}
#options{display:flex;flex-direction:column;gap:8px}
.option{padding:10px;border-radius:8px;background:#0f172a;border:1px solid #1f2937;cursor:pointer}
.option.correct{background:#093; color:#021}
.option.wrong{background:#b33;color:#200}
#score{font-weight:700}
GSC

&& cat > game/sports.js <<'GSJ'
/* game/sports.js - sports quiz logic (uses /quiz/questions.json -> sports) */
(async () => {
  const loader = document.getElementById('loader');
  const quizEl = document.getElementById('quiz');
  const qText = document.getElementById('qText');
  const opts = document.getElementById('options');
  const startBtn = document.getElementById('startBtn');
  const nextBtn = document.getElementById('nextBtn');
  const scoreEl = document.getElementById('score');

  let questions = [];
  let idx = 0;
  let score = Number(localStorage.getItem('sports-quiz-score') || 0);
  let running = false;

  scoreEl.textContent = 'Score: ' + score;

  async function load() {
    try {
      const res = await fetch('/quiz/questions.json');
      const json = await res.json();
      questions = (json.sports || []).slice();
      shuffleArray(questions);
      loader.classList.add('hidden');
      quizEl.classList.remove('hidden');
    } catch (err) {
      loader.textContent = 'Failed to load questions.';
      console.error(err);
    }
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function renderQuestion() {
    if (idx >= questions.length) {
      qText.textContent = 'Finished! Final score: ' + score;
      opts.innerHTML = '<div class="note">You can restart to play again.</div>';
      startBtn.textContent = 'Restart';
      nextBtn.disabled = true;
      running = false;
      return;
    }
    const q = questions[idx];
    qText.textContent = (idx+1) + '. ' + q.question;
    opts.innerHTML = '';
    q.options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'option';
      b.textContent = opt;
      b.addEventListener('click', () => select(opt, b, q.answer));
      opts.appendChild(b);
    });
    nextBtn.disabled = true;
  }

  function select(choice, btnEl, correct) {
    if (!running) return;
    const buttons = opts.querySelectorAll('.option');
    buttons.forEach(b => b.disabled = true);
    if (choice === correct) {
      btnEl.classList.add('correct');
      score += 1;
    } else {
      btnEl.classList.add('wrong');
      // highlight correct
      buttons.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
    }
    scoreEl.textContent = 'Score: ' + score;
    localStorage.setItem('sports-quiz-score', score);
    nextBtn.disabled = false;
    running = false;
  }

  startBtn.addEventListener('click', () => {
    if (!running && startBtn.textContent === 'Start') {
      running = true;
      idx = 0;
      score = Number(localStorage.getItem('sports-quiz-score') || 0);
      scoreEl.textContent = 'Score: ' + score;
      renderQuestion();
    } else if (startBtn.textContent === 'Restart') {
      shuffleArray(questions);
      idx = 0;
      score = 0;
      localStorage.setItem('sports-quiz-score', 0);
      scoreEl.textContent = 'Score: ' + score;
      startBtn.textContent = 'Start';
      renderQuestion();
    } else {
      running = true;
      renderQuestion();
    }
  });

  nextBtn.addEventListener('click', () => {
    idx++;
    running = true;
    renderQuestion();
  });

  // initial load
  await load();
  // show first question disabled until Start is pressed
  idx = 0;
  renderQuestion();
})();
GSJ

&& cat > quiz/quiz.css <<'QQC'
/* styles for JAMB quiz */
body{margin:0;font-family:system-ui, -apple-system, 'Segoe UI', Roboto;background:#071029;color:#e6eef6;display:flex;align-items:flex-start;justify-content:center;padding:28px}
.container{width:100%;max-width:880px}
header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
h1{color:#9be7c4;margin:0}
.controls{display:flex;gap:8px;align-items:center}
.controls button, .controls select{padding:8px 12px;border-radius:6px;border:0;background:#00ff88;color:#042016;font-weight:700;cursor:pointer}
#loader{color:#9fb3c8}
.hidden{display:none}
#qText{font-size:18px;margin-bottom:12px;color:#dbeef0}
#options{display:flex;flex-direction:column;gap:8px}
.option{padding:10px;border-radius:8px;background:#0f172a;border:1px solid #1f2937;cursor:pointer}
.option.correct{background:#093; color:#021}
.option.wrong{background:#b33;color:#200}
#score{font-weight:700}
QQC

&& cat > quiz/quiz.js <<'QQJ'
/* quiz/quiz.js - generic subject quiz (maths, english) */
(async () => {
  const loader = document.getElementById('loader');
  const quizEl = document.getElementById('quiz');
  const qText = document.getElementById('qText');
  const opts = document.getElementById('options');
  const startBtn = document.getElementById('startBtn');
  const nextBtn = document.getElementById('nextBtn');
  const scoreEl = document.getElementById('score');
  const subjectSelect = document.getElementById('subjectSelect');

  let questions = [];
  let idx = 0;
  let score = 0;
  let running = false;

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  async function loadFor(subject) {
    loader.classList.remove('hidden');
    quizEl.classList.add('hidden');
    try {
      const res = await fetch('/quiz/questions.json');
      const json = await res.json();
      questions = (json[subject] || []).slice();
      shuffleArray(questions);
      idx = 0;
      score = Number(localStorage.getItem('quiz-' + subject + '-score') || 0);
      scoreEl.textContent = 'Score: ' + score;
      loader.classList.add('hidden');
      quizEl.classList.remove('hidden');
      renderQuestion();
    } catch (err) {
      loader.textContent = 'Failed to load questions.';
      console.error(err);
    }
  }

  function renderQuestion() {
    if (!questions.length) {
      qText.textContent = 'No questions for this subject.';
      opts.innerHTML = '';
      return;
    }
    if (idx >= questions.length) {
      qText.textContent = 'Finished! Final score: ' + score;
      opts.innerHTML = '<div class="note">You can restart the quiz.</div>';
      startBtn.textContent = 'Restart';
      nextBtn.disabled = true;
      running = false;
      return;
    }
    const q = questions[idx];
    qText.textContent = (idx+1) + '. ' + q.question;
    opts.innerHTML = '';
    q.options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'option';
      b.textContent = opt;
      b.addEventListener('click', () => select(opt, b, q.answer));
      opts.appendChild(b);
    });
    nextBtn.disabled = true;
  }

  function select(choice, btnEl, correct) {
    if (!running) return;
    const buttons = opts.querySelectorAll('.option');
    buttons.forEach(b => b.disabled = true);
    if (choice === correct) {
      btnEl.classList.add('correct');
      score += 1;
    } else {
      btnEl.classList.add('wrong');
      buttons.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
    }
    const subj = subjectSelect.value;
    localStorage.setItem('quiz-' + subj + '-score', score);
    scoreEl.textContent = 'Score: ' + score;
    nextBtn.disabled = false;
    running = false;
  }

  startBtn.addEventListener('click', () => {
    const subj = subjectSelect.value;
    if (!running && startBtn.textContent === 'Start') {
      running = true;
      loadFor(subj);
    } else if (startBtn.textContent === 'Restart') {
      shuffleArray(questions);
      idx = 0;
      score = 0;
      localStorage.setItem('quiz-' + subj + '-score', 0);
      scoreEl.textContent = 'Score: ' + score;
      startBtn.textContent = 'Start';
      renderQuestion();
    }
  });

  nextBtn.addEventListener('click', () => {
    idx++;
    running = true;
    renderQuestion();
  });

  // initial state
  loader.textContent = 'Choose a subject and press Start';
  quizEl.classList.add('hidden');
})();
QQJ

&& cat > quiz/questions.json <<'QJ'
{
  "maths": [
    { "question": "If 2x + 5 = 11, what is x?", "options": ["2", "3", "4", "6"], "answer": "3" },
    { "question": "Find the value of 7² - 3²", "options": ["40", "45", "49", "50"], "answer": "40" },
    { "question": "What is the next number: 2, 4, 8, 16, ?", "options": ["18", "20", "32", "24"], "answer": "32" },
    { "question": "What is 15% of 200?", "options": ["20", "25", "30", "35"], "answer": "30" }
  ],
  "english": [
    { "question": "Choose the correct synonym: 'Happy'", "options": ["Sad", "Joyful", "Angry", "Weak"], "answer": "Joyful" },
    { "question": "Which is grammatically correct?", "options": ["She don’t like mangoes", "She doesn’t like mangoes", "She didn’t likes mangoes", "She don’t likes mangoes"], "answer": "She doesn’t like mangoes" },
    { "question": "Select the correctly spelled word:", "options": ["Accomodate", "Acommodate", "Accommodate", "Acommodete"], "answer": "Accommodate" }
  ],
  "sports": [
    { "question": "Who won the FIFA World Cup in 2018?", "options": ["Brazil", "Germany", "France", "Argentina"], "answer": "France" },
    { "question": "In basketball, how many points is a free throw worth?", "options": ["1", "2", "3", "4"], "answer": "1" },
    { "question": "How many players are on a football (soccer) team on the field?", "options": ["9", "10", "11", "12"], "answer": "11" }
  ]
}
QJ