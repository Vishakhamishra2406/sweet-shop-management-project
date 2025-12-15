import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './database/database';
import { seedDatabase } from './database/seed';
import authRoutes from './routes/auth';
import sweetRoutes from './routes/sweets';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function startServer() {
  try {
    await db.initialize();
    
    // Seed database with sample data if empty
    try {
      await seedDatabase();
    } catch (seedError) {
      console.warn('Warning: Could not seed database:', seedError);
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Only start the server when not running in a test environment.
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;

