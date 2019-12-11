import React, { useState, useEffect, createContext } from 'react';

export const ConnectContext = createContext(null);

const ConnectProvider = ({ children }) => {
  const [state, set] = useState({ domain: null, rank: null });
  useEffect(() => {
    var port = chrome.extension.connect({
      name: 'Sample Communication'
    });
    port.postMessage('Connect');
    port.onMessage.addListener(msg => {
      console.log('message recieved' + msg);
      if (msg.type === 'domain-rank') {
        set({ domain: msg.data.domain, rank: msg.data.rank });
      }
    });
  }, []);
  return <ConnectContext.Provider>{children}</ConnectContext.Provider>;
};

export default ConnectProvider;
