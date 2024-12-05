import express from 'express';
import { router as userRouter } from './routes/users.js';
import { router as healthRouter } from './routes/health.js';

const app = express();
const port = 3000;

app.use(express.json());

// Routes
app.use('/users', userRouter);
app.use('/health', healthRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Node.js! 🚀' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});