/* DenTemp — minimal client JS */
(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobileNav.classList.toggle('open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      })
    );
  }

  /* ---------- Tabs (How it works) ---------- */
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const buttons = group.querySelectorAll('[role="tab"]');
    const panels = group.querySelectorAll('[role="tabpanel"]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('aria-controls');
        buttons.forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
        panels.forEach((p) => p.classList.toggle('active', p.id === target));
      });
    });
  });

  /* ---------- Stat counter on view ---------- */
  const stats = document.querySelectorAll('[data-count]');
  if (stats.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 1400;
          const start = performance.now();
          function step(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const value = target * eased;
            el.textContent =
              (value >= 1000 ? Math.round(value).toLocaleString() : value.toFixed(target < 10 ? 1 : 0)) + suffix;
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = (target >= 1000 ? target.toLocaleString() : target) + suffix;
          }
          requestAnimationFrame(step);
          obs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    stats.forEach((s) => obs.observe(s));
  }

  /* ---------- Contact form ---------- */
  const form = document.querySelector('#contact-form');
  if (form) {
    const success = form.querySelector('.form-success');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach((field) => {
        const wrap = field.closest('.field');
        const err = wrap?.querySelector('.field-error');
        let fieldValid = field.value.trim().length > 0;
        if (field.type === 'email' && fieldValid) {
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        wrap?.classList.toggle('error', !fieldValid);
        if (!fieldValid) {
          valid = false;
          if (err && field.type === 'email' && field.value.trim()) {
            err.textContent = 'Please enter a valid email address.';
          } else if (err) {
            err.textContent = 'This field is required.';
          }
        }
      });
      if (valid) {
        success?.classList.add('visible');
        form.reset();
        success?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => success?.classList.remove('visible'), 6000);
      }
    });
    form.querySelectorAll('input, select, textarea').forEach((f) => {
      f.addEventListener('input', () => f.closest('.field')?.classList.remove('error'));
    });
  }

  /* ---------- Year in footer ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
})();
