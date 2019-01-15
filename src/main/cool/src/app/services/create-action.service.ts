import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateAction } from '../models/create-action';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class CreateActionService {

    // actionCreateUrl: string;
    constructor(private httpClient: HttpClient) { }

    registerOffer(createaction: CreateAction): Observable<any> {
        // return this.httpClient.post(this.actionCreateUrl, createaction, { withCredentials: true });
        return;
    }
}
