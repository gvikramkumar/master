import tv4 from 'tv4';
import formats from 'tv4-formats';
import {NamedApiError} from './named-api-error';

const validator = tv4.freshApi();
validator.addFormat(formats);

validator.setErrorReporter(function (error, data, schema) {
// Last component of schemaPath, which *most* of the time is the keyword!
  var lsP = error.schemaPath.split('/').splice(-1)[0];
  // hack to get type to work, error.schemaPath is '' instead of '/type' for type for some reason
  if (!lsP && error.params && error.params.type) {
    lsP = 'type';
  }
  // console.log('>>>>>lsP', lsP);
  // console.log('>>>>>error', error);
  // console.log('>>>>>>>>>data', data);
  // console.log('>>>>>>>schema', schema);
  // console.log('>>>>>>>>>>>>>>>>>>', schema.messages, '>>>>>>', (schema.messages && schema.messages[lsP]));
  return schema.messages && schema.messages[lsP];
  // return (schema.messages && schema.messages[lsP]) || schema.messages;
});

/**
 * Validate
 * @desc - a validation class for all types of validation. Utilizes json schema tv4 validation
 */
class Validate {

  /**
   * validateObject
   * @desc - validates an object using given json schema. If valid, returns undefined. If invalid, returns an ExtendedError with
   * message: "Validation errors" and data an array of the tv4 validateMultiple() messages: {dataPath, message}
   * @param val - value you want to validate
   * @param schema - json schema to validate against
   * @returns {undefined | ExtendedError}
   */
  static validateObject(val, schema) {
    const results = validator.validateMultiple(val, schema);
    if (!results.valid) {
      const err = new NamedApiError('JsonSchemaValidationError', 'Validation errors', extractErrors(results.errors), 400);
      throw err;
    }
  }

  /**
   * validateGuid - validates a given guie
   * @param guid
   * @returns {*}
   */
  static validateGuid(guid) {
    // returns boolean, error will be in validator.error (not tv4.error)
    return validator.validate(guid, {type: 'string', format: 'guid'});
  }
}

module.exports = Validate;

function extractErrors(errors) {
  return errors.map(e => ({path: e.dataPath, message: e.message}));
}


