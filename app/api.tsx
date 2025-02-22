import axios from 'axios';

const API_URL = 'https://json-jvjm.onrender.com/test';

export const fetchHoldings = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.userHolding;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
