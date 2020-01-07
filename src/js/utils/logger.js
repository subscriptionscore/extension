import browser from 'browser';

export default () => {
  var bkg = browser.extension.getBackgroundPage();
  bkg.console.log('foo');
};
