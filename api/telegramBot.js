const axios = require('axios');

module.exports = async (req, res) => {
    const { message } = req.body;
    if (message && message.text) {
        const chatId = message.chat.id;
        const replyText = `Echo: ${message.text}`;
        await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: replyText,
        });

        res.status(200).send('OK');
    } else {
        res.status(200).send('No message received');
    }
};
