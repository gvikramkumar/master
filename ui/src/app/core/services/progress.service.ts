import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ProgressService {
  showProgress$: Subject<boolean> = new Subject();

  showProgressBar(val = true) {
    this.showProgress$.next(val);
  }

  hideProgressBar() {
    this.showProgress$.next(false);
  }

}
