import browser from 'browser';
import {
  addIgnoreEmail,
  addIgnoreSite,
  addSignupAllowedRequest,
  addSignupBlockedRequest,
  getDomainScore
} from './scores';
import logger from '../utils/logger';

let currentPage = {
  rank: null,
  domain: null,
  url: null
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
  if (request.action === 'get-current-url') {
    return sendResponse(currentPage.url);
  }
  if (request.action === 'log') {
    if (sender.id === browser.runtime.id) {
      return logger(request.data);
    }
  }
});

// call when the page changes and we need to
// fetch a new rank for the current url
async function onPageChange(url) {
  currentPage = {
    url
  };
  browser.browserAction.setBadgeText({ text: '' });
  if (!/http(s)?:\/\//.test(url)) {
    browser.browserAction.disable();
  } else {
    browser.browserAction.enable();
    try {
      logger('fetching score');
      const domainScore = await getDomainScore(url);
      if (domainScore) {
        const { rank, domain } = domainScore;
        currentPage = {
          url,
          domain,
          rank
        };
        if (rank) {
          browser.browserAction.setBadgeText({ text: rank });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  browser.browserAction.setBadgeBackgroundColor({
    color: '#666666'
  });
}
