import express from 'express';
import multer from 'multer';
import { getAIInsights, analyzeCSV } from '../controllers/aiController';

const router = express.Router();

// Configure multer for CSV file uploads (memory storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'));
        }
    }
});

// @route   GET /api/ai/insights
// @access  Public (no authentication required)
router.get('/insights', getAIInsights);

// @route   POST /api/ai/analyze-csv
// @access  Public (no authentication required)
router.post('/analyze-csv', upload.single('file'), analyzeCSV);

export default router;
