import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AccessManagement } from '../models/accessmanagement';
import { Observable } from 'rxjs/Observable';
import { EnvironmentService } from '../../environments/environment.service';
import { NewUser } from '../models/newuser';

@Injectable()
export class AccessManagementService {
    businessUnitUrl: string = environment.REST_API_SECONDARY_BUSINESS_UNIT_URL;
    businessEntityUrl: string = environment.REST_API_SECONDARY_BUSINESS_ENTITY_URL;

    constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) {}

    accessManagementAll(): any {
        return this.httpClient.get(this.environmentService.REST_API_ACCESS_MANAGEMENT_GETALL_URL);
    }

    registerUser(newUser: NewUser[]): Observable<any> {
        return this.httpClient.post(this.environmentService.REST_API_ACCESS_MANAGEMENT_CREATEUSER_URL,
            newUser, { withCredentials: true });
    }

    updateAccessManagement(accessManagement: AccessManagement) {
        return this.httpClient.post(this.environmentService.REST_API_ACCESS_MANAGEMENT_UPDATEUSER_URL,
                                    accessManagement, { withCredentials: true });
    }

    /**
     * Function to get distinct business units from pdaf service
     */
    getBusinessUnit() {
        const url = this.businessUnitUrl;
        return this.httpClient.get(url, {withCredentials:true});
    }

    /**
     * Function to get business entities for the selected business units, from
     * pdaf service
     * @param bus
     */
    getBusinessEntity(bus: string): Observable<any> {
        const url = this.businessEntityUrl + bus;
        return this.httpClient.get(url, {withCredentials:true});
    }
}
