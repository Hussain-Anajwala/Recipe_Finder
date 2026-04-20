/**
 * Minimal toast utility — no external library needed.
 * Injects toasts into a #toast-root container at the bottom of the page.
 */

const CONTAINER_ID = 'savour-toasts';

function getContainer() {
  let el = document.getElementById(CONTAINER_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = CONTAINER_ID;
    el.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(el);
  }
  return el;
}

function show(message, type = 'info') {
  const container = getContainer();

  const colors = {
    success: { bg: '#1e4620', text: '#fff', icon: '✓' },
    error:   { bg: '#7f1d1d', text: '#fff', icon: '✕' },
    info:    { bg: '#1e293b', text: '#fff', icon: 'ℹ' },
  };
  const { bg, text, icon } = colors[type] || colors.info;

  const el = document.createElement('div');
  el.style.cssText = `
    background: ${bg};
    color: ${text};
    padding: 12px 18px;
    border-radius: 2px;
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    letter-spacing: 0.03em;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 240px;
    max-width: 380px;
    pointer-events: auto;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.2s ease, transform 0.2s ease;
    box-shadow: 0 4px 24px rgba(0,0,0,0.25);
  `;
  el.innerHTML = `<span style="font-size:15px;flex-shrink:0">${icon}</span><span>${message}</span>`;
  container.appendChild(el);

  // Animate in
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });

  // Auto-remove after 4s
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 250);
  }, 4000);
}

export const toast = {
  success: (msg) => show(msg, 'success'),
  error:   (msg) => show(msg, 'error'),
  info:    (msg) => show(msg, 'info'),
};
