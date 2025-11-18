import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import users from './mock-users.json' with { type: 'json' };

dotenv.config();

const app = express();
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 8000;

// App directory.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json()); // To parse JSON bodies.
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies.

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SSR route to get and display the list of users.
app.get('/users', (req, res) => {
    res.render('users/index', { users });
});

// CSR route to get the list of users as JSON.
// GET /api/users
app.get('/api/users', (req, res) => {
  res
    .status(200)
    .json({
        status: 'OK',
        data: users,
    });
});

// CSR route to get a single user by ID as JSON.
// GET /api/users/:id
app.get('/api/users/:id', (req, res) => {
    const userId = Number(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res
            .status(404)
            .json({
                status: 'Not Found',
                message: 'User not found',
            });
    }

    return res
        .status(200)
        .json({
            status: 'OK',
            data: user,
        });
});

// CSR route to save a new user.
// POST /api/users
app.post('/api/users', (req, res) => {
    const { first_name, last_name, email, gender, job_title } = req.body;

    if (!first_name || !last_name || !email || !gender || !job_title) {
        return res
            .status(400)
            .json({
                status: 'Bad Request',
                message: 'Missing required fields',
            });
    }

    const newUser = {
        id: users.length + 1,
        first_name,
        last_name,
        email,
        gender,
        job_title
    };

    users.push(newUser);

    return res
        .status(201)
        .json({
            status: 'Created',
            id: newUser.id,
        });
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
