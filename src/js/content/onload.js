import logger, { errorLogger } from '../utils/logger';

import digest from '../utils/digest';
/**
 * This script runs after the DOM has loaded and we have fetched
 * the current scores.
 *
 * It is injected into the page as a <script> tag so that it can
 * get data from forms as they are submitted, and intercept their
 * submit handlers
 *
 * Because the onload script cannot request data from the extension,
 * we use the text content of the script tag to pass in the
 * information that we need. Currently this is the ignoredEmailAddress
 * list (hashed for obfuscation), and the url of the frame.html we'll
 * inject later to show the popup.
 *
 * It appears in the DOM like this;
 * <script
 *  integrity="sha256-<GENERATED_HASH_AT_BUILD>"
 *  src="chrome-extension://icadjidlmcbagkpegieghaplhpmbaelg/onload.bundle.js"
 *  type="text/javascript"
 * >
 *  {
 *    "ignoredEmailAddresses": ["ignore@subscriptionscore.com"],
 *    "framePath": "chrome-extension://<EXT_ID>/frame.html"
 *  }
 * </script>
 */
import { injectModal } from './modal';

let haltedForm;
const FORM_DATA_ATTRIBUTE = 'data-ss-approved';

logger('running content script');

/**
 * Attach our submit listener to every <form> element in the DOM
 * that contains an input[type=email] or input[type=password]
 * because this is likely a login or signup form we want to intercept
 */
function attachToEmailForms({ framePath, ignoredEmailAddresses }) {
  logger('loaded');
  const $inputs = document.querySelectorAll(
    'input[type="email"],input[type="password"]'
  );
  $inputs.forEach($input => {
    logger(`attached to form ${$input.form.name}`);
    addSubmitListener($input.form, ignoredEmailAddresses, framePath);
  });
}

function addSubmitListener($form, ignoredEmailAddresses, framePath) {
  $form.__subscriptionscore_is_patched = true;
  if ($form.onsubmit) {
    $form._onsubmit = $form.onsubmit;
    $form.onsubmit = () => {
      console.warn(
        '[subscriptionscore] A form has been blocked from submitting by your Subscription Score extension.'
      );
    };
  }
  // replace the submit handler with ours...
  $form._internalSubmit = onSubmitForm.bind(
    this,
    $form,
    ignoredEmailAddresses,
    framePath
  );
  // ...and add the submit event
  $form._addEventListener('submit', e => $form._internalSubmit(e));
}

/**
 * Our submit handler that intercepts whatever submit handler is
 * on the page's form.
 *
 * The submit handler gets the formData and makes sure we want to
 * block this first, if we do then we show our modal
 *
 * @param {<Form> Element} $form
 * @param {[String]} ignoredEmailAddresses
 * @param {String} framePath
 * @param {submit Event} e
 */
function onSubmitForm($form, ignoredEmailAddresses, framePath, e) {
  $form._originalEvent = e;
  const previouslyApproved = $form.getAttribute(FORM_DATA_ATTRIBUTE) === 'true';
  if (previouslyApproved) {
    return true;
  }
  // check if any of the fields have an email
  // address in them. If any of the email addresses
  // are NOT in our ingored email list then
  // block the form
  //
  // we don't use await here because we want to return false
  // from the function in order to block the native submit handler
  hasCriticalEmailAddress($form, ignoredEmailAddresses)
    .then(hasNonIgnoredEmail => {
      if (!hasNonIgnoredEmail) {
        return doSubmit($form);
      }
      haltedForm = $form;
      return injectModal({
        onApproved,
        onCancelled,
        addIgnoreEmail,
        addIgnoreSite,
        emails: getEmailValues(haltedForm),
        framePath
      });
    })
    .catch(err => errorLogger(err));

  // block submission, will get resubmitted either
  // after the background script tells us it's ok
  // or the user says it's okay
  e.preventDefault();
  return false;
}

function hasCriticalEmailAddress($form, ignoredEmailAddresses) {
  const formData = new FormData($form);
  for (let item of formData) {
    const [, value] = item;
    if (typeof value === 'undefined' || !value.includes('@')) {
      continue; // definitely not an email
    }
    return digest(value).then(hashedValue => {
      if (!ignoredEmailAddresses.includes(hashedValue)) {
        return true;
      }
      return false;
    });
  }
  return Promise.resolve(false);
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
  return $form.submit();
}

function onApproved() {
  haltedForm.setAttribute(FORM_DATA_ATTRIBUTE, 'true');
  doSubmit(haltedForm);
}

function onCancelled() {
  haltedForm.setAttribute(FORM_DATA_ATTRIBUTE, 'false');
}

function addIgnoreEmail() {
  doSubmit(haltedForm);
}

function addIgnoreSite() {
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

/**
 * Lets get started
 */
(() => {
  // if the script has already run for some reason then
  // don't run it again
  if (document.currentScript.getAttribute('data-ss-running')) {
    return;
  }
  document.currentScript.setAttribute('data-ss-running', true);
  // get the variables passed in from the script content
  const { framePath, ignoredEmailAddresses } = JSON.parse(
    document.currentScript.innerText
  );
  // attach to forms
  attachToEmailForms({ framePath, ignoredEmailAddresses });
})();
