(() => {
  'use strict';
  const profile = window.portfolio;
  const { projects } = profile;
  const $ = selector => document.querySelector(selector);
  const gallery = $('#gallery');
  const info = $('#info-panel');
  const detail = $('#project-dialog');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const name = index => projects[index].displayTitle || `${projects[index].title} ${projects[index].accent}`;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeLink = link => { try { const u = new URL(link); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
  const delay = time => new Promise(resolve => setTimeout(resolve, time));
  let current = 0;
  let busy = false;
  let renderer;
  let pointerStart;
  let suppressClick = false;
  let wheelTotal = 0;
  let wheelTime = 0;
  const rail = $('#project-rail');
  let overview = true;
  let railFrame;
  let dragging;
  let dragged = false;
  let lastOverviewWheel = 0;
  let projectClosing = false;
  let aboutClosing = false;
  let aboutAnimations = [];
  const landing = $('#landing');
  let entered = ['#work', '#about', '#contact'].includes(location.hash);
  let enteringPortfolio = false;
  gallery.inert = !entered;
  landing.hidden = entered;
  document.body.dataset.entry = entered ? 'work' : 'landing';
  document.querySelectorAll('.profile-email').forEach(link => {
    link.textContent = profile.email;
    link.href = `mailto:${profile.email}`;
  });
  $('.skip-link').href = entered ? '#work-open' : '#enter-work';

  $('#enter-work').addEventListener('click', async () => {
    if (entered || enteringPortfolio) return;
    enteringPortfolio = true;
    document.body.dataset.entry = 'entering';
    landing.inert = true;
    const animations = reduced ? [] : [
      landing.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' }),
      gallery.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' })
    ];
    try {
      await Promise.all(animations.map(animation => animation.finished));
    } finally {
      landing.hidden = true;
      entered = true;
      enteringPortfolio = false;
      document.body.dataset.entry = 'work';
      gallery.inert = false;
      animations.forEach(animation => animation.cancel());
      history.replaceState(null, '', '#work');
      $('.skip-link').href = '#work-open';
      $('#work-open').focus({ preventScroll: true });
    }
  });

  $('#page-numbers').innerHTML = projects.map((_, i) => `<span>${i + 1}</span>`).join('');
  $('#project-total').textContent = projects.length;
  $('#thumbnails').innerHTML = projects.map((p, i) => `<button class="thumbnail" data-project="${i}" aria-label="Show ${escape(name(i))}" aria-current="${i === 0}"><img src="${escape(p.image)}" alt=""></button>`).join('');
  rail.innerHTML = projects.map((p, i) => `<button class="rail-card" data-project="${i}" aria-label="View ${escape(name(i))} in fullscreen" aria-current="${i === 0}"><img src="${escape(p.image)}" alt="" draggable="false"><span class="sr-only">${escape(name(i))}</span></button>`).join('');

  function centerCard(index, smooth = true) {
    const card = rail.children[index];
    rail.scrollTo({ left: card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2, behavior: smooth && !reduced ? 'smooth' : 'instant' });
  }

  rail.addEventListener('scroll', () => {
    if (railFrame || !overview || busy) return;
    railFrame = requestAnimationFrame(() => {
      railFrame = null;
      const center = rail.scrollLeft + rail.clientWidth / 2;
      const closest = [...rail.children].reduce((best, card, i) => Math.abs(card.offsetLeft + card.offsetWidth / 2 - center) < Math.abs(rail.children[best].offsetLeft + rail.children[best].offsetWidth / 2 - center) ? i : best, 0);
      if (closest !== current) { current = closest; updateLabels(); }
    });
  }, { passive: true });

  function updateViewControls() {
    gallery.dataset.view = overview ? 'overview' : 'fullscreen';
    $('#overview').inert = !overview;
    $('#project-open').inert = overview;
    $('#thumbnails').inert = overview;
    $('#previous').inert = overview;
    $('#next').inert = overview;
    $('#mode-toggle').setAttribute('aria-pressed', String(!overview));
    $('#mode-toggle').setAttribute('aria-label', overview ? 'Switch to fullscreen view' : 'Switch to gallery overview');
    $('#mode-toggle').innerHTML = overview ? 'Fullscreen <span aria-hidden="true">↗</span>' : 'Overview <span aria-hidden="true">⊞</span>';
  }

  async function switchView(toOverview, focusTarget = true) {
    if (busy || overview === toOverview || info.open || detail.open) return;
    busy = true;
    const card = rail.children[current];
    if (!toOverview) {
      if (renderer?.gl.isContextLost()) renderer = null;
      if (renderer) renderer.jump(current);
      $('#hero-image').src = projects[current].image;
    } else centerCard(current, false);
    const rect = card.getBoundingClientRect();
    const clone = document.createElement('img');
    clone.src = projects[current].image;
    clone.alt = '';
    clone.className = 'view-transition-image';
    const small = { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` };
    const large = { left: '0px', top: '0px', width: `${innerWidth}px`, height: `${innerHeight}px` };
    const from = toOverview ? large : small;
    const to = toOverview ? small : large;
    Object.assign(clone.style, from);
    // The expanding image owns the visual until it reaches its destination.
    // Keep both its source card and the fullscreen copy out of that frame.
    gallery.classList.add('view-changing');
    card.classList.add('morph-source');
    gallery.append(clone);
    overview = toOverview;
    updateViewControls();
    let animation;
    try {
      if (!reduced) {
        animation = clone.animate([from, to], { duration: 850, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'both' });
        await animation.finished;
      }
    } finally {
      gallery.classList.remove('view-changing');
      card.classList.remove('morph-source');
      clone.remove();
      animation?.cancel();
      busy = false;
    }
    if (focusTarget) (overview ? card : $('#project-open')).focus({ preventScroll: true });
  }

  $('#mode-toggle').addEventListener('click', () => switchView(!overview, false));
  $('#work-open').addEventListener('click', event => { event.preventDefault(); switchView(true); });
  rail.addEventListener('click', event => {
    const card = event.target.closest('.rail-card');
    if (!card || dragged || busy) return;
    current = Number(card.dataset.project); updateLabels(); switchView(false);
  });
  rail.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    dragging = { x: event.clientX, scroll: rail.scrollLeft };
    dragged = false;
  });
  rail.addEventListener('pointermove', event => {
    if (!dragging) return;
    const distance = event.clientX - dragging.x;
    if (Math.abs(distance) > 5) {
      dragged = true; rail.classList.add('dragging');
      rail.setPointerCapture(event.pointerId);
      rail.scrollLeft = dragging.scroll - distance;
    }
  });
  const stopDrag = () => {
    dragging = null; rail.classList.remove('dragging');
    if (dragged) { centerCard(current); setTimeout(() => { dragged = false; }, 100); }
  };
  rail.addEventListener('pointerup', stopDrag);
  rail.addEventListener('pointercancel', stopDrag);
  rail.addEventListener('focusin', event => {
    const card = event.target.closest('.rail-card');
    if (card && !busy && !dragging) centerCard(Number(card.dataset.project));
  });
  let resizeFrame;
  addEventListener('resize', () => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(() => centerCard(current, false)); });

  function updateLabels() {
    $('#project-title').textContent = name(current);
    $('#project-open').setAttribute('aria-label', `Open ${name(current)} project`);
    $('#project-announcement').textContent = `Project ${current + 1} of ${projects.length}: ${name(current)}`;
    $('#page-numbers').style.transform = `translateY(${-current * 20}px)`;
    document.querySelectorAll('.thumbnail').forEach((button, i) => button.setAttribute('aria-current', String(i === current)));
    const thumbnails = $('#thumbnails');
    const activeThumbnail = thumbnails.children[current];
    thumbnails.scrollTo({ left: activeThumbnail.offsetLeft - (thumbnails.clientWidth - activeThumbnail.offsetWidth) / 2, behavior: reduced ? 'instant' : 'smooth' });
    document.querySelectorAll('.rail-card').forEach((button, i) => button.setAttribute('aria-current', String(i === current)));
  }

  async function fallbackTransition(index, direction) {
    const incoming = $('#incoming-image');
    const old = $('#hero-image');
    incoming.src = projects[index].image;
    try { await incoming.decode(); } catch { /* The currently visible image remains available. */ }
    if (reduced) { old.src = projects[index].image; return; }
    incoming.style.opacity = '1';
    const animation = incoming.animate([
      { clipPath: direction > 0 ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)', transform: `scale(1.13) translateY(${direction * 5}%)` },
      { clipPath: 'inset(0 0 0 0)', transform: 'scale(1.03) translateY(0)' }
    ], { duration: 1100, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });
    const departing = old.animate([{ transform: 'scale(1.03)' }, { transform: `scale(1.09) translateY(${-direction * 5}%)` }], { duration: 1100, easing: 'cubic-bezier(.76,0,.24,1)' });
    await animation.finished;
    old.src = incoming.src;
    try { await old.decode(); } catch { /* Keep the incoming image until source assignment completes. */ }
    incoming.style.opacity = '0';
    animation.cancel(); departing.cancel();
  }

  async function select(index, direction) {
    index = (index + projects.length) % projects.length;
    if (busy || index === current || info.open || detail.open) return;
    if (overview) { current = index; updateLabels(); centerCard(index); return; }
    busy = true;
    direction ??= index > current ? 1 : -1;
    gallery.classList.add('title-out');
    if (renderer?.gl.isContextLost()) renderer = null;
    const animation = renderer ? renderer.transition(index, direction) : fallbackTransition(index, direction);
    await delay(reduced ? 0 : 400);
    gallery.classList.add('title-enter');
    current = index;
    updateLabels();
    gallery.classList.remove('title-out');
    // Commit the starting transform before revealing the new title.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    gallery.classList.remove('title-enter');
    await animation;
    busy = false;
  }

  $('#previous').addEventListener('click', () => select(current - 1, -1));
  $('#next').addEventListener('click', () => select(current + 1, 1));
  $('#thumbnails').addEventListener('click', event => { const button = event.target.closest('[data-project]'); if (button) select(Number(button.dataset.project)); });

  function links() {
    return `<div class="profile-links"><a href="${escape(safeLink(profile.github))}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="${escape(safeLink(profile.linkedin))}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div>`;
  }
  function timeline(items) {
    return items.map(item => `<article class="about-entry"><div class="entry-main"><h4>${escape(item.name)}</h4><p class="entry-role">${escape(item.detail)}</p>${item.summary ? `<p class="entry-summary">${escape(item.summary)}</p>` : ''}</div><p class="entry-date">${escape(item.date)}</p></article>`).join('');
  }
  async function slideAboutPages(entering) {
    const workFrom = entering ? 'translate3d(0,0,0)' : getComputedStyle(gallery).transform;
    const aboutFrom = entering ? 'translate3d(100%,0,0)' : getComputedStyle(info).transform;
    aboutAnimations.forEach(animation => animation.cancel());
    aboutAnimations = [];
    if (reduced) return;
    const timing = { duration: 850, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'both' };
    const animations = [
      gallery.animate([{ transform: workFrom }, { transform: entering ? 'translate3d(-100%,0,0)' : 'translate3d(0,0,0)' }], timing),
      info.animate([{ transform: aboutFrom }, { transform: entering ? 'translate3d(0,0,0)' : 'translate3d(100%,0,0)' }], timing)
    ];
    aboutAnimations = animations;
    try {
      await Promise.all(animations.map(animation => animation.finished));
    } catch (error) {
      // Reversing navigation takes over from the exact current page positions.
      if (error.name !== 'AbortError') throw error;
    } finally {
      if (aboutAnimations === animations) {
        animations.forEach(animation => animation.cancel());
        aboutAnimations = [];
      }
    }
  }
  async function openAbout() {
    if (aboutClosing || info.open || busy || detail.open) return;
    $('#panel-content').innerHTML = `
      <header class="about-introduction">
        <div><div class="about-person"><h1 class="person-name" id="about-title">${escape(profile.name)}</h1><a class="about-email" href="mailto:${encodeURIComponent(profile.email)}">${escape(profile.email)} ↗</a></div><p class="about-intro">Building software<br>for intelligent systems.</p><p class="about-bio">${escape(profile.bio)}</p>${links()}</div>
        <nav class="about-jumps" aria-label="About sections"><a href="#about-experience">Experience <span aria-hidden="true">↓</span></a><a href="#about-education">Education <span aria-hidden="true">↓</span></a><a href="#about-skills">Skills <span aria-hidden="true">↓</span></a></nav>
      </header>
      <section class="about-section" id="about-experience" aria-labelledby="experience-heading">
        <div class="about-section-heading"><span class="section-number">01</span><h2 id="experience-heading">Experience</h2></div>
        <div class="about-section-body"><div class="experience-group"><h3>Industry</h3>${timeline(profile.experience)}</div><div class="experience-group"><h3>Research & leadership</h3>${timeline(profile.research)}</div></div>
      </section>
      <section class="about-section" id="about-education" aria-labelledby="education-heading">
        <div class="about-section-heading"><span class="section-number">02</span><h2 id="education-heading">Education</h2></div><div class="about-section-body">${timeline(profile.education)}</div>
      </section>
      <section class="about-section" id="about-skills" aria-labelledby="skills-heading">
        <div class="about-section-heading"><span class="section-number">03</span><h2 id="skills-heading">Skills</h2></div><div class="about-section-body grouped-skills">${profile.skillGroups.map(group => `<section class="skill-group"><h3>${escape(group.name)}</h3><ul>${group.items.map(skill => `<li>${escape(skill)}</li>`).join('')}</ul></section>`).join('')}</div>
      </section>
      <footer class="contact-area"><div><p>Let’s make something move.</p><a class="contact-action" href="mailto:${encodeURIComponent(profile.email)}">${escape(profile.email)} ↗</a><button class="copy-button" id="copy-email">Copy email</button><div id="copy-status" role="status"></div></div><span class="location">New York, NY</span></footer>`;
    info.showModal(); info.scrollTop = 0;
    document.body.dataset.page = 'about';
    const entering = slideAboutPages(true);
    history.replaceState(null, '', '#about');
    document.querySelectorAll('.about-jumps a').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      const section = $(link.getAttribute('href'));
      const top = section.getBoundingClientRect().top - info.getBoundingClientRect().top + info.scrollTop - $('.dialog-nav').offsetHeight - 28;
      info.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' });
    }));
    $('#copy-email').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(profile.email); $('#copy-status').textContent = 'Email copied.'; }
      catch { $('#copy-status').textContent = 'Select the email address to copy it.'; }
    });
    await entering;
  }
  $('#about-open').addEventListener('click', event => { event.preventDefault(); openAbout(); });
  async function closeAbout() {
    if (!info.open || aboutClosing) return;
    aboutClosing = true;
    try {
      info.classList.add('about-leaving');
      await slideAboutPages(false);
    } finally {
      document.body.dataset.page = 'work';
      if (info.open) info.close();
      info.classList.remove('about-leaving');
      aboutClosing = false;
    }
  }
  $('#close-info').addEventListener('click', closeAbout);
  info.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeAbout();
    }
  });
  info.addEventListener('cancel', event => { event.preventDefault(); closeAbout(); });
  info.addEventListener('close', () => {
    document.body.dataset.page = 'work';
    history.replaceState(null, '', '#work');
  });

  function openProject(index) {
    if (projectClosing) return;
    const p = projects[index]; const link = safeLink(p.link);
    $('#project-content').innerHTML = `<img class="detail-image" src="${escape(p.image)}" alt="${escape(p.alt)}"><div class="detail-body"><span class="detail-kicker">${escape(p.organization)} / ${escape(p.year)}</span><h2 id="detail-title">${escape(name(index))}</h2><div class="detail-columns"><p class="detail-description">${escape(p.description)}</p><ul class="detail-disciplines">${p.disciplines.map(d => `<li>${escape(d)}</li>`).join('')}</ul></div><div class="project-metrics">${(p.highlights || []).map(h => `<div><strong>${escape(h.value)}</strong><span>${escape(h.label)}</span></div>`).join('')}</div>${p.note ? `<p class="detail-note">${escape(p.note)}</p>` : ''}${link ? `<a class="contact-action" href="${escape(link)}" target="_blank" rel="noopener noreferrer">View project ↗</a>` : ''}<button class="detail-next" data-next="${(index + 1) % projects.length}"><span>Next — ${escape(name((index + 1) % projects.length))}</span><span aria-hidden="true">↗</span></button></div>`;
    if (!detail.open) detail.showModal();
    detail.scrollTop = 0;
  }
  $('#project-open').addEventListener('click', () => { if (!suppressClick && !busy) openProject(current); });
  async function closeProject() {
    if (!detail.open || projectClosing) return;
    projectClosing = true;
    let animation;
    try {
      if (!reduced) {
        const transform = getComputedStyle(detail).transform;
        const back = $('#close-project');
        // Preserve the visible back button when transform changes its containing block.
        const backTop = back.getBoundingClientRect().top - detail.getBoundingClientRect().top + detail.scrollTop;
        detail.style.setProperty('--back-offset', `${backTop}px`);
        detail.classList.add('project-leaving');
        animation = detail.animate([
          { transform: transform === 'none' ? 'translate3d(0,0,0)' : transform },
          { transform: 'translate3d(0,100%,0)' }
        ], { duration: 750, easing: 'cubic-bezier(.64,0,.78,0)', fill: 'forwards' });
        await animation.finished;
      }
    } finally {
      if (detail.open) detail.close();
      animation?.cancel();
      detail.classList.remove('project-leaving');
      detail.style.removeProperty('--back-offset');
      projectClosing = false;
    }
  }
  $('#close-project').addEventListener('click', closeProject);
  detail.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeProject();
    }
  });
  detail.addEventListener('cancel', event => { event.preventDefault(); closeProject(); });
  $('#project-content').addEventListener('click', event => { const button = event.target.closest('[data-next]'); if (button) { openProject(Number(button.dataset.next)); $('#close-project').focus({ preventScroll: true }); } });

  gallery.addEventListener('wheel', event => {
    if (info.open || detail.open || event.ctrlKey) return;
    event.preventDefault();
    if (overview) {
      if (!busy) {
        const now = performance.now();
        if (now - wheelTime > 180) wheelTotal = 0;
        wheelTime = now;
        const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
        wheelTotal += delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rail.clientWidth : 1);
        if (Math.abs(wheelTotal) > 45 && now - lastOverviewWheel > 350) {
          const direction = wheelTotal > 0 ? 1 : -1;
          wheelTotal = 0; lastOverviewWheel = now;
          select(current + direction, direction);
        }
      }
      return;
    }
    if (busy) { wheelTotal = 0; return; }
    const now = performance.now();
    if (now - wheelTime > 180) wheelTotal = 0;
    wheelTime = now;
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    wheelTotal += delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    if (Math.abs(wheelTotal) > 45) { const direction = wheelTotal > 0 ? 1 : -1; wheelTotal = 0; select(current + direction, direction); }
  }, { passive: false });
  gallery.addEventListener('pointerdown', event => {
    if (overview || event.pointerType === 'touch' || event.target.closest('#mode-toggle')) return;
    if (event.target.closest('.thumbnail,.scroll-arrow,.header')) return;
    pointerStart = { x: event.clientX, y: event.clientY };
  });
  gallery.addEventListener('pointerup', event => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x, dy = event.clientY - pointerStart.y;
    const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    if (Math.abs(delta) > 45) {
      suppressClick = true;
      const direction = delta < 0 ? 1 : -1;
      select(current + direction, direction);
      setTimeout(() => { suppressClick = false; }, 100);
    }
    pointerStart = null;
  });
  gallery.addEventListener('pointercancel', () => { pointerStart = null; });
  // Touch browsers may cancel pointer events when interpreting vertical movement.
  let touch;
  gallery.addEventListener('touchstart', event => {
    touch = event.touches.length === 1 && !event.target.closest('.header,#mode-toggle,.thumbnail') ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  gallery.addEventListener('touchend', event => {
    if (!touch || busy || overview || event.touches.length) { touch = null; return; }
    const dx = event.changedTouches[0].clientX - touch.x, dy = event.changedTouches[0].clientY - touch.y;
    const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    if (Math.abs(delta) > 50) { event.preventDefault(); const direction = delta < 0 ? 1 : -1; select(current + direction, direction); }
    touch = null;
  }, { passive: false });
  document.addEventListener('keydown', event => {
    if (!entered || enteringPortfolio || info.open || detail.open || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'Escape' && !overview) { event.preventDefault(); switchView(true); }
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) { event.preventDefault(); select(current + 1, 1); }
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) { event.preventDefault(); select(current - 1, -1); }
  });

  async function start() {
    const startTime = performance.now();
    let loaded = 0;
    const images = await Promise.all(projects.map(p => new Promise(resolve => {
      const image = new Image(); image.decoding = 'async';
      const finish = success => { loaded++; $('#load-number').textContent = `${Math.round(loaded / projects.length * 100)}%`; resolve(success ? image : null); };
      image.onload = () => finish(true); image.onerror = () => finish(false); image.src = p.image;
    })));
    if (!reduced && images.every(Boolean) && window.PortfolioScene) {
      try { renderer = new window.PortfolioScene($('#scene-canvas'), images); $('.scene').classList.add('webgl-ready'); }
      catch { renderer = null; }
    }
    await delay(reduced ? 0 : Math.max(0, 850 - (performance.now() - startTime)));
    $('#loader').classList.add('loaded');
    $('#enter-work').disabled = false;
    if (location.hash === '#about' || location.hash === '#contact') openAbout();
  }
  updateLabels(); updateViewControls(); requestAnimationFrame(() => centerCard(0, false)); start();
})();
