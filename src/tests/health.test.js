/**
 * Health Check Tests
 * Tests for system health and status endpoints
 */

const request = require('supertest');
const createApp = require('../../app');
const { connectTestDB, disconnectTestDB } = require('../testUtils');

describe('Health Check Controller', () => {
  let app;

  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  describe('GET /api/health', () => {
    it('should return health status with 200', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status');
      expect(res.body.data).toHaveProperty('timestamp');
      expect(res.body.data).toHaveProperty('uptime');
      expect(res.body.data).toHaveProperty('environment');
    });

    it('should indicate healthy database connection', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body.data.database.connected).toBe(true);
      expect(res.body.data.status).toBe('healthy');
    });
  });
});
