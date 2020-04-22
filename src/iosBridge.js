import utils from './utils';
import CONSTANTS from './constants/ios.js';

let valuelist = [];
let users = [];

function call(id, params) {
  return new Promise((resolve) => {
    resolve();
    window.webkit.messageHandlers[id].postMessage(params || id);
  });
}

function responseCall(id, params, timeout) {
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
}

const IosBackend = {
  getFormInitData(data) {
    return new Promise((resolve, reject) => {
      responseCall('getInitData', null)
        .then((res) => resolve(utils.formatFormInitData(res)))
        .catch((err) => reject(err));
    });
  },

  getFormStates(data) {
    return new Promise((resolve, reject) => {
      responseCall('getTableName', { tableName: 'tblEstadosForms' })
        .then((res) => {
          resolve(utils.formatFormStates(res));
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
        responseCall('getTableName', { tableName })
          .then((res) => {
            valuelist[tableName] = utils.formatValueList(res);
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

      let eventName = `getEntity-${CONSTANTS.entity[data.getEntity]}-${CONSTANTS.entityId[
        data.fromEntity
      ] || CONSTANTS.entity[data.getEntity]}-${data.id}`;
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
        idEntityIn: CONSTANTS.entityId[data.fromEntity] || CONSTANTS.entity[data.getEntity],
        idEntityRecupear: +data.id,
        idEntityOut: CONSTANTS.entity[data.getEntity],
      });
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
      responseCall('getFilteredForms', {
        fieldName: '',
        formValue: idTipoForm,
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
        objectToSave: JSON.stringify(data.formData),
      });
    });
  },

  openDatePicker(data) {
    return responseCall(
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
    return responseCall(
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
    return responseCall(
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
    return responseCall(
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
};

export default IosBackend;
