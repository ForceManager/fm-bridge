import postRobot from 'post-robot';

const packageJson = require('../package.json');
const version = packageJson.version.substring(0, packageJson.version.indexOf('.'));
const guid = window.name;

const client = {
  getEntityId() {
    return postRobot.sendToParent('getEntityId', { version });
  },

  getToken() {
    return postRobot.sendToParent('getToken', { version, guid });
  },

  getNewToken() {
    return postRobot.sendToParent('getNewToken', { version, guid });
  },

  getLiteral(literal) {
    if (!literal) return Promise.reject({ msg: 'No literal' });
    return postRobot.sendToParent('getLiteral', { version, literal });
  },

  getCultureLang() {
    return postRobot.sendToParent('getCultureLang', { version });
  },

  getUserLocale() {
    return postRobot.sendToParent('getUserLocale', { version });
  },

  getUserId() {
    return postRobot.sendToParent('getUserId', { version });
  },

  getFilteredUsers() {
    return postRobot.sendToParent('getFilteredUsers', { version });
  },

  getPermissions() {
    return postRobot.sendToParent('getPermissions', { version });
  },

  setDrilldown(key, value) {
    if (!key || !value) return Promise.reject({ msg: 'No key or value' });
    return postRobot.sendToParent('setDrilldown', { version, key, value });
  },

  getFilteredPeriodString(period) {
    if (period !== undefined) {
      return {
        startDate: period.dateStart.getTime(),
        endDate: period.dateEnd.getTime(),
      };
    }
    return postRobot.sendToParent('getFilteredPeriodString', { version });
  },

  // ##### FORM FUNCTIONS ##### //

  getFormInitData() {
    console.log('fm-bridge getFormInitData');
    return postRobot
      .sendToParent('getFormInitData', { version, guid })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getValueList(tableName) {
    return postRobot
      .sendToParent('getValueList', { version, tableName })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getUsuarios() {
    return this.getRelatedEntitiesById(1, -1, 2); // TEMP SPT REVISAR
  },

  getRelatedEntitiesById(idEntityIn, id, idEntityOut) {
    return postRobot
      .sendToParent('getUsuarios', { version, idEntityIn, id, idEntityOut })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getFormType(idTipoForm) {
    return postRobot
      .sendToParent('getFormType', { version, idTipoForm })
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

  saveData(json) {
    return postRobot
      .sendToParent('saveData', { version, json })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  openDialogPicker(eventName, date, dateMax = '', dateMin = '') {
    return postRobot
      .sendToParent('openDialogPicker', { version, eventName, date, dateMax, dateMin })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  openSignatureView(id, background = 'white') {
    return postRobot
      .sendToParent('openSignatureView', { version, id, background })
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

  showAlertDialog(id, message, btnOk) {
    return postRobot
      .sendToParent('showAlertDialog', { version, id, message, btnOk })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  showConfirmDialog(id, message, btnOkStr, btnKOStr) {
    return postRobot
      .sendToParent('showConfirmDialog', { version, id, message, btnOkStr, btnKOStr })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },
};

export default client;
