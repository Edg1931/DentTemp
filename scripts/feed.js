/* DenTemp — community feed interactivity (mock, client-only) */
(function () {
  'use strict';

  /* Char counter */
  const ta = document.getElementById('composer-text');
  const cc = document.getElementById('char-count');
  if (ta && cc) {
    const update = () => {
      const remaining = 280 - ta.value.length;
      cc.textContent = remaining;
      cc.classList.toggle('warn', remaining < 20);
    };
    ta.addEventListener('input', update);
    update();
  }

  /* Compose -> prepend to feed */
  const composer = document.getElementById('composer');
  const feed = document.getElementById('feed');
  if (composer && feed) {
    composer.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = ta.value.trim();
      if (!text) return;
      const card = document.createElement('article');
      card.className = 'feed-card';
      card.dataset.type = 'POST_CREATED';
      card.innerHTML = `
        <div class="feed-card-head">
          <div class="feed-avatar is-online" aria-hidden="true"></div>
          <div class="feed-meta">
            <strong>You</strong><span class="badge">RDH</span><span class="timestamp">· just now</span>
            <div class="subtitle">Your post · visible to the community</div>
          </div>
          <span class="activity-tag t-post">Post</span>
        </div>
        <p class="feed-body"></p>
        <div class="feed-actions">
          <button class="feed-action" data-action="heart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><span>0</span></button>
          <button class="feed-action" data-action="comment"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>0</span></button>
          <button class="feed-action" data-action="share"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg><span>Share</span></button>
          <button class="feed-action" data-action="save"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
        </div>`;
      card.querySelector('.feed-body').textContent = text;
      feed.prepend(card);
      ta.value = '';
      ta.dispatchEvent(new Event('input'));
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      bindActions(card);
    });
  }

  /* Filter tabs */
  document.querySelectorAll('.filter-tabs button').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tabs button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.feed-card').forEach((card) => {
        card.style.display =
          filter === 'all' || filter === 'following' || card.dataset.type === filter ? '' : 'none';
      });
    });
  });

  /* Heart / save state — persisted in localStorage */
  function bindActions(scope = document) {
    scope.querySelectorAll('.feed-action[data-action]').forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'heart') {
          btn.classList.toggle('hearted');
          const counter = btn.querySelector('span');
          if (counter && /^\d+$/.test(counter.textContent)) {
            const n = parseInt(counter.textContent, 10);
            counter.textContent = btn.classList.contains('hearted') ? n + 1 : Math.max(0, n - 1);
          }
        } else if (action === 'save') {
          btn.classList.toggle('hearted');
        }
      });
    });
  }
  bindActions();

  /* "New posts" pill — simulated real-time after 8s */
  const pill = document.getElementById('new-pill');
  if (pill) {
    setTimeout(() => pill.classList.add('visible'), 8000);
    pill.querySelector('button')?.addEventListener('click', () => {
      pill.classList.remove('visible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
