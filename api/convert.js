const express = require('express');
const axios = require('axios');
const { execSync } = require('child_process');

const app = express();
app.use(express.json());

const ASSEMBLYAI_API_KEY = "44a59a5f79334612ac64ab85f9196d22";

function getAudioUrl(videoId) {
  try {
    const command = `yt-dlp -f bestaudio --get-url https://www.youtube.com/watch?v=${videoId}`;
    const audioUrl = execSync(command).toString().trim();
    console.log(`Audio URL: ${audioUrl}`); // Debug: Log the audio URL
    return audioUrl;
  } catch (error) {
    console.error(`Error getting audio URL for video ${videoId}:`, error); // Debug: Log errors
    throw error;
  }
}

async function transcribeAudio(audioUrl) {
  try {
    const response = await axios.post('https://api.assemblyai.com/v2/transcript', {
      audio_url: audioUrl,
    }, {
      headers: {
        'authorization': ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Transcription response:`, response.data); // Debug: Log the response
    return response.data;
  } catch (error) {
    console.error(`Error transcribing audio:`, error); // Debug: Log errors
    throw error;
  }
}

app.post('/api/convert', async (req, res) => {
  try {
    const videoId = req.body.videoId;
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    console.log(`Request received for video ID: ${videoId}`); // Debug: Log the video ID
    const audioUrl = getAudioUrl(videoId);
    const transcription = await transcribeAudio(audioUrl);
    res.json(transcription);
  } catch (error) {
    console.error(`Error in /api/convert endpoint:`, error); // Debug: Log endpoint errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
