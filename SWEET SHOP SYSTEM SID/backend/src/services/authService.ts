import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../database/db';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

export class AuthService {
  static async register(email: string, password: string, role: 'USER' | 'ADMIN' = 'USER') {
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const result = db.prepare(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)'
    ).run(email, hashedPassword, role);

    const user = db.prepare('SELECT id, email, role FROM users WHERE id = ?')
      .get(result.lastInsertRowid) as Omit<User, 'password' | 'created_at'>;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      user: { id: user.id, email: user.email, role: user.role },
      token
    };
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: 'USER' | 'ADMIN' };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}