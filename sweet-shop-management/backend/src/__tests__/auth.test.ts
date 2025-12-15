// Tests run under Jest; ensure we rely on Jest globals and app won't start a server during tests.
import request from 'supertest';
import app from '../index';
import { db } from '../database/database';
import bcrypt from 'bcryptjs';
// Use Jest globals provided by the test runner; do not import from Vitest.

const extractErrorText = (res: any) => {
  if (!res || !res.body) return '';
  if (res.body.error) return String(res.body.error);
  if (Array.isArray(res.body.errors)) return res.body.errors.map((e: any) => `${e.param}:${e.msg}`).join('; ');
  return JSON.stringify(res.body);
};

describe('Authentication API', () => {
  beforeAll(async () => {
    await db.initialize();
    await db.run('DELETE FROM users');
  });

  afterEach(async () => {
    await db.run('DELETE FROM users');
  });

  afterAll(async () => {
    await db.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and store a hashed password', async () => {
      const unique = Date.now();
      const username = `testuser_${unique}`;
      const email = `test${unique}@example.com`;

      const response = await request(app)
        .post('/api/auth/register')
        .send({ username, email, password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(email);
      expect(response.body.user.password).toBeUndefined();

      const row: any = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      expect(row).toBeDefined();
      expect(row.password).toBeDefined();
      expect(row.password).not.toBe('password123');
      expect(await bcrypt.compare('password123', row.password)).toBe(true);
    });

    it('should return validation errors array when fields are invalid', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: '', email: 'not-an-email', password: '123' });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.errors)).toBe(true);
      const text = extractErrorText(response);
      expect(text.toLowerCase()).toContain('username');
      expect(text.toLowerCase()).toContain('email');
      expect(text.toLowerCase()).toContain('password');
    });

    it('should not register user with duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'anotheruser', email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      const err = extractErrorText(response).toLowerCase();
      expect(err).toContain('email');
    });

    it('should not register user with duplicate username', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', email: 'another@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      const err = extractErrorText(response).toLowerCase();
      expect(err).toContain('username');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await db.run(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['testuser', 'test@example.com', hashedPassword, 'user']
      );
    });

    it('should login with valid credentials and return token/user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(extractErrorText(response).length).toBeGreaterThan(0);
    });

    it('should return 401 for non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nope@example.com', password: 'password123' });

      expect(response.status).toBe(401);
      expect(extractErrorText(response).length).toBeGreaterThan(0);
    });

    it('should return validation errors on login when fields are invalid', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-an-email', password: '' });

      expect(response.status).toBe(400);
      const err = extractErrorText(response).toLowerCase();
      expect(err).toContain('email');
      expect(err).toContain('password');
    });
  });
});

