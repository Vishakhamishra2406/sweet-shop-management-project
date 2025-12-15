import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/database';
import { User, RegisterRequest, LoginRequest, JWTPayload } from '../types';

export class AuthService {
  async register(data: RegisterRequest): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Check if user exists
    const existingUser = await db.get<User>(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [data.email, data.username]
    );

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new Error('User with this email already exists');
      }
      if (existingUser.username === data.username) {
        throw new Error('User with this username already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Insert user
    await db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [data.username, data.email, hashedPassword, 'user']
    );

    const user = await db.get<User>('SELECT * FROM users WHERE email = ?', [data.email]);

    if (!user) {
      throw new Error('Failed to create user');
    }

    // Generate token
    const token = this.generateToken(user);

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async login(data: LoginRequest): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const user = await db.get<User>('SELECT * FROM users WHERE email = ?', [data.email]);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user);

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  private generateToken(user: User): string {
    const jwtSecret = process.env.JWT_SECRET ?? 'fallback-secret';
    const expiresIn = process.env.JWT_EXPIRES_IN ?? '24h';

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    // ensure types match jsonwebtoken overloads
    const secret = jwtSecret as jwt.Secret;
    const options: jwt.SignOptions = { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] };

    return jwt.sign(payload, secret, options);
  }
}

export const authService = new AuthService();

