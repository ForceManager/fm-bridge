import { formatFormInitData, formatFormStates, formatValueList } from './utils';
import CONSTANTS from './constants/ios.js';

let valuelist = [];

export const IosBackend = {
  // FORMS

  getFormInitData(data) {
    return new Promise((resolve, reject) => {
      this.genericResponseCall('getInitData', null)
        .then((res) => resolve(formatFormInitData(res)))
        .catch((err) => reject(err));
    });
  },

  getFormStates(data) {
    return new Promise((resolve, reject) => {
      this.genericResponseCall('getTableName', { tableName: 'tblEstadosForms' })
        .then((res) => {
          resolve(formatFormStates(res));
        })
        .catch((err) => reject(err));
    });
  },

  getValueList(data) {
    return new Promise((resolve, reject) => {
      const tableName = data.tableName;

      if (!tableName) {
        reject({ error: 'No table name' });
      } else if (valuelist[tableName]) {
        resolve(valuelist[tableName]);
      } else {
        this.genericResponseCall('getTableName', { tableName })
          .then((res) => {
            valuelist[tableName] = formatValueList(res);
            resolve(valuelist[tableName]);
          })
          .catch((err) => reject(err));
      }
    });
  },

  getUsers(data) {
    return this.getRelatedEntity({ fromEntity: 'users', id: -1, getEntity: 'users' });
  },

  getRelatedEntity(data) {
    return new Promise((resolve, reject) => {
      let timeout;

      if (!data.fromEntity) {
        data.fromEntity = data.getEntity;
      }

      let eventName = `getEntity-${CONSTANTS.entity[data.getEntity]}-${
        CONSTANTS.entityId[data.fromEntity] || CONSTANTS.entity[data.getEntity]
      }-${data.id}`;

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
      window.webkit.messageHandlers.getRelatedEntitiesById.postMessage({
        idEntityItem: eventName,
        idEntityIn: CONSTANTS.entityId[data.fromEntity] || CONSTANTS.entity[data.getEntity],
        idEntityRecupear: +data.id,
        idEntityOut: CONSTANTS.entity[data.getEntity],
      });
    });
  },

  getFormType(data) {
    return new Promise((resolve, reject) => {
      this.genericResponseCall('getFilteredForms', {
        fieldName: '',
        formValue: data.idTipoForm,
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  },

  finishActivity(data) {
    return this.genericCall('finishActivity', null);
  },

  setTitle(data) {
    return this.genericCall('setTitle', { title: data.title });
  },

  saveData(data) {
    return new Promise((resolve, reject) => {
      let timeout, saveDataOK, saveDataKO;

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
        objectToSave: JSON.stringify(data.formData),
      });
    });
  },

  openDatePicker(data) {
    return this.genericResponseCall(
      'openDialogPicker',
      {
        idDialogPicker: 'openDatePicker',
        millisActual: data.date,
        millisMaxDate: data.dateMax || '',
        millisMinDate: data.dateMin || '',
      },
      false,
    );
  },

  openSignatureView(data) {
    return this.genericResponseCall(
      'openSignatureView',
      {
        idSignature: 'openSignatureView',
        background: data.background || 'white',
      },
      false,
    );
  },

  showCameraImages(data) {
    return this.genericCall('showCameraImages', null);
  },

  hideCameraImages(data) {
    return this.genericCall('hideCameraImages', null);
  },

  expandImagesView(data) {
    return this.genericCall('expandImagesView', null);
  },

  collapseImagesView(data) {
    return this.genericCall('collapseImagesView', null);
  },

  showLoading(data) {
    return this.genericCall('showLoading', null);
  },

  hideLoading(data) {
    return this.genericCall('hideLoading', null);
  },

  showAlertDialog(data) {
    return this.genericResponseCall(
      'showAlertDialog',
      {
        idAlertDialog: data.id,
        messageAlert: data.message,
        buttonAcceptTextAlert: data.btnOk,
      },
      false,
    );
  },

  showConfirmDialog(data) {
    return this.genericResponseCall(
      'showConfirmDialog',
      {
        idConfirmDialog: data.id,
        messageConfirm: data.message,
        buttonAcceptText: data.btnOkStr,
        buttonCancelText: data.btnKOStr,
      },
      false,
    );
  },

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
};

export default IosBackend;
