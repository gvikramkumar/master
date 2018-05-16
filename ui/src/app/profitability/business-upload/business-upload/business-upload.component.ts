import {Component, OnInit} from '@angular/core';
import {RoutingComponentBase} from '../../../shared/routing-component-base';
import {ActivatedRoute} from '@angular/router';
import {Store} from '../../../store/store';
import {FsFile} from '../../../store/models/fsfile';
import {FsFileService} from '../../../core/services/common/fsfile.service';
import {BusinessUploadFileType, Directory} from '../../store/models/enums';
import * as _ from 'lodash';
import {environment} from '../../../../environments/environment';
import {BusinessUploadService, BuUploadMetadata} from '../../services/business-upload.service';
import {ToastService} from '../../../core/services/common/toast.service';

const directory = Directory.businessUpload;

@Component({
  selector: 'fin-business-upload',
  templateUrl: './business-upload.component.html',
  styleUrls: ['./business-upload.component.scss']
})
export class BusinessUploadComponent extends RoutingComponentBase implements OnInit {
  files: FsFile[];
  templates: FsFile[];
  //todo: these need to have role-based access (likely stored in Mongo)
  uploadTypes = [
    // {value: 'adu', text: 'Adjustments - Dollar Upload'},
    // {value: 'iaspu', text: 'Indirect Adjustments Split Percentage Upload'},
    // {value: 'slspu', text: 'Sales Level Split Percentage Upload'},
    // {value: 'mmspu', text: 'Manual Mapping Split Percentage Upload'},
    // {value: 'pcu', text: 'Product Classification (SW/HW Mix) Upload'}
    {value: 'adu', text: 'Adjustments - Dollar Upload', disabled: false},
    {value: 'iaspu', text: 'Indirect Adjustments Split Percentage Upload', disabled: false},
    {value: 'slspu', text: 'Sales Level Split Percentage Upload', disabled: false},
    {value: 'mmspu', text: 'Manual Mapping Split Percentage Upload', disabled: true},
    {value: 'pcu', text: 'Product Classification (SW/HW Mix) Upload', disabled: true}
  ];
  uploadType = this.uploadTypes[0].value;

  constructor(
    public store: Store,
    private route: ActivatedRoute,
    private fsFileService: FsFileService,
    private businessUploadService: BusinessUploadService,
    private toast: ToastService) {
    super(store, route);
  }

  changeMeasure() {
  }

  ngOnInit() {
    this.fsFileService.getInfoMany({
      directory: Directory.businessUpload,
      buFileType: 'template',
      groupField: 'buUploadType'
    }).subscribe(templates => this.templates = templates)
  }

  uploadFile(fileInput) {
    if (!fileInput.files.length) {
      return;
    }

    const metadata: BuUploadMetadata = {
      directory: directory,
      buFileType: BusinessUploadFileType.upload,
      buUploadType: this.uploadType
    }

    this.businessUploadService.upload(fileInput.files[0], metadata)
      .subscribe(file => {
        fileInput.value = '';
        this.toast.addToast('Business Upload', 'File upload success')
      });

  }

  getUploadTypeText() {
    return _.find(this.uploadTypes, {value: this.uploadType}).text;
  }

  getDownloadUri() {
    if (!this.templates) {
      return;
    }
    const template = _.find(this.templates, item => _.get(item, 'metadata.buUploadType') === this.uploadType);
    return `${environment.apiUrl}/api/file/${template.id}`;
  }

}
