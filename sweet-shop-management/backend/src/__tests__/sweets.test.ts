// Tests run under Jest; app is imported but server is not started during tests (NODE_ENV=test).
import request from 'supertest';
import app from '../index';
import { db } from '../database/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Sweets API', () => {
  let authToken: string;
  let adminToken: string;
  let userId: number;
  let adminId: number;

  beforeAll(async () => {
    await db.initialize();
    await db.run('DELETE FROM sweets');
    await db.run('DELETE FROM users');

    // Create regular user
    const hashedPassword = await bcrypt.hash('password123', 10);
    await db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['testuser', 'user@test.com', hashedPassword, 'user']
    );
    const user = await db.get('SELECT id FROM users WHERE email = ?', ['user@test.com']);
    userId = user?.id;

    // Create admin user
    await db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['adminuser', 'admin@test.com', hashedPassword, 'admin']
    );
    const admin = await db.get('SELECT id FROM users WHERE email = ?', ['admin@test.com']);
    adminId = admin?.id;

    // Generate tokens
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    authToken = jwt.sign({ userId, email: 'user@test.com', role: 'user' }, jwtSecret);
    adminToken = jwt.sign({ userId: adminId, email: 'admin@test.com', role: 'admin' }, jwtSecret);
  });

  afterEach(async () => {
    await db.run('DELETE FROM sweets');
  });

  afterAll(async () => {
    await db.run('DELETE FROM sweets');
    await db.run('DELETE FROM users');
    await db.close();
  });

  describe('POST /api/sweets', () => {
    it('should create a sweet with valid data', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.50,
          quantity: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Chocolate Bar');
      expect(response.body.price).toBe(2.50);
      expect(response.body.quantity).toBe(10);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.50,
        });

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '',
          category: 'Chocolate',
          price: 2.50,
        });

      expect(response.status).toBe(400);
    });

    it('should not allow duplicate sweet names', async () => {
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Unique Sweet',
          category: 'Candy',
          price: 1.50,
        });

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Unique Sweet',
          category: 'Candy',
          price: 1.50,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      await db.run(
        'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
        ['Sweet 1', 'Chocolate', 2.50, 10]
      );
      await db.run(
        'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
        ['Sweet 2', 'Candy', 1.50, 5]
      );
    });

    it('should get all sweets', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/sweets');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await db.run(
        'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
        ['Chocolate Bar', 'Chocolate', 2.50, 10]
      );
      await db.run(
        'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
        ['Lollipop', 'Candy', 1.00, 20]
      );
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ name: 'Chocolate' });

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].name).toContain('Chocolate');
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ category: 'Candy' });

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].category).toBe('Candy');
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ minPrice: 1.5, maxPrice: 3.0 });

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      response.body.forEach((sweet: any) => {
        expect(sweet.price).toBeGreaterThanOrEqual(1.5);
        expect(sweet.price).toBeLessThanOrEqual(3.0);
      });
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId: number;

    beforeEach(async () => {
      const result = await db.run(
        'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
        ['Test Sweet', 'Chocolate', 2.50, 10]
      );
      const sweet = await db.get('SELECT id FROM sweets WHERE name = ?', ['Test Sweet']);
      sweetId = sweet?.id;
    });

    it('should update a sweet', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Sweet',
          price: 3.00,
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Sweet');
      expect(response.body.price).toBe(3.00);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .send({ name: 'Updated Sweet' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId: number;

    beforeEach(async () => {
      const sweet = await db.get(
        'SELECT id FROM sweets WHERE name = ?',
        ['Test Sweet']
      );
      if (!sweet) {
        await db.run(
          'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
          ['Test Sweet', 'Chocolate', 2.50, 10]
        );
        const newSweet = await db.get('SELECT id FROM sweets WHERE name = ?', ['Test Sweet']);
        sweetId = newSweet?.id;
      } else {
        sweetId = sweet.id;
      }
    });

    it('should delete a sweet as admin', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('should not allow non-admin to delete', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId: number;

    beforeEach(async () => {
      await db.run(
        'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
        ['Purchasable Sweet', 'Chocolate', 2.50, 10]
      );
      const sweet = await db.get('SELECT id FROM sweets WHERE name = ?', ['Purchasable Sweet']);
      sweetId = sweet?.id;
    });

    it('should purchase a sweet and decrease quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 2 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(8);

      // Verify in database
      const sweet = await db.get('SELECT quantity FROM sweets WHERE id = ?', [sweetId]);
      expect(sweet?.quantity).toBe(8);
    });

    it('should not purchase if insufficient quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 100 });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweetId: number;

    beforeEach(async () => {
      await db.run(
        'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
        ['Restock Sweet', 'Chocolate', 2.50, 5]
      );
      const sweet = await db.get('SELECT id FROM sweets WHERE name = ?', ['Restock Sweet']);
      sweetId = sweet?.id;
    });

    it('should restock a sweet as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(15);
    });

    it('should not allow non-admin to restock', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 10 });

      expect(response.status).toBe(403);
    });
  });
});

