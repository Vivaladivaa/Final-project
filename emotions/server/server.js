import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcrypt';
const { Pool } = pkg;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    password: 'v123',
    host: 'localhost',
    port: 5433,
    database: 'TestDB',
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const createdAt = new Date();
    try {
        // Check if the username already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, createdAt]
        );
        res.json(result.rows[0]); // Возвращаем данные о новом пользователе
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (isMatch) {
                res.json({ username: user.username, user_id: user.user_id });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.get('/scenes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM scenes');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/scenes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sceneResult = await pool.query('SELECT * FROM scenes WHERE scene_id = $1', [id]);
        const choicesResult = await pool.query('SELECT * FROM choices WHERE scene_id = $1', [id]);
        
        const scene = sceneResult.rows[0];
        scene.choices = choicesResult.rows;
        
        const characterResult = await pool.query('SELECT * FROM characters WHERE character_id = (SELECT character_id FROM scene_characters WHERE scene_id = $1)', [id]);
        scene.character = characterResult.rows[0];

        const dialoguesResult = await pool.query('SELECT * FROM dialogues WHERE scene_id = $1 ORDER BY order_number', [id]);
        scene.dialogues = dialoguesResult.rows;

        res.json(scene);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/save', async (req, res) => {
    const { userId, sceneId } = req.body;
    const createdAt = new Date();
    try {
        const result = await pool.query(
            'INSERT INTO user_saves (user_id, scene_id, created_at) VALUES ($1, $2, $3) RETURNING *',
            [userId, sceneId, createdAt]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/load/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            'SELECT scene_id FROM user_saves WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
            [userId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('No saved game found');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/characters', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM characters_modal');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.post('/rate', async (req, res) => {
    const { userId, sceneId, rating } = req.body;
    const createdAt = new Date();
    try {
        const result = await pool.query(
            'INSERT INTO rate (user_id, scene_id, rating, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, sceneId, rating, createdAt]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
