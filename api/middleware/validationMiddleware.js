import { body, validationResult } from 'express-validator';

export const validateService = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('deliveryTime').isInt({ gt: 0 }).withMessage('Delivery time must be a positive integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];
