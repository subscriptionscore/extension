import { useState, useEffect } from 'react';
import browser from 'browser';

// use this in Chrome
export default () => {
  const [state, set] = useState({ loading: true, url: null });
  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tab = tabs[0];
      const { url } = tab;
      set({ loading: false, url });
    });
  }, []);
  return state;
};

// use this in Firefox

// export default () => {
//   const [state, set] = useState({ loading: true, url: null });
//   useEffect(() => {
//
//   }, []);
//   return state;
// };
