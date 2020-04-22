import postRobot from 'post-robot';
import utils from './utils';

let valuelist = [];

function call(name, { ...params }) {
  return postRobot.sendToParent(name, { ...params });
}

function responseCall(name, { ...params }) {
  return new Promise((resolve, reject) => {
    postRobot
      .sendToParent(name, { ...params })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
}

const WebBackend = {
  getFormInitData: ({ ...params }) => call('getInitData', { ...params }),

  getFormStates: ({ ...params }) => {
    return new Promise((resolve, reject) => {
      this.sendToParent('getTableName', { tableName: 'tblEstadosForms', ...params })
        .then((res) => {
          resolve(utils.formatFormStates(res.data));
        })
        .catch((err) => reject(err));
    });
  },

  getValueList: ({ tableName, ...params }) => {
    return new Promise((resolve, reject) => {
      if (!tableName) {
        reject({ error: 'No table name' });
      } else if (valuelist[tableName]) {
        resolve(valuelist[tableName]);
      } else {
        this.sendToParent('getTableName', { ...params })
          .then((res) => {
            valuelist[tableName] = utils.formatValueList(res.data);
            resolve(valuelist[tableName]);
          })
          .catch((err) => reject(err));
      }
    });
  },

  getUsers: ({ ...params }) =>
    this.getRelatedEntity({ fromEntity: 'users', id: -1, getEntity: 'users', ...params }),

  getRelatedEntity: ({ ...params }) => call('getInitData', { ...params }),

  getFormType: ({ ...params }) => responseCall('getFormType', { ...params }),

  finishActivity: ({ ...params }) => call('finishActivity', { ...params }),

  setTitle: (title) => call('setTitle', { title }),

  saveData: ({ ...params }) => responseCall('saveData', { ...params }),

  openDatePicker: ({ ...params }) => responseCall('openDatePicker', { ...params }),

  openSignatureView: ({ ...params }) => responseCall('openSignatureView', { ...params }),

  showCameraImages: ({ ...params }) => call('showCameraImages', { ...params }),

  hideCameraImages: ({ ...params }) => call('hideCameraImages', { ...params }),

  expandImagesView: ({ ...params }) => call('expandImagesView', { ...params }),

  collapseImagesView: ({ ...params }) => call('collapseImagesView', { ...params }),

  showLoading: ({ ...params }) => call('showLoading', { ...params }),

  hideLoading: ({ ...params }) => call('hideLoading', { ...params }),

  showAlertDialog: ({ ...params }) => call('showAlertDialog', { ...params }),

  showConfirmDialog: ({ ...params }) => call('showConfirmDialog', { ...params }),
};

export default WebBackend;
