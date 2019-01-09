import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

import 'rxjs/add/operator/toPromise';
import { EnvironmentService } from '../../environments/environment.service';
import { AccessManagementService } from './access-management.service';

@Injectable()
export class ConfigurationService {
    urlGetUserInfo = this.environmentService.REST_API_URL_GET_LDAP_INFO;
    urlGetCurrentUser = this.environmentService.REST_API_URL_GET_CURRENT_USER;
    urlCheckAdminAccess = this.environmentService.REST_API_ACCESS_MANAGEMENT_ACCESS_CHECK_URL;
    private _startupData: any;
    private userName:string;

    constructor(private httpClient: HttpClient, 
        private userService: UserService, 
        private environmentService: EnvironmentService,
        private accessMgmtService: AccessManagementService) {
    }

    init() {
        return new Promise((resolve, reject) => {
            this.httpClient.get(this.urlGetCurrentUser, { withCredentials: true }).toPromise()
                .then((user) => {
                    this.userService.setUserId(user);
                    
                    // check for admin access
                    this.accessMgmtService.checkAdminAccess().toPromise().then((data) => {
                        console.log(data);
                        this._startupData = {hasAdminAccess:true};
                    }, (err) => {
                        console.log(err);
                        this._startupData = {hasAdminAccess:false};
                    });
                    
                    return this.httpClient.post(this.urlGetUserInfo, { userId: user }, { withCredentials: true }).toPromise().then((res: any) => {
                        this.userService.setFirstName(res.firstName);
                        this.userService.setLastName(res.lastName);
                        this.userName = res.firstName + ' ' + res.lastName;
                    })
                })
                .then((response) => resolve(true))
                .catch(this.handleError());

        })
    }

    private handleError(data?: any) {
        return (error: any) => {
            console.log(error);
        }
    }

    get startupData(): any {
        return this._startupData;
    }

    getUserName(): string {
        return this.userName;
    }


}