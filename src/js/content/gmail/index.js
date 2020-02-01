import browser from 'browser';
import { renderScores } from './renderer';
import { getPreference } from '../../utils/storage';

import {
  getEmailAddressesOnPage,
  startListening,
  addPageChangeListener
} from './utils';

browser.runtime.onMessage.addListener(async request => {
  if (request.action === 'fetched-scores') {
    renderScores(request.data.scores);
  }
});

(async () => {
  const enabledForGmail = await getPreference('gmailEnabled');
  // FIXME invert this when we ready
  if (!enabledForGmail) {
    handlePageEmails();
    listen();
  }
})();

function handlePageEmails() {
  console.log('[subscriptionscore]: searching page for emails');
  const uniqueAddresses = getEmailAddressesOnPage();
  browser.runtime.sendMessage({
    action: 'fetch-scores',
    data: uniqueAddresses
  });
}

function listen() {
  startListening();
  addPageChangeListener(handlePageEmails);
}
