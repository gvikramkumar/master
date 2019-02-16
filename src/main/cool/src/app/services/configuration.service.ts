import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';


import { EnvironmentService } from '../../environments/environment.service';
import { AccessManagementService } from './access-management.service';

@Injectable()
export class ConfigurationService {
    urlGetUserInfo = this.environmentService.REST_API_URL_GET_LDAP_INFO;
    urlGetCurrentUser = this.environmentService.REST_API_URL_GET_CURRENT_USER;
    urlCheckAdminAccess = this.environmentService.REST_API_ACCESS_MANAGEMENT_ACCESS_CHECK_URL;
    private _startupData: any = {};

    constructor(private httpClient: HttpClient,
        private userService: UserService,
        private environmentService: EnvironmentService,
        private accessMgmtService: AccessManagementService) {
    }

    init() {
        return new Promise((resolve, reject) => {
            if (this._startupData.token || window.location.hash.indexOf('access_token') !== -1) {
                this._startupData.token = window.location.hash.split('&')[0].split('=')[1];

                this.httpClient.get(this.urlGetCurrentUser).toPromise()
                    .then((user) => {
                        this.userService.setUserId(user);

                        // check for admin access
                        this.accessMgmtService.checkAdminAccess().toPromise().then((resUserInfo) => {
                            this._startupData.userName = resUserInfo.userName;
                            this._startupData.isSuperAdmin = resUserInfo.superAdmin;
                            this._startupData.isFunctionalAdmin = (resUserInfo.userMapping && resUserInfo.userMapping.some(mapping => mapping.functionalAdmin));
                            this._startupData.functionsUserCanAddTo = resUserInfo.userMapping.reduce((accumulator, mapping) => {
                                accumulator = [...accumulator, mapping.functionalRole];
                                return accumulator;
                            }, []);
                            if (this._startupData.isSuperAdmin || this._startupData.isFunctionalAdmin) {
                                this._startupData.hasAdminAccess = true;
                            }
                        }, (err) => {
                            this._startupData.hasAdminAccess = false;
                        });

                        return this.httpClient.post(this.urlGetUserInfo, { userId: user }).toPromise().then((resUserInfo: any) => {
                            this.userService.setName(resUserInfo[0].cn);
                        })
                    })
                    .then((response) => resolve(true))
                    .catch(this.handleError());
            } else {
                const url = this.environmentService.GENERATE_AUTH_TOKEN_URL;
                window.location.replace(url);
            }
        });
    }

    private handleError(data?: any) {
        return (error: any) => {
            console.log(error);
        }
    }

    get startupData(): any {
        return this._startupData;
    }
}