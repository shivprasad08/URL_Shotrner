/**
 * Analytics Controller Tests
 * Tests for analytics endpoints
 */

const request = require('supertest');
const createApp = require('../../app');
const { connectTestDB, disconnectTestDB, clearDatabase, createTestUrl } = require('../testUtils');

describe('Analytics Controller', () => {
  let app;

  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  // ==================== GET /api/analytics/:shortCode Tests ====================

  describe('GET /api/analytics/:shortCode - URL Analytics', () => {
    it('should return analytics for existing short URL', async () => {
      await createTestUrl({
        shortCode: 'test123',
        originalUrl: 'https://www.example.com/target',
        clickCount: 10,
      });

      const res = await request(app).get('/api/analytics/test123');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('shortCode', 'test123');
      expect(res.body.data).toHaveProperty('stats');
      expect(res.body.data.stats).toHaveProperty('totalClicks', 10);
    });

    it('should return 404 for non-existent short code', async () => {
      const res = await request(app).get('/api/analytics/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should include recent accesses in analytics', async () => {
      const urlMapping = await createTestUrl({
        shortCode: 'test123',
      });

      // Add some analytics entries
      urlMapping.analytics.push({
        timestamp: new Date(),
        userAgent: 'Chrome',
        ipAddress: '192.168.1.1',
      });
      await urlMapping.save();

      const res = await request(app).get('/api/analytics/test123');

      expect(res.status).toBe(200);
      expect(res.body.data.recentAccesses).toBeDefined();
      expect(res.body.data.recentAccesses.length).toBeGreaterThan(0);
    });

    it('should calculate average clicks per day', async () => {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - 10);

      await createTestUrl({
        shortCode: 'test123',
        createdAt,
        clickCount: 100,
      });

      const res = await request(app).get('/api/analytics/test123');

      expect(res.status).toBe(200);
      expect(res.body.data.stats).toHaveProperty('avgClicksPerDay');
      expect(res.body.data.stats.avgClicksPerDay).toBeGreaterThan(0);
    });
  });

  // ==================== GET /api/analytics Tests ====================

  describe('GET /api/analytics - System Analytics', () => {
    it('should return system-wide analytics', async () => {
      // Create test URLs
      for (let i = 0; i < 3; i++) {
        await createTestUrl({
          shortCode: `code${i}`,
          clickCount: (i + 1) * 10,
        });
      }

      const res = await request(app).get('/api/analytics');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalActiveUrls', 3);
      expect(res.body.data).toHaveProperty('totalClicks', 60); // 10 + 20 + 30
      expect(res.body.data).toHaveProperty('mostPopularUrls');
      expect(res.body.data).toHaveProperty('recentUrls');
    });

    it('should return empty analytics when no URLs exist', async () => {
      const res = await request(app).get('/api/analytics');

      expect(res.status).toBe(200);
      expect(res.body.data.totalActiveUrls).toBe(0);
      expect(res.body.data.totalClicks).toBe(0);
    });

    it('should return most popular URLs sorted by clicks', async () => {
      await createTestUrl({
        shortCode: 'popular1',
        clickCount: 100,
      });
      await createTestUrl({
        shortCode: 'popular2',
        clickCount: 50,
      });
      await createTestUrl({
        shortCode: 'popular3',
        clickCount: 200,
      });

      const res = await request(app).get('/api/analytics');

      expect(res.status).toBe(200);
      const popular = res.body.data.mostPopularUrls;
      expect(popular[0].clickCount).toBe(200);
      expect(popular[1].clickCount).toBe(100);
      expect(popular[2].clickCount).toBe(50);
    });
  });

  // ==================== GET /api/analytics/trends/:days Tests ====================

  describe('GET /api/analytics/trends/:days - Usage Trends', () => {
    it('should return usage trends', async () => {
      // Create URLs with different creation dates
      const today = new Date();

      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        await createTestUrl({
          shortCode: `code${i}`,
          createdAt: date,
        });
      }

      const res = await request(app).get('/api/analytics/trends/30');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('period');
      expect(res.body.data).toHaveProperty('trends');
      expect(Array.isArray(res.body.data.trends)).toBe(true);
    });

    it('should limit days parameter to maximum 365', async () => {
      const res = await request(app).get('/api/analytics/trends/999');

      expect(res.status).toBe(200);
      expect(res.body.data.period).toBe('365 days');
    });
  });
});
