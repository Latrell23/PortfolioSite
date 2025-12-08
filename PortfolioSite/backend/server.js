require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '3704299Blue$';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const resumeUploadsDir = path.join(__dirname, 'uploads', 'resume');
if (!fs.existsSync(resumeUploadsDir)) {
    fs.mkdirSync(resumeUploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, resumeUploadsDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, 'current_resume' + ext);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const mimetype = allowedMimes.includes(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only PDF and Word document files are allowed'));
    },
    limits: { fileSize: 10 * 1024 * 1024 }
});

const tokens = new Set();

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !tokens.has(token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        const token = crypto.randomBytes(32).toString('hex');
        tokens.add(token);
        setTimeout(() => tokens.delete(token), 24 * 60 * 60 * 1000);
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

app.post('/api/admin/logout', verifyToken, (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    tokens.delete(token);
    res.json({ message: 'Logged out' });
});

app.get('/api/resume', async (req, res) => {
    try {
        const [resumes] = await db.query(
            'SELECT * FROM resume ORDER BY uploaded_at DESC LIMIT 1'
        );
        if (resumes.length === 0) {
            return res.status(404).json({ error: 'No resume found' });
        }
        res.json(resumes[0]);
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ error: 'Failed to fetch resume' });
    }
});

app.post('/api/resume', verifyToken, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const fileUrl = `/uploads/resume/${req.file.filename}`;
        const originalName = req.file.originalname;
        const fileSize = req.file.size;
        const mimeType = req.file.mimetype;

        await db.query('DELETE FROM resume');
        const [result] = await db.query(
            `INSERT INTO resume (file_url, original_name, file_size, mime_type) VALUES (?, ?, ?, ?)`,
            [fileUrl, originalName, fileSize, mimeType]
        );

        res.status(201).json({
            id: result.insertId,
            file_url: fileUrl,
            original_name: originalName,
            file_size: fileSize,
            mime_type: mimeType,
            message: 'Resume uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({ error: 'Failed to upload resume' });
    }
});

app.delete('/api/resume', verifyToken, async (req, res) => {
    try {
        const [resumes] = await db.query('SELECT file_url FROM resume');
        for (const resume of resumes) {
            const filePath = path.join(__dirname, resume.file_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await db.query('DELETE FROM resume');
        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ error: 'Failed to delete resume' });
    }
});

app.get('/api/resume/download', async (req, res) => {
    try {
        const [resumes] = await db.query(
            'SELECT * FROM resume ORDER BY uploaded_at DESC LIMIT 1'
        );
        if (resumes.length === 0) {
            return res.status(404).json({ error: 'No resume found' });
        }
        const resume = resumes[0];
        const filePath = path.join(__dirname, resume.file_url);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Resume file not found' });
        }
        res.download(filePath, resume.original_name);
    } catch (error) {
        console.error('Error downloading resume:', error);
        res.status(500).json({ error: 'Failed to download resume' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
