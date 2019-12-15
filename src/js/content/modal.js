const path = chrome.runtime.getURL('/frame.html');

const styles = {
  border: 'none',
  position: 'fixed',
  zIndex: 99999,
  top: '0px',
  right: '0px',
  width: '400px',
  height: '400px'
};

export function injectModal(onApproved, onCancelled) {
  const $frame = document.createElement('iframe');
  $frame.src = path;
  Object.keys(styles).forEach(s => {
    $frame.style[s] = styles[s];
  });
  const onMessage = event => {
    console.log('[subscriptionscore]: received message from ', event.origin);
    if (event.data.popupResponse === 'continue') {
      onApproved();
    } else if (event.data.popupResponse === 'cancel') {
      onCancelled();
    }
  };
  window.addEventListener('message', onMessage, { capture: true, once: true });
  document.body.appendChild($frame);
}
