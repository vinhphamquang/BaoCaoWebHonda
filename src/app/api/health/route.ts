/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: API Health Check
 *     description: Check if the Honda Plus API is running and healthy
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Honda Plus API is healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 uptime:
 *                   type: number
 *                   description: "Server uptime in seconds"
 *                 environment:
 *                   type: string
 *                   example: "production"
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "connected"
 *                     responseTime:
 *                       type: number
 *                       description: "Database response time in ms"
 *       503:
 *         description: API is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Honda Plus API is unhealthy"
 *                 error:
 *                   type: string
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { version } from '../../../../package.json';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Check database connection
    let dbStatus = 'disconnected';
    let dbResponseTime = 0;
    
    try {
      await connectDB();
      dbResponseTime = Date.now() - startTime;
      dbStatus = 'connected';
    } catch (dbError) {
      console.error('Database health check failed:', dbError);
      dbStatus = 'error';
    }

    const healthData = {
      success: true,
      message: 'Honda Plus API is healthy',
      timestamp: new Date().toISOString(),
      version: version || '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        responseTime: dbResponseTime
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
      }
    };

    // Return 503 if database is not connected
    if (dbStatus === 'error') {
      return NextResponse.json(
        {
          success: false,
          message: 'Honda Plus API is unhealthy',
          error: 'Database connection failed',
          ...healthData
        },
        { status: 503 }
      );
    }

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Honda Plus API is unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        version: version || '1.0.0'
      },
      { status: 503 }
    );
  }
}
