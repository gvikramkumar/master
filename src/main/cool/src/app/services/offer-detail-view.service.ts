import {environment} from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class OfferDetailViewService {

    // download_endpoint = 'http://localhost:8080/api/files';

    constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) {}

    // npm install file-saver --save

    // npm install @types/file-saver --save

    // "@types/filesaver": "0.0.30",

    // "file-saver": "^1.3.2"

    export() {
        // return this.httpClient.get(this.download_endpoint, 
            // {responseType: 'blob'});
    }

    offerDetailView(offerId):any {
        return this.httpClient.get(this.environmentService.REST_API_MM_OFFER_BUILDER_GET_URL + offerId);
      }

    mmDataRetrive(offerId):any {
        return this.httpClient.get(this.environmentService.REST_APT_MMPAGE_RETRIVE_DATA_GET_URL + offerId);
      }
}
