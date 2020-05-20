import { formatFormInitData, formatFormStates, formatValueList } from './utils';
import CONSTANTS from './constants/ios.js';

let valuelist = [];

function genericCall(id, params) {
  return new Promise((resolve) => {
    resolve();
    window.webkit.messageHandlers[id].postMessage(params || id);
  });
}

function genericResponseCall(id, params, timeout) {
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

export const IosBackend = {
  getFormInitData: () => genericResponseCall('getInitData', null).then(formatFormInitData),

  getFormStates: () =>
    genericResponseCall('getTableName', { tableName: 'tblEstadosForms' }).then(formatFormStates),

  getValueList: ({ tableName }) =>
    new Promise((resolve, reject) => {
      if (!tableName) {
        reject({ error: 'No table name' });
      } else if (valuelist[tableName]) {
        resolve(valuelist[tableName]);
      } else {
        // genericResponseCall('getTableName', { tableName })
        //   .then((res) => {
        //     valuelist[tableName] = formatValueList(res);
        //     resolve(valuelist[tableName]);
        //   })
        //   .catch((err) => reject(err));
        // TODO eliminar ñapa de abajo y volver al código de arriba
        // cuando iOS haga el fix para devolver listas con eventos con distinto nombre.
        const eventFunc = (event) => {
          valuelist[event.detail.response.table] = formatValueList(event.detail.response);
          if (tableName === event.detail.response.table) {
            resolve(valuelist[tableName]);
          } else {
            let interval = setInterval(() => {
              if (valuelist[tableName]) {
                clearInterval(interval);
                resolve(valuelist[tableName]);
              }
            }, 500);
          }
        };

        window.addEventListener('getTableName', eventFunc);
        window.webkit.messageHandlers.getTableName.postMessage({ tableName });
      }
    }),

  getUsers: () => this.getRelatedEntity({ fromEntity: 'users', id: -1, getEntity: 'users' }),

  getRelatedEntity: ({ id, fromEntity, getEntity }) =>
    new Promise((resolve, reject) => {
      let timeout;

      if (!fromEntity) {
        fromEntity = getEntity;
      }

      let eventName = `getEntity-${CONSTANTS.entity[getEntity]}-${
        CONSTANTS.entityId[fromEntity] || CONSTANTS.entity[getEntity]
      }-${id}`;

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
        idEntityIn: CONSTANTS.entityId[fromEntity] || CONSTANTS.entity[getEntity],
        idEntityRecupear: parseInt(id, 10),
        idEntityOut: CONSTANTS.entity[getEntity],
      });
    }),

  getFormType: ({ idTipoForm }) => {
    return new Promise((resolve, reject) => {
      genericResponseCall('getFilteredForms', {
        fieldName: '',
        formValue: idTipoForm,
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  },

  finishActivity() {
    return genericCall('finishActivity', null);
  },

  setTitle: ({ title }) => {
    return genericCall('setTitle', title);
  },

  saveData: ({ formData }) =>
    new Promise((resolve, reject) => {
      let timeout, saveDataOK, saveDataKO;

      let timeoutFunc = () => {
        window.removeEventListener('saveDataOK', saveDataOK);
        window.removeEventListener('saveDataKO', saveDataKO);
        reject('saveData timeout');
      };

      saveDataOK = () => {
        clearTimeout(timeout);
        window.removeEventListener('saveDataOK', saveDataOK);
        window.removeEventListener('saveDataKO', saveDataKO);
        resolve();
      };
      saveDataKO = () => {
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
    }),

  openDatePicker: ({ date, dateMax, dateMin }) =>
    genericResponseCall(
      'openDialogPicker',
      {
        idDialogPicker: 'openDatePicker',
        millisActual: date,
        millisMaxDate: dateMax || '',
        millisMinDate: dateMin || '',
      },
      false,
    ),

  openSignatureView: ({ background }) =>
    genericResponseCall(
      'openSignatureView',
      {
        idSignature: 'openSignatureView',
        background: background || 'white',
      },
      false,
    ),

  showCameraImages: () => genericCall('showCameraImages', null),

  hideCameraImages: () => genericCall('hideCameraImages', null),

  expandImagesView: () => genericCall('expandImagesView', null),

  collapseImagesView: () => genericCall('collapseImagesView', null),

  showLoading: () => genericCall('showLoading', null),

  hideLoading: () => genericCall('hideLoading', null),

  showAlertDialog: ({ id, message, btnOk }) =>
    genericResponseCall(
      'showAlertDialog',
      {
        idAlertDialog: id,
        messageAlert: message,
        buttonAcceptTextAlert: btnOk,
      },
      false,
    ),

  showConfirmDialog: ({ id, message, btnOkStr, btnKOStr }) =>
    genericResponseCall(
      'showConfirmDialog',
      {
        idConfirmDialog: id,
        messageConfirm: message,
        buttonAcceptText: btnOkStr,
        buttonCancelText: btnKOStr,
      },
      false,
    ),
};

export default IosBackend;
