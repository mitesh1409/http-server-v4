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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SSR route to get and display the list of users.
app.get('/users', (req, res) => {
    const userListHTML = `
    <html>
      <head>
        <title>User List</title>
      </head>
      <body>
        <h1>User List</h1>
        <ul>
            ${users.map(user => `<li>${user.first_name} ${user.last_name}, ${user.gender}, ${user.job_title}, ${user.email}</li>`).join('')}
        </ul>
      </body>
    </html>
    `;

    res
      .status(200)
      .send(userListHTML);
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

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
