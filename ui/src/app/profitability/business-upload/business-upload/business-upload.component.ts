import {Component, OnInit} from '@angular/core';
import {RoutingComponentBase} from '../../../shared/routing-component-base';
import {ActivatedRoute} from '@angular/router';
import {Store} from '../../../store/store';
import {FsFile} from '../../../store/models/fsfile';
import {FsFileService} from '../../../core/services/fsfile.service';
import {BusinessUploadFileType, Directory} from '../../store/models/enums';
import * as _ from 'lodash';
import {environment} from '../../../../environments/environment';
import {ToastService} from '../../../core/services/toast.service';
import {UtilService} from '../../../core/services/util.service';
import {HttpClient} from '@angular/common/http';

const apiUrl = environment.apiUrl;

@Component({
  selector: 'fin-business-upload',
  templateUrl: './business-upload.component.html',
  styleUrls: ['./business-upload.component.scss']
})
export class BusinessUploadComponent extends RoutingComponentBase implements OnInit {
  files: FsFile[];
  templates: FsFile[];
  uploadTypes = [
    {type: 'dollar-upload', text: 'Adjustments - Dollar Upload', disabled: false},
    {type: 'mapping-upload', text: 'Manual Mapping Split Percentage Upload', disabled: false},
    {type: 'dept-upload', text: 'Department / Excluded Account Upload', disabled: false},
    {type: 'sales-split-upload', text: 'Sales Level Split Percentage Upload', disabled: false},
    {type: 'product-class-upload', text: 'Product Classification (SW/HW Mix) Upload', disabled: false}
  ];
  uploadType = this.uploadTypes[0];

  constructor(
    private httpClient: HttpClient,
    private util: UtilService,
    public store: Store,
    private route: ActivatedRoute,
    private fsFileService: FsFileService,
    private toast: ToastService) {
    super(store, route);
  }

  ngOnInit() {
    this.fsFileService.getInfoMany({
      directory: Directory.businessUpload,
      buFileType: BusinessUploadFileType.template,
      groupField: 'buUploadType'
    }).subscribe(templates => this.templates = templates)
  }

  uploadFile(fileInput) {
    if (!fileInput.files.length) {
      return;
    }
    const file = fileInput.files[0];
    const formData: FormData = new FormData();
    formData.append('fileUploadField', file, file.name);
    const options = {headers: {Accept: 'application/json'}};
    const url = `${apiUrl}/api/pft/upload/${this.uploadType.type}`;
    this.httpClient.post<FsFile>(url, formData, options)
      .subscribe(file => {
        fileInput.value = '';
        this.toast.addToast('Business Upload', 'Upload initiated. Results will be emailed to you.')
      });
  }

  getDownloadUri() {
    if (!this.templates) {
      return;
    }
    const template = _.find(this.templates, item => _.get(item, 'metadata.buUploadType') === this.uploadType.type);
    return `${environment.apiUrl}/api/file/${template.id}`;
  }

}
