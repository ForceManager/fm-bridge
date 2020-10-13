import Axios from 'axios';
import bridge from './bridge';

const guid = window.name;

let ready = false;

const instance = Axios.create({
  timeout: 30000,
  withCredentials: false,
  maxContentLength: 128 * 1024 * 1024,
  // baseURL: 'https://externalpre.forcemanager.net/external/v1',
  baseURL: 'https://external.forcemanager.net/external/v1',
  dataType: 'json',
  contentType: 'application/json',
  accept: '*/*',
  // headers: {
  //   'Cache-Control': 'max-age=0, no-cache, must-revalidate, proxy-revalidate',
  // },
});

function setConfig(config) {
  return new Promise((resolve, reject) => {
    if (!ready) {
      bridge
        .getToken(guid)
        .then((res) => {
          if (res) {
            return Promise.resolve(res);
          }
          return bridge.getNewToken(guid);
        })
        .then((token) => {
          config.headers['Authorization'] = `Bearer ${token}`;
          instance.defaults.headers['Authorization'] = `Bearer ${token}`;
          ready = true;
          resolve(config);
        })
        .catch(reject);
    } else {
      resolve(config);
    }
  });
}

instance.interceptors.request.use(
  (config) => {
    return setConfig(config);
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (
      response &&
      response.status === 401 &&
      response.data &&
      (response.data.code === '2' || response.data === 'Token is expired')
    ) {
      const retryOriginalRequest = new Promise((resolve, reject) => {
        bridge
          .getNewToken(guid)
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            instance.defaults.headers['Authorization'] = `Bearer ${token}`;
            resolve(Axios(originalRequest));
          })
          .catch(reject);
      });

      return retryOriginalRequest;
    }

    return Promise.reject(error);
  },
);

export const axios = instance;
