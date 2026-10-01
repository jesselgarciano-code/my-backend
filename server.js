require('dotenv').config();

const mysql = require('mysql2');
const express = require('express');
const app = express();

const PORT = 3000;

// Connect to MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'defaultdb',
    port: process.env.DB_PORT || 3306,
    ssl: {
        rejectUnauthorized: false
    }
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("Connected to MySQL Database!");
});

app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to My Updated Backend Server!');
});

// API Example
app.get('/api/user', (req, res) => {
    res.json({
        name: "Jessel",
        email: "jesselgarciano@gmail.com"
    });
});

// Contact API
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
        return res.status(400).json({
            error: "Invalid email address"
        });
    }

    // SQL query
    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";

    // Save contact to database
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error("Database error:", err);

            return res.status(500).json({
                error: "Failed to save contact"
            });
        }

        res.json({
            message: `Thank you ${name}, your message has been saved!`,
            data: {
                id: result.insertId,
                name,
                email,
                message
            }
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});