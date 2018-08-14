import {ApiError} from '../common/api-error';


export class ControllerCallMethodBase {

  // post /call-method/:method
  callMethod(req, res, next) {
    const method = this[req.params.method];
    if (!method) {
      throw new ApiError(`No method found for ${req.params.method}`);
    }
    method.call(this, req, res, next);
  }

}
