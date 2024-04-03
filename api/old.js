const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const token = '6764939618:AAGJ8XSHH6N7yShX4SoIF0eFj9c7yZ4iyqY';
const bot = new TelegramBot(token, { polling: true });

const authenticatedUsers = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  if (authenticatedUsers[chatId]) {
    bot.sendMessage(chatId, "Welcome back! You are already authenticated and can use the bot.");
  } else {
    bot.sendMessage(chatId, "Welcome to the Capx Bot! Please authenticate using /auth <hash> to use the bot.");
  }
});

bot.onText(/\/auth (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const hash = match[1];
  try {
    const response = await axios.get('https://chat-2jda.vercel.app/api/auth', {
      params: { hash }
    });
    if (response.data.user) {
      authenticatedUsers[chatId] = response.data.user;
      bot.sendMessage(chatId, `Login successful: ${response.data.message}\nName: ${response.data.user.name}\nWallet Address: ${response.data.user.walletAddress}\nPoints: ${response.data.user.points}`);
    } else {
      bot.sendMessage(chatId, `Login successful: ${response.data.message}`);
    }
  } catch (error) {
    bot.sendMessage(chatId, `Login failed: ${error.response?.data?.message || 'Unknown error'}`);
  }
});

bot.onText(/\/earnings/, async (msg) => {
  const chatId = msg.chat.id;
  if (!authenticatedUsers[chatId]) {
    bot.sendMessage(chatId, "You must authenticate first using /auth <hash>.");
    return;
  }
  bot.sendMessage(chatId, "You have 100 earnings.");
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  if (!msg.text.startsWith('/') && authenticatedUsers[chatId]) {
    bot.sendChatAction(chatId, 'typing');
    try {
      const response = await axios.get('https://chat-2jda.vercel.app/api/chat', {
        params: { text: msg.text }
      });
      bot.sendMessage(chatId, `AI Response: ${response.data.generatedText}`);
    } catch (error) {
      bot.sendMessage(chatId, `Error: ${error.response?.data?.error || 'Unknown error'}`);
    }
  } else if (!authenticatedUsers[chatId]) {
    bot.sendMessage(chatId, "You must authenticate first using /auth <hash>.");
  }
});

module.exports = (req, res) => {
  if (req.body) {
    bot.processUpdate(req.body);
  }
  res.status(200).send('Bot is running');
};
