import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class OfferConstructService {

    public singleMultipleFormInfo: any = {};  // for add details single form and multiple form
    public itemlengthList: any = [];  // for add details single form and multiple form
    public closeAddDetails: boolean;
    constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

    public space: Subject<string> = new BehaviorSubject<string>(null);
    submitClickEvent = new EventEmitter();

    broadcastTextChange(text) {
        this.space.next(text);
    }

    public formReset: Subject<string> = new BehaviorSubject<string>(null);

    changeForm(val) {
        this.formReset.next(val);
    }

    public closeDialog: Subject<string> = new BehaviorSubject<string>(null);

    closeAction(action) {
        this.closeDialog.next(action);
    }


    addDetails(groups): Observable<any> {
        return this.httpClient.post(this.environmentService.REST_API_ADD_DETAILS_OFFER_CONSTRUCT_URL, groups, { withCredentials: true });
    }

    toFormGroup(questions) {
        const group: any = {};
        questions.forEach(question => {
            group[question.egineAttribue] = question.required ? new FormControl(question.value || '', Validators.required)
                : new FormControl(question.value || '');
        });
        return new FormGroup(group);
    }

}
