import { formatFormInitData, formatFormStates, formatValueList, formatFormType } from './utils';
import CONSTANTS from './constants/android.js';

let valuelist = [];

function syncCall(id, params, format) {
  return new Promise((resolve, reject) => {
    try {
      const res = JSON.parse(window.AndroidForms[id](...params));

      resolve(res && format ? format(res) : res);
    } catch (err) {
      reject(err);
    }
  });
}

function asyncCall(id, params, timeout) {
  return new Promise((resolve, reject) => {
    const eventFunc = (event) => {
      window.removeEventListener(id, eventFunc);
      resolve(event.detail.response);
    };
    const timeoutFunc = () => {
      window.removeEventListener(id, eventFunc);
      reject({ error: `${id} timeout` });
    };

    window.addEventListener(id, eventFunc);
    timeout = timeout && setTimeout(timeoutFunc, 3000);
    window.AndroidForms[id](...params);
  });
}

const AndroidBackend = {
  getFormInitData: () => syncCall('getInitData', [], formatFormInitData),

  getFormStates: () => syncCall('getTableName', ['tblEstadosForms'], formatFormStates),

  getValueList: ({ tableName }) => {
    return new Promise((resolve, reject) => {
      if (valuelist[tableName]) {
        resolve(valuelist[tableName]);
      } else {
        try {
          const table = JSON.parse(window.AndroidForms.getTableName(tableName));

          valuelist[tableName] = formatValueList(table);
          resolve(valuelist[tableName]);
        } catch (err) {
          reject(err);
        }
      }
    });
  },

  getUsers: () => this.getRelatedEntity({ fromEntity: 'users', id: -1, getEntity: 'users' }),

  getRelatedEntity: ({ id, fromEntity, getEntity }) =>
    new Promise((resolve, reject) => {
      let timeout;

      if (!fromEntity) {
        fromEntity = getEntity;
      }

      const eventName = `getEntity-${CONSTANTS.entity[getEntity]}-${
        CONSTANTS.entityId[fromEntity] || CONSTANTS.entity[getEntity]
      }-${id}`;

      let getRelatedEntitiesByIdEvent = (event) => {
        removeEventListener(eventName, getRelatedEntitiesByIdEvent);
        clearTimeout(timeout);
        try {
          resolve(JSON.parse(event.detail.response));
        } catch (err) {
          reject(err);
        }
      };

      let timeoutFunc = () => {
        window.removeEventListener(eventName, getRelatedEntitiesByIdEvent);
        reject('eventName timeout');
      };

      window.addEventListener(eventName, getRelatedEntitiesByIdEvent);
      timeout = setTimeout(timeoutFunc, 5000);
      window.AndroidForms.getRelatedEntitiesById(
        eventName,
        CONSTANTS.entityId[fromEntity] || CONSTANTS.entity[getEntity],
        id,
        CONSTANTS.entity[getEntity],
      );
    }),

  getFormType: ({ idTipoForm }) =>
    new Promise((resolve, reject) => {
      const res = window.AndroidForms.getFilteredForms('', idTipoForm);

      try {
        resolve(formatFormType(JSON.parse(res)));
      } catch (err) {
        reject(err);
      }
    }),

  finishActivity: () => Promise.resolve(window.AndroidForms.finishActivity()),

  setTitle: ({ title }) => Promise.resolve(window.AndroidForms.setTitle(title)),

  saveData: ({ formData }) =>
    new Promise((resolve, reject) => {
      let timeout, saveDataOK, saveDataKO;

      let timeoutFunc = () => {
        window.removeEventListener('saveDataOK', saveDataOK);
        window.removeEventListener('saveDataKO', saveDataKO);
        reject('saveData timeout');
      };

      saveDataOK = () => {
        window.removeEventListener('saveDataOK', saveDataOK);
        window.removeEventListener('saveDataKO', saveDataKO);
        clearTimeout(timeout);
        resolve();
      };
      saveDataKO = () => {
        window.removeEventListener('saveDataOK', saveDataOK);
        window.removeEventListener('saveDataKO', saveDataKO);
        clearTimeout(timeout);
        reject();
      };
      window.addEventListener('saveDataOK', saveDataOK);
      window.addEventListener('saveDataKO', saveDataKO);
      timeout = setTimeout(timeoutFunc, 3000);
      window.AndroidForms.saveData(JSON.stringify(formData));
    }),

  openDatePicker: ({ date, dateMax, dateMin }) =>
    asyncCall('openDialogPicker', ['openDatePicker', date, dateMax || '', dateMin || '']),

  openSignatureView: ({ background }) =>
    asyncCall('openSignatureView', ['openSignatureView', background || 'white']),

  showCameraImages: () => Promise.resolve(window.AndroidForms.showCameraImages()),

  hideCameraImages: () => Promise.resolve(window.AndroidForms.hideCameraImages()),

  expandImagesView: () => Promise.resolve(window.AndroidForms.expandImagesView()),

  collapseImagesView: () => Promise.resolve(window.AndroidForms.collapseImagesView()),

  showLoading: () => Promise.resolve(window.AndroidForms.showLoading()),

  hideLoading: () => Promise.resolve(window.AndroidForms.hideLoading()),

  showAlertDialog: ({ message, btnOk }) =>
    asyncCall('showConfirmDialog', ['showAlertDialogResponse', message, btnOk]),

  showConfirmDialog: ({ message, btnOkStr, btnKOStr }) =>
    asyncCall('showConfirmDialog', ['showConfirmDialogResponse', message, btnOkStr, btnKOStr]),
};

export default AndroidBackend;
