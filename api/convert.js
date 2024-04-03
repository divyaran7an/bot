const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://youtube-captions-and-transcripts.p.rapidapi.com/getCaptions',
  params: {
    videoId: '9_43jFjkv4w',
    lang: 'en',
    format: 'json'
  },
  headers: {
    'X-RapidAPI-Key': '3d064a261bmsha54142348d3a9a6p19fb45jsn4e1621fe5fc8',
    'X-RapidAPI-Host': 'youtube-captions-and-transcripts.p.rapidapi.com'
  }
};

try {
  const response = await axios.request(options);
  console.log(response.data);
} catch (error) {
  console.error(error);
}