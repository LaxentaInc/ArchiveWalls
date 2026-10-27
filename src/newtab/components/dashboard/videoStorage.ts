// indexeddb storage engine for caching high-definition video wallpaper blobs
// bypasses the 5mb localstorage quota to support 50mb+ video files smoothly

const DB_NAME = 'archive_walls_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'video_blobs';

// opens or initializes the indexeddb database instance
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// persists a video blob into indexeddb keyed by unique id
export async function saveVideoBlob(id: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id, blob, updatedAt: Date.now() });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// retrieves a cached video blob from indexeddb by its id
export async function getVideoBlob(id: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result && request.result.blob) {
          resolve(request.result.blob as Blob);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

// removes a cached video blob from indexeddb
export async function deleteVideoBlob(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {}
}
