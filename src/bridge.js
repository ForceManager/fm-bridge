import postRobot from 'post-robot';

const packageJson = require('../package.json');
const version = packageJson.version.substring(0, packageJson.version.indexOf('.'));
const guid = window.name;

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

  // getUserData() {
  //   return postRobot.sendToParent('getUserData', { version });
  // },

  // ##### SFM FUNCTIONS ##### //

  // getFilteredUsers() {
  //   return postRobot.sendToParent('getFilteredUsers', { version });
  // },

  // getPermissions() {
  //   return postRobot.sendToParent('getPermissions', { version });
  // },

  // setDrilldown(key, value) {
  //   if (!key || !value) return Promise.reject({ msg: 'No key or value' });
  //   return postRobot.sendToParent('setDrilldown', { version, key, value });
  // },

  // getFilteredPeriodString(period) {
  //   if (period !== undefined) {
  //     return {
  //       startDate: period.dateStart.getTime(),
  //       endDate: period.dateEnd.getTime(),
  //     };
  //   }
  //   return postRobot.sendToParent('getFilteredPeriodString', { version });
  // },

  // ##### FORM FUNCTIONS ##### //

  getFormInitData() {
    return new Promise((resolve, reject) => {
      postRobot
        .sendToParent('getFormInitData', { version, guid })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },

  getFormStates() {
    return new Promise((resolve, reject) => {
      postRobot
        .sendToParent('getFormStates', { version })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },

  getValueList(tableName) {
    return new Promise((resolve, reject) => {
      postRobot
        .sendToParent('getValueList', { version, tableName })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },

  getFormType(idTipoForm) {
    return new Promise((resolve, reject) => {
      postRobot
        .sendToParent('getFormType', { version, idTipoForm })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },

  getRelatedEntity(getEntity, fromEntity, id) {
    return new Promise((resolve, reject) => {
      postRobot
        .sendToParent('getRelatedEntity', { version, getEntity, fromEntity, id })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },

  getUsers() {
    return new Promise((resolve, reject) => {
      postRobot
        .sendToParent('getUsers', { version })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },

  collapseImagesView() {
    return postRobot.sendToParent('collapseImagesView', { version });
  },

  expandImagesView() {
    return postRobot.sendToParent('expandImagesView', { version });
  },

  finishActivity() {
    return postRobot.sendToParent('finishActivity', { version });
  },

  setTitle(title) {
    return postRobot.sendToParent('setTitle', { version, title });
  },

  saveData(formData) {
    return new Promise((resolve, reject) => {
      postRobot
        .sendToParent('saveData', { version, formData })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },

  openDatePicker(date = '', dateMax = '', dateMin = '') {
    return new Promise((resolve, reject) => {
      if (date === '') {
        date = getDateNow();
      }
      postRobot
        .sendToParent('openDatePicker', { version, date, dateMax, dateMin })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },

  openSignatureView(background = 'white') {
    return new Promise((resolve, reject) => {
      postRobot
        .sendToParent('openSignatureView', { version, background })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },

  showCameraImages() {
    return postRobot.sendToParent('showCameraImages', { version });
  },

  hideCameraImages() {
    return postRobot.sendToParent('hideCameraImages', { version });
  },

  showLoading() {
    return postRobot.sendToParent('showLoading', { version });
  },

  hideLoading() {
    return postRobot.sendToParent('hideLoading', { version });
  },

  showAlertDialog(message, btnOk) {
    return new Promise((resolve, reject) => {
      postRobot
        .sendToParent('showAlertDialog', { version, message, btnOk })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },

  showConfirmDialog(message, btnOkStr, btnKOStr) {
    return new Promise((resolve, reject) => {
      postRobot
        .sendToParent('showConfirmDialog', { version, message, btnOkStr, btnKOStr })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },
};

export default client;
