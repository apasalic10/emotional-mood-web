import axios from 'axios';
import { store } from './reduxStore/store';
import { setLogout } from './reduxStore/authSlice';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dispatch logout action
      store.dispatch(setLogout());

      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
