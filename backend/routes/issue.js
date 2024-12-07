import { Router } from 'express'
import { issueDocument } from '../controllers/issueController.js'

const router = Router();

router.post('/issuedoc', issueDocument)

export default router;