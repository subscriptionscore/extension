// This script injects our modal into the current tab.
// The modal loads frame.html, which shows our score
// popup within the page.
//
// When the modal is done, it passes a message to it's
// parent here, and the frame is removed from the page
const styles = {
  border: 'none',
  position: 'fixed',
  zIndex: 99999,
  top: '0px',
  right: '0px',
  width: '400px',
  height: '400px'
};

export function injectModal({
  onApproved,
  onCancelled,
  addIgnoreEmail,
  addIgnoreSite,
  emails,
  framePath
}) {
  const $frame = document.createElement('iframe');
  $frame.src = framePath;
  Object.keys(styles).forEach(s => {
    $frame.style[s] = styles[s];
  });
  // handle messages passed up from the modal iframe
  const onMessage = event => {
    let remove = false;
    if (!$frame || !$frame.contentWindow) {
      return;
    }
    if (event.data.action === 'loaded') {
      $frame.contentWindow.postMessage({ emails }, '*');
    } else if (event.data.popupResponse === 'continue') {
      onApproved();
      remove = true;
    } else if (event.data.popupResponse === 'cancel') {
      onCancelled();
      remove = true;
    } else if (event.data.popupResponse === 'add-ignore-email') {
      addIgnoreEmail();
      remove = true;
    } else if (event.data.popupResponse === 'add-ignore-site') {
      addIgnoreSite(event.data.domain);
      remove = true;
    }
    if (remove) {
      document.body.removeChild($frame);
      // FIXME for some reason this REL doesn't seem to
      // actually remove the listener. IDKW.
      window.removeEventListener('message', onMessage);
    }
  };
  window.addEventListener('message', onMessage, { capture: true });
  document.body.appendChild($frame);
}
