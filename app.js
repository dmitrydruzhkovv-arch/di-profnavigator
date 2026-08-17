/* ============================================================
   ПРОФНАВИГАТОР — движок
   Принцип: не предсказываем профессию (это невозможно в 16 лет),
   а (1) показываем среды изнутри, (2) собираем доказательства из
   прошлого опыта, (3) считаем черновик набора ЕГЭ, (4) выдаём
   дешёвые эксперименты «увидеть своими глазами».
   Данных о личности наружу не уходит: всё в localStorage,
   на финале — код, который ученик сам отдаёт наставнику.
   ============================================================ */

const app = document.getElementById('app');
const header = document.getElementById('pn-header');
const fill = document.getElementById('pn-fill');
const stepLabel = document.getElementById('pn-step');

const LS = 'pn_state_v1';
let S = load();
let idx = 0;

function blank() {
  return { v: 1, n: '', w: {}, t: [], p: {}, a: [], d: { wake: '', people: '', hands: '', pay: '' }, s: {}, m: [] };
}
function load() {
  try { const r = JSON.parse(localStorage.getItem(LS)); return r && r.v === 1 ? Object.assign(blank(), r) : blank(); }
  catch (e) { return blank(); }
}
function save() { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) {} }

/* ── лента шагов ── */
const STEPS = [];
STEPS.push({ k: 'cover' });
STEPS.push({ k: 'how' });
STEPS.push({ k: 'worldsIntro' });
WORLDS.forEach((w, i) => STEPS.push({ k: 'world', i }));
STEPS.push({ k: 'tried' });
PAIRS.forEach((p, i) => STEPS.push({ k: 'pair', i }));
STEPS.push({ k: 'anti' });
STEPS.push({ k: 'day' });
STEPS.push({ k: 'subj' });
STEPS.push({ k: 'mathIntro' });
MATH.forEach((m, i) => STEPS.push({ k: 'math', i }));
STEPS.push({ k: 'finish' });

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function go(n) { idx = Math.max(0, Math.min(STEPS.length - 1, n)); render(); window.scrollTo({ top: 0, behavior: 'instant' }); }
function next() { go(idx + 1); }
function back() { go(idx - 1); }

function chrome() {
  const st = STEPS[idx];
  const show = st.k !== 'cover' && st.k !== 'how';
  header.hidden = !show;
  if (show) {
    const pct = Math.round((idx / (STEPS.length - 1)) * 100);
    fill.style.width = pct + '%';
    stepLabel.textContent = pct + '%';
  }
}

/* ============================ ЭКРАНЫ ============================ */

function render() {
  save(); chrome();
  const st = STEPS[idx];
  const R = {
    cover: rCover, how: rHow, worldsIntro: rWorldsIntro, world: rWorld, tried: rTried,
    pair: rPair, anti: rAnti, day: rDay, subj: rSubj, mathIntro: rMathIntro, math: rMath, finish: rFinish
  }[st.k];
  app.innerHTML = '';
  R(st);
}

function rCover() {
  app.innerHTML = `
    <section class="lk-cover">
      <div class="lk-kicker">Профнавигатор</div>
      <h1 class="lk-h1">Тебя не спросят,<br>кем ты хочешь быть</h1>
      <p class="lk-lead">Потому что честный ответ в 16 лет — «я не знаю, я нигде не работал».
      Это нормально и это не твоя вина.<br><br>
      Здесь другое: <b>18 рабочих дней изнутри</b> — как оно на самом деле, включая то, что бесит.
      Смотришь и отмечаешь, где тебя дёрнуло.</p>
      <button class="lk-btn" id="go">Начать · 25–30 минут</button>
      <p style="font-size:13px;color:var(--lk-muted);margin:18px 0 0">
        Никаких имён и телефонов. Всё остаётся в твоём телефоне.</p>
    </section>`;
  document.getElementById('go').onclick = next;
}

