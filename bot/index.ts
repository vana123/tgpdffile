import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);
const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:3000';

// Handle PDF files
bot.on('document', async (ctx) => {
  const fileId = ctx.message.document.file_id;
  
  // Create inline keyboard with button to open web app
  await ctx.reply('Відкрити PDF у веб-додатку:', {
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Відкрити PDF',
          web_app: { url: `${WEBAPP_URL}?file_id=${fileId}` }
        }]
      ]
    }
  });
});

// Start command
bot.command('start', (ctx) => {
  ctx.reply('Відправте мені PDF файл, і я допоможу вам його переглянути.');
});

// Launch bot
bot.launch().then(() => {
  console.log('Bot started');
}).catch((err) => {
  console.error('Error starting bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 