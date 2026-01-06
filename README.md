# Dispatch Zero – Firebase “Loads” Persistence

This repo now includes a minimal Firebase integration (Firestore) to **save/load “loads”**.

## Setup

1) Install deps:

```bash
npm install
```

2) Create your env file:

```bash
cp .env.example .env
```

Fill in the values from **Firebase Console → Project settings → General → Your apps (Web app)**.

## Usage

- **Save a load**: `saveLoad({ userId, name, data })`
- **Get a load**: `getLoad(id)`
- **List loads**: `listLoads({ userId, limit })`

Example script (requires `.env`):

```bash
node --env-file=.env src/example.js
```

## Where the code lives

- Firebase init: `src/firebase.js`
- Loads persistence: `src/loads.js` (Firestore collection: `loads`)

