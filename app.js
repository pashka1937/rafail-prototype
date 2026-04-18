// ═══════════════════════════════════════════
//  РАФАИЛ — Прототип v2
//  Цвета: золото (#8B7500/#D4AF37) + синий (#2E5090)
//  Логотип: синий ангел из logo.jpg
// ═══════════════════════════════════════════

const SCREENS = {
  splash:       { label: 'Заставка',                 build: buildSplash },
  onboard1:     { label: 'Онбординг — Добро пожаловать', build: buildOnboard1 },
  onboard2:     { label: 'Онбординг — Выбор роли',   build: buildOnboard2 },
  onboard3:     { label: 'Онбординг — Интересы',     build: buildOnboard3 },
  onboard4:     { label: 'Регистрация',              build: buildOnboard4 },
  home:         { label: 'Главная — Новичок',        build: buildHome },
  satProfile:   { label: 'Профиль Спутника',         build: buildSatProfile },
  chats:        { label: 'Мои чаты',                 build: buildChats },
  churches:     { label: 'Храмы',                    build: buildChurches },
  gamification: { label: 'Баллы и достижения',       build: buildGamification },
  myProfile:    { label: 'Мой профиль',              build: buildMyProfile },
};

let currentScreen = null;
let navHistory = [];
const app = document.getElementById('app');
const screenLabel = document.getElementById('screen-label');

// ─── NAV ────────────────────────────────────
function navigate(id, push = true) {
  if (!SCREENS[id]) return;
  const old = app.querySelector('.screen.active');
  if (old) {
    old.classList.remove('active');
    old.classList.add('exit-left');
    setTimeout(() => old.remove(), 320);
  }
  const el = document.createElement('div');
  el.className = 'screen';
  app.appendChild(el);
  SCREENS[id].build(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('active')));
  if (push && currentScreen) navHistory.push(currentScreen);
  currentScreen = id;
  screenLabel.textContent = SCREENS[id].label;
}

function goBack() {
  if (!navHistory.length) return;
  navigate(navHistory.pop(), false);
}

// ─── MODAL ──────────────────────────────────
function openModal(id) {
  document.getElementById('modal-overlay').classList.add('active');
  document.getElementById(id).classList.add('active');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}
