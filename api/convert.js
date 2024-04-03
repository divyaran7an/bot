const axios = require('axios');

module.exports = async (req, res) => {
  const { videoId, lang, format } = req.query;

  const options = {
    method: 'GET',
    url: 'https://youtube-captions-and-transcripts.p.rapidapi.com/getCaptions',
    params: {
      videoId,
      lang,
      format
    },
    headers: {
      'X-RapidAPI-Key': '3d064a261bmsha54142348d3a9a6p19fb45jsn4e1621fe5fc8',
      'X-RapidAPI-Host': 'youtube-captions-and-transcripts.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
