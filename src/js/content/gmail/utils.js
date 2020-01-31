const SELECTORS = {
  emailRows: 'table.zt tr.zA',
  authorValueSpan: '.yX [email]',
  selectedTab: '.aKk [aria-selected=true]',
  tabLabelAttribute: 'aria-label'
};

let state = {
  selectedTab: '',
  page: ''
};
let changeHandlers = [];

export function getEmailAddressesOnPage() {
  const emails = [
    ...document.querySelectorAll(
      `${SELECTORS.emailRows} ${SELECTORS.authorValueSpan}`
    )
  ].map(e => e.getAttribute('email'));
  return emails.filter((v, i, arr) => arr.indexOf(v) === i);
}

export function addPageChangeListener(fn) {
  changeHandlers = [...changeHandlers, fn];
}

function getSelectedTabName() {
  const tab = document.querySelector(SELECTORS.selectedTab);
  return tab ? tab.getAttribute(SELECTORS.tabLabelAttribute) : null;
}

function firePageChangeHandlers() {
  changeHandlers.forEach(fn => fn(state));
}

export function checkPageChange() {
  let dirty = false;
  const currentTab = getSelectedTabName();
  if (currentTab !== state.selectedTab) {
    state = { ...state, selectedTab: currentTab };
    dirty = true;
  }
  if (window.location.hash !== state.page) {
    state = { ...state, page: window.location.hash };
    dirty = true;
  }

  if (dirty) {
    return firePageChangeHandlers();
  }
}

export function startListening() {
  setInterval(checkPageChange, 1000);
  checkPageChange();
  return state;
}
