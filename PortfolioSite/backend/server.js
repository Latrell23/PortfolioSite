require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadsDir = path.join(__dirname, 'uploads', 'projects');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/projects', async (req, res) => {
    try {
        const [projects] = await db.query(`
            SELECT p.*, 
                   GROUP_CONCAT(pi.id, ':', pi.image_url, ':', pi.alt_text ORDER BY pi.display_order SEPARATOR '||') as images
            FROM projects p
            LEFT JOIN project_images pi ON p.id = pi.project_id
            GROUP BY p.id
            ORDER BY p.display_order ASC
        `);

        const formattedProjects = projects.map(project => ({
            ...project,
            tech_stack: JSON.parse(project.tech_stack || '[]'),
            features: JSON.parse(project.features || '[]'),
            images: project.images ? project.images.split('||').map(img => {
                const [id, url, alt] = img.split(':');
                return { id: parseInt(id), url, alt };
            }) : []
        }));

        res.json(formattedProjects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.get('/api/projects/:id', async (req, res) => {
    try {
        const [projects] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        if (projects.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const [images] = await db.query(
            'SELECT * FROM project_images WHERE project_id = ? ORDER BY display_order',
            [req.params.id]
        );

        const project = {
            ...projects[0],
            tech_stack: JSON.parse(projects[0].tech_stack || '[]'),
            features: JSON.parse(projects[0].features || '[]'),
            images
        };

        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const { title, description, tech_stack, features, display_order } = req.body;

        const [result] = await db.query(
            `INSERT INTO projects (title, description, tech_stack, features, display_order) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                title,
                description,
                JSON.stringify(tech_stack || []),
                JSON.stringify(features || []),
                display_order || 0
            ]
        );

        res.status(201).json({ id: result.insertId, message: 'Project created successfully' });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    try {
        const { title, description, tech_stack, features, display_order } = req.body;

        await db.query(
            `UPDATE projects SET title = ?, description = ?, tech_stack = ?, features = ?, display_order = ?, updated_at = NOW()
             WHERE id = ?`,
            [
                title,
                description,
                JSON.stringify(tech_stack || []),
                JSON.stringify(features || []),
                display_order || 0,
                req.params.id
            ]
        );

        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        const [images] = await db.query('SELECT image_url FROM project_images WHERE project_id = ?', [req.params.id]);

        for (const img of images) {
            const filePath = path.join(__dirname, img.image_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await db.query('DELETE FROM project_images WHERE project_id = ?', [req.params.id]);
        await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

app.post('/api/projects/:id/images', upload.array('images', 10), async (req, res) => {
    try {
        const projectId = req.params.id;
        const altTexts = req.body.altTexts ? JSON.parse(req.body.altTexts) : [];

        const [maxOrder] = await db.query(
            'SELECT COALESCE(MAX(display_order), 0) as max_order FROM project_images WHERE project_id = ?',
            [projectId]
        );
        let order = maxOrder[0].max_order;

        const insertedImages = [];
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            order++;

            const [result] = await db.query(
                'INSERT INTO project_images (project_id, image_url, alt_text, display_order) VALUES (?, ?, ?, ?)',
                [projectId, `/uploads/projects/${file.filename}`, altTexts[i] || '', order]
            );

            insertedImages.push({
                id: result.insertId,
                url: `/uploads/projects/${file.filename}`,
                alt: altTexts[i] || ''
            });
        }

        res.status(201).json({ message: 'Images uploaded successfully', images: insertedImages });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
});

app.delete('/api/images/:id', async (req, res) => {
    try {
        const [images] = await db.query('SELECT image_url FROM project_images WHERE id = ?', [req.params.id]);

        if (images.length > 0) {
            const filePath = path.join(__dirname, images[0].image_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await db.query('DELETE FROM project_images WHERE id = ?', [req.params.id]);
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
