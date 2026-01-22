import { Router } from 'express';
import prisma from '../lib/prisma.ts';

const router = Router();

router.get('/analytics', async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        // CHANGED: Using 'costs' because that's what your schema defines
        costs: true 
      }
    });

    res.json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('DATABASE ERROR:', error); 
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;