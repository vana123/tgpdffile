const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Обробка команди /start
bot.command('start', (ctx) => {
    ctx.reply('Вітаю! Відправте мені PDF файл, і я покажу його у веб-додатку.');
});

// Обробка PDF файлів
bot.on('document', async (ctx) => {
    const file = ctx.message.document;
    
    // Відповідаємо file_id незалежно від типу документа
    await ctx.reply(`file_id: ${file.file_id}`);

    // Перевіряємо чи це PDF
    if (file.mime_type === 'application/pdf') {
        const webAppUrl = `${process.env.WEBAPP_URL}?file_id=${file.file_id}`;
        await ctx.reply('PDF файл отримано! Натисніть кнопку нижче, щоб переглянути його:', {
            reply_markup: {
                inline_keyboard: [[
                    { text: 'Переглянути PDF', web_app: { url: webAppUrl } }
                ]]
            }
        });
    } else {
        await ctx.reply('Будь ласка, надішліть PDF файл.');
    }
});

// Запуск бота
bot.launch().then(() => {
    console.log('Бот запущено!');
}).catch((err) => {
    console.error('Помилка запуску бота:', err);
});

// Елегантне завершення роботи
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 