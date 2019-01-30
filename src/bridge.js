import postRobot from 'post-robot';

const packageJson = require('../package.json');
const veresion = packageJson.version.substring(0, packageJson.version.indexOf('.'));
const fragmentId = window.name;

const client = {

  getCompanyId() {
    return postRobot.sendToParent('getCompanyId', { veresion });
  },

  getToken() {
    return postRobot.sendToParent('getToken', { veresion, fragmentId });
  },

  getNewToken() { // TEMP
    return postRobot.sendToParent('getNewToken', { veresion, fragmentId });
  },

  getUrlBase() {
    return postRobot.sendToParent('getUrlBase', { veresion });
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
        'startDate': period.dateStart.getTime(),
        'endDate': period.dateEnd.getTime(),
      };
    }
    return postRobot.sendToParent('getFilteredPeriodString', { veresion });
  },

};

export default client;
