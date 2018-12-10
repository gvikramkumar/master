import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class OfferDetailViewService {

    // download_endpoint = 'http://localhost:8080/api/files';

    constructor(private httpClient: HttpClient) {}

    // npm install file-saver --save

    // npm install @types/file-saver --save

    // "@types/filesaver": "0.0.30",
    
    // "file-saver": "^1.3.2"

    export() {
        // return this.httpClient.get(this.download_endpoint, 
            // {responseType: 'blob'});
    }

}