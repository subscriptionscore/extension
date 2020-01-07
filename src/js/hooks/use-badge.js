import { useEffect } from 'react';
import browser from 'browser';

export default ({ url, data }) => {
  const rank = data ? data.rank : '';
  return useEffect(() => {
    if (!url.startsWith('https://')) {
      browser.browserAction.disable();
    } else {
      browser.browserAction.enable();
    }
    browser.browserAction.setBadgeBackgroundColor({
      color: '#666666'
    });
    browser.browserAction.setBadgeText({ text: rank });
  }, [rank, url]);
};
