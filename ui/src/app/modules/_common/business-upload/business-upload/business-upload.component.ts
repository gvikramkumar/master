import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {ActivatedRoute} from '@angular/router';
import {AppStore} from '../../../../app/app-store';
import {FsFile} from '../../models/fsfile';
import {FsFileService} from '../../../../core/services/fsfile.service';
import _ from 'lodash';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BusinessUploadFileType, Directory} from '../../../../../../../shared/misc/enums';
import {UiUtil} from '../../../../core/services/ui-util';
import {OpenPeriodService} from '../../services/open-period.service';
import {OpenPeriod} from '../../models/open-period';
import {shUtil} from '../../../../../../../shared/misc/shared-util';
import {UploadResults} from '../../models/upload-results';
import {BusinessUploadService} from '../../services/business-upload.service';
import {PgLookupService} from '../../../_common/services/pg-lookup.service';
import {ApiDfaData} from '../../../../../../../server/lib/middleware/add-global-data';
import {mail} from '../../../../../../../server/lib/common/mail';
import {svrUtil} from '../../../../../../../server/lib/common/svr-util';

const apiUrl = environment.apiUrl;

interface UploadType {
  type: string;
  text: string;
  disabled: boolean;
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
  dfa: ApiDfaData;
  @ViewChild('fileInput') fileInput;

  uploadTypes = [
    {type: 'dollar-upload', text: 'Input Dollar Adjustments', disabled: false},
    {type: 'mapping-upload', text: 'Manual Mapping Split Percentage', disabled: false},
    {type: 'dept-upload', text: 'Department/Account Exclusion Mapping', disabled: false},
    {type: 'sales-split-upload', text: 'Sales Level Split Percentage', disabled: false},
    {type: 'product-class-upload', text: 'Product Classification (SW/HW Mix)', disabled: false},
    {type: 'alternate-sl2-upload', text: 'Alternate SL2 Mapping', disabled: false},
    {type: 'corp-adjustments-upload', text: 'Corp Adjustments Mapping', disabled: false},
    {type: 'disti-direct-upload', text: 'Disty to Direct Mapping', disabled: false},
    {type: 'service-map-upload', text: 'Service Mapping Split Percentage', disabled: false},
    {type: 'service-training-upload', text: 'Service Training Mapping Split Percentage', disabled: false},
    {type:'misc-exception-upload',text:'Misc Exception Mapping', disabled: false}
  ];
  uploadType: UploadType;

  constructor(
    private httpClient: HttpClient,
    public store: AppStore,
    private route: ActivatedRoute,
    private fsFileService: FsFileService,
    private uiUtil: UiUtil,
    private openPeriodService: OpenPeriodService,
    private businessUploadService: BusinessUploadService,
    private pgLookupService: PgLookupService) {
    super(store, route);
  }

  ngOnInit() {
    Promise.all([
      this.fsFileService.getInfoMany({directory: Directory.profBusinessUpload, buFileType: BusinessUploadFileType.template}).toPromise(),
      this.openPeriodService.getQueryOne({moduleId: this.store.module.moduleId}).toPromise()
    ])
      .then(results => {
        this.templates = results[0];
        if (this.templates.length !== this.uploadTypes.length) {
          this.uiUtil.genericDialog('Template count mismatch');
        }
        this.openPeriod = shUtil.getFiscalMonthLongNameFromNumber(results[1].fiscalMonth);
      });
  }

  uploadFile(fileInput) {
    let isEtlInProgress = false;
    this.pgLookupService.callRepoMethod('getETLAndAllocationFlags', '', {moduleId:this.store.module.moduleId}).toPromise()
    .then(results => {
      for(let i=0; i<results.length; i++){
        if(Number(results[i].module_id) === this.store.module.moduleId && (results[i].
          alloc_processed_flag === "N" || results[i].dl_processed_flag === "N")){
          isEtlInProgress = true;
          break;
        }
      } 
      if(isEtlInProgress){
        // this.sendEmail(`${this.uploadType.type} - Failuer`, "Upload Failed, as currently either ETL data loads or allocation process is running.Please contact DFA Support team for any questions.");
        this.uiUtil.toastPerm(`Upload Failed, as currently either ETL data loads or allocation process is running.Please contact DFA Support team for any questions.`, "Failure");        
      }
      else{
        this.businessUploadService.uploadFile(fileInput, this.uploadType.type);
      }
    });
  }

  getDownloadUri() {
    if (!this.templates || !this.uploadType) {
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
    this.fileInput.nativeElement.value = null;
  }
  // sendEmail(subject, body) {
  //   return mail.sendHtmlMail(
  //     this.dfa.dfaAdminEmail,
  //     svrUtil.getEnvEmail('vgolanuk@cisco.com'),
  //     null,
  //     subject,
  //     body
  //   );
  // }
}
