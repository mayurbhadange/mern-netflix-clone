// import axios from 'axios';
// import { ENV_VARS } from '../config/envVars.js';

  
  

// export const fetchFromTMDB = async (url) => {

//     const options = {
//         headers: {
//           accept: 'application/json',
//           Authorization: 'Bearer ' + ENV_VARS.TMDB_API_KEY
//         }
//       };

//       const response =  await axios.get(url, options);

//       if (!response.status === 200) {
//             throw new Error('Failed to fetch data from TMDB' + response.statusText);
//         }

//         return response.data;
      

//     };


import axios from 'axios';
import { ENV_VARS } from '../config/envVars.js';

export const fetchFromTMDB = async (url) => {
  try {
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + ENV_VARS.TMDB_API_KEY,
      },
    };

    const response = await axios.get(url, options);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch data from TMDB: ${response.status} - ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching from TMDB:', error.message);
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Status Code:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    throw error;
  }
};
