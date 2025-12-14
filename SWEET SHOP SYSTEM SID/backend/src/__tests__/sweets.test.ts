import request from 'supertest';
import { createApp } from '../app';
import { clearDatabase } from '../database/db';

const app = createApp();

let adminToken: string;
let userToken: string;
let sweetIdForUpdate: number;

describe('Sweets Management', () => {
  // Setup: Register admin and user, and create one sweet for general tests
  beforeAll(async () => {
    clearDatabase();

    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'admin@example.com',
        password: 'password123',
        role: 'ADMIN'
      });
    adminToken = adminRes.body.token;

    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user@example.com',
        password: 'password123'
      });
    userToken = userRes.body.token;

    const initialSweet = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Initial Sweet',
        category: 'Setup',
        price: 9.99,
        stock: 5,
        description: 'Initial setup sweet'
      });
    sweetIdForUpdate = initialSweet.body.id;
  });

  describe('POST /api/sweets', () => {
    it('should create a sweet as admin', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.99,
          stock: 100,
          description: 'Delicious chocolate'
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Chocolate Bar');
      expect(res.body.stock).toBe(100);
    });

    it('should reject creation without admin role', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Candy',
          category: 'Candy',
          price: 1.99,
          stock: 50,
          description: 'Sweet candy'
        });

      expect(res.status).toBe(403);
    });

    it('should reject creation without authentication', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Candy',
          category: 'Candy',
          price: 1.99,
          stock: 50,
          description: 'Sweet candy'
        });

      expect(res.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test',
          price: 1.99
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Category is required');
    });
  });

  describe('GET /api/sweets', () => {
    it('should get all sweets without authentication', async () => {
      const res = await request(app).get('/api/sweets');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0); // Should contain the initial sweet and the one created above
    });
  });

  describe('GET /api/sweets/search', () => {
    // Note: Reusing the sweets created in the previous tests.

    it('should search by name', async () => {
      const res = await request(app)
        .get('/api/sweets/search?name=Sweet');

      expect(res.status).toBe(200);
      expect(res.body.some((s: any) => s.name === 'Initial Sweet')).toBe(true);
    });

    it('should search by category', async () => {
      const res = await request(app)
        .get('/api/sweets/search?category=Chocolate');

      expect(res.status).toBe(200);
      expect(res.body.every((s: any) => s.category === 'Chocolate')).toBe(true);
    });

    it('should search by price range', async () => {
      const res = await request(app)
        .get('/api/sweets/search?minPrice=2&maxPrice=10');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(
        res.body.every((s: any) => s.price >= 2 && s.price <= 10)
      ).toBe(true);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    it('should update sweet as admin', async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetIdForUpdate}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 15.00,
          stock: 30
        });

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(15.00);
      expect(res.body.stock).toBe(30);
    });

    it('should reject update by non-admin', async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetIdForUpdate}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          price: 4.99
        });

      expect(res.status).toBe(403);
    });

    it('should return 404 for non-existent sweet', async () => {
      const res = await request(app)
        .put(`/api/sweets/9999`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 10.0 });
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Sweet not found');
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let purchasableSweetId: number;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Purchasable Sweet',
          category: 'Candy',
          price: 1.99,
          stock: 2, // Start with 2 stock
          description: 'For purchase testing'
        });

      purchasableSweetId = res.body.id;
    });

    it('should allow user to purchase sweet and decrement stock', async () => {
      const res = await request(app)
        .post(`/api/sweets/${purchasableSweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.sweet.stock).toBe(1); // 2 -> 1
    });

    it('should prevent purchase when stock is zero', async () => {
      // First purchase to make stock 1
      await request(app)
        .post(`/api/sweets/${purchasableSweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);
      // Second purchase to make stock 0
      await request(app)
        .post(`/api/sweets/${purchasableSweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      // Third purchase attempt
      const res = await request(app)
        .post(`/api/sweets/${purchasableSweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Sweet out of stock');
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let restockSweetId: number;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Restock Sweet',
          category: 'Chocolate',
          price: 2.49,
          stock: 0, // Start at 0
          description: 'Restock test'
        });

      restockSweetId = res.body.id;
    });

    it('should restock sweet as admin', async () => {
      const res = await request(app)
        .post(`/api/sweets/${restockSweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(res.status).toBe(200);
      expect(res.body.sweet.stock).toBe(10);
    });

    it('should reject restock by non-admin', async () => {
      const res = await request(app)
        .post(`/api/sweets/${restockSweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(403);
    });

    it('should validate positive quantity', async () => {
      const res = await request(app)
        .post(`/api/sweets/${restockSweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Valid quantity is required');
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let deleteSweetId: number;

    beforeEach(async () => {
      // Create a fresh sweet for deletion test
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Delete Sweet',
          category: 'Candy',
          price: 1.49,
          stock: 10,
          description: 'Delete test'
        });

      deleteSweetId = res.body.id;
    });

    it('should delete sweet as admin', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${deleteSweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Sweet deleted');

      // Verify it's actually gone
      const checkRes = await request(app).get(`/api/sweets/search?name=Delete%20Sweet`);
      expect(checkRes.body.length).toBe(0);
    });

    it('should reject delete by non-admin', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${deleteSweetId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });
});