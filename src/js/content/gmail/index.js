import {
  addPageChangeListener,
  getEmailAddressesOnPage,
  startListening
} from './utils';

import browser from 'browser';
import { getPreference } from '../../utils/storage';
import logger from '../../utils/logger';
import { renderScores } from './renderer';

let theme;

browser.runtime.onMessage.addListener(async request => {
  if (request.action === 'fetched-scores') {
    renderScores(request.data.scores, theme);
  }
});

(async () => {
  const enabledForGmail = await getPreference('gmailEnabled');
  theme = await getPreference('colorSet');
  if (enabledForGmail) {
    handlePageEmails();
    listen();
  }
})();

function handlePageEmails() {
  logger('searching page for emails');
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
