import browser from 'browser';
import { renderScores } from './renderer';

let debouncedFetch = 0;
let emails = [];

browser.runtime.onMessage.addListener(async request => {
  if (request.action === 'fetched-scores') {
    renderScores(request.data.scores, emails);
  }
});

function fetchScore(email, ThreadRowView) {
  clearTimeout(debouncedFetch);
  emails = [...emails, { view: ThreadRowView, email }];
  debouncedFetch = setTimeout(() => doFetch(), 100);
}

async function doFetch() {
  const addresses = emails.map(e => e.email);
  const uniqueAddresses = Object.keys(
    addresses.reduce((out, a) => {
      return { ...out, [a]: 1 };
    }, {})
  );
  debugger;
  browser.runtime.sendMessage({
    action: 'fetch-scores',
    data: uniqueAddresses
  });
}

function onLoad(sdk) {
  debugger;
  sdk.Lists.registerThreadRowViewHandler(function(ThreadRowView) {
    const contacts = ThreadRowView.getContacts();
    const sender = contacts[0];
    const { emailAddress } = sender;
    fetchScore(emailAddress, ThreadRowView);
  });
}

(() => {
  window.InboxSDK.load('2', 'sdk_Sub-Score_b068febf04').then(onLoad);
})();
