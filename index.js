import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello, World! This is an HTTP server built using Node.js & Express.');
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
