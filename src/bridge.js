import postRobot from 'post-robot';
import utils from './utils';
import CONSTANTS from './constants/ios.js';
// import IosBridge from './iosBridge';
// import WebBbridge from './webBbridge';

const packageJson = require('../package.json');
const version = packageJson.version.substring(0, packageJson.version.indexOf('.'));
const guid = window.name;
let platform;
let valuelist = [];

function getDateNow() {
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return dd + '/' + mm + '/' + yyyy;
}

// const PLATFORM_BRIDGE = {
//   ios: IosBridge,
//   // android: AndroidBbridge,
//   web: WebBbridge,
// };

function getPlatform() {
  const userAgent = navigator.userAgent || navigator.vendor;
  let platform;

  if (/android/i.test(userAgent)) {
    platform = 'android';
  } else if (
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream
  ) {
    platform = 'ios';
  } else {
    platform = 'web';
  }
  return platform;
}

const client = {
  getToken() {
    return postRobot
      .sendToParent('getToken', { version, guid })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getNewToken() {
    return postRobot
      .sendToParent('getNewToken', { version, guid })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getContext() {
    return postRobot
      .sendToParent('getContext', { version })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getEntityId() {
    console.warn('Warn: getEntityId is deprecated. Please use getContext instead.');
    return postRobot
      .sendToParent('getEntityId', { version })
      .then((res) => {
        return res.data;
      })
      .catch((err) => Promise.reject(err));
  },

  getLiteral(literal) {
    if (!literal) return Promise.reject({ msg: 'No literal' });
    return postRobot.sendToParent('getLiteral', { version, literal });
  },

  getLiterals(literals) {
    if (!literals) return Promise.reject({ msg: 'No literals' });
    return postRobot.sendToParent('getLiteral', { version, literals });
  },

  // ##### FORM FUNCTIONS ##### //

  genericCall(id, params) {
    return new Promise((resolve) => {
      resolve();
      window.webkit.messageHandlers[id].postMessage(params || id);
    });
  },

  genericResponseCall(id, params, timeout) {
    return new Promise((resolve, reject) => {
      const eventFunc = (event) => {
        clearTimeout(timeout);
        window.removeEventListener(id, eventFunc);
        resolve(event.detail.response);
      };
      const timeoutFunc = () => {
        window.removeEventListener(id, eventFunc);
        reject({ error: `${id} timeout` });
      };

      window.addEventListener(id, eventFunc);
      timeout = timeout && setTimeout(timeoutFunc, 3000);
      window.webkit.messageHandlers[id].postMessage(params || id);
    });
  },

  getFormInitData() {
    if (platform === 'ios') {
      return new Promise((resolve, reject) => {
        this.genericResponseCall('getInitData', null)
          .then((res) => resolve(utils.formatFormInitData(res)))
          .catch((err) => reject(err));
      });
    }
    return postRobot
      .sendToParent('getFormInitData', { version, guid })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getFormStates() {
    if (platform === 'ios') {
      return new Promise((resolve, reject) => {
        this.genericResponseCall('getTableName', { tableName: 'tblEstadosForms' })
          .then((res) => {
            resolve(utils.formatFormStates(res));
          })
          .catch((err) => reject(err));
      });
    }
    return postRobot
      .sendToParent('getFormStates', { version })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getValueList(tableName) {
    if (platform === 'ios') {
      return new Promise((resolve, reject) => {
        if (!tableName) {
          reject({ error: 'No table name' });
        } else if (valuelist[tableName]) {
          resolve(valuelist[tableName]);
        } else {
          this.genericResponseCall('getTableName', { tableName })
            .then((res) => {
              valuelist[tableName] = utils.formatValueList(res);
              resolve(valuelist[tableName]);
            })
            .catch((err) => reject(err));
        }
      });
    }
    return postRobot
      .sendToParent('getValueList', { version, tableName })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getFormType(idTipoForm) {
    return postRobot
      .sendToParent('getFormType', { version, idTipoForm })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getRelatedEntity(getEntity, fromEntity, id) {
    if (platform === 'ios') {
      return new Promise((resolve, reject) => {
        let timeout;

        if (!fromEntity) {
          fromEntity = getEntity;
        }

        let eventName = `getEntity-${CONSTANTS.entity[getEntity]}-${CONSTANTS.entityId[
          fromEntity
        ] || CONSTANTS.entity[getEntity]}-${id}`;
        let getRelatedEntitiesByIdEvent = (event) => {
          clearTimeout(timeout);
          removeEventListener(eventName, getRelatedEntitiesByIdEvent);
          resolve(event.detail.response);
        };
        let timeoutFunc = () => {
          window.removeEventListener(eventName, getRelatedEntitiesByIdEvent);
          reject('getRelatedEntitiesById timeout');
        };

        window.addEventListener(eventName, getRelatedEntitiesByIdEvent);
        timeout = setTimeout(timeoutFunc, 5000);
        console.log('getRelatedEntitiesById', {
          idEntityItem: eventName,
          idEntityIn: CONSTANTS.entityId[fromEntity] || CONSTANTS.entity[getEntity],
          idEntityRecupear: +id,
          idEntityOut: CONSTANTS.entity[getEntity],
        });
        window.webkit.messageHandlers.getRelatedEntitiesById.postMessage({
          idEntityItem: eventName,
          idEntityIn: CONSTANTS.entityId[fromEntity] || CONSTANTS.entity[getEntity],
          idEntityRecupear: +id,
          idEntityOut: CONSTANTS.entity[getEntity],
        });
      });
    }
    return postRobot
      .sendToParent('getRelatedEntity', { version, getEntity, fromEntity, id })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getUsers() {
    return postRobot
      .sendToParent('getUsers', { version })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  collapseImagesView() {
    return postRobot
      .sendToParent('collapseImagesView', { version })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  expandImagesView() {
    return postRobot
      .sendToParent('expandImagesView', { version })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  finishActivity() {
    if (platform === 'ios') {
      return this.genericCall('finishActivity', null);
    }
    return postRobot
      .sendToParent('finishActivity', { version })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  setTitle(title) {
    if (platform === 'ios') {
      return this.genericCall('setTitle', { title: title });
    }
    return postRobot
      .sendToParent('setTitle', { version, title })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  saveData(formData) {
    if (platform === 'ios') {
      return new Promise((resolve, reject) => {
        let timeout;
        let saveDataOK;
        let saveDataKO;
        let timeoutFunc = () => {
          window.removeEventListener('saveDataOK', saveDataOK);
          window.removeEventListener('saveDataKO', saveDataKO);
          reject('saveData timeout');
        };

        saveDataOK = (event) => {
          clearTimeout(timeout);
          window.removeEventListener('saveDataOK', saveDataOK);
          window.removeEventListener('saveDataKO', saveDataKO);
          resolve();
        };
        saveDataKO = (event) => {
          clearTimeout(timeout);
          window.removeEventListener('saveDataOK', saveDataOK);
          window.removeEventListener('saveDataKO', saveDataKO);
          reject();
        };
        window.addEventListener('saveDataOK', saveDataOK);
        window.addEventListener('saveDataKO', saveDataKO);
        timeout = setTimeout(timeoutFunc, 5000);
        window.webkit.messageHandlers.saveData.postMessage({
          objectToSave: JSON.stringify(formData),
        });
      });
    }
    return postRobot
      .sendToParent('saveData', { version, formData })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  openDatePicker(date = '', dateMax = '', dateMin = '') {
    if (date === '') {
      date = getDateNow();
    }
    return postRobot
      .sendToParent('openDatePicker', { version, date, dateMax, dateMin })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  openSignatureView(background = 'white') {
    if (platform === 'ios') {
    }
    return postRobot
      .sendToParent('openSignatureView', { version, background })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  showCameraImages() {
    return postRobot
      .sendToParent('showCameraImages', { version })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  hideCameraImages() {
    return postRobot
      .sendToParent('hideCameraImages', { version })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  showLoading() {
    if (platform === 'ios') {
      return this.genericCall('showLoading', null);
    }
    return postRobot
      .sendToParent('showLoading', { version })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  hideLoading() {
    if (platform === 'ios') {
      return this.genericCall('hideLoading', null);
    }
    return postRobot
      .sendToParent('hideLoading', { version })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  showAlertDialog(message, btnOk) {
    return postRobot
      .sendToParent('showAlertDialog', { version, message, btnOk })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  showConfirmDialog(message, btnOkStr, btnKOStr) {
    return postRobot
      .sendToParent('showConfirmDialog', { version, message, btnOkStr, btnKOStr })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },
};

platform = getPlatform();

export default client;
