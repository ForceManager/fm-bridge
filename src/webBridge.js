import postRobot from 'post-robot';

function buildFunction(name) {
  return {
    [name]: (data) => postRobot.sendToParent(name, { ...data }).then((res) => res.data),
  };
}

const WebBbridge = {
  ...buildFunction('getFormInitData'),
  ...buildFunction('getFormStates'),
  ...buildFunction('getValueList'),
  ...buildFunction('getRelatedEntity'),
  ...buildFunction('getFormType'),
  ...buildFunction('finishActivity'),
  ...buildFunction('setTitle'),
  ...buildFunction('saveData'),
  ...buildFunction('openDatePicker'),
  ...buildFunction('openSignatureView'),
  ...buildFunction('showCameraImages'),
  ...buildFunction('hideCameraImages'),
  ...buildFunction('expandImagesView'),
  ...buildFunction('collapseImagesView'),
  ...buildFunction('showLoading'),
  ...buildFunction('hideLoading'),
  ...buildFunction('showAlertDialog'),
  ...buildFunction('showConfirmDialog'),
  getUsers: (data) =>
    postRobot.sendToParent('getRelatedEntity', {
      fromEntity: 'users',
      id: -1,
      getEntity: 'users',
      ...data,
    }),
};

export default WebBbridge;
