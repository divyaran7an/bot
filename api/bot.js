const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Use environment variable for the token
const token = "6764939618:AAGJ8XSHH6N7yShX4SoIF0eFj9c7yZ4iyqY";
const bot = new TelegramBot(token, { polling: true });

const authenticatedUsers = {};

// Create a base Axios instance for repeated use
const apiClient = axios.create({
  baseURL: 'https://chat-2jda.vercel.app/api',
});

// Async middleware for handling errors in async bot handlers
const asyncMiddleware = (fn) => (msg, match) => {
  Promise.resolve(fn(msg, match)).catch((error) => {
    console.error('Error handling bot command:', error);
    bot.sendMessage(msg.chat.id, `An error occurred: ${error.message}`);
  });
};

// Middleware for checking authentication
const isAuthenticated = (msg) => !!authenticatedUsers[msg.chat.id];

bot.onText(/\/start/, asyncMiddleware(async (msg) => {
  const chatId = msg.chat.id;
  if (isAuthenticated(msg)) {
    bot.sendMessage(chatId, "Welcome back! You are already authenticated and can use the bot.");
  } else {
    bot.sendMessage(chatId, "Welcome to the Capx Bot! Please authenticate using /auth <hash> to use the bot.");
  }
}));

bot.onText(/\/auth (.+)/, asyncMiddleware(async (msg, match) => {
  const chatId = msg.chat.id;
  const hash = match[1];
  const response = await apiClient.get('/auth', { params: { hash } });
  if (response.data.user) {
    authenticatedUsers[chatId] = response.data.user;
    bot.sendMessage(chatId, `Login successful: ${response.data.message}\nName: ${response.data.user.name}\nWallet Address: ${response.data.user.walletAddress}\nPoints: ${response.data.user.points}`);
  } else {
    bot.sendMessage(chatId, `Login successful: ${response.data.message}`);
  }
}));

bot.onText(/\/earnings/, asyncMiddleware(async (msg) => {
  const chatId = msg.chat.id;
  if (!isAuthenticated(msg)) {
    bot.sendMessage(chatId, "You must authenticate first using /auth <hash>.");
    return;
  }
  bot.sendMessage(chatId, "You have 100 earnings.");
}));

bot.on('message', asyncMiddleware(async (msg) => {
  const chatId = msg.chat.id;
  if (!msg.text.startsWith('/') && isAuthenticated(msg)) {
    bot.sendChatAction(chatId, 'typing');
    const response = await apiClient.get('/chat', {
      params: { text: msg.text }
    });
    bot.sendMessage(chatId, `AI Response: ${response.data.generatedText}`);
  } else if (!isAuthenticated(msg)) {
    bot.sendMessage(chatId, "You must authenticate first using /auth <hash>.");
  }
}));

module.exports = (req, res) => {
  if (req.body) {
    bot.processUpdate(req.body);
  }
  res.status(200).send('Bot is running');
};
