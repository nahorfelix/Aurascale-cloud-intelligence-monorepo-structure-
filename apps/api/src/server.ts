import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import dashboardRoutes from './routes/dashboard.ts';

const app = express();
const PORT = process.env.PORT || 3001;

// Standard Middlewares
app.use(cors());
app.use(express.json());

// REGISTER YOUR NEW ROUTE
// This makes your analytics available at http://localhost:3001/api/analytics
app.use('/api', dashboardRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'AuraScale API is Healthy' });
});

app.listen(PORT, () => {
  console.log(`🚀 AuraScale Server running on http://localhost:${PORT}`);
});