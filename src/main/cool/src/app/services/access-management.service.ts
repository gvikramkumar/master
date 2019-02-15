import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AccessManagement } from '../models/accessmanagement';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../environments/environment.service';
import { NewUser } from '../models/newuser';
import { UserService } from './user.service';
import { User } from '../access-management/user';

@Injectable()
export class AccessManagementService {

    businessUnitUrl: string = this.environmentService.REST_API_SECONDARY_BUSINESS_UNIT_URL;
    businessEntityUrl: string = this.environmentService.PDAF_API + '?columns=BE&distinct=true';
    getPrimaryBUBasedOnBE: string = this.environmentService.REST_API_PRIMARY_BUSINESS_UNIT_LULU_URL;

    constructor(private httpClient: HttpClient, private environmentService: EnvironmentService, private userService: UserService) { }

    accessManagementAll(): any {
        return this.httpClient.get(this.environmentService.REST_API_ACCESS_MANAGEMENT_GETALL_URL);
    }

    getUserDetails(user: User) {
        return this.httpClient.post<[]>(this.environmentService.REST_API_USER_DETAILS, user, { withCredentials: true });
    }

    registerUser(newUser: NewUser[]): Observable<any> {
        return this.httpClient.post(this.environmentService.REST_API_ACCESS_MANAGEMENT_CREATEUSER_URL,
            newUser, { withCredentials: true });
    }

    updateAccessManagement(accessManagement: any) {
        return this.httpClient.post(this.environmentService.REST_API_ACCESS_MANAGEMENT_UPDATEUSER_URL,
            accessManagement, { withCredentials: true });
    }

    /**
     * Function to get distinct business units from pdaf service
     */
    getBusinessUnit() {
        const url = this.businessUnitUrl;
        return this.httpClient.get(url, { withCredentials: true });
    }
    getregisterUserFunction() {
        //  let url="http://10.155.72.125:8080/coolsrv/LOV/getFunctionalRoles";
        let url = this.environmentService.REST_API_RIGISTERNEWUSER_GET_URL
        return this.httpClient.get(url, { withCredentials: true });
    }

    /**
     * Function to get business entities for the selected business units, from
     * pdaf service
     * @param bus
     */
    getBusinessEntity(): Observable<any> {
        const url = this.businessEntityUrl;
        return this.httpClient.get(url, { withCredentials: true });
    }

    checkAdminAccess(): Observable<any> {
        return this.httpClient.get(this.environmentService.REST_API_ACCESS_MANAGEMENT_ACCESS_CHECK_URL + '/' + this.userService.getUserId(),
            { withCredentials: true });
    }

    // change on GET PRIMARY BU BASED ON BE
    getPrimaryBuBasedOnBe(data) {
        let url = this.getPrimaryBUBasedOnBE + data;
        return this.httpClient.get(url, { withCredentials: true });
    }

}