function rHow() {
  app.innerHTML = `
    <div class="pn-sect">Как это устроено</div>
    <h2 class="pn-q">Выбрать то, чего не видел, нельзя. Поэтому так:</h2>
    <div class="lk-card" style="margin-bottom:14px">
      <b>1. Показываем миры, а не названия.</b><br>
      Не «инженер» и «юрист», а конкретный вторник: что делаешь руками, что бесит, кто рядом.
      Названия профессий ты уже слышал, а дни — нет.
    </div>
    <div class="lk-card" style="margin-bottom:14px">
      <b>2. Ищем доказательства в твоём прошлом.</b><br>
      Ты не работал, но ты уже что-то собирал, объяснял, организовывал, доводил до конца.
      Это данные. Мечты — нет.
    </div>
    <div class="lk-card" style="margin-bottom:14px">
      <b>3. Считаем набор ЕГЭ как «сколько дверей открыто».</b><br>
      Главное решение 10 класса — не профессия, а предметы. Задача не угадать судьбу,
      а <b>не закрыть двери зря</b>.
    </div>
    <div class="lk-card" style="margin-bottom:14px">
      <b>4. Даём 3 способа увидеть своими глазами.</b><br>
      Дешёвые эксперименты на неделю: сходить, поговорить, попробовать руками.
      Только так неизвестное становится известным.
    </div>
    <div class="pn-warn">В конце не будет вердикта «ты инженер». Будет материал для живого разбора —
    и код, который ты отдашь наставнику.</div>
    <div class="pn-nav"><button class="lk-btn" id="go">Понятно, пошли</button></div>
    <button class="pn-back" id="bk">← назад</button>`;
  document.getElementById('go').onclick = next;
  document.getElementById('bk').onclick = back;
}

function rWorldsIntro() {
  app.innerHTML = `
    <div class="pn-sect">Часть 1 из 6 · 18 миров</div>
    <h2 class="pn-q">Читай как свой вторник</h2>
    <p class="pn-sub">Не «нравится ли профессия», а <b>смог бы ты так жить</b>. У каждого мира есть
    и кайф, и то, что бесит — специально, потому что без второго это реклама, а не правда.</p>
    <div class="lk-card" style="margin-bottom:14px">
      🔥 <b>Зацепило</b> — хочу попробовать по-настоящему<br><br>
      😐 <b>Никак</b> — не отталкивает, но и не тянет<br><br>
      ⛔ <b>Нет</b> — я так жить не хочу
    </div>
    <p class="pn-sub">Отвечай быстро, первым чувством. Правильных ответов нет и оценок тоже нет.</p>
    <div class="pn-nav"><button class="lk-btn" id="go">Первый мир</button></div>
    <button class="pn-back" id="bk">← назад</button>`;
  document.getElementById('go').onclick = next;
  document.getElementById('bk').onclick = back;
}

function rWorld(st) {
  const w = WORLDS[st.i];
  const cur = S.w[w.id] || '';
  app.innerHTML = `
    <div class="pn-sect">Мир ${st.i + 1} из ${WORLDS.length}</div>
    <div class="lk-card pn-world">
      <div class="pn-world-head">
        <div class="pn-ico">${w.ico}</div>
        <h2 class="pn-world-title">${esc(w.title)}</h2>
      </div>
      <ul class="pn-day">${w.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
      <div class="pn-row"><span class="pn-tag pn-tag-up">КАЙФ</span><span>${esc(w.kayf)}</span></div>
      <div class="pn-row"><span class="pn-tag pn-tag-down">БЕСИТ</span><span>${esc(w.besit)}</span></div>
      <div class="pn-meta">
        <b>Кто там работает:</b> ${esc(w.kto)}
        <div class="pn-ege">${w.ege.map(e => `<span>${esc(e)}</span>`).join('')}</div>
      </div>
    </div>
    <div class="pn-rate">
      <button class="pn-yes ${cur === 'y' ? 'is-on' : ''}" data-v="y"><span class="pn-em">🔥</span> Зацепило — хочу попробовать</button>
      <button class="pn-meh ${cur === 'm' ? 'is-on' : ''}" data-v="m"><span class="pn-em">😐</span> Никак</button>
      <button class="pn-no ${cur === 'n' ? 'is-on' : ''}" data-v="n"><span class="pn-em">⛔</span> Нет, я так жить не хочу</button>
    </div>
    <button class="pn-back" id="bk">← назад</button>`;
  app.querySelectorAll('.pn-rate button').forEach(b => b.onclick = () => {
    S.w[w.id] = b.dataset.v; save(); next();
  });
  document.getElementById('bk').onclick = back;
}

