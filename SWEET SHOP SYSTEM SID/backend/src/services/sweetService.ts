import { db } from '../database/db';
import { Sweet } from '../types';

export class SweetService {
  static createSweet(data: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) {
    const result = db.prepare(
      'INSERT INTO sweets (name, category, price, stock, description) VALUES (?, ?, ?, ?, ?)'
    ).run(data.name, data.category, data.price, data.stock, data.description);

    return db.prepare('SELECT * FROM sweets WHERE id = ?').get(result.lastInsertRowid) as Sweet;
  }

  static getAllSweets() {
    return db.prepare('SELECT * FROM sweets').all() as Sweet[];
  }

  static getSweetById(id: number) {
    return db.prepare('SELECT * FROM sweets WHERE id = ?').get(id) as Sweet | undefined;
  }

  static searchSweets(params: { name?: string; category?: string; minPrice?: number; maxPrice?: number }) {
    let query = 'SELECT * FROM sweets WHERE 1=1';
    const queryParams: any[] = [];

    if (params.name) {
      query += ' AND name LIKE ?';
      queryParams.push(`%${params.name}%`);
    }

    if (params.category) {
      query += ' AND category = ?';
      queryParams.push(params.category);
    }

    if (params.minPrice !== undefined) {
      query += ' AND price >= ?';
      queryParams.push(params.minPrice);
    }

    if (params.maxPrice !== undefined) {
      query += ' AND price <= ?';
      queryParams.push(params.maxPrice);
    }

    return db.prepare(query).all(...queryParams) as Sweet[];
  }

  static updateSweet(id: number, data: Partial<Omit<Sweet, 'id' | 'created_at' | 'updated_at'>>) {
    const sweet = this.getSweetById(id);
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.category !== undefined) {
      updates.push('category = ?');
      values.push(data.category);
    }
    if (data.price !== undefined) {
      updates.push('price = ?');
      values.push(data.price);
    }
    if (data.stock !== undefined) {
      updates.push('stock = ?');
      values.push(data.stock);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }

    if (updates.length === 0) {
        return sweet; // No updates to perform
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id); // ID for the WHERE clause

    db.prepare(`UPDATE sweets SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    return this.getSweetById(id);
  }

  static deleteSweet(id: number) {
    const sweet = this.getSweetById(id);
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    db.prepare('DELETE FROM sweets WHERE id = ?').run(id);
    return sweet;
  }

  static purchaseSweet(userId: number, sweetId: number) {
    const sweet = this.getSweetById(sweetId);
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    if (sweet.stock === 0) {
      throw new Error('Sweet out of stock');
    }

    db.prepare('UPDATE sweets SET stock = stock - 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(sweetId);
    db.prepare('INSERT INTO purchases (user_id, sweet_id) VALUES (?, ?)').run(userId, sweetId);

    return this.getSweetById(sweetId);
  }

  static restockSweet(id: number, quantity: number) {
    const sweet = this.getSweetById(id);
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    db.prepare('UPDATE sweets SET stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(quantity, id);

    return this.getSweetById(id);
  }
}