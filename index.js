// Copyright (c) 2017 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

'use strict';

require('./src/bot');

const http = require('http');

const hostname = '0.0.0.0';
const port = process.env.PORT || 8000;

const server = http.createServer(function (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('This is a Telegram Bot, just type @cryptorates_bot in any ' +
            'Telegram chat to use it. The source code is at ' +
            'https://github.com/ablanco/cryptorates-telegram-bot');
});

server.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
