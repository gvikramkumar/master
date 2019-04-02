
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class LoaderService {
    public loaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    display(value: boolean) {
        console.log('display');
        this.loaderStatus.next(value);
    }

}