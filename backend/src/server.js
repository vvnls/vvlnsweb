import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

await connectDB();
app.listen(env.PORT, () => console.log(`API running on http://localhost:${env.PORT}`));