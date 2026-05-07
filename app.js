// ===== QUOTES =====
const quotes = [
  { text: "Indeed, Allah is with the patient.", source: "— Quran 8:46" },
  { text: "And whoever fears Allah — He will make for him a way out.", source: "— Quran 65:2" },
  { text: "The strong man is not the one who overcomes others by his strength, but the one who controls himself when angry — and in temptation.", source: "— Hadith (Bukhari)" },
  { text: "Verily, Allah loves those who are constantly repentant and loves those who purify themselves.", source: "— Quran 2:222" },
  { text: "Take care of your body. It's the only place you have to live.", source: "— Jim Rohn" },
  { text: "Self-discipline is the magic power that makes you virtually unstoppable.", source: "— Dan Kennedy" },
  { text: "You will not be punished for your anger; you will be punished by your anger. Conquer yourself.", source: "— Buddhist Proverb" },
  { text: "Do not give in to the temptation of the moment. Every act of discipline now is an investment in the man you're becoming.", source: "— Stoic Principle" },
  { text: "Whoever controls his desires controls his destiny.", source: "— Ancient Wisdom" },
  { text: "The nafs (soul) commands to evil unless it is under the mercy of my Lord.", source: "— Quran 12:53" },
  { text: "Fasting is a shield against hellfire and a guard for the soul. Discipline the body and the mind follows.", source: "— Adapted from Hadith" },
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", source: "— Marcus Aurelius" },
  { text: "A man who conquers himself is greater than one who conquers a thousand men in battle.", source: "— Dhammapada" },
  { text: "The secret of getting ahead is getting started. Rise again, every single time.", source: "— Mark Twain" },
  { text: "Purity of thought, purity of deed, purity of body — this is the foundation of a man's power.", source: "— Swami Vivekananda" },
  { text: "No temptation has overtaken you except what is common to mankind. God is faithful; He will not let you be tempted beyond what you can bear.", source: "— 1 Corinthians 10:13" },
  { text: "He who rules his spirit has won a greater victory than the taking of a city.", source: "— Proverbs 16:32" },
  { text: "Your energy is sacred. Guard it like the most precious thing you own — because it is.", source: "— Ancient Yogic Teaching" },
];

// ===== BADGE SYSTEM =====
const badges = [
  { days: 0,   icon: '🌱', label: 'Seedling' },
  { days: 3,   icon: '🔥', label: '3-Day Warrior' },
  { days: 7,   icon: '⚔️', label: '1-Week Soldier' },
  { days: 14,  icon: '🛡️', label: '2-Week Guardian' },
  { days: 30,  icon: '🌙', label: '30-Day Monk' },
  { days: 60,  icon: '🏔️', label: '60-Day Mountain' },
  { days: 90,  icon: '👑', label: '90-Day King' },
  { days: 180, icon: '✨', label: '180-Day Sage' },
  { days: 365, icon: '🌟', label: '365-Day Legend' },
];

// ===== MILESTONES =====
const milestones = [
  { day: 7,  icon: '⚔️', label: '1W' },
  { day: 14, icon: '🛡️', label: '2W' },
  { day: 30, icon: '🌙', label: '30D' },
  { day: 60, icon: '🏔️', label: '60D' },
  { day: 90, icon: '👑', label: '90D' },
];

// ===== STATE =====
let state = {
  startDate: null,
  bestStreak: 0,
  totalCleanDays: 0,
  urgesBeaten: 0,
  relapseCount: 0,
  log: [],
  bedtime: '22:00',
};

function loadState() {
  const saved = localStorage.getItem('brahmacharya_state');
  if (saved) {
    try { state = { ...state, ...JSON.parse(saved) }; } catch(e) {}
  }
}

function saveState() {
  localStorage.setItem('brahmacharya_state', JSON.stringify(state));
}

