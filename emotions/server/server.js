import express from 'express';
import cors from 'cors';
import pkg from 'pg';
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

        console.log('Scene:', scene);  // Логирование данных сцены

        // Получение character_id из таблицы scene_characters
        const sceneCharacterResult = await pool.query('SELECT character_id FROM scene_characters WHERE scene_id = $1', [id]);
        const characterId = sceneCharacterResult.rows[0]?.character_id;

        if (characterId) {
            const characterResult = await pool.query('SELECT * FROM characters WHERE character_id = $1', [characterId]);
            scene.character = characterResult.rows[0];
            console.log('Character:', scene.character);  // Логирование данных о персонаже
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
