import browser from 'browser';

browser.extension.onConnect.addListener(function(port) {
  console.log('Connected .....');
  port.onMessage.addListener(function(msg) {
    console.log('message recieved' + msg);
    port.postMessage('Hi Popup.js');
  });
});
