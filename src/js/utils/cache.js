// A naive cache implementation for scores that
// are returned from the SubscriptionScore API
//
// Uses indexdb with a 6 hour ttl per key
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

let db;
const DB_NAME = 'subscriptionscores';
let DBOpenRequest;
if (indexedDB) {
  DBOpenRequest = indexedDB.open(DB_NAME, 5);
  // these two event handlers act on the database being opened successfully, or not
  DBOpenRequest.onerror = function() {
    console.log('error opening cache');
  };

  DBOpenRequest.onsuccess = function() {
    // store the result of opening the database in the db variable. This is used a lot below
    db = DBOpenRequest.result;
  };
  // This event handles the event whereby a new version of the database needs to be created
  // Either one has not been created before, or a new version number has been submitted via the
  // window.indexedDB.open line above
  //it is only implemented in recent browsers
  DBOpenRequest.onupgradeneeded = function(event) {
    let db = event.target.result;
    db.onerror = function(ev) {
      console.log('[cache]: error', ev);
    };
    // Create an objectStore for this database
    const domainStore = db.createObjectStore('domainscores', {
      keyPath: 'domain'
    });
    const addressStrore = db.createObjectStore('addressscores', {
      keyPath: 'address'
    });

    domainStore.createIndex('timestamp', 'timestamp', { unique: false });
    addressStrore.createIndex('timestamp', 'timestamp', { unique: false });
  };
}

export function putDomainScore(domain, rank) {
  return put('domainscores', { domain, rank });
}
export function getDomainScore(domain) {
  return get('domainscores', domain);
}
export function putAddressScore(address, rank) {
  return put('addressscores', { address, rank });
}
export function getAddressScore(address) {
  return get('addressscores', address);
}
export function getAddressScores(addresses) {
  return getAll('addressscores', addresses);
}

export function put(store, value) {
  if (!db) return null;
  const tx = db.transaction([store], 'readwrite');
  const objectStore = tx.objectStore(store);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject();
    objectStore.put({ ...value, timestamp: Date.now() });
  });
}

export function getAll(store, keys) {
  if (!db) return null;
  const tx = db.transaction([store], 'readwrite');
  const objectStore = tx.objectStore(store);
  return Promise.all(
    keys.map(key => {
      return new Promise((resolve, reject) => {
        tx.onerror = () => reject();
        const objectStoreRequest = objectStore.get(key);
        objectStoreRequest.onsuccess = () => {
          let data = objectStoreRequest.result;
          resolve(data);
        };
      });
    })
  ).then(arr => arr.filter(a => a));
}

export function get(store, key) {
  if (!db) return null;
  const tx = db.transaction([store], 'readwrite');
  const objectStore = tx.objectStore(store);
  return new Promise((resolve, reject) => {
    tx.onerror = () => reject();
    const objectStoreRequest = objectStore.get(key);
    objectStoreRequest.onsuccess = () => {
      let data = objectStoreRequest.result;
      resolve(data);
    };
  });
}

const SIX_HOURS = 1000 * 60 * 60 * 6;
const ONE_DAY = 1000 * 60 * 60 * 24;

export function clearCache() {
  const tx = db.transaction(['domainscores', 'addressscores'], 'readwrite');
  const sixHourRange = IDBKeyRange.upperBound(new Date() - SIX_HOURS);
  const oneDayRange = IDBKeyRange.upperBound(new Date() - ONE_DAY);

  function onsuccess(e) {
    var cursor = e.target.result;
    if (!cursor) return;
    cursor.delete();
    cursor.continue();
  }

  tx
    .objectStore('domainscores')
    .index('timestamp')
    .openCursor(sixHourRange).onsuccess = onsuccess;
  tx
    .objectStore('addressscores')
    .index('timestamp')
    .openCursor(oneDayRange).onsuccess = onsuccess;
}
