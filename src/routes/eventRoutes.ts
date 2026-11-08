import { Router } from 'express';
import { createEvent, registerEvent } from '../controllers/eventController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint ini dilindungi oleh middleware 'authenticate'
// User harus menyertakan Token JWT saat mengaksesnya
router.post('/', authenticate, createEvent);
router.post('/register', authenticate, registerEvent);

export default router;
