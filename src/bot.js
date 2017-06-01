// Copyright (c) 2017 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

'use strict';

const settings = require('./settings.js');

const TelegramBot = require('node-telegram-bot-api');
const _ = require('lodash');
const request = require('request');

// TELEGRAM BOT ///////////////////////////////////////////////////////////////

const bot = new TelegramBot(settings.token, { polling: true });

// UTILS //////////////////////////////////////////////////////////////////////

// curl https://api.coinbase.com/v2/prices/ETH-EUR/spot
// curl https://api.coinbase.com/v2/prices/ETH-EUR/buy
// curl https://api.coinbase.com/v2/prices/ETH-EUR/sell

const getExchangeRates = function (from, to) {
    const pair = `${from}-${to}`;

    const promises = _.map([
        `https://api.coinbase.com/v2/prices/${pair}/spot`,
        `https://api.coinbase.com/v2/prices/${pair}/buy`,
        `https://api.coinbase.com/v2/prices/${pair}/sell`
    ], function (url) {
        return new Promise(function (resolve, reject) {
            request
                .get(url)
                .on('error', function (error) {
                    reject(error);
                })
                .on('data', function (data) {
                    resolve(data);
                });
        });
    });

    return Promise.all(promises);
};

// COMMANDS ///////////////////////////////////////////////////////////////////

const helpText =
        'This bot is intended to be used in inline mode, just type ' +
        '@cryptorates_bot in any chat.';

bot.onText(/\/start.*/, function (msg) {
    bot.sendMessage(msg.from.id, helpText);
});

bot.onText(/\/help.*/, function (msg) {
    bot.sendMessage(msg.from.id, helpText);
});

// INLINE MODE ////////////////////////////////////////////////////////////////

bot.on('inline_query', function (incomingRequest) {
    const inlineId = incomingRequest.id;

    // console.log(`Querying ${incomingRequest.query}`);

    if (incomingRequest.query.trim().length === 0) {
        bot.answerInlineQuery(inlineId, []);
    }

    const currencies = incomingRequest.query.trim().split(' ');

    getExchangeRates(currencies[0], currencies[1]).then(function (data) {
        console.log(data);
        bot.answerInlineQuery(inlineId, data);
    });
});

module.exports = bot;
