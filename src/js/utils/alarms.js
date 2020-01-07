import { clearCache } from './cache';
import browser from 'browser';
// run the cachebust alarm every 30 minutes
// to clear items in the cache that are older
// than six hours
browser.alarms.create('cachebust', {
  periodInMinutes: 30
});

browser.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'cachebust') {
    clearCache();
  }
});
