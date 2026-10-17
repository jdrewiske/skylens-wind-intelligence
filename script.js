const form = document.querySelector('#waitlist-form');
const emailInput = document.querySelector('#email');
const message = document.querySelector('#form-message');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav nav');
const dialog = document.querySelector('#demo-dialog');
document.querySelector('#year').textContent = new Date().getFullYear();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();
  if (!emailInput.checkValidity() || !email) { message.textContent = 'Please enter a valid email address.'; message.classList.add('error'); emailInput.focus(); return; }
  message.classList.remove('error');
  message.textContent = `Thanks — ${email} is ready for the waitlist! This demo doesn't send or store signups yet.`;
  form.querySelector('button[type="submit"]').textContent = 'You’re on the demo list ✓';
});
menuToggle.addEventListener('click', () => { const isOpen = nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(isOpen)); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); }));

const demoData = {
  golf: {symbol:'↗', value:'Wind 8 mph · NE', detail:'Gusts 13 mph · Crosswind cue', title:'Golf: read the breeze', description:'Watch the animated wind vectors sweep across the course view. This is a concept for understanding wind direction and gusts before a shot; it does not recommend a club or guarantee ball flight.', speed:8, direction:35, gust:13},
  tennis: {symbol:'≋', value:'Crosswind · 8 mph', detail:'Gusts increasing · Court view', title:'Tennis: stay aware of crosswinds', description:'A quick, glanceable concept for wind direction and gust variability during practice or match play.', speed:8, direction:115, gust:12},
  outdoors: {symbol:'◎', value:'Wind 11 mph · W', detail:'Gusts 17 mph · Conditions changing', title:'Outdoor athletes: adapt on the move', description:'A concept view for runners, cyclists, and other outdoor athletes who want to keep wind conditions in context.', speed:11, direction:250, gust:17}
};
let currentMode = 'golf';
function setMode(mode) {
  currentMode = demoData[mode] ? mode : 'golf'; const data = demoData[currentMode];
  document.querySelector('#preview-symbol').textContent = data.symbol;
  document.querySelector('#preview-value').textContent = data.value;
  document.querySelector('#preview-detail').textContent = data.detail;
  document.querySelector('#modal-title').textContent = data.title;
  document.querySelector('#modal-description').textContent = data.description;
  document.querySelectorAll('.preview-tabs button').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === currentMode));
  document.querySelector('#stage-wind-value').textContent = `${data.symbol} ${data.speed} mph · ${currentMode === 'golf' ? 'NE' : currentMode === 'tennis' ? 'SE' : 'W'}`;
  document.querySelector('#stage-wind-detail').textContent = `Gusts ${data.gust} mph · illustrative`;
  document.querySelector('#wind-mode-cycle').textContent = `${currentMode === 'golf' ? 'Golf' : currentMode === 'tennis' ? 'Tennis' : 'Outdoor'} view ▾`;
  mainFlow.setWind(data.direction, data.speed); modalFlow.setWind(data.direction, data.speed);
}
document.querySelectorAll('.preview-tabs button').forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));

function makeWindFlow(canvas, initialDirection = 35) {
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, raf = 0, running = true, vectors = true, phase = 0;
  let direction = initialDirection, speed = 8, particles = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Sparse, long horizontal streamlines — never fill the scene with a blue haze.
    particles = Array.from({ length: Math.max(8, Math.round(width * height / 19000)) }, (_, i) => ({
      x: Math.random() * width, y: 28 + Math.random() * Math.max(1, height - 56),
      length: 115 + Math.random() * 115, phase: Math.random() * Math.PI * 2,
      row: i
    }));
    drawStill();
  }

  function drawArrow(x, y, len, alpha, wobble = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(wobble); ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#f0f8ff'; ctx.fillStyle = '#f0f8ff'; ctx.lineWidth = 1.65; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(len, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(len - 9, -4.5); ctx.lineTo(len, 0); ctx.lineTo(len - 9, 4.5); ctx.stroke();
    ctx.restore();
  }

  function render(animate) {
    ctx.clearRect(0, 0, width, height);
    if (!vectors) return;
    const drift = animate ? phase : 0;
    particles.forEach((p, i) => {
      const span = width + p.length + 30;
      const x = ((p.x + drift * (24 + speed * 1.7)) % span) - p.length;
      const y = p.y + (animate ? Math.sin(drift * .7 + p.phase) * 3 : 0);
      const len = p.length;
      // Fine, tapered-looking trail with a clear arrowhead at its leading edge.
      const grad = ctx.createLinearGradient(x, y, x + len, y);
      grad.addColorStop(0, 'rgba(240,248,255,0)');
      grad.addColorStop(.35, 'rgba(240,248,255,.36)');
      grad.addColorStop(1, 'rgba(240,248,255,.82)');
      ctx.strokeStyle = grad; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y); ctx.stroke();
      if (i % 2 === 0) drawArrow(x + len - 15, y, 15, .9, animate ? Math.sin(drift + p.phase) * .012 : 0);
    });
  }
  function drawStill() { render(false); }
  function frame() {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    phase += .014 + speed * .0005;
    render(true);
  }
  resize(); frame();
  return {
    setWind(d, s) { direction = d; speed = s; },
    toggleRun() { running = !running; if (running) render(true); return running; },
    toggleVectors() { vectors = !vectors; render(running); return vectors; },
    isRunning() { return running; },
    resize, refresh() { resize(); render(running); }
  };
}
const mainFlow=makeWindFlow(document.querySelector('#wind-canvas'));
const modalFlow=makeWindFlow(document.querySelector('#modal-wind-canvas'));
window.addEventListener('resize',()=>{mainFlow.resize();modalFlow.resize();});
document.querySelector('#wind-play-toggle').addEventListener('click',e=>{const on=mainFlow.toggleRun();e.currentTarget.textContent=on?'Ⅱ Pause flow':'▶ Resume flow';e.currentTarget.setAttribute('aria-pressed',String(on));e.currentTarget.setAttribute('aria-label',on?'Pause wind animation':'Resume wind animation');});
document.querySelector('#wind-vector-toggle').addEventListener('click',e=>{const on=mainFlow.toggleVectors();e.currentTarget.textContent=on?'↗ Vectors on':'↗ Vectors off';e.currentTarget.setAttribute('aria-pressed',String(on));});
document.querySelector('#wind-mode-cycle').addEventListener('click',()=>{const modes=['golf','tennis','outdoors'];setMode(modes[(modes.indexOf(currentMode)+1)%modes.length]);});

function openDemo(mode='golf'){setMode(mode);if(!dialog.open)dialog.showModal();requestAnimationFrame(()=>modalFlow.refresh());}
document.querySelector('#play-demo').addEventListener('click',()=>openDemo(currentMode));
document.querySelector('#open-demo').addEventListener('click',()=>openDemo('golf'));
document.querySelector('#close-demo').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
document.querySelectorAll('.gallery-card').forEach((card,index)=>card.addEventListener('click',()=>openDemo(['golf','tennis','outdoors'][index])));
