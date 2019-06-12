import { Component, OnInit } from '@angular/core';
import {EnvironmentService} from '@env/environment.service';
import {HttpClient, HttpRequest} from '@angular/common/http';

@Component({
  selector: 'app-upload-doc',
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.component.css']
})
export class UploadDocComponent implements OnInit {
  fileToUpload: File = null;
  constructor(
   public _evnService: EnvironmentService,
    public httpClient: HttpClient
  ) { }

  ngOnInit() {

  }

  showUploadWindow() {
    document.getElementById('myFileInput').click();
  }

  handleFileInput(files: FileList) {
   this.fileToUpload = files.item(0);

    let formdata: FormData = new FormData();

    formdata.append('file', this.fileToUpload);
    this.httpClient.post(this._evnService.REST_API_RoyaltySetup_upload,formdata).subscribe(
      (res) => {
        console.log(res);
      }
    );

   //  const req = new HttpRequest('POST', this._evnService.REST_API_RoyaltySetup_upload, formdata, {
   //    reportProgress: true,
   //    responseType: 'text'
   //  });
   // this.httpClient.request(req).subscribe(
   //   (res) => {
   //     console.log(res);
   //     debugger;
   //   }
   // );

  }
}
