import { injectModal } from './modal';

const emailWhitelist = ['james.ivings@gmail.com'];
const blockFor = ['F', 'D', 'E', 'C'];

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
  if (emailWhitelist.includes(emailAddress)) {
    return true;
  }
  if (blockFor.includes(domainData.rank)) {
    console.log('[subscriptionscore]: preventing form submit');
    e.preventDefault();
    injectModal($form);
    return false;
  }
}

// runs at document idle as per manifest.json
(() => {
  attachToEmailForms();
})();
