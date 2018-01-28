chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.target) {
    case 'SHOW_OVERLAY':
      createOverlay();
      break;
    case 'CLOSE_OVERLAY':
      removeOverlay();
  }

  return true;
});

function createOverlay() {
  if (!document.querySelector('.rememberer-overlay')){
    const overlay = document.createElement('div');
    overlay.className = 'rememberer-overlay';
    overlay.style.cssText = 'position: absolute;left: 0px;top: 0px;width:100%;height:100%;text-align:center;z-index: 99998;';

    const overlayContent = document.createElement('div');
    overlayContent.className = 'rememberer-overlay-content';
    overlayContent.innerHTML = `<div>
                                  <h1>Please, LOG YOUR FUCKING TIME!!!</h1>
                                  <input type="text" class="rememberer-overlay-description">
                                  <br/>
                                  <button class="rememberer-save-task">Save</button>
                                </div>`;

    const button = overlayContent.querySelector('.rememberer-save-task');
    button.addEventListener('click', () => {
      const value = document.querySelector('.rememberer-overlay-description').value;
      if (value) {
        chrome.runtime.sendMessage({
          currentTask: value,
          additionalInformation: 'FROM_OVERLAY',
          target: 'SAVE_CURRENT_TASK'
        }, (response) => {
          if (response) {
            if (response.status === 'done') {
              removeOverlay();
            }
          }
        });
      }
    });
    overlayContent.style.cssText = 'width:300px;margin: 100px auto;background-color: #fff;border:1px solid #000;padding:15px;text-align:center;z-index: 99999;'

    overlay.appendChild(overlayContent);

    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
    body.appendChild(overlay);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);
  }
}


function removeOverlay() {
  const overlay = document.querySelector('.rememberer-overlay');
  if (overlay) {
    overlay.remove();
    document.querySelector('body').style.overflow = 'inherit'
  }
}