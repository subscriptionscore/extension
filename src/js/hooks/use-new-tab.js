import { useCallback } from 'react';
import browser from 'browser';

export default url => {
  return useCallback(() => {
    browser.tabs.create({ url });
  }, [url]);
};
