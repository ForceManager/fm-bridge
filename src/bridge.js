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
    return postRobot
      .sendToParent('getFormInitData', { version, guid })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getFormStates() {
    return postRobot
      .sendToParent('getFormStates', { version })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getValueList(tableName) {
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
    return postRobot
      .sendToParent('finishActivity', { version })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  setTitle(title) {
    return postRobot
      .sendToParent('setTitle', { version, title })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  saveData(formData) {
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
    return postRobot
      .sendToParent('showLoading', { version })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  hideLoading() {
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

export default client;
