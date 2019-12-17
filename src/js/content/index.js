import { injectModal } from './modal';
import { getPreference } from '../utils/storage';

const ranks = ['F', 'E', 'D', 'C', 'B', 'A', 'A+'];
let haltedForm;

const FORM_DATA_ATTRIBUTE = 'data-ss-approved';

console.log('[subscriptionscore]: running content script');

async function attachToEmailForms(
  ignoredEmailAddresses,
  ignoredSites,
  blockedRank
) {
  console.log('[subscriptionscore]: loaded');

  const $inputs = document.querySelectorAll(
    'input[type="email"],input[type="password"]'
  );

  new Set($inputs).forEach($input => {
    addSubmitListener(
      $input.form,
      $input,
      ignoredEmailAddresses,
      ignoredSites,
      blockedRank
    );
  });
}

function addSubmitListener(
  $form,
  $input,
  ignoredEmailAddresses,
  ignoredSites,
  blockedRank
) {
  $form.addEventListener('submit', e =>
    onSubmitForm(
      e,
      $form,
      $input,
      ignoredEmailAddresses,
      ignoredSites,
      blockedRank
    )
  );
}

function onSubmitForm(
  e,
  $form,
  $emailInput,
  ignoredEmailAddresses,
  ignoredSites,
  blockedRank
) {
  const emailAddress = $emailInput.value;

  if ($form.getAttribute(FORM_DATA_ATTRIBUTE) === 'true') {
    return true;
  }
  if (ignoredEmailAddresses.includes(emailAddress)) {
    return true;
  }
  haltedForm = $form;

  // get the domain rank from the background script
  chrome.runtime.sendMessage({ action: 'get-current-rank' }, response => {
    const { rank, domain } = response;
    const isIgnored = ignoredSites.some(is => is === domain);

    if (!isIgnored && ranks.indexOf(rank) <= ranks.indexOf(blockedRank)) {
      console.log('[subscriptionscore]: preventing form submit');
      injectModal({
        onApproved,
        onCancelled,
        addIgnoreEmail,
        addIgnoreSite
      });
    } else {
      // resubmit form for real
      haltedForm.setAttribute(FORM_DATA_ATTRIBUTE, 'true');
      haltedForm.submit();
    }
  });

  // block submission, will get resubmitted either
  // after the background script tells us it's ok
  // or the user says it's okay
  e.preventDefault();
  return false;
}

function onApproved() {
  haltedForm.setAttribute(FORM_DATA_ATTRIBUTE, 'true');
  chrome.runtime.sendMessage({
    action: 'signup-allowed'
  });
  haltedForm.submit();
}

function onCancelled() {
  haltedForm.setAttribute(FORM_DATA_ATTRIBUTE, 'false');
  chrome.runtime.sendMessage({
    action: 'signup-blocked'
  });
}

function addIgnoreEmail() {
  const $input = haltedForm.querySelector('input[type="email"]');
  if ($input) {
    const email = $input.value;
    chrome.runtime.sendMessage({
      action: 'ignore-email',
      data: email
    });
  }
}

function addIgnoreSite(domain) {
  chrome.runtime.sendMessage({
    action: 'ignore-site',
    data: domain
  });
}

(async () => {
  const ignoredSites = await getPreference('ignoredSites');
  const ignoredEmailAddresses = await getPreference('ignoredEmailAddresses');
  const blockedRank = await getPreference('blockedRank');
  attachToEmailForms(ignoredEmailAddresses, ignoredSites, blockedRank);
})();
