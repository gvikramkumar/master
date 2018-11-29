import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class SharedServiceService {

    // private _proceedValue = new BehaviorSubject<boolean>(false);
    // setProceedValue(value) {
    //   this._proceedValue.next(value);
    // }
    // _proceedFlagValue$ = this._proceedValue.asObservable();


    // private _alignValue = new BehaviorSubject<boolean>(false);
    // setAlignValue(value) {
    //   this._alignValue.next(value);
    // }
    // _alignFlagValue$ = this._alignValue.asObservable();
}