function rTried() {
  app.innerHTML = `
    <div class="pn-sect">Часть 2 из 6 · доказательства</div>
    <h2 class="pn-q">Что ты уже делал по-настоящему</h2>
    <p class="pn-sub">Не «умею» и не «хотел бы» — а <b>делал, и получилось</b>. Хоть один раз.
    Это единственные твёрдые данные о тебе, которые вообще существуют.</p>
    <div class="pn-check" id="list">
      ${TRIED.map(t => `<label class="${S.t.includes(t.id) ? 'is-on' : ''}">
        <input type="checkbox" data-id="${t.id}" ${S.t.includes(t.id) ? 'checked' : ''}>
        <span>${esc(t.t)}</span></label>`).join('')}
    </div>
    <div class="pn-nav"><button class="lk-btn" id="go">Дальше</button></div>
    <button class="pn-back" id="bk">← назад</button>`;
  app.querySelectorAll('#list input').forEach(inp => inp.onchange = () => {
    const id = inp.dataset.id;
    S.t = inp.checked ? Array.from(new Set(S.t.concat(id))) : S.t.filter(x => x !== id);
    inp.closest('label').classList.toggle('is-on', inp.checked);
    save();
  });
  document.getElementById('go').onclick = next;
  document.getElementById('bk').onclick = back;
}

function rPair(st) {
  const p = PAIRS[st.i];
  app.innerHTML = `
    <div class="pn-sect">Часть 3 из 6 · ${st.i + 1} из ${PAIRS.length}</div>
    <h2 class="pn-q">Что скорее твоё?</h2>
    <p class="pn-sub">Оба варианта нормальные. Выбирай то, от чего меньше устанешь за восемь часов.</p>
    <div class="pn-pair">
      <button data-v="0">${esc(p.a)}</button>
      <div class="pn-or">или</div>
      <button data-v="1">${esc(p.b)}</button>
    </div>
    <button class="pn-back" id="bk">← назад</button>`;
  app.querySelectorAll('.pn-pair button').forEach(b => b.onclick = () => {
    S.p[st.i] = +b.dataset.v; save(); next();
  });
  document.getElementById('bk').onclick = back;
}

function rAnti() {
  app.innerHTML = `
    <div class="pn-sect">Часть 4 из 6 · антирезюме</div>
    <h2 class="pn-q">Чего ты точно НЕ хочешь</h2>
    <p class="pn-sub">Это работает быстрее, чем «хочу»: <b>вычеркнуть проще, чем выбрать</b>.
    Отмечай только то, от чего внутри реально «нет».</p>
    <div class="pn-check" id="list">
      ${ANTI.map(a => `<label class="${S.a.includes(a.id) ? 'is-on' : ''}">
        <input type="checkbox" data-id="${a.id}" ${S.a.includes(a.id) ? 'checked' : ''}>
        <span>${esc(a.t)}</span></label>`).join('')}
    </div>
    <div class="pn-nav"><button class="lk-btn" id="go">Дальше</button></div>
    <button class="pn-back" id="bk">← назад</button>`;
  app.querySelectorAll('#list input').forEach(inp => inp.onchange = () => {
    const id = inp.dataset.id;
    S.a = inp.checked ? Array.from(new Set(S.a.concat(id))) : S.a.filter(x => x !== id);
    inp.closest('label').classList.toggle('is-on', inp.checked);
    save();
  });
  document.getElementById('go').onclick = next;
  document.getElementById('bk').onclick = back;
}

