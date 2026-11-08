document.querySelectorAll('[data-document-viewer]').forEach((viewer) => {
  const documentSelect = viewer.querySelector('[data-document]');
  const zoom = viewer.querySelector('[data-zoom]');
  const image = viewer.querySelector('[data-page-image]');
  const original = viewer.querySelector('[data-original]');
  const fullImage = viewer.querySelector('[data-full-image]');
  const previous = viewer.querySelector('[data-prev]');
  const next = viewer.querySelector('[data-next]');
  const status = viewer.querySelector('[data-page-status]');
  const stage = viewer.querySelector('.document-stage');
  let page = 1;
  const update = () => {
    const report = !documentSelect || documentSelect.value === 'report';
    const total = report ? 13 : 1;
    const src = report ? `assets/capstone/report/page-${String(page).padStart(2, '0')}.jpg` : 'assets/capstone/datafolio.jpg';
    image.src = src;
    image.alt = `${report ? 'Housing affordability final report' : 'Original capstone datafolio'}, page ${page} of ${total}`;
    fullImage.href = src;
    fullImage.style.width = `${zoom.value}%`;
    original.href = `assets/capstone/${report ? 'report' : 'datafolio'}.pdf`;
    previous.disabled = page === 1;
    next.disabled = page === total;
    status.textContent = `Page ${page} of ${total}`;
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
  };
  documentSelect?.addEventListener('change', () => { page = 1; zoom.value = '100'; update(); });
  zoom.addEventListener('change', update);
  previous.addEventListener('click', () => { if (page > 1) { page--; update(); } });
  next.addEventListener('click', () => { if ((!documentSelect || documentSelect.value === 'report') && page < 13) { page++; update(); } });
  stage.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' && !next.disabled) { event.preventDefault(); next.click(); }
    if (event.key === 'ArrowLeft' && !previous.disabled) { event.preventDefault(); previous.click(); }
  });
});

document.querySelectorAll('[data-image-zoom]').forEach(viewer => {
  let zoom = 100;
  let drag = null;
  const image = viewer.querySelector('img');
  const stage = viewer.querySelector('.datafolio-image-stage');
  const minus = viewer.querySelector('[data-zoom-out]');
  const plus = viewer.querySelector('[data-zoom-in]');
  const stopDrag = () => { drag = null; stage.classList.remove('is-dragging'); };
  const update = () => {
    image.style.width = `${zoom}%`;
    viewer.querySelector('[data-zoom-status]').textContent = `${zoom}%`;
    minus.disabled = zoom === 100;
    plus.disabled = zoom === 250;
    stage.classList.toggle('is-zoomed', zoom > 100);
    stopDrag();
    if (zoom === 100) { stage.scrollTop = 0; stage.scrollLeft = 0; }
  };
  minus.addEventListener('click', () => { zoom = Math.max(100, zoom - 50); update(); });
  plus.addEventListener('click', () => { zoom = Math.min(250, zoom + 50); update(); });
  viewer.querySelector('[data-zoom-fit]').addEventListener('click', () => { zoom = 100; update(); });
  image.draggable = false;
  stage.addEventListener('pointerdown', event => {
    if (zoom === 100 || event.button !== 0 || !event.isPrimary) return;
    drag = { x: event.clientX, y: event.clientY, left: stage.scrollLeft, top: stage.scrollTop };
    stage.setPointerCapture(event.pointerId);
    stage.classList.add('is-dragging');
    stage.focus({ preventScroll: true });
    event.preventDefault();
  });
  stage.addEventListener('pointermove', event => {
    if (!drag) return;
    stage.scrollLeft = drag.left + drag.x - event.clientX;
    stage.scrollTop = drag.top + drag.y - event.clientY;
  });
  const release = event => {
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    stopDrag();
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('lostpointercapture', stopDrag);
  update();
});
