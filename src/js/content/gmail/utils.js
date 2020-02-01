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

/**
 * Searches the DOM for visible emails and grabs the email address
 * from their sender attribute.
 *
 * Gmail caches the rendered tabs in the DOM so sometimes the
 * querySelector returns a load of items that aren't currently
 * visible, so we also discard these.
 */
export function getEmailAddressesOnPage() {
  const emails = [
    ...document.querySelectorAll(
      `${SELECTORS.emailRows} ${SELECTORS.authorValueSpan}`
    )
  ].reduce(
    // reduce the elements into only ones that are visible
    // and get their email address attribute, and return only
    // the unique values
    (out, $el) => {
      const value = $el.getAttribute('email');
      // if not visible then offsetTop is 0
      if (value && $el.offsetTop !== 0) {
        return out.indexOf(value) === -1 ? [...out, value] : out;
      }
      return out;
    },
    []
  );
  return emails;
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

/**
 * Checks to see if the tab has changed or the URL hash
 * if different from last time we checked. If it is then
 * there are probably now a bunch of different emails on
 * the page so we need to fetch details of them
 */
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
