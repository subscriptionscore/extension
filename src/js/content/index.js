import browser from 'browser';
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
import digest from '../utils/digest';
import { getPreference } from '../utils/storage';
import isExcludedDomain from '../utils/is-excluded-domain';
import logger from '../utils/logger';

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
window.__subscriptionscore_is_active = true;
EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, ...args) {
  let newListener = listener;
  if (type === 'submit') {    
    if (typeof listener === 'function') {
      this._onsubmit = listener.bind(this);
    } else if (typeof listener.handleEvent === 'function') {
      this._onsubmit = listener.handleEvent.bind(this);
    }
    const newListener = function(...args) {
      if (!window.__subscriptionscore_is_active) {
        return listener.apply(this, args);
      } else {
        // do nothing
      }
    }
  }
  return EventTarget.prototype._addEventListener.apply(this, [type, listener, ...args]);
};`;
  return awaitDomLoaded.then(() => {
    return document.head.prepend($script);
  });
}

function injectUnpatchScript() {
  const $script = document.createElement('script');
  $script.id = 'subscription-score-unpatch-script';
  $script.type = 'text/javascript';
  $script.textContent = `window.__subscriptionscore_is_active=false;`;
  return awaitDomLoaded.then(() => {
    return document.body.append($script);
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
  if (!alertOnSubmit || isExcludedDomain(window.location.href)) {
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

    const isBelowAlertThreshold =
      ranks.indexOf(rank) <= ranks.indexOf(blockedRank);
    const blockFormSubmit = !isIgnored && isBelowAlertThreshold;

    if (blockFormSubmit) {
      logger('hijacking form submissions');
      isPatched.then(() =>
        injectScripts({
          ignoredEmailAddresses
        })
      );
    } else {
      // injectUnpatchScript();
    }
  });
})();
