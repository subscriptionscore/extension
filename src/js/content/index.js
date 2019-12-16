import { getPreference } from '../utils/storage';

// runs at document idle as per manifest.json
(async () => {
  // programatically insert the content script if the user
  // has specified that they want to get alerts when they
  // submit a form
  const alertOnSubmit = await getPreference('alertOnSubmit');
  if (alertOnSubmit) {
    chrome.tabs.executeScript(null, { file: 'content.js' });
  }
})();
