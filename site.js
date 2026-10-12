// === download logic + toast ===
const GH_USER = '6larping7';
const GH_REPO = 'aurora';
const AURORA_URL = `https://github.com/${GH_USER}/${GH_REPO}/releases/latest/download/aurora.zip`;
const EMULATOR_URL = `https://github.com/${GH_USER}/${GH_REPO}/releases/latest/download/emulator.zip`;

const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function download(url, label, sizeHint) {
  showToast(`${label} • ${sizeHint} • starting download...`);
  // actually trigger the browser download
  const a = document.createElement('a');
  a.href = url;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

document.getElementById('dl-aurora').addEventListener('click', () => {
  download(AURORA_URL, 'aurora.zip', '~48MB');
});
document.getElementById('dl-emulator').addEventListener('click', () => {
  download(EMULATOR_URL, 'emulator.zip', '~520MB');
});

// === live download counter from github api ===
(async () => {
  try {
    const r = await fetch(`https://api.github.com/repos/${GH_USER}/${GH_REPO}/releases/latest`);
    if (!r.ok) return;
    const j = await r.json();
    const total = (j.assets || []).reduce((n, a) => n + (a.download_count || 0), 0);
    if (total > 0) {
      document.getElementById('dl-count').textContent = total.toLocaleString();
    }
  } catch (e) { /* offline, keep placeholder */ }
})();

// === modals (info + buy) ===
function wireModal(modalId, triggerId) {
  const m = document.getElementById(modalId);
  const t = document.getElementById(triggerId);
  if (!m || !t) return;
  const open = () => { m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); };
  const close = () => { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); };
  t.addEventListener('click', open);
  m.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}
wireModal('info-modal', 'btn-info');
wireModal('buy-modal', 'btn-buy');

// === copy-to-clipboard buttons inside buy modal ===
document.querySelectorAll('.pay-copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.getAttribute('data-copy');
    const el = document.getElementById(id);
    if (!el) return;
    try {
      await navigator.clipboard.writeText(el.textContent.trim());
      const prev = btn.textContent;
      btn.textContent = 'copied';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = prev; btn.classList.remove('copied'); }, 1600);
    } catch { showToast('clipboard blocked — select + copy manually'); }
  });
});

// === topnav shrink on scroll ===
const nav = document.querySelector('.topnav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) nav.style.padding = '12px 36px';
  else nav.style.padding = '18px 36px';
}, { passive: true });
