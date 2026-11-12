const viewerDialog = document.querySelector('.project-viewer-dialog');

document.querySelectorAll('.project-viewer').forEach(viewer => {
  const stage = viewer.querySelector('.project-viewer__stage');
  const fullscreen = viewer.querySelector('[data-fullscreen]');
  const home = viewer.parentElement;

  const updateFullscreen = () => {
    const expanded = document.fullscreenElement === viewer || viewer.parentElement === viewerDialog;
    fullscreen.textContent = expanded ? 'Exit fullscreen' : 'Fullscreen';
    fullscreen.setAttribute('aria-pressed', String(expanded));
  };

  document.addEventListener('fullscreenchange', updateFullscreen);
  viewerDialog.addEventListener('close', () => {
    if (viewer.parentElement !== viewerDialog) return;
    const scrollPosition = stage.scrollTop;
    home.append(viewer);
    stage.scrollTop = scrollPosition;
    updateFullscreen();
    fullscreen.focus();
  });

  fullscreen.addEventListener('click', async () => {
    if (document.fullscreenElement === viewer) {
      await document.exitFullscreen();
      return;
    }
    if (viewer.parentElement === viewerDialog) {
      viewerDialog.close();
      return;
    }
    if (viewer.requestFullscreen) {
      try {
        await viewer.requestFullscreen();
        return;
      } catch {
        // Use an in-page modal on browsers that restrict element fullscreen.
      }
    }
    const scrollPosition = stage.scrollTop;
    viewerDialog.setAttribute('aria-label', viewer.dataset.label);
    viewerDialog.append(viewer);
    viewerDialog.showModal();
    stage.scrollTop = scrollPosition;
    updateFullscreen();
    fullscreen.focus();
  });

  const slides = [...viewer.querySelectorAll('.project-viewer__slides img')];
  if (!slides.length) return;

  const previous = viewer.querySelector('[data-slide-prev]');
  const next = viewer.querySelector('[data-slide-next]');
  const status = viewer.querySelector('[data-slide-status]');
  let current = 0;

  const changeSlide = step => {
    const index = current + step;
    if (index < 0 || index >= slides.length) return;
    slides[current].hidden = true;
    current = index;
    slides[current].hidden = false;
    previous.setAttribute('aria-disabled', String(current === 0));
    next.setAttribute('aria-disabled', String(current === slides.length - 1));
    status.textContent = `Slide ${current + 1} of ${slides.length}`;
  };

  previous.addEventListener('click', () => changeSlide(-1));
  next.addEventListener('click', () => changeSlide(1));
  viewer.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    changeSlide(event.key === 'ArrowLeft' ? -1 : 1);
  });
});
