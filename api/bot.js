const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Replace with your actual Telegram bot token
const bot = new TelegramBot('6764939618:AAGJ8XSHH6N7yShX4SoIF0eFj9c7yZ4iyqY', { polling: true });

// Endpoint to authenticate a user with a given hash
bot.onText(/\/auth (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const hash = match[1];

  try {
    const response = await axios.get('https://chat-2jda.vercel.app/api/auth', {
      params: { hash }
    });

    if (response.data.user) {
      bot.sendMessage(chatId, `Login successful: ${response.data.message}\nName: ${response.data.user.name}\nWallet Address: ${response.data.user.walletAddress}\nPoints: ${response.data.user.points}`);
    } else {
      bot.sendMessage(chatId, `Login successful: ${response.data.message}`);
    }
  } catch (error) {
    bot.sendMessage(chatId, `Login failed: ${error.response?.data?.message || 'Unknown error'}`);
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
    bot.sendMessage(chatId, `Error: ${error.response?.data?.error || 'Unknown error'}`);
  }
});

// Endpoint to retrieve earnings for a user
bot.onText(/\/earnings (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const hash = match[1];

  try {
    const response = await axios.get('https://chat-2jda.vercel.app/api/earnings', {
      params: { hash }
    });

    bot.sendMessage(chatId, `Earnings: ${response.data.message}`);
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.response?.data?.message || 'Unknown error'}`);
  }
});

module.exports = (req, res) => {
  res.status(200).send('Bot is running');
};
