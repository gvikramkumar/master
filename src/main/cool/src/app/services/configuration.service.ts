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
    accessToken:string = "";
    private _startupData: any;

    constructor(private httpClient: HttpClient, 
        private userService: UserService, 
        private environmentService: EnvironmentService,
        private accessMgmtService: AccessManagementService) {
    }

    init() {
        debugger;
        let that = this;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (location.hash) {
                        /* Extract the Access Token from the URI fragment */
                        that.accessToken = location.hash.split('&')[0].split('=')[1];
                    }
                }
            };
            
            xhttp.open("GET", this.environmentService.PDAF_GET_TOKEN_API, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        ;
        
        
        console.log(this.getAuthHeader());
        // original code: DO NOT CH
        return new Promise((resolve, reject) => {
            this.httpClient.get(this.urlGetCurrentUser, { withCredentials: true }).toPromise()
                .then((user) => {
                    this.userService.setUserId(user);
                    
                    // check for admin access
                    this.accessMgmtService.checkAdminAccess().toPromise().then((data) => {
                        console.log(data);
                        this._startupData = {hasAdminAccess:true, userName: data.userName};
                    }, (err) => {
                        console.log(err);
                        this._startupData = {hasAdminAccess:false};
                    });
                    
                    return this.httpClient.post(this.urlGetUserInfo, { userId: user }, { withCredentials: true }).toPromise().then((res: any) => {
                        console.log(res);
                        this.userService.setFirstName(res.firstName);
                        this.userService.setLastName(res.lastName);
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

    /* set this header value with key as 'Authorization' before calling any api */
    getAuthHeader(){
       return ('Bearer ' + this.accessToken);
    }

    get startupData(): any {
        return this._startupData;
    }
}