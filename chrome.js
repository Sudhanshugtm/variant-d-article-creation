// Shared helpers for VisualEditor-style prototype chrome
export function initToolbarInteractions(root = document) {
  const closeBtn = root.querySelector('[data-ve-close], #close');
  if (closeBtn && !closeBtn.dataset.prototypeHooked) {
    closeBtn.dataset.prototypeHooked = 'true';
    closeBtn.addEventListener('click', () => {
      alert('Close editor (prototype)');
    });
  }

  const nextBtn = root.querySelector('[data-ve-next], #submit, #submit-desktop');
  if (nextBtn && !nextBtn.dataset.prototypeHooked) {
    nextBtn.dataset.prototypeHooked = 'true';
    nextBtn.addEventListener('click', () => {
      alert('Publish flow (prototype)');
    });
  }
}
