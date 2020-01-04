chrome.storage.onChanged.addListener(function(changes, namespace) {
  chrome.runtime.sendMessage({
    action: 'log',
    data: `Changes to storage ${namespace}`
  });
  chrome.runtime.sendMessage({
    action: 'log',
    data: changes
  });
});

export function onStorageChange(fn) {
  chrome.storage.onChanged.addListener(fn);
}

export function setItem(data) {
  return new Promise(resolve => {
    chrome.storage.sync.set(data, () => {
      return resolve(data);
    });
  });
}

export function getItem(key) {
  return new Promise(resolve => {
    chrome.storage.sync.get([key], result => {
      const data = result[key];
      return resolve(data);
    });
  });
}

export function getItems() {
  return new Promise(resolve => {
    // pass in null to get the entire contents of storage.
    chrome.storage.sync.get(null, result => {
      const data = result;
      return resolve(data);
    });
  });
}
