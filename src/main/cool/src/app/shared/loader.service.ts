
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private _loading: boolean = false;
  loadingStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._loading);

  get loading():boolean {
    return this._loading;
  }

  set loading(value) {
    this._loading = value;
    this.loadingStatus.next(value);
    console.log('called loading method');
  }

  startLoading() {
    this.loading = true;
    console.log('start loading method');
  }

  stopLoading() {
    this.loading = false;
    console.log('stop loading method');
  }

}
