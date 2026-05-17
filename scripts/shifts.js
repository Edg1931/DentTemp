/* DenTemp — shift posting + cross-page persistence (client-only) */
(function () {
  'use strict';

  const STORAGE_KEY = 'dentemp_shifts_v1';

  /* ============ Storage ============ */
  function loadShifts() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }
  function saveShifts(shifts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shifts));
  }
  function addShift(data) {
    const shifts = loadShifts();
    const now = new Date();
    const shift = {
      id: 'sft_' + now.getTime(),
      ...data,
      status: 'open',
      offersCount: 0,
      createdAt: now.toISOString(),
      office: {
        name: 'Smile Studio Dental',
        slug: 'smile-studio-dental',
        city: 'Austin, TX',
        initials: 'SS',
        rating: 4.8,
        reviews: 6
      }
    };
    shifts.unshift(shift);
    saveShifts(shifts);
    return shift;
  }

  /* ============ Helpers ============ */
  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  function formatTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'pm' : 'am';
    const h12 = h % 12 || 12;
    return `${h12}${m ? ':' + String(m).padStart(2, '0') : ''}${ampm}`;
  }
  function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
  function shiftLabel(s) {
    if (s.shiftType === 'permanent') return 'Permanent · ' + (s.employmentType || 'full-time');
    if (s.shiftType === 'multi-day') return `${formatDate(s.date)} – ${formatDate(s.endDate || s.date)}`;
    if (s.shiftType === 'same-day') return 'Today';
    return formatDate(s.date);
  }

  /* ============ Toast ============ */
  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = '<span class="check" aria-hidden="true">✓</span><span class="text"></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector('.text').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 5000);
  }

  /* ============ Modal init (dashboard) ============ */
  function initModal() {
    const backdrop = document.getElementById('post-modal');
    if (!backdrop) return;
    const form = backdrop.querySelector('#post-form');
    const openers = document.querySelectorAll('[data-open-post]');
    const closers = backdrop.querySelectorAll('[data-close-modal]');

    function open() {
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => backdrop.querySelector('input, select, textarea')?.focus(), 50);
    }
    function close() {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    openers.forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
    closers.forEach((b) => b.addEventListener('click', close));
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && backdrop.classList.contains('open')) close(); });

    /* Radio cards (visually selected, single selection per group) */
    backdrop.querySelectorAll('.radio-card').forEach((card) => {
      card.addEventListener('click', () => {
        const input = card.querySelector('input');
        if (!input) return;
        backdrop.querySelectorAll(`input[name="${input.name}"]`).forEach((i) =>
          i.closest('.radio-card')?.classList.remove('selected')
        );
        card.classList.add('selected');
        input.checked = true;
        if (input.name === 'shiftType') {
          const endWrap = backdrop.querySelector('[data-end-date]');
          if (endWrap) endWrap.style.display = input.value === 'multi-day' ? '' : 'none';
          const timeWrap = backdrop.querySelector('[data-time-row]');
          if (timeWrap) timeWrap.style.display = input.value === 'permanent' ? 'none' : '';
        }
      });
    });

    /* Chip multi-select */
    backdrop.querySelectorAll('.chip-pick label').forEach((label) => {
      const input = label.querySelector('input');
      label.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT') return;
        e.preventDefault();
        input.checked = !input.checked;
        label.classList.toggle('selected', input.checked);
      });
    });

    /* Bonus amount */
    backdrop.querySelectorAll('.bonus-amounts label').forEach((label) => {
      label.addEventListener('click', (e) => {
        e.preventDefault();
        backdrop.querySelectorAll('.bonus-amounts label').forEach((l) => l.classList.remove('selected'));
        label.classList.add('selected');
        label.querySelector('input').checked = true;
      });
    });

    /* Submit */
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const role = fd.get('role');
      const shiftType = fd.get('shiftType');
      if (!role || !shiftType) {
        showToast('Pick a role and shift type to continue.');
        return;
      }
      const data = {
        role,
        shiftType,
        date: fd.get('date'),
        endDate: fd.get('endDate'),
        startTime: fd.get('startTime'),
        endTime: fd.get('endTime'),
        rateLow: parseInt(fd.get('rateLow') || 0, 10),
        rateHigh: parseInt(fd.get('rateHigh') || 0, 10),
        showUpBonus: parseInt(fd.get('showUpBonus') || 0, 10),
        software: fd.getAll('software'),
        certs: fd.getAll('certs'),
        experience: fd.get('experience'),
        vibes: fd.getAll('vibes'),
        notes: fd.get('notes'),
        favoritesOnly: fd.get('favoritesOnly') === 'on',
        lunchProvided: fd.get('lunchProvided') === 'on'
      };
      const shift = addShift(data);
      close();
      showToast(
        data.favoritesOnly
          ? 'Posted to your Sub-on-Call roster. They\'re being notified now.'
          : `Posted! Notifying verified pros within 25 miles.`
      );
      prependToTable(shift);
      form.reset();
      backdrop
        .querySelectorAll('.radio-card.selected, .chip-pick label.selected, .bonus-amounts label.selected')
        .forEach((el) => el.classList.remove('selected'));
      const endWrap = backdrop.querySelector('[data-end-date]');
      if (endWrap) endWrap.style.display = 'none';
    });

    /* Hide multi-day end-date row by default */
    const endWrap = backdrop.querySelector('[data-end-date]');
    if (endWrap) endWrap.style.display = 'none';
  }

  /* ============ Dashboard table render ============ */
  function prependToTable(shift) {
    const tbody = document.querySelector('#open-shifts-body');
    if (!tbody) return;
    const row = document.createElement('tr');
    row.className = 'just-posted';
    row.style.borderBottom = '1px solid var(--cream-200)';
    row.innerHTML = `
      <td style="padding: 14px 0;">
        <strong>${escape(shift.role)}</strong> · ${escape(shiftLabel(shift))}
        ${shift.showUpBonus > 0 ? `<span class="bonus-badge" title="Show-up bonus">+$${shift.showUpBonus} bonus</span>` : ''}
        <br><span style="color: var(--ink-500); font-size: .85rem;">
          $${shift.rateLow}–$${shift.rateHigh}/hr${shift.software?.length ? ' · ' + escape(shift.software.join(', ')) : ''}
        </span>
      </td>
      <td>${shift.offersCount}</td>
      <td><span style="background:#E6F5F0; color: var(--success); padding:4px 10px; border-radius: var(--r-full); font-size:.78rem; font-weight:600;">Just posted</span></td>
      <td style="text-align: right;"><button class="btn btn-secondary" style="padding: 6px 14px; font-size: .85rem;">Review →</button></td>
    `;
    tbody.prepend(row);
  }

  function renderDashboardTable() {
    const tbody = document.querySelector('#open-shifts-body');
    if (!tbody) return;
    loadShifts()
      .slice()
      .reverse()
      .forEach((shift) => prependToTable(shift));
  }

  function escape(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  }

  /* ============ Jobs board: prepend user-posted shifts ============ */
  function renderJobsBoard() {
    const list = document.querySelector('.jobs-list');
    if (!list) return;
    const shifts = loadShifts();
    if (!shifts.length) return;

    shifts
      .slice()
      .reverse()
      .forEach((s) => {
        if (s.favoritesOnly) return; // private to favorites only
        const card = document.createElement('article');
        card.className = 'job-card just-posted';
        const dateLine =
          s.shiftType === 'same-day'
            ? 'Today'
            : s.shiftType === 'permanent'
            ? 'Permanent'
            : shiftLabel(s);
        const timeLine =
          s.shiftType === 'permanent'
            ? ''
            : s.startTime
            ? `, ${formatTime(s.startTime)}–${formatTime(s.endTime)}`
            : '';
        card.innerHTML = `
          <div class="job-logo">${escape(s.office.initials)}</div>
          <div class="job-info">
            <h3>${escape(s.role)} — ${escape(s.shiftType === 'permanent' ? 'permanent role' : s.shiftType + ' shift')}
              ${s.showUpBonus > 0 ? `<span class="bonus-badge">+$${s.showUpBonus} bonus</span>` : ''}
            </h3>
            <div class="office"><a href="profile-office.html">${escape(s.office.name)}</a> · ${escape(s.office.city)}</div>
            <div class="meta">
              <span>📅 ${escape(dateLine)}${escape(timeLine)}</span>
              <span>★ ${s.office.rating} (${s.office.reviews} reviews)</span>
              ${s.software?.length ? `<span>🦷 ${escape(s.software.join(', '))}</span>` : ''}
            </div>
            <div class="tags">
              <span>Posted ${timeAgo(s.createdAt)}</span>
              ${s.certs?.length ? `<span>${escape(s.certs.join(' · '))}</span>` : ''}
              ${s.vibes?.length ? s.vibes.slice(0, 2).map((v) => `<span>${escape(v)}</span>`).join('') : ''}
            </div>
          </div>
          <div class="job-cta">
            <div class="job-rate">$${s.rateLow}–$${s.rateHigh}<small>/hr</small></div>
            <button class="btn btn-primary">Send offer</button>
          </div>
        `;
        list.prepend(card);
      });
  }

  /* ============ Community feed: prepend SHIFT_POSTED card ============ */
  function renderFeedShifts() {
    const feed = document.getElementById('feed');
    if (!feed) return;
    const shifts = loadShifts();
    if (!shifts.length) return;

    shifts
      .slice()
      .reverse()
      .forEach((s) => {
        if (s.favoritesOnly) return; // not broadcast
        const card = document.createElement('article');
        card.className = 'feed-card just-posted';
        card.dataset.type = 'JOB_POSTED';
        card.innerHTML = `
          <div class="feed-card-head">
            <div class="feed-avatar" aria-hidden="true" style="background:linear-gradient(135deg,var(--gold-500),var(--rose-400)); border-radius: 12px;"></div>
            <div class="feed-meta">
              <strong>${escape(s.office.name)}</strong>
              <span class="badge" style="background:var(--gold-300); color:#3A7C82;">Verified office</span>
              <span class="timestamp">· ${timeAgo(s.createdAt)}</span>
              <div class="subtitle">${escape(s.office.city)} · ★ ${s.office.rating}</div>
            </div>
            <span class="activity-tag t-job">Posted</span>
          </div>
          <p class="feed-body">${escape(s.office.name)} just posted a new <strong>${escape(s.role)} ${escape(s.shiftType === 'permanent' ? 'role' : 'shift')}</strong> in ${escape(s.office.city)}.${s.showUpBonus > 0 ? ` <span class="bonus-badge">+$${s.showUpBonus} show-up bonus</span>` : ''} View their profile to see open positions.</p>
          <div class="feed-actions">
            <button class="feed-action" data-action="heart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><span>0</span></button>
            <a class="feed-action" href="profile-office.html" style="text-decoration:none;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/></svg><span>View office</span></a>
            <a class="feed-action" href="jobs.html" style="text-decoration:none;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg><span>See jobs</span></a>
            <button class="feed-action" data-action="save"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
          </div>
        `;
        feed.prepend(card);
      });
  }

  /* ============ Boot ============ */
  document.addEventListener('DOMContentLoaded', () => {
    initModal();
    renderDashboardTable();
    renderJobsBoard();
    renderFeedShifts();
  });
})();
