const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://calculator_5q4v_user:melrgcck142bxiG4FaM38PFMq3qra3T3@dpg-d7plf5v7f7vs739nk8tg-a.oregon-postgres.render.com/calculator_5q4v',
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(cors());
app.use(express.json());


app.post('/api/auth/login', async (req, res) => {
    const { login, password } = req.body;
    try {
        const result = await pool.query('SELECT id, login, email, password, state, created_at FROM users WHERE login = $1 AND password = $2',[login, password]);
        if (result.rows.length > 0) {
            res.json({ user: result.rows[0] });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// Реєстрація
app.post('/api/auth/register', async (req, res) => {
    const { login, password, email } = req.body;
    try {
        const result = await pool.query('INSERT INTO users (login, password, email) VALUES ($1, $2, $3) RETURNING id, login, email, password, created_at', [login, password, email]);
        res.status(201).json({ user: result.rows[0] });
    } catch (err) { res.status(400).json({ message: "User already exists" }); }
});

app.put('/api/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;
    const field = Object.keys(updateData)[0]; 
    const value = updateData[field];

    try {
        const result = await pool.query( `UPDATE users SET ${field} = $1 WHERE id = $2 RETURNING id, login, email, password, state, created_at`, [value, userId] );
        res.json(result.rows[0]); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Помилка при оновленні бази даних" });
    }
});


app.get('/api/calculator/:userId', async (req, res) => {
    try {
        const result = await pool.query('SELECT state FROM users WHERE id = $1', [req.params.userId]);
        res.json(result.rows[0]?.state || { currentValue: "0" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/api/calculator/:userId', async (req, res) => {
    const { userId } = req.params;
    const state = req.body;
    try {
        await pool.query('UPDATE users SET state = $1 WHERE id = $2', [state, userId]);
        res.json({ message: "Saved" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server started with Postgres on: http://localhost:${PORT}`);
});