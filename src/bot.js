// Copyright (c) 2017 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

'use strict';

const settings = require('./settings.js');

const TelegramBot = require('node-telegram-bot-api');
const _ = require('lodash');
const request = require('request');
const uuidV4 = require('uuid/v4');

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
            request(url, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(body);
            });
        });
    });

    return Promise.all(promises);
};

const rateTypes = {
    0: 'Spot',
    1: 'Buy',
    2: 'Sell'
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
        return;
    }

    const currencies = incomingRequest.query.trim().split(' ');
    const from = _.get(currencies, '[0]', '');
    const to = _.get(currencies, '[1]', '');

    if (from.length !== 3 || to.length !== 3) {
        bot.answerInlineQuery(inlineId, []);
        return;
    }

    getExchangeRates(from, to).then(function (data) {
        var prices = _.map(data, function (dataJson, index) {
            const amount = _.get(JSON.parse(dataJson), 'data.amount', 'Error');
            const type = rateTypes[index];
            const content = `${type} rate: ${amount}`;

            return {
                id: uuidV4(),
                type: 'article',
                title: content,
                // eslint-disable-next-line camelcase
                input_message_content: {
                    // eslint-disable-next-line camelcase
                    message_text: `${from} to ${to} => ${content}`
                }
            };
        });
        bot.answerInlineQuery(inlineId, prices);
    });
});

module.exports = bot;
