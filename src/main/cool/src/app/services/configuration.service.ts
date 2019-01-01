import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

import 'rxjs/add/operator/toPromise';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class ConfigurationService {
    urlGetUserInfo = environment.REST_API_URL;
    urlGetCurrentUser = environment.REST_API_URL_GET_CURRENT_USER;
    
    constructor(private httpClient: HttpClient, 
        private userService: UserService, 
        private environmentService: EnvironmentService) {
    }

    init(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.httpClient.get(this.urlGetCurrentUser, { withCredentials: true }).toPromise()
                .then((user) => {
                    this.userService.setUserId(user);
                    return this.httpClient.post(this.urlGetUserInfo, { userId: user }, { withCredentials: true }).toPromise().then((res: any) => {
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
    /*assignUserId(data) {
        this.userService.userId = data.userId;
    }*/

}