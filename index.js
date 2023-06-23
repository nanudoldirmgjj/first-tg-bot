const TelegramApi = require('node-telegram-bot-api');

const {gameOptions, againOptions, startOptions} = require('./options')

const token = "5873485125:AAET4Fu5WkjlupW2Ip_ey-CJUDihfqkobTE";


const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
    { command: '/start', description: "Начальное приветствие" },
    { command: '/game', description: 'Игра "угадай число"' },
])

const chats = {};


const game = async (chatId) => {

    await bot.sendMessage(chatId, 'Я загадываю число от 1 до 10, а ты его угадываешь');
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);

}

const start = () => {

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;


        if (text === '/start') {
            return bot.sendMessage(chatId, `Добро пожаловать в мой первый телеграм бот! \nВот что я умею: `, startOptions);
        }



        if (text === '/game') {
            return (game(chatId));
        }

        return bot.sendMessage(chatId, 'Я вас не понимаю'), bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/h/hipowhat/hipowhat_004.webp');
    });
    bot.on('callback_query', async msg => {
        
        const data = msg.data;
        const chatID = msg.message.chat.id;

        if (data === '/again' || data === '/game') return game(chatID);

        if (Number(data) === chats[chatID]) {
            return await bot.sendMessage(chatID, 'Молодец, ты угадал!', againOptions);
        } else await bot.sendMessage(chatID, `К сожалению, ты проиграл. Я загадывал цифру ${chats[chatID]}`, againOptions);

    })
}

start();