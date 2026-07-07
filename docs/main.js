const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealTargets = document.querySelectorAll('.reveal, .reveal-section');
const terminalShell = document.querySelector('[data-terminal]');
const terminalPhases = Array.from(document.querySelectorAll('.terminal-phase'));
const copyButton = document.getElementById('copy-button');
const copyTooltip = document.getElementById('copy-tooltip');
const copyLabel = document.getElementById('copy-label');
const installCode = document.getElementById('install-code');
const heroDots = document.getElementById('hero-dots');

if (heroDots) {
  for (let i = 0; i < 54; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'hero-dot';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.opacity = `${0.04 + Math.random() * 0.04}`;
    dot.style.setProperty('--duration', `${16 + Math.random() * 12}s`);
    dot.style.animationDelay = `${-Math.random() * 20}s`;
    heroDots.appendChild(dot);
  }
}

const setRevealVisible = (entry) => {
  entry.target.classList.add('is-visible');
};

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setRevealVisible(entry);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}

const typewriterText = 'cd ../myapp-feature-login';
let phaseTimer = null;
let loopTimer = null;
let typingTimer = null;
let loopRunning = false;
let inView = false;

const phase2 = terminalPhases[1];
const commandLine = phase2 ? phase2.querySelector('[data-typewriter]') : null;
const responseLine = phase2 ? phase2.querySelector('[data-response]') : null;

const clearTimers = () => {
  [phaseTimer, loopTimer, typingTimer].forEach((timer) => {
    if (timer) {
      clearTimeout(timer);
    }
  });
  phaseTimer = null;
  loopTimer = null;
  typingTimer = null;
};

const setActivePhase = (index) => {
  terminalPhases.forEach((phase, phaseIndex) => {
    phase.classList.toggle('is-active', phaseIndex === index);
    phase.classList.toggle('is-dimmed', phaseIndex === 4);
  });
};

const resetTerminal = () => {
  clearTimers();
  if (commandLine) {
    commandLine.textContent = '';
  }
  if (responseLine) {
    responseLine.classList.remove('is-visible');
  }
  setActivePhase(0);
};

const runTypingPhase = () => {
  if (!commandLine || !responseLine) {
    return;
  }

  let index = 0;
  commandLine.textContent = '';
  responseLine.classList.remove('is-visible');

  const typeNext = () => {
    if (!inView || !loopRunning) {
      return;
    }

    if (index <= typewriterText.length) {
      commandLine.textContent = typewriterText.slice(0, index);
      index += 1;
      typingTimer = window.setTimeout(typeNext, 60);
    } else {
      typingTimer = window.setTimeout(() => {
        responseLine.classList.add('is-visible');
      }, 300);
    }
  };

  typeNext();
};

const schedulePhase = (index, delay) => {
  phaseTimer = window.setTimeout(() => {
    if (!inView || !loopRunning) {
      return;
    }

    setActivePhase(index);

    if (index === 1) {
      runTypingPhase();
    }

    if (index === 0) {
      resetTerminal();
    }

    if (index < 4) {
      const nextDelay = [3000, 4000, 3000, 4000][index] ?? 2000;
      schedulePhase(index + 1, nextDelay);
    } else {
      loopTimer = window.setTimeout(() => {
        if (!inView || !loopRunning) {
          return;
        }
        resetTerminal();
        schedulePhase(0, 0);
      }, 2000);
    }
  }, delay);
};

const startLoop = () => {
  if (prefersReducedMotion) {
    resetTerminal();
    setActivePhase(3);
    return;
  }

  if (loopRunning) {
    return;
  }

  loopRunning = true;
  resetTerminal();
  schedulePhase(0, 0);
};

const stopLoop = () => {
  loopRunning = false;
  clearTimers();
};

if (terminalShell && 'IntersectionObserver' in window) {
  const terminalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          inView = true;
          startLoop();
        } else {
          inView = false;
          stopLoop();
        }
      });
    },
    { threshold: 0.35 }
  );

  terminalObserver.observe(terminalShell);
} else {
  inView = true;
  startLoop();
}

if (copyButton && installCode) {
  let copyResetTimer = null;

  copyButton.addEventListener('click', async () => {
    const text = installCode.textContent || '';

    try {
      await navigator.clipboard.writeText(text);
      copyTooltip.classList.add('is-visible');
      if (copyLabel) {
        copyLabel.textContent = 'Copied!';
      }
      window.clearTimeout(copyResetTimer);
      copyResetTimer = window.setTimeout(() => {
        if (copyLabel) {
          copyLabel.textContent = 'Copy';
        }
        copyTooltip.classList.remove('is-visible');
      }, 2000);
    } catch (error) {
      if (copyLabel) {
        copyLabel.textContent = 'Copy failed';
      }
      window.clearTimeout(copyResetTimer);
      copyResetTimer = window.setTimeout(() => {
        if (copyLabel) {
          copyLabel.textContent = 'Copy';
        }
      }, 2000);
    }
  });
}
