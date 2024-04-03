const fetch = require('node-fetch');

// Your YouTube Data API key
const API_KEY = 'AIzaSyAsXTLiSZnAkM2BGcrxQ28lHMedXiNmr-o';

async function getVideoCaptions(videoId) {
  // Construct the API URL to get video caption tracks
  const captionsUrl = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${API_KEY}`;

  try {
    const response = await fetch(captionsUrl);
    const data = await response.json();

    // Extract the first available caption track (if any)
    if (data.items.length > 0) {
      const trackId = data.items[0].id;
      // Construct the URL to download the caption track
      const downloadUrl = `https://www.googleapis.com/youtube/v3/captions/${trackId}?key=${API_KEY}`;
      // Fetch and return the caption content
      const captionsResponse = await fetch(downloadUrl);
      const captionsText = await captionsResponse.text();
      return captionsText;
    } else {
      return 'No captions available for this video.';
    }
  } catch (error) {
    console.error('Failed to fetch video captions:', error);
    throw new Error('Failed to fetch video captions');
  }
}

module.exports = async (req, res) => {
  // Hardcoded video ID for testing
  const videoId = 'f2kNGLAAUdY';
  try {
    const captions = await getVideoCaptions(videoId);
    res.status(200).send(captions);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
