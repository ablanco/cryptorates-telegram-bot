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

// curl https://api.kraken.com/0/public/Ticker?pair=ETHEUR

const getExchangeRates = function (from, to) {
    const pair = `${from}${to}`;
    const url = `https://api.kraken.com/0/public/Ticker?pair=${pair}`;

    return new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
            if (error) {
                reject(error);
            }
            resolve(body);
        });
    });
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
    const query = incomingRequest.query.trim().toUpperCase();

    // console.log(`Querying ${incomingRequest.query}`);

    if (query.length === 0) {
        bot.answerInlineQuery(inlineId, []);
        return;
    }

    const currencies = query.split(' ');
    const from = _.get(currencies, '[0]', '');
    let to = _.get(currencies, '[1]', '');

    if (to.length === 0) { to = 'EUR'; }
    if (from.length !== 3 || to.length !== 3) {
        bot.answerInlineQuery(inlineId, []);
        return;
    }

    getExchangeRates(from, to).then(function (data) {
        // console.log(`Got this from server: ${data}`);

        // {"error":[],"result":{"XETHZEUR":{"a":["326.50000","7","7.000"],"b":["326.50000","6","6.000"],"c":["326.50000","0.82270000"],"v":["59528.91437761","81253.27399644"],"p":["318.07435","317.36101"],"t":[12629,17724],"l":["305.10000","305.10000"],"h":["326.50000","326.50000"],"o":"316.49932"}}}

        data = _.get(JSON.parse(data), 'result', {});
        let key = _.keys(data);
        if (key.length !== 1) {
            bot.answerInlineQuery(inlineId, []);
            return;
        }
        key = key[0];
        data = data[key];

        const buyAmount = _.get(data, 'b.0', 'Error');
        const sellAmount = _.get(data, 'a.0', 'Error');
        const lastAmount = _.get(data, 'c.0', 'Error');
        const tfhVolume = _.get(data, 'v.1', 'Error');
        const tfhAverageAmount = _.get(data, 'p.1', 'Error');
        const tfhTrades = _.get(data, 't.1', 'Error');
        const tfhLowestAmount = _.get(data, 'l.1', 'Error');
        const tfhHighestAmount = _.get(data, 'h.1', 'Error');
        const openingAmount = _.get(data, 'o', 'Error');

        const content = `From *${from} to ${to}*

Buy rate: *${buyAmount}*
Sell rate: *${sellAmount}*

Last trade rate: *${lastAmount}*
Last 24 hours volume: *${tfhVolume}*
Last 24 hours average rate: *${tfhAverageAmount}*
Last 24 hours number of trades: *${tfhTrades}*

Last 24 hours lowest rate: *${tfhLowestAmount}*
Last 24 hours highest rate: *${tfhHighestAmount}*
Today's opening price: *${openingAmount}*

_Data from kraken.com_`;

        bot.answerInlineQuery(inlineId, [{
            id: uuidV4(),
            type: 'article',
            title: `Buy at ${buyAmount} and sell at ${sellAmount}`,
            /* eslint-disable camelcase */
            input_message_content: {
                parse_mode: 'markdown',
                message_text: content
            }
            /* eslint-enable camelcase */
        }]);
    });
});

module.exports = bot;
