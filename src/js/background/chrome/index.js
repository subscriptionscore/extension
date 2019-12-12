import { getDomainScore } from '../scores';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const { url } = tab;
  onPageChange(url);
});

chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const { url } = tabs[0];
    onPageChange(url);
  });
});

// call when the page changes and we need to
// fetch a new rank for the current url
async function onPageChange(url) {
  chrome.browserAction.setBadgeText({ text: '' });
  if (!/http(s)?:\/\//.test(url)) {
    chrome.browserAction.disable();
  } else {
    chrome.browserAction.enable();
    const domainScore = await getDomainScore(url);
    if (domainScore) {
      const { rank } = domainScore;
      if (rank) {
        chrome.browserAction.setBadgeText({ text: rank });
      }
    }
  }
  chrome.browserAction.setBadgeBackgroundColor({
    color: '#666666'
  });
}
