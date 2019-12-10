export default () => {
  var bkg = chrome.extension.getBackgroundPage();
  bkg.console.log('foo');
};
