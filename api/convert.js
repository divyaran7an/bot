const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// Your OAuth 2.0 credentials
const CLIENT_ID = '701835730412-rh1adur82n4t8om1vec154j797milkpg.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URL = 'http://www.google.com'; // You can use any URL here since we're manually handling the token
const SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];

// The path to store the token
const TOKEN_PATH = 'token.json';

// Function to authorize and get the access token
async function authorize() {
 const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

 // Check if we have previously stored a token.
 if (fs.existsSync(TOKEN_PATH)) {
    oauth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8')));
 } else {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const code = await new Promise(resolve => rl.question('Enter the code from that page here: ', resolve));
    rl.close();
    const {tokens} = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
 }

 return oauth2Client;
}

// Function to get video captions
async function getVideoCaptions(videoId, auth) {
 const service = google.youtube({version: 'v3', auth});
 const response = await service.captions.list({
    part: 'snippet',
    videoId: videoId,
 });

 if (response.data.items.length > 0) {
    const trackId = response.data.items[0].id;
    const captionsResponse = await service.captions.download({
      id: trackId,
    });
    return captionsResponse.data;
 } else {
    return 'No captions available for this video.';
 }
}

// Main function to run the script
async function main() {
 const auth = await authorize();
 const videoId = 'YOUR_VIDEO_ID_HERE'; // Replace with your video ID
 const captions = await getVideoCaptions(videoId, auth);
 console.log(captions);
}

main().catch(console.error);
