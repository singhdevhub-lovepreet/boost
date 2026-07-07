const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const terminal = document.querySelector('[data-terminal]');
const terminalBody = document.querySelector('.terminal-body');
const terminalCaption = document.querySelector('[data-terminal-caption]');
const copyButton = document.getElementById('copy-button');
const copyLabel = document.getElementById('copy-label');
const copyTooltip = document.getElementById('copy-tooltip');
const installCode = document.getElementById('install-code');
const dotGrid = document.getElementById('dot-grid');
const revealTargets = document.querySelectorAll('.reveal');
const terminalStateDurations = { a: 3500, b: 3500 };
let terminalTimer = null;
let terminalRunning = false;
let terminalVisible = false;
let copyResetTimer = null;

if (dotGrid) {
  for (let i = 0; i < 52; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.opacity = `${0.04 + Math.random() * 0.05}`;
    dot.style.setProperty('--dur', `${18 + Math.random() * 16}s`);
    dot.style.animationDelay = `${-Math.random() * 20}s`;
    dotGrid.appendChild(dot);
  }
}

const setVisible = (entry) => entry.target.classList.add('is-visible');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setVisible(entry);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}

const clearTerminalTimer = () => {
  if (terminalTimer) {
    clearTimeout(terminalTimer);
    terminalTimer = null;
  }
};

const applyTerminalState = (state) => {
  if (!terminalBody) return;
  terminalBody.dataset.terminalState = state;
  if (terminalCaption) {
    terminalCaption.textContent = state === 'a'
      ? 'Three panes, three branches — no organization.'
      : 'Same branch → panes link into one column. Others stay separate.';
  }
};

const scheduleTerminal = (state) => {
  clearTerminalTimer();
  applyTerminalState(state);
  if (!terminalRunning || prefersReducedMotion || !terminalVisible) return;
  const nextState = state === 'a' ? 'b' : 'a';
  terminalTimer = window.setTimeout(() => scheduleTerminal(nextState), terminalStateDurations[state]);
};

const startTerminal = () => {
  if (terminalRunning) return;
  terminalRunning = true;
  clearTerminalTimer();
  if (prefersReducedMotion) {
    applyTerminalState('b');
    return;
  }
  scheduleTerminal('a');
};

const stopTerminal = () => {
  terminalRunning = false;
  clearTerminalTimer();
};

if (terminal && 'IntersectionObserver' in window) {
  const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        terminalVisible = true;
        startTerminal();
      } else {
        terminalVisible = false;
        stopTerminal();
      }
    });
  }, { threshold: 0.35 });

  terminalObserver.observe(terminal);
} else {
  terminalVisible = true;
  startTerminal();
}

if (copyButton && installCode) {
  copyButton.addEventListener('click', async () => {
    const text = installCode.textContent || '';

    try {
      await navigator.clipboard.writeText(text);
      if (copyLabel) copyLabel.textContent = 'Copied!';
      if (copyTooltip) copyTooltip.classList.add('is-visible');
      window.clearTimeout(copyResetTimer);
      copyResetTimer = window.setTimeout(() => {
        if (copyLabel) copyLabel.textContent = 'Copy';
        if (copyTooltip) copyTooltip.classList.remove('is-visible');
      }, 2000);
    } catch (error) {
      if (copyLabel) copyLabel.textContent = 'Copy failed';
      window.clearTimeout(copyResetTimer);
      copyResetTimer = window.setTimeout(() => {
        if (copyLabel) copyLabel.textContent = 'Copy';
      }, 2000);
    }
  });
}