function selectTrebaType(btn) {
  document.querySelectorAll('.treba-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function submitTreba() { closeModal(); showToast('Заказ оформлен! Оплата через Tinkoff.', '✅'); }

// ─── TOAST ──────────────────────────────────
function showToast(msg, icon = '✓') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(16px);
    background:#1A1A1A;color:#fff;padding:10px 18px;border-radius:99px;
    font-size:13px;font-weight:600;font-family:var(--font-body);z-index:999;
    display:flex;align-items:center;gap:7px;white-space:nowrap;
    box-shadow:0 6px 20px rgba(0,0,0,0.25);transition:transform .22s ease,opacity .22s ease;opacity:0;`;
  t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)';
  }));
  setTimeout(() => {
    t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(8px)';
    setTimeout(() => t.remove(), 250);
  }, 2600);
}

// ─── SEND MESSAGE ───────────────────────────
function sendMessage() {
  const inp = document.getElementById('chat-input-field');
  const txt = inp.value.trim(); if (!txt) return;
  const msgs = document.getElementById('chat-messages');
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
  const d = document.createElement('div');
  d.className = 'message msg-out';
  d.innerHTML = `<div class="msg-bubble">${txt}</div><div class="msg-time">${time}</div>`;
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
  inp.value = '';
  setTimeout(() => {
    const r = document.createElement('div');
    r.className = 'message msg-in';
    r.innerHTML = `<div class="msg-bubble">Понял, договорились! 🙏</div><div class="msg-time">${time}</div>`;
    msgs.appendChild(r);
    msgs.scrollTop = msgs.scrollHeight;
  }, 1000);
}

function toggleChip(el) { el.classList.toggle('selected'); }
function toggleFilter(el) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ─── HELPERS ────────────────────────────────
function statusBar(light = false) {
  const c = light ? 'rgba(255,255,255,0.88)' : 'currentColor';
  return `<div class="status-bar${light ? ' light' : ''}">
    <span>9:41</span>
    <div class="status-icons">
      <svg width="14" height="10" viewBox="0 0 16 12" fill="${c}">
        <rect x="0" y="4" width="3" height="8" rx="0.5" opacity="0.4"/>
        <rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5" opacity="0.65"/>
        <rect x="9" y="1" width="3" height="11" rx="0.5"/>
        <rect x="13.5" y="0" width="2.5" height="12" rx="0.5"/>
      </svg>
      <svg width="14" height="11" viewBox="0 0 16 12" fill="none" stroke="${c}" stroke-width="1.5">
        <path d="M1 4.5C3.7 2.2 6.2 1 8 1s4.3 1.2 7 3.5"/>
        <path d="M3 7C4.8 5.3 6.3 4.5 8 4.5S11.2 5.3 13 7"/>
        <circle cx="8" cy="10" r="1" fill="${c}" stroke="none"/>
      </svg>
      <svg width="22" height="11" viewBox="0 0 25 12" fill="none">
        <rect x=".5" y=".5" width="21" height="11" rx="3.5" stroke="${light ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.2)'}"/>
        <rect x="1" y="1" width="16" height="10" rx="3" fill="${c}"/>
        <path d="M23 4v4a2 2 0 0 0 0-4z" fill="${light ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)'}"/>
      </svg>
    </div>
  </div>`;
}

function bottomNav(active) {
  const items = [
    { id:'home', label:'Главная', svg:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
    { id:'chats', label:'Чаты', svg:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>` },
    { id:'churches', label:'Храмы', svg:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="9" y1="4" x2="15" y2="4"/></svg>` },
    { id:'gamification', label:'Баллы', svg:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
    { id:'myProfile', label:'Профиль', svg:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
  ];
  return `<nav class="bottom-nav">${items.map(it => `
    <button class="nav-item${active === it.id ? ' active' : ''}" onclick="navigate('${it.id}')">
      <span class="nav-icon">${it.svg}</span>
      <span>${it.label}</span>
    </button>`).join('')}</nav>`;
}

// ══════════════════════════════════════════════
//  SCREEN BUILDERS
// ══════════════════════════════════════════════

// ─── SPLASH ─────────────────────────────────
function buildSplash(el) {
  el.innerHTML = `
    ${statusBar(true)}
    <div class="splash-bg">
      <div class="splash-logo-wrap">
        <div class="splash-logo-img">
          <img src="logo.png" alt="Рафаил" onerror="this.style.display='none';this.parentNode.innerHTML='<svg width=60 height=60 viewBox=&quot;0 0 60 60&quot; fill=&quot;none&quot;><path d=&quot;M30 8C22 12 16 22 16 30C16 42 22 50 30 52&quot; stroke=&quot;%23D4AF37&quot; stroke-width=&quot;2.5&quot; fill=&quot;none&quot; stroke-linecap=&quot;round&quot;/><path d=&quot;M30 8C38 12 44 22 44 30C44 42 38 50 30 52&quot; stroke=&quot;%23D4AF37&quot; stroke-width=&quot;2.5&quot; fill=&quot;none&quot; stroke-linecap=&quot;round&quot;/><line x1=&quot;30&quot; y1=&quot;14&quot; x2=&quot;30&quot; y2=&quot;42&quot; stroke=&quot;%23D4AF37&quot; stroke-width=&quot;2.5&quot; stroke-linecap=&quot;round&quot;/><line x1=&quot;23&quot; y1=&quot;26&quot; x2=&quot;37&quot; y2=&quot;26&quot; stroke=&quot;%23D4AF37&quot; stroke-width=&quot;2.5&quot; stroke-linecap=&quot;round&quot;/><circle cx=&quot;30&quot; cy=&quot;11&quot; r=&quot;4&quot; fill=&quot;none&quot; stroke=&quot;%23D4AF37&quot; stroke-width=&quot;1.8&quot;/></svg>'">
        </div>
        <div class="splash-app-name">Рафаил</div>
        <div class="splash-app-sub">Путь в храм</div>
      </div>
      <div class="splash-tagline">Найди Спутника, который поможет тебе сделать первый шаг в храм</div>
      <button class="splash-cta" onclick="navigate('onboard1')">Начать путь →</button>
      <div class="splash-login">Уже есть аккаунт? <span onclick="navigate('home')">Войти</span></div>
    </div>`;
}

// ─── ONBOARD 1 ──────────────────────────────
function buildOnboard1(el) {
  el.innerHTML = `
    ${statusBar()}
    <div class="ob-header">
      <div class="ob-steps">
        <div class="step-dot active"></div>
        <div class="step-dot"></div><div class="step-dot"></div><div class="step-dot"></div>
      </div>
      <div class="ob-emoji">🙏</div>
      <div class="ob-title">Добро пожаловать</div>
      <div class="ob-desc">Рафаил соединяет новичков с опытными прихожанами — Спутниками — для первого визита в храм.</div>
    </div>
    <div class="ob-body">
      ${[
        ['🔍','Умный подбор','Алгоритм подберёт Спутника по интересам и возрасту'],
        ['💬','Безопасный чат','Познакомьтесь до встречи в зашифрованном чате'],
        ['⛪','Первый визит','Вместе сделайте первый шаг к духовной жизни'],
        ['🏆','Геймификация','Зарабатывайте баллы за каждый визит и приглашение'],
      ].map(([ico,t,d]) => `
        <div style="display:flex;align-items:flex-start;gap:12px">
          <div style="width:44px;height:44px;border-radius:12px;background:var(--color-secondary-light);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${ico}</div>
          <div>
            <div style="font-weight:700;font-size:14px;margin-bottom:2px">${t}</div>
            <div style="font-size:12px;color:var(--color-text-muted);line-height:1.5">${d}</div>
          </div>
        </div>`).join('')}
    </div>
    <div class="ob-footer">
      <button class="btn btn-primary btn-full" onclick="navigate('onboard2')">Далее →</button>
    </div>`;
}

// ─── ONBOARD 2 — Роль ───────────────────────
function buildOnboard2(el) {
  el.innerHTML = `
    ${statusBar()}
    <div class="ob-header">
      <div class="ob-steps">
        <div class="step-dot done"></div><div class="step-dot active"></div>
        <div class="step-dot"></div><div class="step-dot"></div>
      </div>
      <div class="ob-emoji">🤝</div>
      <div class="ob-title">Кто ты?</div>
      <div class="ob-desc">Выбери свою роль в приложении</div>
    </div>
    <div class="ob-body">
      ${[
        ['novice','🌱','Я новичок','Хочу прийти в храм, но не знаю с чего начать'],
        ['satellite','🌟','Я Спутник','Хочу помочь другим прийти к вере'],
        ['church','⛪','Администратор храма','Управляю расписанием и требами прихода'],
      ].map(([id,ico,name,desc], i) => `
        <div class="role-card${i===0?' selected':''}" id="role-${id}" onclick="selectRole('${id}')">
          <div class="role-emoji">${ico}</div>
          <div style="flex:1"><div class="role-name">${name}</div><div class="role-desc">${desc}</div></div>
          <div class="role-check">${i===0?`<svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="2 7 5.5 10.5 12 4"/></svg>`:''}</div>
        </div>`).join('')}
    </div>
    <div class="ob-footer">
      <button class="btn btn-secondary" onclick="goBack()">← Назад</button>
      <button class="btn btn-primary" style="flex:1" onclick="navigate('onboard3')">Далее →</button>
    </div>`;
}

function selectRole(id) {
  document.querySelectorAll('.role-card').forEach(c => {
    c.classList.remove('selected');
    const ch = c.querySelector('.role-check'); ch.innerHTML = '';
    ch.style.background=''; ch.style.borderColor='';
  });
  const card = document.getElementById('role-'+id);
  card.classList.add('selected');
  const check = card.querySelector('.role-check');
  check.innerHTML = `<svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="2 7 5.5 10.5 12 4"/></svg>`;
}

// ─── ONBOARD 3 — Интересы ───────────────────
function buildOnboard3(el) {
  const interests = ['Архитектура','История','Музыка','Хор','Иконопись','Живопись','Молитва','Паломничество','Общение','Семья','Богослужение','Пост'];
  el.innerHTML = `
    ${statusBar()}
    <div class="ob-header">
      <div class="ob-steps">
        <div class="step-dot done"></div><div class="step-dot done"></div>
        <div class="step-dot active"></div><div class="step-dot"></div>
      </div>
      <div class="ob-emoji">💫</div>
      <div class="ob-title">Твои интересы</div>
      <div class="ob-desc">Выбери темы — подберём Спутника с похожими интересами</div>
    </div>
    <div class="ob-body">
      <div class="chips-grid">
        ${interests.map((t,i) => `<div class="chip${i<3?' selected':''}" onclick="toggleChip(this)">${t}</div>`).join('')}
      </div>
      <div class="form-group">
        <label class="form-label">О себе (необязательно)</label>
        <textarea class="form-input" rows="3" placeholder="Расскажи немного о себе..."></textarea>
      </div>
    </div>
    <div class="ob-footer">
      <button class="btn btn-secondary" onclick="goBack()">← Назад</button>
      <button class="btn btn-primary" style="flex:1" onclick="navigate('onboard4')">Далее →</button>
    </div>`;
}

// ─── ONBOARD 4 — Данные ─────────────────────
function buildOnboard4(el) {
  el.innerHTML = `
    ${statusBar()}
    <div class="ob-header">
      <div class="ob-steps">
        <div class="step-dot done"></div><div class="step-dot done"></div>
        <div class="step-dot done"></div><div class="step-dot active"></div>
      </div>
      <div class="ob-emoji">🎂</div>
      <div class="ob-title">Последний шаг</div>
      <div class="ob-desc">Возраст нужен для безопасного подбора Спутника</div>
    </div>
    <div class="ob-body">
      <div class="form-group">
        <label class="form-label">Имя</label>
        <input type="text" class="form-input" value="Алексей" placeholder="Ваше имя">
      </div>
      <div class="form-group">
        <label class="form-label">Дата рождения</label>
        <input type="date" class="form-input" value="1995-05-15">
      </div>
      <div class="form-group">
        <label class="form-label">Телефон</label>
        <input type="tel" class="form-input" placeholder="+7 (___) ___-__-__">
      </div>
      <div style="padding:12px 14px;background:var(--color-secondary-light);border-radius:var(--radius-lg);border:1px solid color-mix(in srgb,var(--color-secondary) 20%,transparent)">
        <div style="font-size:12px;color:var(--color-secondary);line-height:1.5">
          🔒 <strong>Конфиденциально:</strong> Данные видны только верифицированным Спутникам. Никогда не передаются третьим лицам.
        </div>
      </div>
    </div>
    <div class="ob-footer">
      <button class="btn btn-secondary" onclick="goBack()">← Назад</button>
      <button class="btn btn-gold" style="flex:1" onclick="finishOnboarding()">Начать! 🎉</button>
    </div>`;
}

function finishOnboarding() {
  showToast('Добро пожаловать, Алексей!', '🎉');
  navigate('home');
}

// ─── HOME ───────────────────────────────────
function buildHome(el) {
  el.innerHTML = `
    <div class="home-hero">
      ${statusBar(true)}
      <div class="hero-greeting">Добрый день,</div>
      <div class="hero-name">Алексей</div>
      <div class="hero-match-card" onclick="navigate('satProfile')">
        <div style="flex:1">
          <div class="match-badge">Новый матч!</div>
          <div class="match-info-text" style="margin-top:5px">
            <strong>Александр — 92% совместимость</strong>
            Спутник из Свято-Успенского собора
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
    <div class="screen-content">
      <div class="section">
        <div class="section-header">
          <div class="section-title">Ваши Спутники</div>
          <div class="section-link">Все →</div>
        </div>
        <div class="cards-scroll">
          ${[
            {name:'Александр',pct:'92',col:'#2E5090',tag:'✓ Дети',church:'Успенский',letter:'А'},
            {name:'Елена',pct:'88',col:'#7B3F9E',tag:'♫ Хор',church:'Никольский',letter:'Е'},
            {name:'Михаил',pct:'81',col:'#1B6B4A',tag:'📖 История',church:'Спасский',letter:'М'},
          ].map(s => `
            <div class="satellite-card" onclick="navigate('satProfile')">
              <div class="sat-card-top">
                <div class="avatar av-md" style="background:${s.col}">${s.letter}</div>
                <div class="sat-name">${s.name}</div>
                <div class="sat-pct">${s.pct}% совместимость</div>
              </div>
              <div class="sat-card-body">
                <div class="sat-tag">${s.tag}</div>
                <div class="sat-church">⛪ ${s.church}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <div class="section mt-10">
        <div class="section-header">
          <div class="section-title">Храмы рядом</div>
          <div class="section-link" onclick="navigate('churches')">На карте →</div>
        </div>
        ${[
          {ico:'⛪',name:'Свято-Успенский собор',dist:'0.8 км',svcs:['О здравии','Сорокоуст']},
          {ico:'🕍',name:'Свято-Николаевский храм',dist:'1.2 км',svcs:['Требы','Акафист']},
        ].map(c => `
          <div class="church-card" onclick="navigate('churches')">
            <div class="church-img">${c.ico}</div>
            <div class="church-info">
              <div class="church-name">${c.name}</div>
              <div class="church-dist">📍 ${c.dist}</div>
              <div class="church-services">${c.svcs.map(s=>`<span class="svc-badge">${s}</span>`).join('')}</div>
            </div>
          </div>`).join('')}
      </div>

      <div class="section mt-10 pb-20">
        <div class="section-title" style="margin-bottom:10px">Моя миссия</div>
        <div style="background:var(--color-surface);border:1.5px solid var(--color-border);border-radius:var(--radius-xl);padding:14px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div style="font-weight:700;font-size:13px">До первого визита</div>
            <div style="font-size:12px;color:var(--color-secondary);font-weight:600">2 / 3</div>
          </div>
          <div style="height:6px;background:var(--color-divider);border-radius:99px;overflow:hidden;margin-bottom:12px">
            <div style="height:100%;width:66%;background:linear-gradient(90deg,#2E5090,#64B5F6);border-radius:99px"></div>
          </div>
          ${[['✅','Зарегистрировался',true],['✅','Нашёл Спутника',true],['⬜','Посетить храм',false]].map(([i,t,d]) =>
            `<div style="display:flex;align-items:center;gap:10px;padding:5px 0;opacity:${d?1:0.45}">
              <span style="font-size:16px">${i}</span>
              <span style="font-size:13px;${d?'text-decoration:line-through;color:var(--color-text-muted)':''}">${t}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>
    ${bottomNav('home')}`;
}

// ─── SAT PROFILE ────────────────────────────
function buildSatProfile(el) {
  el.innerHTML = `
    <div class="profile-hero">
      ${statusBar(true)}
      <button class="icon-btn profile-back" onclick="goBack()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="avatar av-xl" style="background:#2E5090;box-shadow:0 4px 16px rgba(0,0,0,0.3),0 0 0 3px rgba(255,255,255,0.1)">А</div>
      <div class="profile-badge">
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="2 7 5.5 10.5 12 4"/></svg>
        Верифицирован
      </div>
      <div class="profile-name">Александр Петров</div>
      <div class="profile-church">⛪ Свято-Успенский собор · Витебск</div>
      <div class="compat-pill">✨ 92% совместимость</div>
    </div>
    <div class="screen-content">
      <div class="stats-row">
        ${[['24','Визитов'],['4.9','Рейтинг'],['3г.','Опыт']].map(([v,l]) =>
          `<div class="stat-card"><div class="stat-val">${v}</div><div class="stat-lbl">${l}</div></div>`).join('')}
      </div>
      <div class="prof-section mt-14">
        <div class="prof-section-title">О себе</div>
        <p style="font-size:13px;color:var(--color-text-muted);line-height:1.6">
          Прихожанин Свято-Успенского собора уже 3 года. Интересуюсь историей православной архитектуры и хоровым пением. Рад помочь сделать первый шаг.
        </p>
      </div>
      <div class="prof-section mt-14">
        <div class="prof-section-title">Интересы</div>
        <div class="chips-grid">
          ${['История','Архитектура','Хор','Иконопись','Богослужение'].map(t=>`<div class="chip selected">${t}</div>`).join('')}
        </div>
      </div>
      <div class="prof-section mt-14">
        <div class="prof-section-title">Доступность</div>
        <div class="avail-list">
          ${['Вс 09:00','Вс 17:00','Пн 18:00','Пт 17:00'].map(t=>`<div class="avail-chip">📅 ${t}</div>`).join('')}
        </div>
      </div>
      <div class="prof-section mt-14">
        <div class="prof-section-title">Сертификаты</div>
        <div class="cert-row">
          <div class="cert-card cert-green"><div class="cert-icon">🛡️</div><div class="cert-name">Безопасность детей</div></div>
          <div class="cert-card cert-blue"><div class="cert-icon">✝️</div><div class="cert-name">Верификация епархии</div></div>
        </div>
      </div>
      <div class="prof-section mt-14 pb-20">
        <div class="prof-section-title">Отзывы</div>
        ${[
          {nm:'Мария К.',txt:'Александр был очень внимателен. Объяснил всё о службе.',r:5},
          {nm:'Иван П.',txt:'Благодаря ему я не боюсь ходить в церковь.',r:5},
        ].map(r => `
          <div class="review-item">
            <div class="review-top">
              <div class="review-name">${r.nm}</div>
              <div class="review-stars">${'⭐'.repeat(r.r)}</div>
            </div>
            <div class="review-text">${r.txt}</div>
          </div>`).join('')}
      </div>
    </div>
    <div class="profile-actions">
      <button class="btn btn-primary" style="flex:1" onclick="openModal('chat-modal')">💬 Написать</button>
      <button class="btn btn-secondary" onclick="showToast('Встреча запланирована: вс, 9:00','📅')">📅 Встреча</button>
    </div>`;
}

// ─── CHATS ──────────────────────────────────
function buildChats(el) {
  const items = [
    {l:'А',col:'#2E5090',nm:'Александр Петров',prev:'Жду вас у главного входа!',t:'10:51',u:0,on:true},
    {l:'Е',col:'#7B3F9E',nm:'Елена Смирнова',prev:'Могу в субботу вечером',t:'Вчера',u:2,on:false},
    {l:'М',col:'#1B6B4A',nm:'Михаил Орлов',prev:'Добрый день! Готов помочь',t:'Пн',u:0,on:false},
  ];
  el.innerHTML = `
    ${statusBar()}
    <div class="app-header">
      <div class="header-title">Мои чаты</div>
      <button class="icon-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/></svg></button>
    </div>
    <div style="padding:10px 16px;border-bottom:1px solid var(--color-divider);flex-shrink:0">
      <div class="search-wrap">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Поиск чатов...">
      </div>
    </div>
    <div class="screen-content">
      ${items.map(c => `
        <div class="chat-item" onclick="openModal('chat-modal')">
          <div class="online-wrap">
            <div class="avatar av-md" style="background:${c.col}">${c.l}</div>
            ${c.on?`<div class="online-dot-abs"></div>`:''}
          </div>
          <div class="chat-info">
            <div class="chat-name-row">
              <div class="chat-nm">${c.nm}</div>
              <div class="chat-time">${c.t}</div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div class="chat-preview">${c.prev}</div>
              ${c.u>0?`<div class="unread-badge">${c.u}</div>`:''}
            </div>
          </div>
        </div>`).join('')}
      <div style="text-align:center;padding:32px 20px;color:var(--color-text-faint);font-size:13px">
        <div style="font-size:28px;margin-bottom:8px">💬</div>
        Найди Спутника, чтобы начать общение
      </div>
    </div>
    ${bottomNav('chats')}`;
}

// ─── CHURCHES ───────────────────────────────
function buildChurches(el) {
  const churches = [
    {ico:'⛪',nm:'Свято-Успенский собор',dist:'0.8 км',svcs:['О здравии','О упокоении','Сорокоуст'],sats:3},
    {ico:'🕍',nm:'Свято-Николаевский храм',dist:'1.2 км',svcs:['Требы','Акафист'],sats:5},
    {ico:'⛪',nm:'Покровский собор',dist:'2.5 км',svcs:['Все услуги'],sats:8},
  ];
  el.innerHTML = `
    ${statusBar()}
    <div class="app-header">
      <div class="header-title">Храмы</div>
      <button class="icon-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg></button>
    </div>
    <div class="map-preview">
      <div class="map-pin" style="top:32%;left:37%">📍</div>
      <div class="map-pin" style="top:54%;left:62%;animation-delay:.5s">📍</div>
      <div class="map-pin" style="top:42%;left:72%;animation-delay:1s">📍</div>
      <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:0.12" viewBox="0 0 360 160">
        ${[40,80,120].map(y=>`<line x1="0" y1="${y}" x2="360" y2="${y}" stroke="#2d6a2d" stroke-width="1"/>`).join('')}
        ${[72,144,216,288].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="160" stroke="#2d6a2d" stroke-width="1"/>`).join('')}
      </svg>
      <div class="map-label" onclick="showToast('Открываем Google Maps...','🗺️')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Поиск на карте
      </div>
    </div>
    <div class="search-bar">
      <div class="search-wrap">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Название храма или город...">
      </div>
    </div>
    <div class="filter-row">
      ${['Все','📍 Рядом','🕊️ О здравии','✝️ Требы','🌟 Спутники'].map((t,i) =>
        `<div class="filter-chip${i===0?' active':''}" onclick="toggleFilter(this)">${t}</div>`).join('')}
    </div>
    <div class="screen-content" style="padding:12px 16px">
      ${churches.map(c => `
        <div class="ch-card" onclick="openModal('treba-modal')">
          <div class="ch-card-top">
            <div class="ch-card-img">${c.ico}</div>
            <div class="ch-card-info">
              <div class="ch-name">${c.nm}</div>
              <div class="ch-dist">📍 ${c.dist} · Витебск</div>
              <div class="ch-services">${c.svcs.map(s=>`<span class="svc-badge">${s}</span>`).join('')}</div>
              <div class="ch-sats">👥 ${c.sats} Спутников</div>
            </div>
          </div>
          <div class="ch-card-actions">
            <button class="btn btn-sm btn-gold" style="flex:1" onclick="event.stopPropagation();openModal('treba-modal')">📿 Подать записку</button>
            <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();navigate('satProfile')">👥 Спутники</button>
          </div>
        </div>`).join('')}
      <div style="height:16px"></div>
    </div>
    ${bottomNav('churches')}`;
}

// ─── GAMIFICATION ───────────────────────────
function buildGamification(el) {
  const achiev = [
    {ico:'🕊️',nm:'Первый шаг',pts:'+100',ok:true},
    {ico:'💬',nm:'Первый чат',pts:'+75',ok:true},
    {ico:'⭐',nm:'Ищущий',pts:'+200',ok:true},
    {ico:'⛪',nm:'Первый визит',pts:'+500',ok:false},
    {ico:'🤝',nm:'Помощник',pts:'+150',ok:false},
    {ico:'🌟',nm:'Миссионер',pts:'+2000',ok:false},
  ];
  el.innerHTML = `
    <div class="gamif-hero">
      ${statusBar(true)}
      <div class="rank-badge">🌟 Ранг: Ищущий</div>
      <div class="pts-num">375</div>
      <div class="pts-lbl">баллов заработано</div>
      <div class="progress-wrap">
        <div class="progress-track"><div class="progress-fill"></div></div>
        <div class="progress-labels">
          <span class="progress-lbl">375 / 500</span>
          <span class="progress-lbl">Следующий: Помощник</span>
        </div>
      </div>
    </div>
    <div class="screen-content">
      <div class="section">
        <div class="section-title" style="margin-bottom:12px">Достижения</div>
        <div class="achiev-grid">
          ${achiev.map(a => `
            <div class="achiev-card${a.ok?' unlocked':''}"
                 onclick="${a.ok?`showToast('${a.nm}: ${a.pts} бал.','🏆')`:`showToast('Ещё не разблокировано','🔒')`}">
              <div class="achiev-icon">${a.ico}</div>
              <div class="achiev-name">${a.nm}</div>
              <div class="achiev-pts">${a.pts} бал.</div>
            </div>`).join('')}
        </div>
      </div>
      <div class="section mt-14">
        <div class="section-title" style="margin-bottom:6px">Активность</div>
        ${[['🤝','Нашёл первого Спутника','+100'],['💬','Первое сообщение','+75'],['✅','Завершил регистрацию','+200']].map(([i,t,p])=>
          `<div class="activity-item">
            <div class="act-icon">${i}</div>
            <div class="act-text">${t}</div>
            <div class="act-pts">${p}</div>
          </div>`).join('')}
      </div>
      <div class="section mt-14 pb-20">
        <div style="background:var(--color-secondary-light);border:1.5px solid color-mix(in srgb,var(--color-secondary) 20%,transparent);border-radius:var(--radius-xl);padding:14px;text-align:center">
          <div style="font-size:26px;margin-bottom:6px">🎁</div>
          <div style="font-weight:700;font-size:14px;margin-bottom:4px">Пригласи друга</div>
          <div style="font-size:12px;color:var(--color-text-muted);margin-bottom:12px">Получи 150 баллов за каждого, кто совершит первый визит</div>
          <button class="btn btn-primary btn-sm" onclick="showToast('Ссылка скопирована!','📎')">📎 Пригласить</button>
        </div>
      </div>
    </div>
    ${bottomNav('gamification')}`;
}

// ─── MY PROFILE ─────────────────────────────
function buildMyProfile(el) {
  el.innerHTML = `
    <div class="profile-hero" style="padding-bottom:20px">
      ${statusBar(true)}
      <div class="avatar av-xl" style="background:linear-gradient(135deg,#2E5090,#64B5F6)">А</div>
      <div class="profile-name" style="margin-top:10px">Алексей</div>
      <div class="profile-church">🌱 Новичок · В поиске Спутника</div>
      <div style="display:flex;gap:8px;z-index:1">
        <div style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:99px;padding:4px 12px;font-size:11px;color:rgba(255,255,255,0.7)">⭐ 375 баллов</div>
        <div style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:99px;padding:4px 12px;font-size:11px;color:rgba(255,255,255,0.7)">🏆 Ищущий</div>
      </div>
    </div>
    <div class="screen-content">
      ${[
        ['👤','Редактировать профиль',`showToast('Открываем настройки','✏️')`],
        ['🔔','Уведомления',`showToast('Настройки уведомлений','🔔')`],
        ['🔒','Конфиденциальность',`showToast('Политика конфиденциальности','🔒')`],
        ['📞','Служба поддержки',`showToast('Открываем чат поддержки','💬')`],
        ['📜','История заказов',`showToast('У вас пока нет заказов','📜')`],
      ].map(([ico,txt,fn]) => `
        <div class="profile-menu-item" onclick="${fn}">
          <div class="menu-icon-wrap">${ico}</div>
          <div class="menu-text">${txt}</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-faint)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>`).join('')}
      <div style="padding:20px 16px 24px">
        <button class="btn btn-full" style="color:var(--color-error);border:1.5px solid var(--color-error-light);border-radius:var(--radius-lg);padding:13px"
                onclick="showToast('Сессия завершена','👋');setTimeout(()=>navigate('splash'),900)">
          Выйти из аккаунта
        </button>
      </div>
    </div>
    ${bottomNav('myProfile')}`;
}

// ─── INIT ───────────────────────────────────
window.addEventListener('DOMContentLoaded', () => navigate('splash'));
