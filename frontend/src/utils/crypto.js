const SALT = "stud-iq-notes-salt-v1";

async function deriveKey(authId) {
  const enc      = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(authId),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name:       "PBKDF2",
      salt:       enc.encode(SALT),
      iterations: 100000,
      hash:       "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function bufToBase64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBuf(b64) {
  const binary = atob(b64);
  const buf    = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
  return buf.buffer;
}

export async function encryptText(plaintext, authId) {
  if (!plaintext) return plaintext;

  try {
    const key = await deriveKey(authId);
    const iv  = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();

    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(plaintext)
    );

    const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.byteLength);

    return "enc:" + bufToBase64(combined.buffer);
  } catch (err) {
    console.error("encryptText error:", err);
    return plaintext; // fallback — return plaintext if encryption fails
  }
}

export async function decryptText(cipherBase64, authId) {
  if (!cipherBase64 || !cipherBase64.startsWith("enc:")) return cipherBase64;

  try {
    const key     = await deriveKey(authId);
    const combined = new Uint8Array(base64ToBuf(cipherBase64.slice(4)));

    const iv         = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error("decryptText error:", err);
    return "[Unable to decrypt]"; 
  }
}

export async function encryptNote(note, authId) {
  const [encTitle, encContent] = await Promise.all([
    encryptText(note.title,   authId),
    encryptText(note.content, authId),
  ]);
  return { ...note, title: encTitle, content: encContent };
}

export async function decryptNote(note, authId) {
  const [decTitle, decContent] = await Promise.all([
    decryptText(note.title,   authId),
    decryptText(note.content, authId),
  ]);
  return { ...note, title: decTitle, content: decContent };
}

export async function decryptNotes(notes, authId) {
  return Promise.all(notes.map((n) => decryptNote(n, authId)));
}