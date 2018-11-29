import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable()
export class ConfigurationService {
    url = environment.REST_API_URL + "userInfo";
    
    constructor(private httpClient: HttpClient, private userService: UserService) {
    }

    init() {
        console.log('init invoked');
        const ret = this.httpClient.get(this.url).toPromise().then((data: any) => {
            this.assignUserId(data);
            return true;
        }).catch();
        console.log(this.userService.userId);
    }

    assignUserId(data){
        this.userService.userId = data.userId;
    }

}