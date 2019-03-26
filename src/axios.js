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
          if (res.data) {
            return Promise.resolve(res);
          }
          return bridge.getNewToken();
        })
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
    return response;
  },
  (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response && response.status === 401 && response.data && response.data.code === '2') {
      const retryOriginalRequest = new Promise((resolve) => {
        bridge.getNewToken((res) => {
          originalRequest.headers['Authorization'] = `Bearer ${res.data}`;
          resolve(Axios(originalRequest));
        });
      });

      return retryOriginalRequest;
    }

    return Promise.reject(error);
  },
);

export const axios = instance;
