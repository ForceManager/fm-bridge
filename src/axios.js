import Axios from 'axios';
import bridge from './bridge';

let ready = false;

export function createInstance(config) {
  return Axios.create({
    timeout: 30000,
    withCredentials: false,
    maxContentLength: 128 * 1024 * 1024,
    headers: {
      'Cache-Control': 'max-age=0, no-cache, must-revalidate, proxy-revalidate',
    },
    ...config,
  });
}

const instance = createInstance({
  baseURL: 'https://external.forcemanager.net/external/v1',
});

function setConfig(config) {
  return new Promise((resolve, reject) => {
    if (!ready) {
      bridge
        .getToken()
        .then((res) => {
          config.headers['Authorization'] = `Bearer ${res.data}`;
          ready = true;
          resolve(config);
        })
        .catch((err) => reject(err));
    } else {
      resolve(config);
    }
  });
}

instance.interceptors.request.use(
  (config) => {
    return setConfig(config)
      .then(() => config)
      .catch((err) => Promise.reject(err));
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    console.log('interceptors response', response);
    return response;
  },
  (error) => {
    const { config, response } = error;
    const originalRequest = config;
    let token;

    if (response && response.status === 401 && response.data && response.data.code === '2') {
      const retryOriginalRequest = new Promise((resolve) => {
        bridge.getNewToken((res) => {
          token = res.data;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(Axios(originalRequest));
        });
      });

      if (token) {
        return retryOriginalRequest;
      }
    }

    return Promise.reject(error);
  },
);

export const axios = instance;
