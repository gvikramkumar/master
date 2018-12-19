import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AccessManagement } from '../models/accessmanagement';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AccessManagementService {

    constructor(private httpClient: HttpClient) {}

    accessManagementAll(): any {
        return this.httpClient.get(environment.REST_API_ACCESS_MANAGEMENT_GETALL_URL);
    }

    registerUser(accessManagement: AccessManagement): Observable<any> {
        return this.httpClient.post(environment.REST_API_ACCESS_MANAGEMENT_CREATEUSER_URL, accessManagement, { withCredentials: true });
    }

    updateAccessManagement(accessManagement: AccessManagement) {
        return this.httpClient.post(environment.REST_API_ACCESS_MANAGEMENT_UPDATEUSER_URL, accessManagement, { withCredentials: true });
    }
}
