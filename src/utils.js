const utils = {
  getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      return 'Android';
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'iOS';
    }
    return 'web';
  },

  formatFormType(data) {
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
  },

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

  formatFormStates(data) {
    console.log('formatFormStates', data);
    // TODO no va en Android
    return data.values.map((el) => {
      console.log('endState', el.endState, +el.endState, parseInt(el.endState, 2));
      return {
        id: el.id,
        name: el.label,
        setStateOnPage: parseInt(el.extraFields.z_setstateonpage, 10),
        endState: +el.endState,
      };
    });
  },

  formatApiFormStates(data) {
    return data.map((el) => {
      return {
        id: el.id,
        name: el.Descripcion,
        setStateOnPage: parseInt(el.Z_SetStateOnPage, 10),
        endState: el.blnEndState,
      };
    });
  },

  formatBeDevicesFormStates(data) {
    return data.statesConfig.map((el) => {
      const state = data.states.find((state) => (state.id = el.idFormState));

      return {
        id: el.id,
        name: state ? state.Descripcion : '',
        setStateOnPage: parseInt(el.setOnPage, 10),
        endState: el.endState,
      };
    });
  },

  formatValueList(data) {
    return data.values.map((el) => {
      return {
        value: el.id,
        label: el.label,
        idParent: el.idParent,
        extraFields: el.extraFields,
        checked: false,
      };
    });
  },

  formatApiValueList(data) {
    return data.map((el) => {
      return {
        value: el.id,
        label: el.descripcion || el.Descripcion,
        checked: false,
      };
    });
  },

  parseFeild(field) {
    if (!field) return null;
    if (typeof field !== 'string') return field;
    try {
      return JSON.parse(field);
    } catch (error) {
      console.warn(error);
      return null;
    }
  },

  formatFormInitData(data) {
    const fullObject = data.entityForm ? this.parseFeild(data.entityForm.fullObject) : {};
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
      platform: this.getMobileOperatingSystem(),
    };
  },
};

export default utils;
