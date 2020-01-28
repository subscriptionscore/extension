import { injectModal } from './modal';

let haltedForm;

const FORM_DATA_ATTRIBUTE = 'data-ss-approved';

console.log('[subscriptionscore]: running content script');

async function attachToEmailForms({ framePath, ignoredEmailAddresses }) {
  console.log('[subscriptionscore]: loaded');

  const $inputs = document.querySelectorAll(
    'input[type="email"],input[type="password"]'
  );

  $inputs.forEach($input => {
    console.log(`[subscriptionscore]: attached to form ${$input.form.name}`);
    addSubmitListener($input.form, ignoredEmailAddresses, framePath);
  });
}

function addSubmitListener($form, ignoredEmailAddresses, framePath) {
  if ($form.onsubmit) {
    $form._onsubmit = $form.onsubmit;
    $form.onsubmit = () => {
      console.warn(
        '[subscriptionscore]: This form has been prevented from submitting by your Subscription Score extension.'
      );
    };
  }
  $form._internalSubmit = onSubmitForm.bind(
    this,
    $form,
    ignoredEmailAddresses,
    framePath
  );
  $form._addEventListener('submit', e => $form._internalSubmit(e));
}

function onSubmitForm($form, ignoredEmailAddresses, framePath, e) {
  $form._originalEvent = e;
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
    return doSubmit($form);
  }
  haltedForm = $form;

  console.log('[subscriptionscore]: checking rank...');
  injectModal({
    onApproved,
    onCancelled,
    addIgnoreEmail,
    addIgnoreSite,
    framePath
  });
  // block submission, will get resubmitted either
  // after the background script tells us it's ok
  // or the user says it's okay
  e.preventDefault();
  return false;
}

function doSubmit($form) {
  $form.removeEventListener('submit', $form._internalSubmit);
  if ($form._onsubmit) {
    const e = $form._originalEvent;
    $form.onsubmit = $form._onsubmit;
    if (typeof $form.onsubmit === 'function') {
      return $form.onsubmit(e);
    }
  }
  // fallback to default submit action
  $form.submit();
}

function onApproved() {
  haltedForm.setAttribute(FORM_DATA_ATTRIBUTE, 'true');
  // browser.runtime.sendMessage({
  //   action: 'signup-allowed'
  // });
  doSubmit(haltedForm);
}

function onCancelled() {
  haltedForm.setAttribute(FORM_DATA_ATTRIBUTE, 'false');
  // browser.runtime.sendMessage({
  //   action: 'signup-blocked'
  // });
}

function addIgnoreEmail() {
  const emails = getEmailValues(haltedForm);
  if (emails.length) {
    // browser.runtime.sendMessage({
    //   action: 'ignore-email',
    //   data: emails
    // });
  }
  doSubmit(haltedForm);
}

function addIgnoreSite(domain) {
  // browser.runtime.sendMessage({
  //   action: 'ignore-site',
  //   data: domain
  // });
  doSubmit(haltedForm);
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

  const { framePath, ignoredEmailAddresses } = JSON.parse(
    document.currentScript.innerText
  );

  attachToEmailForms({ framePath, ignoredEmailAddresses });
})();
