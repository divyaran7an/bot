const axios = require('axios');

module.exports = async (req, res) => {
  const text = req.query.text;
  const providers = req.query.providers || 'openai'; // Explicitly set default value

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const postData = {
    providers,
    text,
    chatbot_global_action: 'Act as an assistant',
    previous_history: [],
    temperature: 0,
    max_tokens: 100,
    fallback_providers: ''
  };

  const config = {
    method: 'post',
    url: 'https://api.edenai.run/v2/text/chat',
    headers: {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWJmY2M1MWItZjkyMi00NjVkLTkzYjUtOWI0MjdiMjg5Mjg2IiwidHlwZSI6ImFwaV90b2tlbiJ9.YVxMghpbDVNDs-qrjPqUGVKlWukQwnnnwTtlW6wVQ0M',
      'content-type': 'application/json'
    },
    data: postData
  };

  try {
    const response = await axios(config);
    console.log(response.data); 
    const generatedText = response.data[providers]?.generated_text;
    if (generatedText) {
      res.status(200).json({ generatedText });
    } else {
      res.status(500).json({ error: 'Generated text not found in response' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
