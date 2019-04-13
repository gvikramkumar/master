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
    public questionsSet = new Set();

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
    
    setQuestionsSet(questionsSet) {
        this.questionsSet = questionsSet;
    }


    toFormGroup(questions) {
        const group: any = {};
        questions.forEach(question => {
            let validators: any[] = [];
            if (question.egineAttribue !== "Item Name (PID)") {
                if (typeof question.rules.maxCharacterLen != 'undefined' && question.rules.maxCharacterLen) {
                    validators.push(Validators.maxLength(question.rules.maxCharacterLen))
                }
                if (typeof question.rules.isMandatoryOptional != 'undefined' && question.rules.isMandatoryOptional === "Mandatory") {
                    validators.push(Validators.required)
                }
                if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "numeric") {
                    validators.push(Validators.pattern("^[0-9]*$"))
                }
                if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "camel") {
                    validators.push(Validators.pattern("^(([0-9])|([A-Z0-9][a-z0-9]+))*([A-Z])?$"))
                }
                if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "2 decimal number") {
                    validators.push(Validators.pattern("^[0-9]*\.[0-9][0-9]$"))
                }
                if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "comma seperate numeric with no space") {
                    validators.push(Validators.pattern("^[0-9]+(,[0-9]+)*$"))
                }
                if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "First letter Caps, No special characters allowed and max of 60 characters") {
                    validators.push(Validators.pattern("^[A-Z][A-Za-z0-9\\s]*$"))
                }
            }

            if (question.componentType == 'Multiselect') {
                group[question.egineAttribue] = new FormControl(question.listCurrentValue || '', validators);
            } else {
                group[question.egineAttribue] = new FormControl(question.currentValue || '', validators);
            }

        });
        return new FormGroup(group);
    }
    
}