// ===== STREAK CALCULATION =====
function getStreakDays() {
  if (!state.startDate) return 0;
  const start = new Date(state.startDate);
  const now = new Date();
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function getBadge(days) {
  let badge = badges[0];
  for (const b of badges) {
    if (days >= b.days) badge = b;
  }
  return badge;
}

// ===== RENDER =====
function render() {
  const days = getStreakDays();

  // Streak number
  document.getElementById('streakDays').textContent = days;

  // Since
  if (state.startDate) {
    const d = new Date(state.startDate);
    document.getElementById('streakSince').textContent =
      `Since ${d.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}`;
  } else {
    document.getElementById('streakSince').textContent = 'Tap below to begin your journey';
  }

  // Badge
  const badge = getBadge(days);
  document.getElementById('streakBadge').textContent = `${badge.icon} ${badge.label}`;

  // Progress bar (toward 90 days)
  const pct = Math.min(100, (days / 90) * 100);
  document.getElementById('progressFill').style.width = pct + '%';

  // Milestones
  const milestoneRow = document.getElementById('milestoneRow');
  milestoneRow.innerHTML = milestones.map(m => `
    <div class="milestone ${days >= m.day ? 'reached' : ''}">
      <span class="m-icon">${m.icon}</span>
      ${m.label}
    </div>
  `).join('');

  // Stats
  const currentStreak = days;
  const best = Math.max(state.bestStreak, currentStreak);
  document.getElementById('totalDays').textContent = state.totalCleanDays + currentStreak;
  document.getElementById('bestStreak').textContent = best;
  document.getElementById('urgesBeaten').textContent = state.urgesBeaten;
  document.getElementById('relapseCount').textContent = state.relapseCount;

  // Log
  renderLog();
}

function renderLog() {
  const list = document.getElementById('logList');
  if (!state.log || state.log.length === 0) {
    list.innerHTML = '<li style="color:var(--text-muted);font-size:0.85rem;font-style:italic;padding:8px">No entries yet. Every win counts.</li>';
    return;
  }
  list.innerHTML = [...state.log].reverse().map(item => `
    <li class="log-item">
      <span>${item.text}</span>
      <span class="log-date">${item.date}</span>
    </li>
  `).join('');
}

// ===== DAILY QUOTE =====
function setDailyQuote() {
  const today = new Date();
  const idx = (today.getDate() + today.getMonth() * 31) % quotes.length;
  const q = quotes[idx];
  document.getElementById('dailyQuote').textContent = `"${q.text}"`;
  document.getElementById('quoteSource').textContent = q.source;
}

// ===== URGE TIMER =====
let urgeInterval = null;

document.getElementById('urgeBtn').addEventListener('click', function() {
  this.style.display = 'none';
  document.getElementById('urgeTimer').style.display = 'block';
  document.getElementById('urgeAlternatives').style.display = 'none';

  let secs = 60;
  const countdown = document.getElementById('countdown');
  const msg = document.getElementById('urgeMsg');

  const messages = [
    "Breathe. This urge will pass.",
    "Think of who you want to become.",
    "Your future self is watching.",
    "This discomfort is temporary. Your character is permanent.",
    "Every second you hold is strength added.",
    "Remember your why. Remember your worth.",
    "ॐ — You are more than your desires.",
  ];

  let msgIdx = 0;
  countdown.textContent = secs;

  urgeInterval = setInterval(() => {
    secs--;
    countdown.textContent = secs;

    if (secs % 9 === 0) {
      msgIdx = (msgIdx + 1) % messages.length;
      msg.textContent = messages[msgIdx];
    }

    if (secs <= 0) {
      clearInterval(urgeInterval);
      document.getElementById('urgeTimer').style.display = 'none';
      document.getElementById('urgeAlternatives').style.display = 'block';
      document.getElementById('urgeBtn').style.display = 'none';

      // Count urge beaten
      state.urgesBeaten++;
      saveState();
      render();
    }
  }, 1000);
});

window.doActivity = function(type) {
  const activities = {
    pushups: "💪 Started 20 push-ups",
    cold: "🚿 Took a cold shower",
    pray: "🙏 Prayed / meditated",
    walk: "🚶 Went for a walk",
  };
  addLog(activities[type] || "Did a healthy activity");
  document.getElementById('urgeAlternatives').style.display = 'none';
  document.getElementById('urgeBtn').style.display = 'block';
  document.getElementById('urgeTimer').style.display = 'none';
};

// ===== LOG =====
document.getElementById('logBtn').addEventListener('click', () => {
  const input = document.getElementById('logInput');
  const text = input.value.trim();
  if (!text) return;
  addLog(text);
  input.value = '';
});

document.getElementById('logInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('logBtn').click();
});

