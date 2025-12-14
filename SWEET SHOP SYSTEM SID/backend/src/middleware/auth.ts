import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

// Extend the Request interface to include the user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export const authenticate = (req: Request, res: Response, next: NextFunction) =>  {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};