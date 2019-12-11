import { useCallback } from 'react';

export default url => {
  return useCallback(() => {
    chrome.tabs.create({ url });
  }, [url]);
};
