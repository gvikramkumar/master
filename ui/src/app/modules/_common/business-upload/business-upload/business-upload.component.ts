import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {ActivatedRoute} from '@angular/router';
import {AppStore} from '../../../../app/app-store';
import {FsFile} from '../../models/fsfile';
import {FsFileService} from '../../../../core/services/fsfile.service';
import * as _ from 'lodash';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BusinessUploadFileType, Directory} from '../../../../../../../shared/enums';
import {UiUtil} from '../../../../core/services/ui-util';
import {OpenPeriodService} from '../../services/open-period.service';
import {OpenPeriod} from '../../models/open-period';
import {shUtil} from '../../../../../../../shared/shared-util';

const apiUrl = environment.apiUrl;

interface UploadResults {
  status: string;
  uploadName?: string;
  rowCount?: number;
}

@Component({
  selector: 'fin-business-upload',
  templateUrl: './business-upload.component.html',
  styleUrls: ['./business-upload.component.scss']
})
export class BusinessUploadComponent extends RoutingComponentBase implements OnInit {
  files: FsFile[];
  selectedFileName = '';
  templates: FsFile[];
  openPeriod: OpenPeriod;
  uploadTypes = [
    {type: 'dollar-upload', text: 'Adjustments - Dollar Upload', disabled: false},
    {type: 'mapping-upload', text: 'Manual Mapping Split Percentage Upload', disabled: false},
    {type: 'dept-upload', text: 'Department / Excluded Account Upload', disabled: false},
    {type: 'sales-split-upload', text: 'Sales Level Split Percentage Upload', disabled: false},
    {type: 'product-class-upload', text: 'Product Classification (SW/HW Mix) Upload', disabled: false},
    {type: 'alternate-sl2-upload', text: 'Alternate SL2 Upload', disabled: false},
    {type: 'corp-adjustments-upload', text: 'Corp Adjustments Upload', disabled: false},
  ];
  uploadType = this.uploadTypes[0];

  constructor(
    private httpClient: HttpClient,
    public store: AppStore,
    private route: ActivatedRoute,
    private fsFileService: FsFileService,
    private uiUtil: UiUtil,
    private openPeriodService: OpenPeriodService) {
    super(store, route);
  }

  ngOnInit() {
    Promise.all([
      this.fsFileService.getInfoMany({
        directory: Directory.businessUpload,
        buFileType: BusinessUploadFileType.template,
        groupField: 'buUploadType'
      }).toPromise(),
      this.openPeriodService.getQueryOne({moduleId: this.store.module.moduleId}).toPromise()
    ])
      .then(results => {
        this.templates = results[0];
        this.openPeriod = shUtil.getFiscalMonthLongNameFromNumber(results[1].fiscalMonth);
      });
  }

  uploadFile(fileInput) {
    if (!fileInput.files.length) {
      return;
    }
    const file = fileInput.files[0];
    const formData: FormData = new FormData();
    formData.append('fileUploadField', file, file.name);
    formData.append('moduleId', this.store.module.moduleId.toString())
    const params = new HttpParams().set('showProgress', 'true')
    const options = {headers: {Accept: 'application/json'}, params};
    const url = `${apiUrl}/api/prof/upload/${this.uploadType.type}`;
    this.httpClient.post<{ status: string, numRows?: number }>(url, formData, options)
      .subscribe((result: UploadResults) => {
        fileInput.value = '';
        let title;
        let message;
        if (result.status === 'success') {
          // title = `${result.uploadName} - success`; // for cui toasts
          title = 'Success';
          message = `${result.rowCount} rows have been processed.`;
        } else if (result.status === 'failure') {
          // title = `${result.uploadName} - failure`;
          title = 'Failure';
          message = 'Errors have been emailed to your email account.';
        }
        this.uiUtil.toast(message, title);
      });
  }

  getDownloadUri() {
    if (!this.templates) {
      return;
    }
    const template = _.find(this.templates, item => _.get(item, 'metadata.buUploadType') === this.uploadType.type);
    return `${environment.apiUrl}/api/file/${template.id}`;
  }

  changeFile(fileInput) {
    this.selectedFileName = fileInput.files[0] && fileInput.files[0].name;
  }

  changeUploadType() {
    this.selectedFileName = '';
  }
}
