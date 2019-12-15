const path = chrome.runtime.getURL('/frame.html');

const styles = {
  border: 'none',
  position: 'fixed',
  zIndex: 9999,
  top: '0px',
  right: '0px',
  width: '400px',
  height: '257px'
};

export function injectModal($form) {
  const $frame = document.createElement('iframe');
  $frame.src = path;
  Object.keys(styles).forEach(s => {
    $frame.style[s] = styles[s];
  });
  document.body.appendChild($frame);
}
