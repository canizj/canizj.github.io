for (const frame of document.querySelectorAll('[data-simulation]')) {
  let observer;
  frame.addEventListener('load', () => {
    observer?.disconnect();
    const content = frame.contentDocument?.querySelector('main');
    if (!content) return;
    const resize = () => {
      frame.style.height = Math.ceil(content.getBoundingClientRect().height + 2) + 'px';
    };
    observer = new ResizeObserver(resize);
    observer.observe(content);
    resize();
  });
}
