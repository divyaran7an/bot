const express = require('express');
const axios = require('axios');
const { execSync } = require('child_process');

const app = express();
app.use(express.json());

const ASSEMBLYAI_API_KEY = "44a59a5f79334612ac64ab85f9196d22";

function getAudioUrl(videoId) {
  const command = `yt-dlp -f bestaudio --get-url https://www.youtube.com/watch?v=${videoId}`;
  const audioUrl = execSync(command).toString().trim();
  return audioUrl;
}

async function transcribeAudio(audioUrl) {
  const response = await axios.post('https://api.assemblyai.com/v2/transcript', {
    audio_url: audioUrl,
  }, {
    headers: {
      'authorization': ASSEMBLYAI_API_KEY,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}

app.post('/api/convert', async (req, res) => {
  try {
    const videoId = req.body.videoId;
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    const audioUrl = getAudioUrl(videoId);
    const transcription = await transcribeAudio(audioUrl);
    res.json(transcription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
