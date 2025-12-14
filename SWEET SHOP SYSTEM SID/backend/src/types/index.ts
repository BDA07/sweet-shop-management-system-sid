export interface User {
  id: number;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  created_at: string;
}

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  created_at: string;
  updated_at: string;
}

// Note: For AuthRequest in a real Express app with TypeScript, 
// you'd typically augment the Request type.
// Since you used 'any' in the middleware, this is a conceptual interface for context.
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: 'USER' | 'ADMIN';
    };
  }
}
