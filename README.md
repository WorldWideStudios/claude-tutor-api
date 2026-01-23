# Claude Tutor API

A backend for aggregating context between email and cli

## Services

Third party services here are

- supabase - as a database
- inbound - for sending/receiving emails

## Setup

- install dependencies `npm i`
- for development
  - run worker `npm run run-script src/worker.ts`
    - this doesn't hot reload, will have to restart after each change
  - run server `npm run dev`
- for deployment
  - see Procfile but generally speaking
    - web: `node ./dist/src/index.js`
    - worker: `node ./dist/src/worker.js`
