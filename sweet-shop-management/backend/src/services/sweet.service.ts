import { db } from '../database/database';
import {
  Sweet,
  CreateSweetRequest,
  UpdateSweetRequest,
  SearchQuery,
} from '../types';

export class SweetService {
  async create(data: CreateSweetRequest): Promise<Sweet> {
    // Check if sweet with same name exists
    const existing = await db.get<Sweet>(
      'SELECT * FROM sweets WHERE name = ?',
      [data.name]
    );

    if (existing) {
      throw new Error('Sweet with this name already exists');
    }

    const quantity = data.quantity || 0;

    await db.run(
      'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
      [data.name, data.category, data.price, quantity]
    );

    const sweet = await db.get<Sweet>(
      'SELECT * FROM sweets WHERE name = ?',
      [data.name]
    );

    if (!sweet) {
      throw new Error('Failed to create sweet');
    }

    return sweet;
  }

  async getAll(): Promise<Sweet[]> {
    return db.all<Sweet>('SELECT * FROM sweets ORDER BY created_at DESC');
  }

  async getById(id: number): Promise<Sweet | undefined> {
    return db.get<Sweet>('SELECT * FROM sweets WHERE id = ?', [id]);
  }

  async search(query: SearchQuery): Promise<Sweet[]> {
    let sql = 'SELECT * FROM sweets WHERE 1=1';
    const params: any[] = [];

    if (query.name) {
      sql += ' AND name LIKE ?';
      params.push(`%${query.name}%`);
    }

    if (query.category) {
      sql += ' AND category = ?';
      params.push(query.category);
    }

    if (query.minPrice !== undefined) {
      sql += ' AND price >= ?';
      params.push(query.minPrice);
    }

    if (query.maxPrice !== undefined) {
      sql += ' AND price <= ?';
      params.push(query.maxPrice);
    }

    sql += ' ORDER BY created_at DESC';

    return db.all<Sweet>(sql, params);
  }

  async update(id: number, data: UpdateSweetRequest): Promise<Sweet> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error('Sweet not found');
    }

    // Check if new name conflicts with existing sweet
    if (data.name && data.name !== existing.name) {
      const nameConflict = await db.get<Sweet>(
        'SELECT * FROM sweets WHERE name = ? AND id != ?',
        [data.name, id]
      );
      if (nameConflict) {
        throw new Error('Sweet with this name already exists');
      }
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      params.push(data.name);
    }
    if (data.category !== undefined) {
      updates.push('category = ?');
      params.push(data.category);
    }
    if (data.price !== undefined) {
      updates.push('price = ?');
      params.push(data.price);
    }
    if (data.quantity !== undefined) {
      updates.push('quantity = ?');
      params.push(data.quantity);
    }

    if (updates.length === 0) {
      return existing;
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await db.run(
      `UPDATE sweets SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const updated = await this.getById(id);
    if (!updated) {
      throw new Error('Failed to update sweet');
    }

    return updated;
  }

  async delete(id: number): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error('Sweet not found');
    }

    await db.run('DELETE FROM sweets WHERE id = ?', [id]);
  }

  async purchase(id: number, quantity: number): Promise<Sweet> {
    const sweet = await this.getById(id);
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    if (sweet.quantity < quantity) {
      throw new Error('Insufficient quantity in stock');
    }

    const newQuantity = sweet.quantity - quantity;

    await db.run(
      'UPDATE sweets SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newQuantity, id]
    );

    const updated = await this.getById(id);
    if (!updated) {
      throw new Error('Failed to update sweet');
    }

    return updated;
  }

  async restock(id: number, quantity: number): Promise<Sweet> {
    const sweet = await this.getById(id);
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    const newQuantity = sweet.quantity + quantity;

    await db.run(
      'UPDATE sweets SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newQuantity, id]
    );

    const updated = await this.getById(id);
    if (!updated) {
      throw new Error('Failed to update sweet');
    }

    return updated;
  }
}

export const sweetService = new SweetService();

