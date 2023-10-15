import axios from 'axios';

const KEY = '40010743-d05596e7f628efecfaf78134c';
const API_URL = 'https://pixabay.com/api/?';
const perPage = 40;

export const fetchPhotos = async (query, page) => {
  try {
    const data = await axios.get(API_URL, {
      params: {
        key: KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching photos:', error);
  }
};
