import browser from 'browser';
import { getPreference } from '../utils/storage';
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
import { injectModal } from './modal';

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

  $inputs.forEach($input => {
    addSubmitListener(
      $input.form,
      ignoredEmailAddresses,
      ignoredSites,
      blockedRank
    );
  });
}

function addSubmitListener(
  $form,
  ignoredEmailAddresses,
  ignoredSites,
  blockedRank
) {
  $form.addEventListener('submit', e =>
    onSubmitForm(e, $form, ignoredEmailAddresses, ignoredSites, blockedRank)
  );
}

function onSubmitForm(
  e,
  $form,
  ignoredEmailAddresses,
  ignoredSites,
  blockedRank
) {
  console.log('[subscriptionscore]: on submit');
  const previouslyApproved = $form.getAttribute(FORM_DATA_ATTRIBUTE) === 'true';
  if (previouslyApproved) {
    return true;
  }
  // check if any of the fields have an email
  // address in them. If any of the email addresses
  // are NOT in our ingored email list then
  // block the form
  const formData = new FormData($form);
  let hasNonIgnoredEmail = false;

  for (let item of formData) {
    const [, value] = item;
    if (value.includes('@') && !ignoredEmailAddresses.includes(value)) {
      hasNonIgnoredEmail = true;
    }
  }
  if (!hasNonIgnoredEmail) {
    console.warn('[subscriptionscore]: no email');
    return true;
  }
  haltedForm = $form;

  console.log('[subscriptionscore]: checking rank...');

  // get the domain rank from the background script
  browser.runtime.sendMessage({ action: 'get-current-rank' }, response => {
    const { rank, domain } = response;
    const isIgnored = ignoredSites.some(is => is === domain);
    console.log('[subscriptionscore]: ranked', `${rank} - ${domain}`);

    const isBelowAlertThreshold =
      ranks.indexOf(rank) <= ranks.indexOf(blockedRank);
    const blockFormSubmit = !isIgnored && isBelowAlertThreshold;

    if (blockFormSubmit) {
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
  browser.runtime.sendMessage({
    action: 'signup-allowed'
  });
  haltedForm.submit();
}

function onCancelled() {
  haltedForm.setAttribute(FORM_DATA_ATTRIBUTE, 'false');
  browser.runtime.sendMessage({
    action: 'signup-blocked'
  });
}

function addIgnoreEmail() {
  const emails = getEmailValues(haltedForm);
  if (emails.length) {
    browser.runtime.sendMessage({
      action: 'ignore-email',
      data: emails
    });
  }
  haltedForm.submit();
}

function addIgnoreSite(domain) {
  browser.runtime.sendMessage({
    action: 'ignore-site',
    data: domain
  });
  haltedForm.submit();
}

function getEmailValues($form) {
  const formData = new FormData($form);
  let emails = [];
  for (let item of formData) {
    const [, value] = item;
    if (value.includes('@')) {
      emails = [...emails, value];
    }
  }
  return emails;
}

(async () => {
  if (document.body.getAttribute('data-ss-running')) {
    return;
  }
  document.body.setAttribute('data-ss-running', true);
  const ignoredSites = await getPreference('ignoredSites');
  const ignoredEmailAddresses = await getPreference('ignoredEmailAddresses');
  const blockedRank = await getPreference('blockedRank');
  attachToEmailForms(ignoredEmailAddresses, ignoredSites, blockedRank);
})();
