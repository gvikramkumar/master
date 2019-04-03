import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class OfferConstructService {
    constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }



    public singleMultipleFormInfo: any = {};  // for add details single form and multiple form
    public itemlengthList: any = [];  // for add details single form and multiple form
    public closeAddDetails: boolean;

    public space: Subject<string> = new BehaviorSubject<string>(null);
    submitClickEvent = new EventEmitter();

    public formReset: Subject<string> = new BehaviorSubject<string>(null);

    public closeDialog: Subject<string> = new BehaviorSubject<string>(null);

    broadcastTextChange(text) {
        this.space.next(text);
    }

    changeForm(val) {
        this.formReset.next(val);
    }

    closeAction(action) {
        this.closeDialog.next(action);
    }


    addDetails(groups): Observable<any> {
        return this.httpClient.post(this.environmentService.REST_API_ADD_DETAILS_OFFER_CONSTRUCT_URL, groups, { withCredentials: true });
    }

    toFormGroup(questions) {
        const group: any = {};
        questions.forEach(question => {
            group[question.egineAttribue] = question.rules.isMandatoryOptional === 'Mandatory'
                && question.egineAttribue !== 'Item Name (PID)' ? new FormControl(question.currentValue || '', Validators.required)
                : new FormControl(question.currentValue || '');
        });
        return new FormGroup(group);
    }
}
