/* VAULT RESERVED — interactions
   No dependencies. Every feature degrades to plain links without JS. */
(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canDialog = typeof HTMLDialogElement === 'function' && 'showModal' in HTMLDialogElement.prototype;

  /* ---------- Year ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Scroll lock shared by dialogs ---------- */
  let locks = 0;
  const lock = () => { locks += 1; root.classList.add('is-locked'); };
  const unlock = () => { locks = Math.max(0, locks - 1); if (!locks) root.classList.remove('is-locked'); };

  /* ---------- Nav: solid after hero top, active section ---------- */
  const nav = $('#nav');
  const onScroll = () => { nav.classList.toggle('is-solid', window.scrollY > 24); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const navLinks = $$('.nav__links a');
  const linkFor = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.removeAttribute('aria-current'));
        const link = linkFor.get(entry.target.id);
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', ...linkFor.keys()].forEach((id) => { const el = document.getElementById(id); if (el) sectionObserver.observe(el); });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Mobile menu ---------- */
  const menu = $('#menu');
  const menuOpenBtn = $('[data-menu-open]');
  if (menu && canDialog) {
    menuOpenBtn.addEventListener('click', () => {
      menu.showModal();
      menuOpenBtn.setAttribute('aria-expanded', 'true');
      lock();
    });
    menu.addEventListener('close', () => {
      menuOpenBtn.setAttribute('aria-expanded', 'false');
      unlock();
    });
    $('[data-menu-close]', menu).addEventListener('click', () => menu.close());
    $$('[data-menu-link]', menu).forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        menu.close();
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
          history.replaceState(null, '', '#' + id);
        });
      });
    });
  } else if (menuOpenBtn) {
    // No <dialog> support: jump to the visit section, which holds every link.
    menuOpenBtn.addEventListener('click', () => { location.hash = '#ziyaret'; });
  }

  /* ---------- Reservation dialog (official Check&Place form) ---------- */
  const rsv = $('#rsv');
  const frameBox = $('#rsv-frame');
  const msg = $('[data-rsv-msg]');
  const firstReserve = $('[data-reserve]');
  const RSV_URL = firstReserve ? firstReserve.href : '';
  const HASH = '#rezervasyon-formu';
  let iframe = null;
  let slowTimer = 0;

  const ensureFrame = () => {
    if (iframe || !frameBox || !RSV_URL) return;
    iframe = document.createElement('iframe');
    iframe.title = 'Vault Reserved rezervasyon formu';
    iframe.src = RSV_URL;
    iframe.addEventListener('load', () => {
      clearTimeout(slowTimer);
      frameBox.classList.add('is-loaded');
    });
    slowTimer = window.setTimeout(() => {
      if (frameBox.classList.contains('is-loaded')) return;
      frameBox.classList.add('is-slow');
      msg.textContent = 'Form beklenenden uzun sürüyor. Yeni sekmede açabilirsiniz.';
    }, 9000);
    frameBox.appendChild(iframe);
  };

  const openRsv = (push = true) => {
    if (!rsv || rsv.open) return;
    ensureFrame();
    rsv.showModal();
    lock();
    if (push) history.pushState({ rsv: true }, '', HASH);
  };

  const closeRsv = () => {
    if (!rsv || !rsv.open) return;
    if (history.state && history.state.rsv) history.back(); // popstate closes it
    else rsv.close();
  };

  if (rsv && canDialog) {
    $$('[data-reserve]').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return; // let "open in new tab" work
        e.preventDefault();
        if (menu && menu.open) menu.close();
        openRsv();
      });
      // Warm the form up on intent so it is ready when the dialog opens.
      el.addEventListener('pointerenter', ensureFrame, { once: true, passive: true });
      el.addEventListener('touchstart', ensureFrame, { once: true, passive: true });
    });

    $('[data-rsv-close]', rsv).addEventListener('click', closeRsv);
    rsv.addEventListener('click', (e) => { if (e.target === rsv) closeRsv(); }); // backdrop
    rsv.addEventListener('cancel', (e) => { e.preventDefault(); closeRsv(); }); // Esc
    rsv.addEventListener('close', () => {
      unlock();
      if (location.hash === HASH) history.replaceState(null, '', location.pathname + location.search);
    });
    window.addEventListener('popstate', () => { if (rsv.open) rsv.close(); });

    // Deep link: /#rezervasyon-formu opens the form directly (e.g. from the Instagram bio).
    if (location.hash === HASH) openRsv(false);
  }

  /* ---------- Kitchen & Bar index (desktop stage) ---------- */
  const chapters = $$('[data-chapter]');
  const stages = $$('[data-stage]');
  const desktop = window.matchMedia('(min-width: 1024px)');
  const setChapter = (i) => {
    chapters.forEach((c) => c.classList.toggle('is-active', c.dataset.chapter === String(i)));
    stages.forEach((s) => s.classList.toggle('is-active', s.dataset.stage === String(i)));
  };
  chapters.forEach((c) => {
    c.addEventListener('mouseenter', () => { if (desktop.matches) setChapter(c.dataset.chapter); });
  });
  if ('IntersectionObserver' in window) {
    const chapterObserver = new IntersectionObserver((entries) => {
      if (!desktop.matches) return;
      entries.forEach((entry) => { if (entry.isIntersecting) setChapter(entry.target.closest('[data-chapter]').dataset.chapter); });
    }, { rootMargin: '-42% 0px -48% 0px' });
    chapters.forEach((c) => chapterObserver.observe($('.chapter__head', c)));
  }

  /* ---------- Sticky mobile reservation dock ---------- */
  const dock = $('#dock');
  const heroCta = $('#hero-cta');
  if (dock && heroCta && 'IntersectionObserver' in window) {
    const dockLinks = $$('a', dock);
    const setDock = (visible) => {
      dock.classList.toggle('is-visible', visible);
      dock.setAttribute('aria-hidden', visible ? 'false' : 'true');
      dockLinks.forEach((a) => (visible ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1')));
    };
    new IntersectionObserver(([entry]) => {
      setDock(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    }).observe(heroCta);
  }
})();
