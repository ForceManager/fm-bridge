import utils from './utils';
import CONSTANTS from './constants/android.js';

let valuelist = [];
let users = [];

function call(id, params) {
  return new Promise((resolve, reject) => {
    try {
      const table = JSON.parse(window.AndroidForms.getTableName('tblEstadosForms'));

      resolve(utils.formatFormStates(table));
    } catch (err) {
      reject(err);
    }
  });
}

function syncResponseCall(id, params, format) {
  return new Promise((resolve, reject) => {
    try {
      const res = JSON.parse(window.AndroidForms[id](...params));

      resolve(format ? format(res) : res);
    } catch (err) {
      reject(err);
    }
  });
}

function responseCall(id, params, timeout) {
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
  getFormInitData: ({ ...params }) =>
    syncResponseCall('getFormInitData', { ...params }, utils.formatFormInitData),

  getFormStates(data) {
    return new Promise((resolve, reject) => {
      try {
        const table = JSON.parse(window.AndroidForms.getTableName('tblEstadosForms'));

        resolve(utils.formatFormStates(table));
      } catch (err) {
        reject(err);
      }
    });
  },

  getValueList(data) {
    return new Promise((resolve, reject) => {
      if (valuelist[data.tableName]) {
        resolve(valuelist[data.tableName]);
      } else {
        try {
          const table = JSON.parse(window.AndroidForms.getTableName(data.tableName));

          valuelist[data.tableName] = utils.formatValueList(table);
          resolve(valuelist[data.tableName]);
        } catch (err) {
          reject(err);
        }
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

      const eventName = `getEntity-${CONSTANTS.entity[data.getEntity]}-${CONSTANTS.entityId[
        data.fromEntity
      ] || CONSTANTS.entity[data.getEntity]}-${data.id}`;
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
        CONSTANTS.entityId[data.fromEntity] || CONSTANTS.entity[data.getEntity],
        data.id,
        CONSTANTS.entity[data.getEntity],
      );
    });
  },

  getFormType(data) {
    return new Promise((resolve, reject) => {
      const res = window.AndroidForms.getFilteredForms('', data.idTipoForm);

      try {
        resolve(utils.formatFormType(JSON.parse(res)));
      } catch (err) {
        reject(err);
      }
    });
  },

  finishActivity(data) {
    return Promise.resolve(window.AndroidForms.finishActivity());
  },

  setTitle(data) {
    return Promise.resolve(window.AndroidForms.setTitle(data.title));
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
        window.removeEventListener('saveDataOK', saveDataOK);
        window.removeEventListener('saveDataKO', saveDataKO);
        clearTimeout(timeout);
        resolve();
      };
      saveDataKO = (event) => {
        window.removeEventListener('saveDataOK', saveDataOK);
        window.removeEventListener('saveDataKO', saveDataKO);
        clearTimeout(timeout);
        reject();
      };
      window.addEventListener('saveDataOK', saveDataOK);
      window.addEventListener('saveDataKO', saveDataKO);
      timeout = setTimeout(timeoutFunc, 3000);
      data.formData = {
        ...data.formData,
        endState: 1,
      };
      window.AndroidForms.saveData(JSON.stringify(data.formData));
    });
  },

  openDatePicker(data) {
    return this.genericResponseCall('openDialogPicker', [
      'openDatePicker',
      data.date,
      data.dateMax || '',
      data.dateMin || '',
    ]);
  },

  openSignatureView(data) {
    return new Promise((resolve, reject) => {
      this.genericResponseCall('openSignatureView', ['openSignatureView', 'white'])
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  },

  showCameraImages(data) {
    return Promise.resolve(window.AndroidForms.showCameraImages());
  },

  hideCameraImages(data) {
    return Promise.resolve(window.AndroidForms.hideCameraImages());
  },

  expandImagesView(data) {
    return Promise.resolve(window.AndroidForms.expandImagesView());
  },

  collapseImagesView(data) {
    return Promise.resolve(window.AndroidForms.collapseImagesView());
  },

  showLoading(data) {
    return Promise.resolve(window.AndroidForms.showLoading());
  },

  hideLoading(data) {
    return Promise.resolve(window.AndroidForms.hideLoading());
  },

  showAlertDialog(data) {
    return new Promise((resolve, reject) => {
      this.androidGenericResponseCall('showConfirmDialog', [
        'showAlertDialogResponse',
        data.message,
        data.btnOk,
      ])
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  },

  showConfirmDialog(data) {
    return new Promise((resolve, reject) => {
      this.androidGenericResponseCall('showConfirmDialog', [
        'showConfirmDialogResponse',
        data.message,
        data.btnOkStr,
        data.btnKOStr,
      ])
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  },
};

export default AndroidBackend;
