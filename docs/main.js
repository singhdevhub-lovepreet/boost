(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Reveal on scroll ──────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ── Terminal animation ────────────────────────────────────────── */
  const terminalEl = document.getElementById('terminal');
  const terminalBody = document.querySelector('.terminal-body');
  const caption = document.getElementById('terminal-caption');
  const typeTarget = document.getElementById('typewriter-target');
  const typewriterCursor = document.getElementById('typewriter-cursor');

  const CAPTIONS = {
    a: 'three panes, three branches \u2014 no organization yet.',
    typing: 'developer switches to the feature branch worktree\u2026',
    b: 'same branch \u2192 same column. color-coded. automatic.'
  };

  const TYPE_CMD = 'cd ../myapp-feature-login';
  const CHAR_DELAY = 55;
  const PAUSE_BEFORE_TYPE = 2000;
  const PAUSE_AFTER_TYPE = 800;
  const STATE_B_HOLD = 4000;
  const FADE_PAUSE = 600;

  let running = false;
  let visible = false;
  let loopTimer = null;

  const wait = (ms) => new Promise((r) => { loopTimer = setTimeout(r, ms); });

  const setCaption = (key) => {
    if (caption) caption.textContent = CAPTIONS[key] || '';
  };

  const setState = (s) => {
    if (terminalBody) terminalBody.dataset.state = s;
  };

  const typewrite = async (text) => {
    if (!typeTarget) return;
    typeTarget.textContent = '';
    if (typewriterCursor) typewriterCursor.style.display = 'inline-block';
    for (let i = 0; i < text.length; i++) {
      if (!running) return;
      typeTarget.textContent += text[i];
      await wait(CHAR_DELAY + Math.random() * 25);
    }
  };

  const clearTypewriter = () => {
    if (typeTarget) typeTarget.textContent = '';
    if (typewriterCursor) typewriterCursor.style.display = 'none';
  };

  const runLoop = async () => {
    while (running && visible) {
      // Phase 1: Show ungrouped state
      setState('a');
      setCaption('a');
      clearTypewriter();
      await wait(PAUSE_BEFORE_TYPE);
      if (!running || !visible) break;

      // Phase 2: Typewriter
      setCaption('typing');
      await typewrite(TYPE_CMD);
      if (!running || !visible) break;
      await wait(PAUSE_AFTER_TYPE);
      if (!running || !visible) break;

      // Phase 3: Transition to grouped
      setState('b');
      setCaption('b');
      clearTypewriter();
      await wait(STATE_B_HOLD);
      if (!running || !visible) break;

      // Phase 4: Brief pause before loop
      await wait(FADE_PAUSE);
    }
  };

  const startTerminal = () => {
    if (running) return;
    running = true;
    if (prefersReducedMotion) {
      setState('b');
      setCaption('b');
      clearTypewriter();
      return;
    }
    runLoop();
  };

  const stopTerminal = () => {
    running = false;
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
  };

  if (terminalEl && 'IntersectionObserver' in window) {
    const termObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible = true;
          startTerminal();
        } else {
          visible = false;
          stopTerminal();
        }
      });
    }, { threshold: 0.3 });
    termObs.observe(terminalEl);
  } else {
    visible = true;
    startTerminal();
  }

  /* ── Copy button ───────────────────────────────────────────────── */
  const copyBtn = document.getElementById('copy-btn');
  const installCode = document.getElementById('install-code');
  let copyTimer = null;

  if (copyBtn && installCode) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(installCode.textContent || '');
        copyBtn.textContent = 'copied';
        copyBtn.classList.add('copied');
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
          copyBtn.textContent = 'copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch {
        copyBtn.textContent = 'failed';
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => { copyBtn.textContent = 'copy'; }, 2000);
      }
    });
  }
})();
