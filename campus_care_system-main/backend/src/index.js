import { app } from './app.js';
import { env } from './config/env.js';
import { pingDb } from './config/db.js';

const server = app.listen(env.port, async () => {
  console.log(`CampusCare API listening on http://localhost:${env.port}`);
  try {
    await pingDb();
    console.log(`MySQL connected (${env.db.host}:${env.db.port}/${env.db.name})`);
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
    console.error('Run `npm run seed` from the backend folder after starting MySQL.');
  }
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
