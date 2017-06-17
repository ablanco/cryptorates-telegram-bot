# cryptorates-telegram-bot

[![Code Climate](https://codeclimate.com/github/ablanco/cryptorates-telegram-bot/badges/gpa.svg)](https://codeclimate.com/github/ablanco/cryptorates-telegram-bot)

A Telegram bot for getting cryptocurrencies exchange rates, from Kraken.

It works in inline mode. Write `@cryptorates_bot <currency_1> <currency_2>` in
any Telegram chat and you'll get a menu with the exchange rates where you can
choose what do you want to share. Currencies are written in their ISO code form.

For example: `@cryptorates_bot ETH EUR`

It's possible to omit the second parameter, in that case, the bot will assume
it's `EUR`.

## Boring Legal Stuff

MIT License

Copyright (c) 2017 Alejandro Blanco

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
