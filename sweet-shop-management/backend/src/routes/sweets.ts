import express, { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { sweetService } from '../services/sweet.service';
import { CreateSweetRequest, UpdateSweetRequest, SearchQuery } from '../types';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

const createSweetValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
];

const updateSweetValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
];

router.post('/', createSweetValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data: CreateSweetRequest = req.body;
    const sweet = await sweetService.create(data);
    res.status(201).json(sweet);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const sweets = await sweetService.getAll();
    res.status(200).json(sweets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req: Request, res: Response) => {
  try {
    const searchQuery: SearchQuery = {
      name: req.query.name as string,
      category: req.query.category as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
    };

    const sweets = await sweetService.search(searchQuery);
    res.status(200).json(sweets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', updateSweetValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }

    const data: UpdateSweetRequest = req.body;
    const sweet = await sweetService.update(id, data);
    res.status(200).json(sweet);
  } catch (error: any) {
    if (error.message === 'Sweet not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }

    await sweetService.delete(id);
    res.status(200).json({ message: 'Sweet deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Sweet not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/purchase', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }

    const quantity = parseInt(req.body.quantity);
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    const sweet = await sweetService.purchase(id, quantity);
    res.status(200).json(sweet);
  } catch (error: any) {
    if (error.message === 'Sweet not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/restock', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }

    const quantity = parseInt(req.body.quantity);
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    const sweet = await sweetService.restock(id, quantity);
    res.status(200).json(sweet);
  } catch (error: any) {
    if (error.message === 'Sweet not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

export default router;

