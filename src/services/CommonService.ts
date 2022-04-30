import * as _ from "lodash"

class CommonService {

    errorHandler(errObj, schema = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let errorMessage = "";
                if (errObj && errObj.code) {
                    switch (errObj.code) {
                        case 11000:
                            errorMessage = "Duplicate key error";
                            if (schema) {
                                const indexes = [[{ _id: 1 }, { unique: true }]].concat(schema.indexes());
                                await indexes.forEach(async (index) => {
                                    const paths = Object.keys(index[0]);
                                    if ((errObj.message).includes(paths[0])) {
                                        errorMessage = ` ${paths[0]} expects to be unique. `;
                                    }
                                });
                            }
                            break;
                        case 0:
                            errorMessage = "";
                            break;
                        case 1:
                            errorMessage = "";
                            break;
                        default:
                            break;
                    }
                } else if (errObj && errObj.message && errObj.message.errmsg) {
                    errorMessage = errObj.message.errmsg;
                } else if (errObj && errObj.errors) {
                    if (schema) {
                        schema.eachPath(function (schemapath) {
                            if (_.has(errObj.errors, schemapath) && errObj.errors[schemapath].message) {
                                errorMessage = errObj.errors[schemapath].message;
                            }
                        });

                    }
                } else if (errObj && errObj.message && errObj.message.errors) {
                    if (schema) {
                        schema.eachPath(function (schemapath) {
                            // console.log('schemapath', schemapath);
                            if (_.has(errObj.message.errors, schemapath) && errObj.message.errors[schemapath].message) {
                                errorMessage = errObj.message.errors[schemapath].message;
                                // console.log('errorMessage', errorMessage);
                            }
                        });

                    }
                }
                return resolve(errorMessage);
            } catch (error) {
                return reject({ status: 0, message: error });
            }
        });
    }


}
export default new CommonService();

