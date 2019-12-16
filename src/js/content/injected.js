import { injectModal } from './modal';
import { getPreference } from '../utils/storage';

let ignoredEmailAddresses;
let blockedRank;
const ranks = ['F', 'E', 'D', 'C', 'B', 'A', 'A+'];
let haltedForm;

const FORM_DATA_ATTRIBUTE = 'data-ss-approved';

console.log('[subscriptionscore]: running content script');

function attachToEmailForms() {
  console.log('[subscriptionscore]: loaded');
  const $inputs = document.querySelectorAll(
    'input[type="email"],input[type="password"]'
  );
  new Set($inputs).forEach($input => {
    addSubmitListener($input.form, $input);
  });
}

function addSubmitListener($form, $input) {
  $form.addEventListener('submit', e => onSubmitForm(e, $form, $input));
}

function onSubmitForm(e, $form, $emailInput) {
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
    const { rank } = response;
    if (ranks.indexOf(rank) <= ranks.indexOf(blockedRank)) {
      console.log('[subscriptionscore]: preventing form submit');
      injectModal(
        () => {
          haltedForm.setAttribute(FORM_DATA_ATTRIBUTE, 'true');
          chrome.runtime.sendMessage({
            action: 'signup-allowed'
          });
          haltedForm.submit();
        },
        () => {
          haltedForm.setAttribute(FORM_DATA_ATTRIBUTE, 'false');
          chrome.runtime.sendMessage({
            action: 'signup-blocked'
          });
        }
      );
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
(async () => {
  ignoredEmailAddresses = await getPreference('ignoredEmailAddresses');
  blockedRank = await getPreference('blockedRanks');
  attachToEmailForms();
})();
