import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class OfferConstructService {

    constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

    addDetails(groups): Observable<any> {
        return this.httpClient.post(this.environmentService.REST_API_ADD_DETAILS_OFFER_CONSTRUCT_URL, groups, { withCredentials: true });
    }

    toFormGroup(questions) {
        const group: any = {};
        console.log(questions);
        questions.forEach(question => {
          group[question.egineAttribue] = question.required ? new FormControl(question.value || '', Validators.required)
                                                  : new FormControl(question.value || '');
        });
        return new FormGroup(group);
      }

}
