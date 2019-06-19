import {Component, Input, OnInit} from '@angular/core';
import {EnvironmentService} from '@env/environment.service';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {ActionsAndNotifcations} from '@app/feature/dashboard/action';
import {UserService} from '@core/services';

@Component({
  selector: 'app-upload-doc',
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.component.css']
})
export class UploadDocComponent implements OnInit {
  fileToUpload: File = null;
  @Input() moduleName: string;
  offerId: string;
  fileName: string;
  status: number;
  downloadUrl: string;
  timestamp: number;
  userId: string;
  userName: string;
  info: string;
  DocType: Array<string>;
  DocSize: number;
  @Input() isReadonly: boolean;
  ishide: boolean = true;

  constructor(
    public _evnService: EnvironmentService,
    public httpClient: HttpClient,
    private _userService: UserService
  ) { }

  ngOnInit() {
    this.httpClient.get(this._evnService.REST_API_BasicModuleDocType,{
      params: new HttpParams().set('moduleName', this.moduleName)
    }).subscribe(
      (ModuleExtension: any) => {
        console.log(ModuleExtension);
        this.DocType = ModuleExtension.documentType.split('|');
        this.DocSize = ModuleExtension.size;

      }
    );
    this.info = "";
    this.offerId = this._userService.getofferId();
    this.getFileName();
  }

  showUploadWindow() {
    document.getElementById('myFileInput').click();
  }
  getFileName() {
    if(this.offerId !== null) {
      this.httpClient.get(this._evnService.REST_API_BasicModuleFileName, {
        params: new HttpParams().set('offerId', this.offerId).append('moduleName', this.moduleName)
      }).subscribe((res: any) => {
        this.status = 200;
        this.fileName = res.fileName;
        this.timestamp = res.timeStamp;
        this.userId =  res.userId;
        this.userName = res.userName;
        this.downloadUrl = this._evnService.REST_API_BasicModule_DownloadDoc+"?offerId="+this.offerId+"&fileName="+this.fileName+"&moduleName="+this.moduleName+"";
      });
    }

  }



  handleFileInput(files: FileList) {

    this.fileToUpload = files.item(0);
    if(  this.fileToUpload.name) {

      if(this.fileToUpload.size/(1024*1024) <= this.DocSize) {

        if (this.DocType.indexOf(  this.fileToUpload.name.split('.')[1].toLocaleLowerCase()) > -1 || this.DocType.indexOf('ALL') > -1) {

          let formdata: FormData = new FormData();
          const usaTime = new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'});
          console.log( new Date(usaTime).getTime().toString());
          console.log( new Date(usaTime));
          this.timestamp = new Date(usaTime).getTime();
          this.userId = this._userService.getUserId();
          this.userName =  this._userService.getName();
          formdata.append('file', this.fileToUpload);
          formdata.append('offerId', this._userService.getofferId());
          formdata.append('userId', this._userService.getUserId());
          formdata.append('userName', this._userService.getName());
          formdata.append('timeStamp', new Date(usaTime).getTime().toString());
          formdata.append('moduleName', this.moduleName);
          debugger;
          this.httpClient.post(this._evnService.REST_API_BasicModule_upload, formdata).subscribe(
            (res: any) => {
              this.status = res.status;
              if (res.status === 200) {
                this.fileName = res.fileName;
                this.info="";
                this.downloadUrl = this._evnService.REST_API_BasicModule_DownloadDoc+"?offerId="+this.offerId+"&fileName="+this.fileName+"&moduleName="+this.moduleName+"";
              } else {
                this.info = res.Message;
              }

            }
          );
        } else {
          this.ishide = false;
          this.info =  "File type is not supported.";
        }


      } else {
        this.ishide = false;
        this.info = "Upload file exceeded maximum file size allowed. Please try again.";
      }

    } else {
      this.info = "Please make sure you have the fileName";
    }




  }

  changemodalstatus() {
    this.ishide = true;
  }
}
