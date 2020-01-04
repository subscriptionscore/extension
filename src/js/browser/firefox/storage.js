browser.storage.onChanged.addListener(function(changes, namespace) {
  browser.runtime.sendMessage({
    action: 'log',
    data: `Changes to storage ${namespace}`
  });
  browser.runtime.sendMessage({
    action: 'log',
    data: changes
  });
});

export function onStorageChange(fn) {
  browser.storage.onChanged.addListener(fn);
}

export function setItem(data) {
  console.log('setting store', data);
  return browser.storage.sync.set(data);
}

export async function getItem(key) {
  const result = await browser.storage.sync.get(key);
  console.log(`get from store ${key}`, result[key]);
  return result[key];
}

export async function getItems() {
  const result = await browser.storage.sync.get(null);
  return result;
}