function rDay() {
  const d = S.d;
  app.innerHTML = `
    <div class="pn-sect">Часть 5 из 6 · день в 27 лет</div>
    <h2 class="pn-q">Тебе 27. Обычный вторник</h2>
    <p class="pn-sub">Не мечта и не «стану миллионером» — <b>обычный день</b>. Коротко, как думаешь.
    Тут вылезают твои настоящие условия жизни, а не профессии.</p>
    <div class="pn-field"><label>Во сколько встал и что первое делаешь?</label>
      <input id="f-wake" value="${esc(d.wake)}" placeholder="например: в 9, без будильника"></div>
    <div class="pn-field"><label>Один или среди людей? Сколько людей за день?</label>
      <input id="f-people" value="${esc(d.people)}" placeholder="например: двое-трое, не больше"></div>
    <div class="pn-field"><label>Что делаешь руками, а что головой?</label>
      <textarea id="f-hands" placeholder="например: руками почти ничего, весь день разбираюсь в задаче">${esc(d.hands)}</textarea></div>
    <div class="pn-field"><label>Кто тебе платит и за что именно?</label>
      <textarea id="f-pay" placeholder="например: компания, за то что я решаю их проблему">${esc(d.pay)}</textarea></div>
    <div class="pn-nav"><button class="lk-btn" id="go">Дальше</button></div>
    <button class="pn-back" id="bk">← назад</button>`;
  const grab = () => {
    S.d = {
      wake: document.getElementById('f-wake').value.slice(0, 200),
      people: document.getElementById('f-people').value.slice(0, 200),
      hands: document.getElementById('f-hands').value.slice(0, 400),
      pay: document.getElementById('f-pay').value.slice(0, 400)
    }; save();
  };
  ['f-wake', 'f-people', 'f-hands', 'f-pay'].forEach(id => document.getElementById(id).oninput = grab);
  document.getElementById('go').onclick = () => { grab(); next(); };
  document.getElementById('bk').onclick = () => { grab(); back(); };
}

function rSubj() {
  app.innerHTML = `
    <div class="pn-sect">Часть 6 из 6 · школа честно</div>
    <h2 class="pn-q">Предметы: где ты на самом деле</h2>
    <p class="pn-sub">Честно, без «должно быть». Это нужно, чтобы посчитать <b>набор ЕГЭ</b>,
    а не чтобы тебя оценить.</p>
    <div class="pn-subj" id="rows">
      ${SUBJECTS.map(s => {
        const v = S.s[s.id] || '';
        return `<div class="pn-subj-row"><div class="pn-subj-name">${esc(s.t)}</div>
        <div class="pn-subj-btns" data-id="${s.id}">
          <button data-v="l" class="${v === 'l' ? 'is-on' : ''}" title="могу и нравится">👍</button>
          <button data-v="c" class="${v === 'c' ? 'is-on' : ''}" title="могу, но не люблю">😐</button>
          <button data-v="n" class="${v === 'n' ? 'is-on' : ''}" title="не тяну">✕</button>
        </div></div>`;
      }).join('')}
    </div>
    <div class="pn-legend">👍 могу и нравится · 😐 могу, но не люблю · ✕ сейчас не тяну<br>
    «Не тяну» — это про сегодня, а не про способности. Это отдельный разговор с наставником.</div>
    <div class="pn-nav"><button class="lk-btn" id="go">Дальше</button></div>
    <button class="pn-back" id="bk">← назад</button>`;
  app.querySelectorAll('.pn-subj-btns').forEach(g => {
    g.querySelectorAll('button').forEach(b => b.onclick = () => {
      S.s[g.dataset.id] = b.dataset.v; save();
      g.querySelectorAll('button').forEach(x => x.classList.remove('is-on'));
      b.classList.add('is-on');
    });
  });
  document.getElementById('go').onclick = next;
  document.getElementById('bk').onclick = back;
}

