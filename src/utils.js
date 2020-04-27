export function getPlatform() {
  const userAgent = navigator.userAgent || navigator.vendor;

  let platform;

  if (/android/i.test(userAgent)) {
    platform = 'android';
  } else if (
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream
  ) {
    platform = 'ios';
  } else {
    platform = 'web';
  }
  return platform;
}

export function getDateNow() {
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return dd + '/' + mm + '/' + yyyy;
}

export function formatFormType(data) {
  try {
    const result = JSON.parse(data);
    const response = {};

    if (result.length > 0) {
      response.id = result[0].id;
      response.description = result[0].description;
    }
    return response;
  } catch (error) {
    this.error(error);
    return null;
  }
}

// formatUsuarios(data) {
//   try {
//     const result = JSON.parse(data.replace(/(\r\n|\n|\r)/gm, ''));
//     const response = [];

//     result.forEach((element) => {
//       response.push({
//         id: element.id,
//         extId: element.extId,
//         nombreCompleto: element.strNombre.trim() + ' ' + element.strApellidos.trim(),
//       });
//     });
//     return response;
//   } catch (error) {
//     this.error(error);
//     return null;
//   }
// },

export function formatFormStates(data) {
  return data.values.map((el) => {
    return {
      id: el.id,
      name: el.label,
      setStateOnPage: parseInt(el.extraFields.z_setstateonpage, 10),
      endState: +el.endState,
    };
  });
}

export function formatValueList(data) {
  return data.values.map((el) => {
    return {
      ...el,
      value: el.id,
      checked: false,
      ...el.extraFields,
    };
  });
}

export function parseFeild(field) {
  if (!field) return null;
  if (typeof field !== 'string') return field;
  try {
    return JSON.parse(field);
  } catch (error) {
    console.warn(error);
    return null;
  }
}

export function formatFormInitData(data) {
  const fullObject = data.entityForm ? parseFeild(data.entityForm.fullObject) : {};
  // const extraFieldsArr = this.parseFeild(data.entityFormExtraFields);
  // const extraFields = extraFieldsArr
  //   ? extraFieldsArr.reduce(function(acc, cur, i) {
  //       acc[cur.fieldId] = cur;
  //       return acc;
  //     }, {})
  //   : {};

  return {
    account: data.company,
    user: data.user,
    isReadonly: data.isReadonly,
    mode: data.mode,
    form: {
      dateCreated: data.fcreado,
      dateDeleted: null,
      dateUpdated: data.fmodificado,
      deleted: data.isDeleted,
      deviceGuid: null,
      entityId: data.entityId,
      entityType: data.entityTypeFrom,
      id: data.id,
      idFormType: data.idFormType || data.idPreSelectedFormType,
      idState: data.idState,
      ...fullObject,
      salesRepIdCreated: data.entityForm ? data.entityForm.responsableId : null,
      salesRepIdDeleted: null,
      salesRepIdUpdated: null,
      images: data.imagesList,
      // ...extraFields,
    },
    platform: getPlatform(),
  };
}
