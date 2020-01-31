// This is the content script injected into every page
// specified in the `matches` param in the manifest
//
// It searches the page for email inputs and attaches
// to the form action that submits them.
//
// If the form attempts to submit an email address that
// the user has not previously added to their ignore
// list then we inject our popup that alerts the user
//
import logger from '../utils/logger';
import browser from 'browser';
import { getPreference } from '../utils/storage';
import digest from '../utils/digest';

const onloadScriptPath = browser.runtime.getURL('/onload.bundle.js');
const framePath = browser.runtime.getURL('/frame.html');

const ranks = ['F', 'E', 'D', 'C', 'B', 'A', 'A+'];

/**
 * This script patches the native Element.prototype.addEventListener
 * function so that we can intercept submit events on forms and
 * show our scores for the domain before the user gives away their
 * email address.
 *
 * We try to ensure this is the first thing loaded on the page
 * before any submit events are added.
 */
function injectPatchScript() {
  if (document.getElementById('subscription-score-patch-script')) {
    return console.warn(
      '[subscriptionscore]: attempt to inject patch script multiple times'
    );
  }
  const $script = document.createElement('script');
  $script.id = 'subscription-score-patch-script';
  $script.type = 'text/javascript';
  // TODO probably can move this into a file rather than
  // inlining it here, we just want to jump to execution
  // as soon as we can
  $script.textContent = `/** 
 * Subscription Score patch script
 * More info: https://github.com/subscriptionscore/extension
*/
Element.prototype._addEventListener = Element.prototype.addEventListener;  
Element.prototype.addEventListener = function(eventName, fn, ...args) {    
  if (eventName === 'submit') {    
    this._onsubmit = fn;      
  } else {
    return Element.prototype._addEventEventListener(eventName, fn, ...args);
  }
};`;
  return awaitDomLoaded.then(() => {
    return document.head.prepend($script);
  });
}

let awaitDomLoaded = new Promise(resolve => {
  document.addEventListener('DOMContentLoaded', () => resolve());
});

/**
 * This injects our main content script that handles form
 * submissions and show our scores for the domain before
 * the user gives away their email address.
 *
 * This only gets injected if the score of the domain
 * is lower than the users' set threshold.
 *
 * We pass the (hashed) ignored emails list and some other
 * vars into the script because injected content scripts
 * can't access the extension storage
 */
async function injectScripts({ ignoredEmailAddresses }) {
  if (document.querySelector(`[src="${onloadScriptPath}"]`)) {
    return console.warn(
      '[subscriptionscore]: attempt to inject onload script multiple times'
    );
  }
  const $script = document.createElement('script');
  $script.src = `${onloadScriptPath}`;
  $script.type = 'text/javascript';
  $script.id = 'subscription-score-onload-script';

  // TODO how can we achieve this subresource integrity?
  // https://github.com/subscriptionscore/extension/issues/5
  if (process.env.SUBRESOURCE_INTEGRITY_ONLOAD) {
    $script.integrity = process.env.SUBRESOURCE_INTEGRITY_ONLOAD;
  }

  const emails = await Promise.all(ignoredEmailAddresses.map(e => digest(e)));

  $script.textContent = JSON.stringify({
    ignoredEmailAddresses: emails,
    framePath: framePath
  });
  awaitDomLoaded.then(() => document.head.appendChild($script));
}

/**
 * Lets get started
 */
(async () => {
  // if user has not enabled this functionality then bail out here
  const alertOnSubmit = await getPreference('alertOnSubmit');
  if (!alertOnSubmit) {
    return;
  }

  let isPatched = injectPatchScript();
  const ignoredSites = await getPreference('ignoredSites');
  const ignoredEmailAddresses = await getPreference('ignoredEmailAddresses');
  const blockedRank = await getPreference('blockedRank');
  // get the rank for the current page from the background script
  // which already has it in it's cache
  browser.runtime.sendMessage({ action: 'get-current-rank' }, response => {
    const { rank, domain } = response;
    const isIgnored = ignoredSites.some(is => is === domain);
    if (!isIgnored && ranks.indexOf(rank) <= ranks.indexOf(blockedRank)) {
      logger('hijacking form submissions');
      isPatched.then(() =>
        injectScripts({
          ignoredEmailAddresses
        })
      );
    }
  });
})();
