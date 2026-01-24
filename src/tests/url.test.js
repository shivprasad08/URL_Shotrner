/**
 * URL Controller Tests
 * Unit and integration tests for URL shortening endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../app');
const { connectTestDB, disconnectTestDB, clearDatabase, createTestUrl } = require('./testUtils');
const URLMapping = require('../models/URLMapping');

describe('URL Controller', () => {
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

  // ==================== POST /api/shorten Tests ====================

  describe('POST /api/shorten - Create Short URL', () => {
    it('should create a short URL successfully', async () => {
      const res = await request(app)
        .post('/api/shorten')
        .send({
          url: 'https://www.example.com/very/long/url/path',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('shortCode');
      expect(res.body.data).toHaveProperty('shortUrl');
      expect(res.body.data).toHaveProperty('originalUrl');
      expect(res.body.data).toHaveProperty('createdAt');
    });

    it('should return duplicate short URL for same original URL', async () => {
      const url = 'https://www.example.com/test';

      // First request
      const res1 = await request(app)
        .post('/api/shorten')
        .send({ url });

      expect(res1.status).toBe(201);
      const shortCode1 = res1.body.data.shortCode;

      // Second request with same URL
      const res2 = await request(app)
        .post('/api/shorten')
        .send({ url });

      expect(res2.status).toBe(201);
      expect(res2.body.data.shortCode).toBe(shortCode1);
    });

    it('should accept custom short code', async () => {
      const res = await request(app)
        .post('/api/shorten')
        .send({
          url: 'https://www.example.com/test',
          customCode: 'mycode',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.shortCode).toBe('mycode');
    });

    it('should reject duplicate custom short code', async () => {
      // Create first URL with custom code
      await request(app)
        .post('/api/shorten')
        .send({
          url: 'https://www.example.com/test1',
          customCode: 'duplicate',
        });

      // Try to create second URL with same custom code
      const res = await request(app)
        .post('/api/shorten')
        .send({
          url: 'https://www.example.com/test2',
          customCode: 'duplicate',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid URL format', async () => {
      const res = await request(app)
        .post('/api/shorten')
        .send({
          url: 'not-a-valid-url',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toBeDefined();
    });

    it('should reject empty URL', async () => {
      const res = await request(app)
        .post('/api/shorten')
        .send({
          url: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject missing URL', async () => {
      const res = await request(app)
        .post('/api/shorten')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject URL without protocol', async () => {
      const res = await request(app)
        .post('/api/shorten')
        .send({
          url: 'www.example.com',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should accept optional description', async () => {
      const res = await request(app)
        .post('/api/shorten')
        .send({
          url: 'https://www.example.com',
          description: 'My test link',
        });

      expect(res.status).toBe(201);
    });

    it('should handle future expiration date', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const res = await request(app)
        .post('/api/shorten')
        .send({
          url: 'https://www.example.com',
          expiresAt: futureDate.toISOString(),
        });

      expect(res.status).toBe(201);
    });

    it('should reject past expiration date', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const res = await request(app)
        .post('/api/shorten')
        .send({
          url: 'https://www.example.com',
          expiresAt: pastDate.toISOString(),
        });

      expect(res.status).toBe(400);
    });
  });

  // ==================== GET /:shortCode Tests ====================

  describe('GET /:shortCode - Redirect to Original URL', () => {
    it('should redirect to original URL', async () => {
      const urlMapping = await createTestUrl({
        originalUrl: 'https://www.example.com/target',
        shortCode: 'abc123',
      });

      const res = await request(app)
        .get('/abc123')
        .redirects(0);

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe(urlMapping.originalUrl);
    });

    it('should increment click count on redirect', async () => {
      await createTestUrl({
        originalUrl: 'https://www.example.com/target',
        shortCode: 'abc123',
        clickCount: 5,
      });

      // Make request
      await request(app).get('/abc123').redirects(0);

      // Wait a bit for async update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check updated click count
      const updated = await URLMapping.findOne({ shortCode: 'abc123' });
      expect(updated.clickCount).toBe(6);
    });

    it('should return 404 for non-existent short code', async () => {
      const res = await request(app).get('/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for inactive URLs', async () => {
      await createTestUrl({
        originalUrl: 'https://www.example.com/target',
        shortCode: 'abc123',
        isActive: false,
      });

      const res = await request(app).get('/abc123');

      expect(res.status).toBe(404);
    });

    it('should return 404 for expired URLs', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      await createTestUrl({
        originalUrl: 'https://www.example.com/target',
        shortCode: 'abc123',
        expiresAt: pastDate,
      });

      const res = await request(app).get('/abc123');

      expect(res.status).toBe(404);
    });

    it('should record access metadata (user agent, IP)', async () => {
      await createTestUrl({
        originalUrl: 'https://www.example.com/target',
        shortCode: 'abc123',
      });

      await request(app)
        .get('/abc123')
        .set('User-Agent', 'Mozilla/5.0 Test Browser')
        .redirects(0);

      // Wait for async update
      await new Promise(resolve => setTimeout(resolve, 100));

      const updated = await URLMapping.findOne({ shortCode: 'abc123' });
      expect(updated.analytics.length).toBeGreaterThan(0);
      expect(updated.analytics[0].userAgent).toContain('Test Browser');
    });
  });

  // ==================== GET /api/urls Tests ====================

  describe('GET /api/urls - List All URLs', () => {
    it('should return all URLs with pagination', async () => {
      // Create multiple test URLs
      for (let i = 0; i < 5; i++) {
        await createTestUrl({
          shortCode: `code${i}`,
          originalUrl: `https://example.com/${i}`,
        });
      }

      const res = await request(app).get('/api/urls');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(5);
      expect(res.body.pagination).toHaveProperty('page');
      expect(res.body.pagination).toHaveProperty('limit');
      expect(res.body.pagination).toHaveProperty('total');
    });

    it('should respect page parameter', async () => {
      for (let i = 0; i < 25; i++) {
        await createTestUrl({
          shortCode: `code${i}`,
          originalUrl: `https://example.com/${i}`,
        });
      }

      const res = await request(app)
        .get('/api/urls')
        .query({ page: 2, limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(2);
      expect(res.body.data.length).toBe(10);
    });

    it('should exclude inactive URLs by default', async () => {
      await createTestUrl({ shortCode: 'active', isActive: true });
      await createTestUrl({ shortCode: 'inactive', isActive: false });

      const res = await request(app).get('/api/urls');

      expect(res.status).toBe(200);
      expect(res.body.pagination.total).toBe(1);
    });
  });

  // ==================== DELETE /api/urls/:shortCode Tests ====================

  describe('DELETE /api/urls/:shortCode - Deactivate URL', () => {
    it('should deactivate a short URL', async () => {
      await createTestUrl({
        shortCode: 'abc123',
        originalUrl: 'https://www.example.com/target',
      });

      const res = await request(app).delete('/api/urls/abc123');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deactivation
      const url = await URLMapping.findOne({ shortCode: 'abc123' });
      expect(url.isActive).toBe(false);
    });

    it('should return 404 for non-existent short code', async () => {
      const res = await request(app).delete('/api/urls/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should not deactivate already inactive URLs', async () => {
      await createTestUrl({
        shortCode: 'abc123',
        isActive: false,
      });

      const res = await request(app).delete('/api/urls/abc123');

      expect(res.status).toBe(404);
    });
  });
});
