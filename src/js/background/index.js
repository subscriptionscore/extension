import browser from 'browser';
import {
  addIgnoreEmail,
  addIgnoreSite,
  addSignupAllowedRequest,
  addSignupBlockedRequest,
  getDomainScore
} from './scores';

let currentPage = {
  rank: null,
  domain: null
};

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo && changeInfo.status === 'complete') {
    const { url } = tab;
    return onPageChange(url, { inject: true });
  }
});

browser.tabs.onActivated.addListener(() => {
  browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const { url } = tabs[0];
    onPageChange(url);
  });
});

browser.runtime.onInstalled.addListener(details => {
  if (details.reason !== 'update') {
    // first install, launch the settings page
    // browser.runtime.openOptionsPage();
    const url = '/options.html?welcome=true';
    browser.tabs.create({ url });
  }
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == 'signup-allowed') {
    return addSignupAllowedRequest(currentPage.domain);
  }
  if (request.action == 'signup-blocked') {
    return addSignupBlockedRequest(currentPage.domain);
  }
  if (request.action === 'get-current-rank') {
    return sendResponse(currentPage);
  }
  if (request.action === 'ignore-email') {
    const emails = request.data;
    return addIgnoreEmail(emails);
  }
  if (request.action === 'ignore-site') {
    const domain = request.data;
    return addIgnoreSite(domain);
  }
  if (request.action === 'log') {
    if (sender.id === browser.runtime.id) {
      return console.log(`[subscriptionscore]:`, request.data);
    }
  }
});

async function injectScript() {
  browser.contentScripts.register({
    js: [
      {
        file: '/content.bundle.js'
      }
    ],
    runAt: 'document_idle'
  });
}
// call when the page changes and we need to
// fetch a new rank for the current url
async function onPageChange(url, { inject = false } = {}) {
  browser.browserAction.setBadgeText({ text: '' });
  if (!/http(s)?:\/\//.test(url)) {
    browser.browserAction.disable();
  } else {
    browser.browserAction.enable();
    try {
      console.log('[subscriptionscore]: fetching score');
      const domainScore = await getDomainScore(url);
      if (domainScore) {
        const { rank, domain } = domainScore;
        currentPage = {
          domain,
          rank
        };
        if (rank) {
          browser.browserAction.setBadgeText({ text: rank });
        }
      }
      if (inject) {
        injectScript();
      }
    } catch (err) {
      console.error(err);
    }
  }
  browser.browserAction.setBadgeBackgroundColor({
    color: '#666666'
  });
}
