import { clearCache } from './cache';

// run the cachebust alarm every 30 minutes
// to clear items in the cache that are older
// than six hours
chrome.alarms.create('cachebust', {
  periodInMinutes: 30
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'cachebust') {
    clearCache();
  }
});
