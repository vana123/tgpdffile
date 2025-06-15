import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);
const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:3000';

// Handle PDF files
bot.on('document', async (ctx) => {
  try {
    const fileId = ctx.message.document.file_id;
    console.log('Received document with file_id:', fileId);
    
    // Verify file type
    if (!ctx.message.document.mime_type?.includes('pdf')) {
      await ctx.reply('Будь ласка, надішліть PDF файл.');
      return;
    }

    // Create inline keyboard with button to open web app
    const webAppUrl = `${WEBAPP_URL}?file_id=${fileId}`;
    console.log('Generated WebApp URL:', webAppUrl);

    await ctx.reply('Відкрити PDF у веб-додатку:', {
      reply_markup: {
        inline_keyboard: [
          [{
            text: 'Відкрити PDF',
            web_app: { url: webAppUrl }
          }]
        ]
      }
    });
  } catch (error) {
    console.error('Error handling document:', error);
    await ctx.reply('Сталася помилка при обробці файлу. Спробуйте ще раз.');
  }
});

// Start command
bot.command('start', (ctx) => {
  ctx.reply('Відправте мені PDF файл, і я допоможу вам його переглянути.');
});

// Launch bot
bot.launch().then(() => {
  console.log('Bot started successfully');
  console.log('WebApp URL:', WEBAPP_URL);
}).catch((err) => {
  console.error('Error starting bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 