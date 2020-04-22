import postRobot from 'post-robot';
import IosBridge from './iosBridge';
import AndroidBridge from './androidBridge';
import WebBbridge from './webBbridge';

const packageJson = require('../package.json');
const version = packageJson.version.substring(0, packageJson.version.indexOf('.'));
const guid = window.name;

const PLATFORM_BRIDGE = {
  ios: IosBridge,
  android: AndroidBridge,
  web: WebBbridge,
  dev: WebBbridge,
};

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

const platform = getPlatform();

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

function call(name, data = {}) {
  if (PLATFORM_BRIDGE[platform]?.[name]) {
    return PLATFORM_BRIDGE[platform][name]({ version, ...data });
  }
  return Promise.reject();
}

const client = {
  getToken() {
    return new Promise((resolve, reject) => {
      postRobot
        .sendToParent('getToken', { version, guid })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },

  getNewToken() {
    return new Promise((resolve, reject) => {
      postRobot
        .sendToParent('getNewToken', { version, guid })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },

  getContext() {
    return new Promise((resolve, reject) => {
      postRobot
        .sendToParent('getContext', { version })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
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

  getFormInitData: () => call('getFormInitData', {}),

  getFormStates: () => call('getFormStates', {}),

  getValueList: (tableName) => call('getValueList', { tableName }),

  getFormType: (idTipoForm) => call('getFormType', { idTipoForm }),

  getRelatedEntity: (getEntity, fromEntity, id) =>
    call('getFormType', { getEntity, fromEntity, id }),

  getUsers: () => call('getUsers', {}),

  collapseImagesView: () => call('collapseImagesView', {}),

  expandImagesView: () => call('expandImagesView', {}),

  finishActivity: () => call('finishActivity', {}),

  setTitle: (title) => call('setTitle', { title }),

  saveData: (formData) => call('saveData', { formData }),

  openDatePicker: (date = '', dateMax = '', dateMin = '') => {
    if (date === '') {
      date = getDateNow();
    }
    return call('saveData', { date, dateMax, dateMin });
  },
  openSignatureView: (background = 'white') => call('openSignatureView', { background }),

  showCameraImages: () => call('showCameraImages', {}),

  hideCameraImages: () => call('hideCameraImages', {}),

  showLoading: () => call('showLoading', {}),

  hideLoading: () => call('hideLoading', {}),

  showAlertDialog: (message, btnOk) => call('showAlertDialog', { message, btnOk }),

  showConfirmDialog: (message, btnOkStr, btnKOStr) =>
    call('showConfirmDialog', { message, btnOkStr, btnKOStr }),
};

export default client;
