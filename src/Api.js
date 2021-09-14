import axios from 'axios';

const { REACT_APP_HOST: baseURL, REACT_APP_HOST_V2: baseUrlV2 } = process.env;

const headers = {
   'Content-Type': 'application/json',
   'cache-control': 'no-cache',
};

const axs = axios.create({
   baseURL,
   headers,
});

const axsV2 = axios.create({
   baseURL: baseUrlV2,
   headers,
});


const Api = {
   GET_INDEX_HISTORY: () => axs.get('/cvx'),
   GET_FEES_COLLECTED: (queryParams = "") => axsV2.get('/fees' + queryParams)
};

export default Api;