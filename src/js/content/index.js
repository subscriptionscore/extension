import { injectModal } from './modal';

const emailWhitelist = ['james.ivings@gmail.com'];
const blockFor = ['F', 'D', 'E', 'C'];
let haltedForm;

console.log('[subscriptionscore]: running content script');
const domainData = {
  rank: 'C'
};

function attachToEmailForms() {
  console.log('[subscriptionscore]: loaded');
  const $inputs = document.querySelectorAll('input[type="email"]');
  [...$inputs].forEach($input => {
    addSubmitListener($input.form, $input);
  });
}

function addSubmitListener($form, $input) {
  $form.addEventListener('submit', e => onSubmitForm(e, $form, $input));
}

function onSubmitForm(e, $form, $emailInput) {
  const emailAddress = $emailInput.value;
  if ($form.getAttribute('data-approved') === 'true') {
    return true;
  }
  if (emailWhitelist.includes(emailAddress)) {
    return true;
  }
  if (blockFor.includes(domainData.rank)) {
    console.log('[subscriptionscore]: preventing form submit');
    haltedForm = $form;
    e.preventDefault();
    injectModal(
      () => {
        haltedForm.addAttribute('data-approved', 'true');
        haltedForm.submit();
      },
      () => {
        haltedForm.addAttribute('data-approved', 'false');
      }
    );
    return false;
  }
}

// runs at document idle as per manifest.json
(() => {
  attachToEmailForms();
})();
