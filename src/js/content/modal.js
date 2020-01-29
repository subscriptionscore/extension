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
  framePath
}) {
  const $frame = document.createElement('iframe');
  $frame.src = framePath;
  Object.keys(styles).forEach(s => {
    $frame.style[s] = styles[s];
  });
  const onMessage = event => {
    let remove = false;
    if (event.data.popupResponse === 'continue') {
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
    }
  };
  window.addEventListener('message', onMessage, { capture: true, once: true });
  document.body.appendChild($frame);
}
