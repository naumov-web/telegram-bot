const TelegramApi = require('node-telegram-bot-api')

const token = ''
const botName = ''
const options = {
    polling: true
}

const bot = new TelegramApi(token, options)

const chatsNumbers = {}
const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}],
        ]
    })
}
const tryAgainOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Попробовать еще раз?', callback_data: '/try_again'}]
        ]
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а вы должны его угадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chatsNumbers[chatId] = randomNumber

    return bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        const chatId = msg.chat.id
        const text = msg.text

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return bot.sendMessage(chatId, 'Добро пожаловать!')
        }

        if (text === '/about-me') {
            return bot.sendMessage(chatId, `Вас зовут: ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я вас не понимаю :-(')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === '/try_again') {
            return startGame(chatId)
        }

        if (data === chatsNumbers[chatId].toString()) {
            return bot.sendMessage(chatId, 'Вы угадали :-)', tryAgainOptions)
        } else {
            return bot.sendMessage(chatId, 'Вы не угадали :-(', tryAgainOptions)
        }
    })
}

start()