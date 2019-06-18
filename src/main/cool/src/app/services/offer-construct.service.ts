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
    public questionsSet: any = {};

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


    addDetails(groups, offerId): Observable<any> {
        const url = this.environmentService.REST_API_ADD_DETAILS_OFFER_CONSTRUCT_URL + '?offerId=' +offerId;
        return this.httpClient.post(url, groups, { withCredentials: true });
    }

    setQuestionsSet(questionsSet) {
        this.questionsSet = questionsSet;
    }


    toFormGroup(questions) {

        const group: any = {};

        questions.forEach(question => {

            const validators: any[] = [];

            if (question.egineAttribue !== 'Item Name (PID)') {

                if (typeof question.rules.maxCharacterLen != 'undefined' && question.rules.maxCharacterLen) {
                    validators.push(Validators.maxLength(question.rules.maxCharacterLen));
                }
                if (typeof question.rules.isMandatoryOptional != 'undefined' && question.rules.isMandatoryOptional === 'Mandatory') {
                    validators.push(Validators.required);
                }
                if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === 'numeric') {
                    validators.push(Validators.pattern('^[0-9]*$'));
                }
                if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === 'camel') {
                    validators.push(Validators.pattern('^(([0-9])|([A-Z0-9][a-z0-9]+))*([A-Z])?$'));
                }
                if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "2 decimal number") {
                    validators.push(Validators.pattern("^[0-9]+\\.[0-9]{2}$"))
                }
                if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === 'comma seperate numeric with no space') {
                    validators.push(Validators.pattern('^[0-9]+(,[0-9]+)*$'));
                }
                if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === 'First letter Caps, No special characters allowed and max of 60 characters') {
                    validators.push(Validators.pattern('^[A-Z][A-Za-z0-9\\s]*$'));
                }
                if (question.egineAttribue == 'Non Standard True Up Term') {
                    validators.push(Validators.pattern("^0*([2-6])$"))
                }
                if (question.egineAttribue == 'Initial Term') {
                    validators.push(Validators.pattern("^(0*([1-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|120))(,(0*([1-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|120)))*$"))
                }
                if (question.egineAttribue == 'NON STD INITIAL TERM') {
                    validators.push(Validators.pattern("^0*([1-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|120)$"))
                }
                if (question.egineAttribue == 'STD AUTO RENEWAL TERM') {
                    validators.push(Validators.pattern("^0*([1-9]|[1-5][0-9]|60)$"))
                }
                if (question.egineAttribue == 'NON STD AUTO RENEWAL TERM') {
                    validators.push(Validators.pattern("^0*([1-9]|1[0-2])$"))
                }
                if (question.egineAttribue == 'Subscription Offset(In Days)') {
                    validators.push(Validators.pattern("^0*([1-9]|[1-5][0-9]|60)$"))
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

    toOfferFormGroup(titleQuestionsMap) {

        const group: any = {};
        // for (const [title, questions] of Object.entries(titleQuestionsMap)) {
        //     console.log(title, questions);
        for (let title in titleQuestionsMap) {
            let questions = titleQuestionsMap[title];

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
                    if (question.egineAttribue == 'Non Standard True Up Term') {
                        validators.push(Validators.pattern("^0*([2-6])$"))
                    }
                    if (question.egineAttribue == 'Initial Term') {
                        validators.push(Validators.pattern("^0*([1-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|120)$"))
                    }
                    if (question.egineAttribue == 'NON STD INITIAL TERM') {
                        validators.push(Validators.pattern("^0*([1-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|120)$"))
                    }
                    if (question.egineAttribue == 'STD AUTO RENEWAL TERM') {
                        validators.push(Validators.pattern("^0*([1-9]|[1-5][0-9]|60)$"))
                    }
                    if (question.egineAttribue == 'NON STD AUTO RENEWAL TERM') {
                        validators.push(Validators.pattern("^([1-9]|1[0-2])$"))
                    }
                    if (question.egineAttribue == 'Subscription Offset(In Days)') {
                        validators.push(Validators.pattern("^([1-9]|[1-5][0-9]|60)$"))
                    }
                    
                }

                if (question.componentType == 'Multiselect') {
                    group[title + "_" + question.egineAttribue] = new FormControl(question.listCurrentValue || '', validators);
                } else {
                    group[title + "_" + question.egineAttribue] = new FormControl(question.currentValue || '', validators);
                }

            });
        }
        return new FormGroup(group);
    }
    
    updateNewEgenieFlag(offerId): Observable<any>{
        const url = `${this.environmentService.REST_API_UPDATE_EGENIE_FLAG}/${offerId}`;
        return this.httpClient.put(url, { withCredentials: true });
    }

}
