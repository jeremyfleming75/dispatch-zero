import test from "node:test";
import assert from "node:assert/strict";

import { getFirebaseConfigFromEnv } from "./firebase.js";

test("getFirebaseConfigFromEnv throws when required keys missing", () => {
  assert.throws(
    () => getFirebaseConfigFromEnv({}),
    /Missing Firebase env vars:/
  );
});

test("getFirebaseConfigFromEnv returns config when keys exist", () => {
  const cfg = getFirebaseConfigFromEnv({
    FIREBASE_API_KEY: "a",
    FIREBASE_AUTH_DOMAIN: "b",
    FIREBASE_PROJECT_ID: "c",
    FIREBASE_STORAGE_BUCKET: "d",
    FIREBASE_MESSAGING_SENDER_ID: "e",
    FIREBASE_APP_ID: "f",
  });

  assert.equal(cfg.apiKey, "a");
  assert.equal(cfg.projectId, "c");
});

