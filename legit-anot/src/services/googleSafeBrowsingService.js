const axios = require('axios');

const API_KEY = 'AIzaSyByeLBjadSQnJ7AdU5SIcV7ZBKZwRu0eCk';
const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

export const checkWebsiteSafe = async (url) => {
  try {
    const response = await axios.post(API_URL, {
      client: {
        clientId: 'your-app-id',
        clientVersion: '1.0.0',
      },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }],
      },
    });

    // Check if response.data is empty
    if (Object.keys(response.data).length === 0) {
      console.log('No threats found.');
      return 'No threats found';
    }

    // Handle response data here
    console.log('Threats found:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking website safety:', error);
    throw error;
  }
};
