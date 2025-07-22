/**
 * @jest-environment node
 */

import { GET } from '@/app/api/health/route'
import { NextRequest } from 'next/server'

// Mock MongoDB connection
jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
}))

describe('/api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return healthy status when database is connected', async () => {
    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Honda Plus API is healthy')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('version')
    expect(data).toHaveProperty('uptime')
    expect(data).toHaveProperty('environment')
    expect(data).toHaveProperty('database')
    expect(data.database.status).toBe('connected')
  })

  it('should return unhealthy status when database connection fails', async () => {
    // Mock database connection failure
    const mockConnectDB = require('@/lib/mongodb').default
    mockConnectDB.mockRejectedValueOnce(new Error('Database connection failed'))

    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(503)
    expect(data.success).toBe(false)
    expect(data.message).toBe('Honda Plus API is unhealthy')
    expect(data.error).toBe('Database connection failed')
  })

  it('should include system information in response', async () => {
    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    expect(data).toHaveProperty('memory')
    expect(data.memory).toHaveProperty('used')
    expect(data.memory).toHaveProperty('total')
    expect(data.memory).toHaveProperty('external')

    expect(data).toHaveProperty('system')
    expect(data.system).toHaveProperty('platform')
    expect(data.system).toHaveProperty('nodeVersion')
    expect(data.system).toHaveProperty('pid')
  })

  it('should have correct cache headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET()

    expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
    expect(response.headers.get('Pragma')).toBe('no-cache')
    expect(response.headers.get('Expires')).toBe('0')
  })
})
