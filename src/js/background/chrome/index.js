import {
  getDomainScore,
  addSignupAllowedRequest,
  addSignupBlockedRequest,
  addIgnoreEmail,
  addIgnoreSite
} from '../scores';

let currentPage = {
  rank: null,
  domain: null
};

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

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason !== 'update') {
    // first install, launch the settings page
    chrome.runtime.openOptionsPage();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[subscriptionscore]: message', request);
  if (request.action == 'signup-allowed') {
    return addSignupAllowedRequest(request.domain);
  }
  if (request.action == 'signup-blocked') {
    return addSignupBlockedRequest(request.domain);
  }
  if (request.action === 'get-current-rank') {
    return sendResponse(currentPage);
  }
  if (request.action === 'ignore-email') {
    const email = request.data;
    return addIgnoreEmail(email);
  }
  if (request.action === 'ignore-site') {
    const domain = request.data;
    return addIgnoreSite(domain);
  }
});

// call when the page changes and we need to
// fetch a new rank for the current url
async function onPageChange(url) {
  console.log('[subscriptionscore]: page change', url);
  chrome.browserAction.setBadgeText({ text: '' });
  if (!/http(s)?:\/\//.test(url)) {
    chrome.browserAction.disable();
  } else {
    chrome.browserAction.enable();
    const domainScore = await getDomainScore(url);
    if (domainScore) {
      const { rank, domain } = domainScore;
      currentPage = {
        domain,
        rank
      };
      if (rank) {
        chrome.browserAction.setBadgeText({ text: rank });
      }
    }
  }
  chrome.browserAction.setBadgeBackgroundColor({
    color: '#666666'
  });
}
