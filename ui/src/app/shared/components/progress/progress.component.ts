import {Component, OnInit} from '@angular/core';
import {AppStore} from '../../../app/app-store';

@Component({
  selector: 'fin-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {
  show = false;
  value = 0;
  timer = null;

  constructor(store: AppStore) {
    store.showProgress$.subscribe(show => {
      if (show) {
        this.show = true;
        this.value = 0;
        this.timer = setInterval(() => {
          if (this.value < 101) {
            this.value += 1;
          }
        }, 100);
      } else {
        this.show = false;
        clearInterval(this.timer);
      }
    });
  }

}
