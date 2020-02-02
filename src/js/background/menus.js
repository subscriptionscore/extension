import {
  getPreference,
  onStorageChange,
  setPreference
} from '../utils/storage';

import browser from 'browser';
import { updateUserPreferences } from '../utils/preferences';

(async () => {
  // intial state
  const alertOnSubmit = await getPreference('alertOnSubmit');
  const gmailEnabled = await getPreference('gmailEnabled');

  browser.contextMenus.create({
    id: 'show-gmail-ranks',
    type: 'checkbox',
    title: 'Show ranks in Gmail',
    contexts: ['all'],
    checked: gmailEnabled,
    async onclick({ checked }) {
      const prefs = await setPreference('gmailEnabled', checked);
      updateUserPreferences(prefs);
    }
  });
  browser.contextMenus.create({
    id: 'show-alerts',
    type: 'checkbox',
    title: 'Show form submit alerts',
    contexts: ['all'],
    checked: alertOnSubmit,
    async onclick({ checked }) {
      const prefs = await setPreference('alertOnSubmit', checked);
      updateUserPreferences(prefs);
    }
  });
})();

onStorageChange(storage => {
  if (storage.preferences && hasChanged('alertOnSubmit', storage)) {
    browser.contextMenus.update('show-alerts', {
      checked: storage.preferences.newValue.alertOnSubmit
    });
  }
  if (storage.preferences && hasChanged('gmailEnabled', storage)) {
    browser.contextMenus.update('show-gmail-ranks', {
      checked: storage.preferences.newValue.gmailEnabled
    });
  }
});

function hasChanged(prop, storage) {
  return (
    storage.preferences.newValue[prop] !== storage.preferences.oldValue[prop]
  );
}
