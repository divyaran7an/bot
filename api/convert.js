const fetch = require('node-fetch');

// Assuming you're using the TranscribeTube API
const TRANSCRIBETUBE_API_URL = 'https://tapi.transcribetube.com/api/v1/transcript/{videoId}?apikey=4e6MWJXqCx@oQ5?pPEhLDPO%jLedCkPdaxMPh&jAMbV5#uFy';

async function getVideoTranscription(videoId) {
  const apiUrl = TRANSCRIBETUBE_API_URL.replace('{videoId}', videoId);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch video transcription:', error);
    throw error;
  }
}

module.exports = async (req, res) => {
  // Extract videoId from query parameters
  const { videoId } = req.query;

  try {
    const transcription = await getVideoTranscription(videoId);
    res.status(200).json(transcription);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
