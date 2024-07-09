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
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, createdAt]
        );
        res.json(result.rows[0]); 
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
            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                res.json({ user_id: user.user_id }); 
            } else {
                res.status(401).send('Invalid username or password');
            }
        } else {
            res.status(401).send('Invalid username or password');
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
        const dialoguesResult = await pool.query('SELECT * FROM dialogues WHERE scene_id = $1 ORDER BY order_number', [id]);
        
        const scene = sceneResult.rows[0];
        scene.choices = choicesResult.rows;
        scene.dialogues = dialoguesResult.rows;

        console.log('Scene:', scene);  

        const sceneCharacterResult = await pool.query('SELECT character_id FROM scene_characters WHERE scene_id = $1', [id]);
        const characterId = sceneCharacterResult.rows[0]?.character_id;

        if (characterId) {
            const characterResult = await pool.query('SELECT * FROM characters WHERE character_id = $1', [characterId]);
            scene.character = characterResult.rows[0];
            console.log('Character:', scene.character); 
        } else {
            scene.character = null;
            console.log('No character associated with this scene');
        }

        res.json(scene);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