function rMathIntro() {
  app.innerHTML = `
    <div class="pn-sect">Бонус · 5 задач</div>
    <h2 class="pn-q">Проверка одной фразы</h2>
    <p class="pn-sub">Половина людей вычёркивает технику, IT и экономику одной фразой:
    <b>«я не математик»</b>. Обычно она родом из тройки в седьмом классе, а не из фактов.
    Пять задач, по нарастанию. Считать на бумаге можно, гуглить — смысла нет.</p>
    <div class="pn-warn">Это не экзамен и результат никуда не идёт, кроме твоего же разбора.
    Задача — посмотреть на факт, а не получить оценку.</div>
    <div class="pn-nav"><button class="lk-btn" id="go">Погнали</button></div>
    <button class="pn-back" id="bk">← назад</button>`;
  document.getElementById('go').onclick = next;
  document.getElementById('bk').onclick = back;
}

function rMath(st) {
  const m = MATH[st.i];
  app.innerHTML = `
    <div class="pn-sect">Задача ${st.i + 1} из ${MATH.length}</div>
    <div class="lk-card"><div class="lk-cond" style="margin:0">${esc(m.q)}</div></div>
    <div class="pn-math-in">
      <input id="ans" inputmode="decimal" autocomplete="off" placeholder="ответ">
      <button class="lk-btn" id="ok" style="flex:0 0 auto">Ответить</button>
    </div>
    <div id="fb"></div>
    <button class="pn-back" id="bk">← назад</button>`;
  const check = () => {
    const raw = document.getElementById('ans').value.trim().replace(',', '.').replace(/\s|₽/g, '');
    if (!raw) return;
    const good = m.ans.some(a => a === raw);
    S.m[st.i] = good; save();
    document.getElementById('fb').innerHTML = good
      ? `<div class="pn-verdict ok">Верно. Дальше.</div>`
      : `<div class="pn-verdict bad">Не сходится. Подсказка: ${esc(m.hint)}<br>
         <span style="color:var(--lk-muted)">Правильный ответ: <b class="lk-mono">${esc(m.ans[0])}</b>. Идём дальше — это не экзамен.</span></div>`;
    setTimeout(next, good ? 700 : 2600);
  };
  document.getElementById('ok').onclick = check;
  document.getElementById('ans').onkeydown = e => { if (e.key === 'Enter') check(); };
  document.getElementById('ans').focus();
  document.getElementById('bk').onclick = back;
}

/* ============================ ФИНАЛ ============================ */

function analyse(s) {
  // 1. миры по оценкам
  const yes = WORLDS.filter(w => s.w[w.id] === 'y');
  const meh = WORLDS.filter(w => s.w[w.id] === 'm');
  const no = WORLDS.filter(w => s.w[w.id] === 'n');

  // 2. буквы среды: миры 🔥 (вес 2), прошлый опыт (вес 2), пары (вес 1)
  const tally = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  yes.forEach(w => w.code.split('').forEach(c => tally[c] += 2));
  s.t.forEach(id => { const t = TRIED.find(x => x.id === id); if (t) tally[t.code] += 2; });
  Object.keys(s.p).forEach(i => {
    const p = PAIRS[i]; if (!p) return;
    tally[s.p[i] === 0 ? p.ca : p.cb] += 1;
  });
  const top = Object.keys(tally).sort((a, b) => tally[b] - tally[a]).filter(k => tally[k] > 0);

  // 3. набор ЕГЭ из миров 🔥
  const egeCount = {};
  yes.forEach(w => w.ege.forEach(e => egeCount[e] = (egeCount[e] || 0) + 1));
  const ege = Object.keys(egeCount).sort((a, b) => egeCount[b] - egeCount[a]);

  // 4. противоречия «хочу, но предмет не тяну»
  const map = { 'Профильная математика': 'math', 'Физика': 'phys', 'Информатика': 'inf', 'Химия': 'chem', 'Биология': 'bio', 'История': 'hist', 'Общество': 'soc' };
  const conflicts = [];
  yes.forEach(w => w.ege.forEach(e => {
    const sid = map[e]; if (!sid) return;
    if (s.s[sid] === 'n') conflicts.push(`«${w.title}» требует ${e.toLowerCase()}, а ты записал этот предмет как «не тяну»`);
  }));

  const mathScore = s.m.filter(Boolean).length;
  return { yes, meh, no, tally, top, ege, conflicts, mathScore };
}

