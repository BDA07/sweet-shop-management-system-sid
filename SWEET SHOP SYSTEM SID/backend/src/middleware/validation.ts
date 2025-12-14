import { Request, Response, NextFunction } from 'express';

export const validateSweet = (req: Request, res: Response, next: NextFunction) => {
  const { name, category, price, stock } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return res.status(400).json({ error: 'Category is required' });
  }

  // Use parseFloat for price and parseInt for stock for more robust number checking
  const parsedPrice = parseFloat(price);
  const parsedStock = parseInt(stock, 10);


  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ error: 'Valid price is required' });
  }
  // If price is sent as a string, e.g. "50", it's valid, but we must use the correct type in the service
  req.body.price = parsedPrice;


  if (isNaN(parsedStock) || parsedStock < 0) {
    return res.status(400).json({ error: 'Valid stock is required' });
  }
  req.body.stock = parsedStock;

  next();
};

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  next();
};