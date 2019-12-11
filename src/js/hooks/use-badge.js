import { useEffect } from 'react';

// use this in Chrome
export default ({ url, data }) => {
  const rank = data ? data.rank : '';
  return useEffect(() => {
    if (!url.startsWith('https://')) {
      chrome.browserAction.disable();
    } else {
      chrome.browserAction.enable();
    }
    chrome.browserAction.setBadgeBackgroundColor({
      color: '#666666'
    });
    chrome.browserAction.setBadgeText({ text: rank });
  }, [rank, url]);
};

// use this in Firefox

// export default () => {
//   const [state, set] = useState({ loading: true, url: null });
//   useEffect(() => {
//
//   }, []);
//   return state;
// };
