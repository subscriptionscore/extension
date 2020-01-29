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

(async () => {
  // if user has not enabled this then bail out here
  const alertOnSubmit = await getPreference('alertOnSubmit');
  if (!alertOnSubmit) {
    return;
  }

  injectPatchScript();
  const ignoredSites = await getPreference('ignoredSites');
  const ignoredEmailAddresses = await getPreference('ignoredEmailAddresses');
  const blockedRank = await getPreference('blockedRank');
  browser.runtime.sendMessage({ action: 'get-current-rank' }, response => {
    const { rank, domain } = response;
    const isIgnored = ignoredSites.some(is => is === domain);
    logger('ranked', `${rank} - ${domain}`);
    if (!isIgnored && ranks.indexOf(rank) <= ranks.indexOf(blockedRank)) {
      logger('preventing form submit');
      injectScripts({
        ignoredEmailAddresses
      });
    }
  });
})();

function injectPatchScript() {
  const $script = document.createElement('script');
  $script.type = 'text/javascript';
  $script.textContent = `    
  Element.prototype._addEventListener = Element.prototype.addEventListener;  
  Element.prototype.addEventListener = function(eventName, fn, ...args) {    
    if (eventName === 'onsubmit' || eventName === 'submit') {
      console.log(
        "[subscriptionscore]: monkey patching event listener "+eventName+" on element " + this
      );
      this._onsubmit = fn;      
    }        
  };
  `;
  document.addEventListener('DOMContentLoaded', () =>
    document.head.prepend($script)
  );
}

let awaitDomLoaded = new Promise(resolve => {
  document.addEventListener('DOMContentLoaded', () => resolve());
});

async function injectScripts({ ignoredEmailAddresses }) {
  const $script = document.createElement('script');
  $script.src = `${onloadScriptPath}`;
  $script.type = 'text/javascript';
  // TODO how can we achieve this subresource integrity?
  // https://github.com/subscriptionscore/extension/issues/5
  if (process.env.SUBRESOURCE_INTEGRITY_ONLOAD) {
    $script.integrity = process.env.SUBRESOURCE_INTEGRITY_ONLOAD;
  }

  const emails = await Promise.all(ignoredEmailAddresses.map(e => digest(e)));
  $script.innerText = JSON.stringify({
    ignoredEmailAddresses: emails,
    framePath: framePath
  });
  awaitDomLoaded.then(() => document.head.appendChild($script));
}
