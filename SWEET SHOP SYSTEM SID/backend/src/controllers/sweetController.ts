import { Request, Response } from 'express';
import { SweetService } from '../services/sweetService';

export class SweetController {
  static createSweet(req: Request, res: Response) {
    try {
      const sweet = SweetService.createSweet(req.body);
      res.status(201).json(sweet);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static getAllSweets(req: Request, res: Response) {
    try {
      const sweets = SweetService.getAllSweets();
      res.json(sweets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static searchSweets(req: Request, res: Response) {
    try {
      const { name, category, minPrice, maxPrice } = req.query;
      const params = {
        name: name as string,
        category: category as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined
      };
      const sweets = SweetService.searchSweets(params);
      res.json(sweets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static updateSweet(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid sweet ID' });
      
      const sweet = SweetService.updateSweet(id, req.body);
      res.json(sweet);
    } catch (error: any) {
      const status = error.message === 'Sweet not found' ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  }

  static deleteSweet(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid sweet ID' });
      
      const sweet = SweetService.deleteSweet(id);
      res.json({ message: 'Sweet deleted', sweet });
    } catch (error: any) {
      const status = error.message === 'Sweet not found' ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  }

  static purchaseSweet(req: Request, res: Response) {
    try {
      const sweetId = parseInt(req.params.id);
      if (isNaN(sweetId)) return res.status(400).json({ error: 'Invalid sweet ID' });
      
      const userId = req.user!.id; // req.user is guaranteed by authenticate middleware
      const sweet = SweetService.purchaseSweet(userId, sweetId);
      res.json({ message: 'Purchase successful', sweet });
    } catch (error: any) {
      const status = error.message === 'Sweet not found' ? 404 : 
                    error.message === 'Sweet out of stock' ? 400 : 500;
      res.status(status).json({ error: error.message });
    }
  }

  static restockSweet(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid sweet ID' });
      
      const { quantity } = req.body;
      const parsedQuantity = parseInt(quantity);
      
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({ error: 'Valid quantity is required' });
      }

      const sweet = SweetService.restockSweet(id, parsedQuantity);
      res.json({ message: 'Restock successful', sweet });
    } catch (error: any) {
      const status = error.message === 'Sweet not found' ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  }
}