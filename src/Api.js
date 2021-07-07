import axios from 'axios';

const { REACT_APP_HOST: baseURL } = process.env;

const headers = {
   'Content-Type': 'application/json',
   'cache-control': 'no-cache',
};

const axs = axios.create({
   baseURL,
   headers,
});


const EXPORT_API = {
   GET_INDEX_HISTORY: () => axs.get('/cvx'),
};

export default EXPORT_API;