import postRobot from 'post-robot';

const packageJson = require('../package.json');
const veresion = packageJson.version.substring(0, packageJson.version.indexOf('.'));
const guid = window.name;

const client = {
  getEntityId() {
    return postRobot.sendToParent('getEntityId', { veresion });
  },

  getToken() {
    return postRobot.sendToParent('getToken', { veresion, guid });
  },

  getNewToken() {
    return postRobot.sendToParent('getNewToken', { veresion, guid });
  },

  getLiteral(literal) {
    if (!literal) return Promise.reject('No literal');
    return postRobot.sendToParent('getLiteral', { veresion, literal });
  },

  getCultureLang() {
    return postRobot.sendToParent('getCultureLang', { veresion });
  },

  getUserLocale() {
    return postRobot.sendToParent('getUserLocale', { veresion });
  },

  getUserId() {
    return postRobot.sendToParent('getUserId', { veresion });
  },

  getFilteredUsers() {
    return postRobot.sendToParent('getFilteredUsers', { veresion });
  },

  getPermissions() {
    return postRobot.sendToParent('getPermissions', { veresion });
  },

  setDrilldown(key, value) {
    if (!key || !value) return Promise.reject('No key or value');
    return postRobot.sendToParent('setDrilldown', { veresion, key, value });
  },

  getFilteredPeriodString(period) {
    if (period !== undefined) {
      return {
        startDate: period.dateStart.getTime(),
        endDate: period.dateEnd.getTime(),
      };
    }
    return postRobot.sendToParent('getFilteredPeriodString', { veresion });
  },

  // ##### FORM FUNCTIONS ##### //

  getFormInitData() {
    console.log('fm-bridge getFormInitData');
    return postRobot
      .sendToParent('getFormInitData', { veresion, guid })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getValueList(tableName) {
    return postRobot
      .sendToParent('getValueList', { veresion, tableName })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getUsuarios() {
    return this.getRelatedEntitiesById(1, -1, 2); // TEMP SPT REVISAR
  },

  getRelatedEntitiesById(idEntityIn, id, idEntityOut) {
    return postRobot
      .sendToParent('getUsuarios', { veresion, idEntityIn, id, idEntityOut })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  getFormType(idTipoForm) {
    return postRobot
      .sendToParent('getFormType', { veresion, idTipoForm })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  collapseImagesView() {
    return postRobot
      .sendToParent('collapseImagesView', { veresion })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  expandImagesView() {
    return postRobot
      .sendToParent('expandImagesView', { veresion })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  finishActivity() {
    return postRobot
      .sendToParent('finishActivity', { veresion })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  setTitle(title) {
    return postRobot
      .sendToParent('setTitle', { veresion, title })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  saveData(json) {
    return postRobot
      .sendToParent('saveData', { veresion, json })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  openDialogPicker(eventName, date, dateMax = '', dateMin = '') {
    return postRobot
      .sendToParent('openDialogPicker', { veresion, eventName, date, dateMax, dateMin })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  openSignatureView(id, background = 'white') {
    return postRobot
      .sendToParent('openSignatureView', { veresion, id, background })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  showCameraImages() {
    return postRobot
      .sendToParent('showCameraImages', { veresion })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  hideCameraImages() {
    return postRobot
      .sendToParent('hideCameraImages', { veresion })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  showLoading() {
    return postRobot
      .sendToParent('showLoading', { veresion })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  hideLoading() {
    return postRobot
      .sendToParent('hideLoading', { veresion })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  showAlertDialog(id, message, btnOk) {
    return postRobot
      .sendToParent('showAlertDialog', { veresion, id, message, btnOk })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },

  showConfirmDialog(id, message, btnOkStr, btnKOStr) {
    return postRobot
      .sendToParent('showConfirmDialog', { veresion, id, message, btnOkStr, btnKOStr })
      .then((res) => res.data)
      .catch((err) => Promise.reject(err));
  },
};

export default client;
