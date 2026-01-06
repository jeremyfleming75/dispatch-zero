import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit as limitTo,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore/lite";
import { getDb } from "./firebase.js";

/**
 * @typedef {Object} Load
 * @property {string} [id] Firestore doc id
 * @property {string} [userId] Owner id (optional)
 * @property {string} [name] Human-friendly label (optional)
 * @property {any} data Arbitrary payload for the "load"
 * @property {any} [createdAt] Firestore timestamp (server-set)
 * @property {any} [updatedAt] Firestore timestamp (server-set)
 */

const COLLECTION = "loads";

/**
 * Saves a load to Firestore.
 * - If `load.id` is provided, upserts that doc id.
 * - Otherwise creates a new doc id.
 *
 * Returns the doc id.
 *
 * @param {Load} load
 * @returns {Promise<string>}
 */
export async function saveLoad(load) {
  if (!load || typeof load !== "object") {
    throw new TypeError("saveLoad(load): load must be an object");
  }
  if (typeof load.data === "undefined") {
    throw new TypeError("saveLoad(load): load.data is required");
  }

  const db = getDb();
  const col = collection(db, COLLECTION);
  const ref = load.id ? doc(col, load.id) : doc(col);

  const now = serverTimestamp();

  const payload = {
    userId: load.userId ?? null,
    name: load.name ?? null,
    data: load.data,
    updatedAt: now,
    ...(load.id ? {} : { createdAt: now }),
  };

  await setDoc(ref, payload, { merge: true });
  return ref.id;
}

/**
 * Loads a single load by id.
 *
 * @param {string} id
 * @returns {Promise<Load|null>}
 */
export async function getLoad(id) {
  if (!id) throw new TypeError("getLoad(id): id is required");
  const db = getDb();
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Lists loads, optionally filtered by userId.
 *
 * @param {{ userId?: string, limit?: number }} [opts]
 * @returns {Promise<Load[]>}
 */
export async function listLoads(opts = {}) {
  const db = getDb();
  const col = collection(db, COLLECTION);

  const parts = [];
  if (opts.userId) parts.push(where("userId", "==", opts.userId));
  parts.push(orderBy("updatedAt", "desc"));
  parts.push(limitTo(Math.min(Math.max(opts.limit ?? 50, 1), 200)));

  const q = query(col, ...parts);
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }));
}