function encode(s) {
  const bytes = new TextEncoder().encode(JSON.stringify(s));
  let bin = ''; bytes.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decode(code) {
  let b = code.replace(/-/g, '+').replace(/_/g, '/');
  while (b.length % 4) b += '=';
  const bin = atob(b);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return JSON.parse(new TextDecoder().decode(bytes));
}

function mathLine(n) {
  if (n >= 4) return `Ты решил <b>${n} из 5</b>. Это рабочий уровень: профильная математика с такого старта берётся за год. Фразу «я не математик» из разговора убираем — она противоречит факту.`;
  if (n >= 2) return `Ты решил <b>${n} из 5</b> — то есть база есть, дырки локальные. Это не «неспособность», это непройденные темы. За год такое поднимается до профильной, если взяться.`;
  return `Ты решил <b>${n} из 5</b>. Это стартовая точка, а не приговор: задачи были на проценты, уравнение и пропорцию — темы 6–7 класса, которые чинятся быстро. Вопрос не «способен ли», а «сколько времени готов вложить».`;
}

function rFinish(_, ro) {
  const A = analyse(S);
  const code = encode(S);
  const probes = (A.yes.length ? A.yes : A.meh).slice(0, 3);

  const topLine = A.top.slice(0, 3).map(c => `<b>${c}</b> — ${CODE_NAMES[c]}`).join('<br>');

  app.innerHTML = `
    <section class="lk-cover" style="padding:36px 20px 30px">
      <div class="lk-kicker">Собрано</div>
      <h1 class="lk-h1">Это не вердикт.<br>Это материал.</h1>
      <p class="lk-lead" style="margin-bottom:0">Никакой тест не знает, кем тебе быть — и я не знаю.
      Зато теперь видно, <b>какие среды тебя дёрнули</b>, что ты уже умеешь и какие двери надо
      держать открытыми.</p>
    </section>

    <div class="pn-res-block" style="margin-top:24px">
      <h3>🔥 Зацепило (${A.yes.length})</h3>
      ${A.yes.length ? `<div class="pn-top">${A.yes.map(w => `<div class="pn-top-item">
        <span style="font-size:22px">${w.ico}</span><span><b>${esc(w.title)}</b><br>
        <span style="color:var(--lk-muted)">${esc(w.kto)}</span></span></div>`).join('')}</div>`
        : `<div class="pn-warn">Ни один мир не зацепил. Это тоже результат, и довольно частый:
           значит, показанного мало или всё показанное — не твоё. На разборе идём вглубь того,
           что отмечено как «никак».</div>`}
    </div>

    <div class="pn-res-block">
      <h3>⛔ Точно не твоё (${A.no.length})</h3>
      <p style="font-size:15px;line-height:1.5;color:var(--lk-muted);margin:0">
        ${A.no.length ? A.no.map(w => esc(w.title)).join(' · ') : 'ничего не вычеркнуто — стоит пройти ещё раз честнее'}</p>
    </div>

    <div class="pn-res-block">
      <h3>🧭 Среда, которая набралась</h3>
      <div class="lk-card">${topLine || 'данных мало'}
        <div style="margin-top:12px;font-size:14px;color:var(--lk-muted)">
        Это гипотеза из трёх источников: миры, которые дёрнули, твой прошлый опыт и быстрые пары.
        Не диагноз — то, что проверяем.</div>
      </div>
    </div>

    <div class="pn-res-block">
      <h3>📐 Черновик набора ЕГЭ</h3>
      <div class="lk-card">
        ${A.ege.length ? `Твои миры чаще всего требуют:<div class="pn-ege" style="margin-top:10px">
          ${A.ege.map(e => `<span>${esc(e)}</span>`).join('')}</div>` : 'миров 🔥 нет — набор считаем на разборе'}
        <div style="margin-top:14px;font-size:15px;line-height:1.5">
        Правило: в 10 классе выбирают <b>не судьбу, а количество открытых дверей</b>.
        Самый широкий набор — русский + профильная математика + информатика или физика:
        он держит открытыми технику, IT и экономику. Отказ от профильной математики закрывает
        их все сразу.</div>
      </div>
    </div>

    ${A.conflicts.length ? `<div class="pn-res-block">
      <h3>⚡ Противоречия — главный разговор</h3>
      <div class="pn-warn">${A.conflicts.map(c => esc(c)).join('<br><br>')}<br><br>
      Это не тупик. Это ровно то место, где решается, будет ли дверь открыта: подтянуть предмет
      за год или честно вычеркнуть направление.</div></div>` : ''}

    <div class="pn-res-block">
      <h3>🔢 Математика</h3>
      <div class="lk-card">${mathLine(A.mathScore)}</div>
    </div>

    <div class="pn-res-block">
      <h3>👀 Три способа увидеть своими глазами</h3>
      <p style="font-size:15px;color:var(--lk-muted);line-height:1.5;margin:0 0 12px">
        Единственный честный ответ на «как выбрать то, чего не видел» — пойти и посмотреть.
        Дёшево, быстро, на этой неделе:</p>
      <ol class="pn-steps-list">
        ${probes.length ? probes.map(w => `<li><b>${w.ico} ${esc(w.title.split(':')[0])}.</b> ${esc(w.probe)}</li>`).join('')
          : '<li>Выбери любые два мира из списка и сделай то, что там написано в «как увидеть».</li>'}
      </ol>
    </div>

    ${ro ? '' : `<div class="pn-res-block">
      <h3>📤 Код результата — отдай наставнику</h3>
      <p style="font-size:15px;color:var(--lk-muted);line-height:1.5;margin:0 0 12px">
        Нажми «Скопировать» и отправь этот код в переписку. По нему разбирают ответы целиком.</p>
      <div class="pn-code-box" id="code">${esc(code)}</div>
      <div class="pn-nav">
        <button class="lk-btn" id="cp">Скопировать код</button>
        <button class="lk-btn lk-ghost" id="rs">Пройти заново</button>
      </div>
    </div>`}

    <button class="pn-back" id="bk">← вернуться к вопросам</button>`;

  if (!ro) {
    document.getElementById('cp').onclick = async () => {
      const btn = document.getElementById('cp');
      try { await navigator.clipboard.writeText(code); btn.textContent = 'Скопировано ✓'; }
      catch (e) {
        const r = document.createRange(); r.selectNodeContents(document.getElementById('code'));
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
        btn.textContent = 'Выделено — копируй вручную';
      }
      setTimeout(() => btn.textContent = 'Скопировать код', 2600);
    };
    document.getElementById('rs').onclick = () => {
      if (!confirm('Стереть все ответы и начать заново?')) return;
      localStorage.removeItem(LS); S = blank(); go(0);
    };
  }
  document.getElementById('bk').onclick = back;
}

/* ── режим ?r=КОД: наставник смотрит результат ── */
const urlCode = new URLSearchParams(location.search).get('r');
if (urlCode) {
  try {
    S = Object.assign(blank(), decode(urlCode));
    idx = STEPS.length - 1;
    save(); chrome();
    app.innerHTML = '';
    rFinish(null, true);
    app.insertAdjacentHTML('afterbegin',
      '<div class="pn-warn" style="margin-bottom:18px">Режим просмотра: результат, открытый по коду.</div>');
  } catch (e) { go(0); }
} else {
  go(0);
}
