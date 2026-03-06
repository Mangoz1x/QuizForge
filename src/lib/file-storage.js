const DB_NAME = "quizforge_files";
const STORE_NAME = "files";
const DB_VERSION = 1;

// --- Supported types ---

export const SUPPORTED_TYPES = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  pdfs: ["application/pdf"],
  text: ["text/plain"],
};

export const ALL_ACCEPTED_TYPES = [
  ...SUPPORTED_TYPES.images,
  ...SUPPORTED_TYPES.pdfs,
  ...SUPPORTED_TYPES.text,
];

export const MAX_FILES = 10;

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// --- Size limits per type ---

export function getMaxFileSize(mimeType) {
  if (SUPPORTED_TYPES.images.includes(mimeType)) return 5 * 1024 * 1024;
  if (SUPPORTED_TYPES.pdfs.includes(mimeType)) return 25 * 1024 * 1024;
  if (SUPPORTED_TYPES.text.includes(mimeType)) return 1 * 1024 * 1024;
  return 5 * 1024 * 1024;
}

function formatMB(bytes) {
  return Math.round(bytes / (1024 * 1024));
}

function getTypeLabel(mimeType) {
  if (SUPPORTED_TYPES.images.includes(mimeType)) return "image";
  if (SUPPORTED_TYPES.pdfs.includes(mimeType)) return "PDF";
  if (SUPPORTED_TYPES.text.includes(mimeType)) return "text";
  return "unknown";
}

// --- Validation ---

export function validateFile(file) {
  if (!ALL_ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error:
        "Unsupported file type. Use PDF, images (JPEG, PNG, GIF, WebP), or text files.",
    };
  }

  const maxSize = getMaxFileSize(file.type);
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${formatMB(maxSize)} MB for ${getTypeLabel(file.type)} files.`,
    };
  }

  return { valid: true, error: null };
}

// --- Content hashing ---

export async function hashFileContent(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// --- Base64 helper ---

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// --- IndexedDB helpers ---

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function generateId() {
  return crypto.randomUUID();
}

// --- CRUD operations ---

export async function findByHash(hash) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const match = request.result.find((r) => r.hash === hash);
      resolve(match || null);
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function saveFile(file) {
  const [base64, hash] = await Promise.all([fileToBase64(file), hashFileContent(file)]);

  let preview = null;
  if (SUPPORTED_TYPES.images.includes(file.type)) {
    preview = base64;
  } else if (SUPPORTED_TYPES.text.includes(file.type)) {
    const text = await file.text();
    preview = text.slice(0, 200);
  }

  const record = {
    id: generateId(),
    name: file.name,
    type: file.type,
    size: file.size,
    data: base64,
    hash,
    preview,
    createdAt: Date.now(),
  };

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(record);
    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function getFile(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function deleteFile(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function getAllFiles() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const records = request.result.map(({ data, ...rest }) => rest);
      resolve(records);
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function clearFiles() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}
