import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ConfigurationService {
    //url = environment.REST_API_URL + "userInfo";
    urlCurrentUser = environment.REST_API_URL_GET_CURRENT_USER;
    
    constructor(private httpClient: HttpClient, private userService: UserService) {
    }

    init(): Promise<any> {
        // debugger;
        return new Promise((resolve,reject) => {
            this.httpClient.get(this.urlCurrentUser).toPromise().then((res:any) => {
               console.log(res);
               this.userService.setUserId(res.userId);
               //this.userService.setFirstName(res.firstName);
               //this.userService.setLastName(res.lastName);
               //console.log(this.userService.getUserId());
               resolve(true);
            }).catch(this.handleError());
            
        })
    }
    private handleError(data?: any){
        return (error: any) => {
            console.log(error);
        }
    }
    /*assignUserId(data) {
        this.userService.userId = data.userId;
    }*/

}