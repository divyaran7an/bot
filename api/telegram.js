const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('YOUR_TELEGRAM_BOT_TOKEN', { polling: true });

// Endpoint to authenticate a user with a given hash
bot.onText(/\/auth (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const hash = match[1];

  try {
    const response = await axios.get('https://chat-2jda.vercel.app/api/auth', {
      params: { hash }
    });

    bot.sendMessage(chatId, `Login successful: ${response.data.message}`);
  } catch (error) {
    bot.sendMessage(chatId, `Login failed: ${error.response.data.message}`);
  }
});

// Endpoint to send a chat message and receive a response from an AI assistant
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Skip if the message is a command (starts with '/')
  if (text.startsWith('/')) return;

  try {
    const response = await axios.get('https://chat-2jda.vercel.app/api/chat', {
      params: { text }
    });

    bot.sendMessage(chatId, `AI Response: ${response.data.generatedText}`);
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.response.data.error}`);
  }
});

// Endpoint to retrieve earnings for a user
bot.onText(/\/earnings
