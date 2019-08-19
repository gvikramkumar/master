import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Measure} from '../models/measure';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';
import {UploadResults} from '../models/upload-results';
import {UiUtil} from '../../../core/services/ui-util';
import AnyObj from '../../../../../../shared/models/any-obj';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class BusinessUploadService {

  constructor(private httpClient: HttpClient, private store: AppStore, private uiUtil: UiUtil) {
  }

  // submeasureName is for submeasure mode
  uploadFile(fileInput, uploadType, submeasureName?) {
    if (!fileInput.files.length) {
      return;
    }
    const file = fileInput.files[0];
    fileInput.value = null;
    const formData: FormData = new FormData();
    formData.append('fileUploadField', file, file.name);
    const params: AnyObj = {
      showProgress: true,
      moduleId: this.store.module.moduleId
    }
    if (submeasureName) {
      params.submeasureName = submeasureName;
    }
    const options = {headers: {Accept: 'application/json'}, params};
    const url = `${apiUrl}/api/prof/upload/${uploadType}`;
    this.uiUtil.toastHide();
    return this.httpClient.post<{ status: string, numRows?: number }>(url, formData, options).toPromise()
      .then((result: UploadResults) => {
        let title;
        let message;
        if (result.status === 'success') {
          // title = `${result.uploadName} - success`; // for cui toasts
          title = 'Success';
          message = `${result.rowCount} rows have been processed.`;
          if (uploadType !== 'dollar-upload')
            message += ` Data will not be viewable in report until 15 minutes after close of upload window.`;
        } else if(result.status === 'successsync'){
          title = 'Success';
          message = `${result.rowCount} rows have been processed, however data will be available in reports once allocation run or data loads complete.`;
          if (uploadType !== 'dollar-upload')
            message += ` Data will not be viewable in report until 15 minutes after close of upload window.`;  
        }
        else if (result.status === 'failure') {
          // title = `${result.uploadName} - failure`;
          title = 'Failure';
          message = 'Errors have been emailed to your email account.';
        }
        this.uiUtil.toastPerm(message, title);
        return result;
      });
  }


}
