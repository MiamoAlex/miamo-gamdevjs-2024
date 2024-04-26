const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json({ limit: '5mb' }));
app.use(express.static('./dist'));

/**
 * Envoie le fichier index.html lorsqu'un client accède à la racine du site.
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

const PORT = process.env.PORT || 3334;

/**
 * Démarre le serveur.
 */
server.listen(PORT, () => {
  console.log("Gleep Gym");
});

module.exports = server;
