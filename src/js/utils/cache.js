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
  DBOpenRequest = indexedDB.open(DB_NAME, 4);
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
    const objectStore = db.createObjectStore(DB_NAME, {
      keyPath: 'domain'
    });
    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
  };
}

export function put(domain, rank, normalizedDomain) {
  if (!db) return null;
  const tx = db.transaction([DB_NAME], 'readwrite');
  const objectStore = tx.objectStore(DB_NAME);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject();
    objectStore.put({ domain, rank, normalizedDomain, timestamp: Date.now() });
  });
}

export function get(domain) {
  if (!db) return null;
  const tx = db.transaction([DB_NAME], 'readwrite');
  const objectStore = tx.objectStore(DB_NAME);
  return new Promise((resolve, reject) => {
    tx.onerror = () => reject();
    const objectStoreRequest = objectStore.get(domain);
    objectStoreRequest.onsuccess = () => {
      let data = objectStoreRequest.result;
      resolve(data);
    };
  });
}

const SIX_HOURS = 1000 * 60 * 60 * 6;
export function clearCache() {
  const tx = db.transaction([DB_NAME], 'readwrite');
  const range = IDBKeyRange.upperBound(new Date() - SIX_HOURS);
  tx
    .objectStore(DB_NAME)
    .index('timestamp')
    .openCursor(range).onsuccess = function(e) {
    var cursor = e.target.result;
    if (!cursor) return;
    cursor.delete();
    cursor.continue();
  };
}
