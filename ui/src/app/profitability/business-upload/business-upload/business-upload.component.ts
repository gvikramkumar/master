import {Component, OnInit, ViewChild} from '@angular/core';

import { MatRadioChange } from '@angular/material/radio';
import {RoutingComponentBase} from '../../../shared/routing-component-base';
import {ActivatedRoute} from '@angular/router';
import {Store} from '../../../store/store';
import {FsFile} from '../../../store/models/fsfile';
import {FsFileService} from '../../../core/services/common/fsfile.service';
import {BusinessUploadFileType, Directory} from '../../store/models/enums';

const directory = Directory.businessUpload;

@Component({
  selector: 'fin-business-upload',
  templateUrl: './business-upload.component.html',
  styleUrls: ['./business-upload.component.scss']
})
export class BusinessUploadComponent extends RoutingComponentBase implements OnInit {
  files: FsFile[];
  @ViewChild('fileUp') fileUp;
  selectedType: {value: string, text: string};
  templates: FsFile[];

  //todo: these need to have role-based access (likely stored in Mongo)
  radios = [
    {value: 'adu', text: 'Adjustments - Dollar Upload'},
    {value: 'iaspu', text: 'Indirect Adjustments Split Percentage Upload'},
    {value: 'slspu', text: 'Sales Level Split Percentage Upload'},
    {value: 'mmspu', text: 'Manual Mapping Split Percentage Upload'},
    {value: 'pcu', text: 'Product Classification (SW/HW Mix) Upload'}
  ];

  constructor(private store: Store, private route: ActivatedRoute, private fsFileService: FsFileService) {
    super(store, route);
  }

  changeMeasure() {
  }

  ngOnInit() {
    this.fsFileService.getInfoMany({
      directory: Directory.businessUpload,
      buFileType: 'template'
    }).subscribe(templates => this.templates = templates)
  }

  upload(event) {
    const fileInput = this.fileUp.nativeElement;
    if (!fileInput.files.length) {
      return;
    }

    const metadata = {
      directory: directory,
      buFileType: BusinessUploadFileType.upload,
      buUploadType: this.selectedType.value
    }

    this.fsFileService.upload(fileInput.files, )
      .subscribe(files => {
      });

  }

}
