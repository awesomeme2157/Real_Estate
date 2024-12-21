import express from 'express';
import { should_be_logged_in, should_be_admin } from '../controllers/test.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get("/should-be-logged-in", verifyToken, should_be_logged_in);
router.get("/should-be-admin", verifyToken, should_be_admin);

export default router;