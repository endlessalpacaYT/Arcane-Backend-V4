const express = require("express");
const path = require('path');
require("dotenv").config();

const app = express();

const PORT = process.env.API_PORT || 5555

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

const v1Routes = require('./v1/index.js');
const v2Routes = require('./v2/index.js'); 

app.use('/v1', v1Routes);
app.use(v2Routes);
app.use('/images/season', express.static(path.join(__dirname, 'v2', 'images', 'season')));

async function startHTTPServer() {
    app.listen(PORT, () => {
        console.log(`Arcane API Listening on 127.0.0.1:${PORT}`);
    });
}

async function startMain() {
    startHTTPServer();
}

startMain();