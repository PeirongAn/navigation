import express from 'express';
import { createRating, getRatings } from '../controllers/ratingController';

const router = express.Router();

router.post('/', createRating);
router.get('/', getRatings);

export default router; 