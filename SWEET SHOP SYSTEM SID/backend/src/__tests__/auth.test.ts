import request from 'supertest';
import { createApp } from '../app';
import { clearDatabase } from '../database/db';

// Ensure the app instance is created only once
const app = createApp();

describe('Authentication', () => {
  beforeEach(() => {
    // Clear the database before each test to ensure isolation (using the :memory: db for tests)
    clearDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe('test@example.com');
      expect(res.body.user.role).toBe('USER');
      expect(res.body).toHaveProperty('token');
    });

    it('should register an admin user if role is provided', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'admin@example.com',
          password: 'password123',
          role: 'ADMIN'
        });

      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('ADMIN');
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('User already exists');
    });

    it('should validate email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('email');
    });

    it('should validate password length', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '12345'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Password');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register a user for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('test@example.com');
      expect(res.body).toHaveProperty('token');
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });
});