function addLog(text) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  if (!state.log) state.log = [];
  state.log.push({ text, date: dateStr });
  if (state.log.length > 50) state.log = state.log.slice(-50);
  saveState();
  renderLog();
}

// ===== START STREAK =====
document.getElementById('startBtn').addEventListener('click', () => {
  if (state.startDate) {
    const days = getStreakDays();
    if (!confirm(`You have a ${days}-day streak. Start a new streak from today?`)) return;
    state.totalCleanDays += days;
    state.bestStreak = Math.max(state.bestStreak, days);
  }
  state.startDate = new Date().toISOString();
  saveState();
  render();

  const numEl = document.getElementById('streakDays');
  numEl.style.transform = 'scale(1.2)';
  numEl.style.color = 'var(--gold-light)';
  setTimeout(() => { numEl.style.transform = 'scale(1)'; }, 400);

  addLog('🔥 New streak started!');
});

// ===== RELAPSE =====
document.getElementById('relapseBtn').addEventListener('click', () => {
  document.getElementById('relapseModal').style.display = 'flex';
});

document.getElementById('cancelRelapse').addEventListener('click', () => {
  document.getElementById('relapseModal').style.display = 'none';
});

document.getElementById('confirmRelapse').addEventListener('click', () => {
  const days = getStreakDays();
  state.bestStreak = Math.max(state.bestStreak, days);
  state.totalCleanDays += days;
  state.relapseCount++;
  state.startDate = new Date().toISOString();
  saveState();
  document.getElementById('relapseModal').style.display = 'none';
  render();
  addLog('💪 Fell and rose again. Day 1 restart.');
});

// ===== NIGHT GUARD / BEDTIME REMINDER =====
document.getElementById('setBedtime').addEventListener('click', () => {
  const time = document.getElementById('bedtimeInput').value;
  state.bedtime = time;
  saveState();
  document.getElementById('reminderStatus').textContent =
    `✅ Reminder set for ${formatTime(time)} — you'll see a browser notification.`;
  scheduleBedtimeNotification(time);
});

function formatTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2,'0')} ${suffix}`;
}

function scheduleBedtimeNotification(timeStr) {
  if (!('Notification' in window)) {
    document.getElementById('reminderStatus').textContent = '⚠️ Your browser does not support notifications. Set a phone alarm instead.';
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') {
      document.getElementById('reminderStatus').textContent =
        '⚠️ Notification permission denied. Set a manual phone alarm for your bedtime.';
      return;
    }

    const [h, m] = timeStr.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);

    const msUntil = target - now;
    setTimeout(() => {
      new Notification('🌙 Brahmacharya Night Guard', {
        body: 'It\'s bedtime. Phone down. No browsing. Your streak is worth protecting. 🙏',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌙</text></svg>',
      });
    }, msUntil);

    document.getElementById('reminderStatus').textContent =
      `✅ Night reminder set for ${formatTime(timeStr)}. Notification will fire tonight.`;
  });
}

// Auto-schedule bedtime reminder on load if bedtime exists
function autoScheduleBedtime() {
  if (state.bedtime) {
    document.getElementById('bedtimeInput').value = state.bedtime;
    scheduleBedtimeNotification(state.bedtime);
  }
}

// ===== PARTICLE CANVAS =====
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 1.5 + 0.3,
    speedY: -(Math.random() * 0.4 + 0.1),
    speedX: (Math.random() - 0.5) * 0.2,
    opacity: Math.random() * 0.4 + 0.1,
    pulse: Math.random() * Math.PI * 2,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.pulse += 0.02;
      p.y += p.speedY;
      p.x += p.speedX;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }

      const glow = Math.sin(p.pulse) * 0.2 + 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${glow})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  setDailyQuote();
  render();
  initParticles();
  autoScheduleBedtime();

  // Live streak tick every minute
  setInterval(() => {
    render();
  }, 60000);
});
