import {Component, OnInit} from '@angular/core';
import {ProgressService} from '../../../core/services/progress.service';

@Component({
  selector: 'dk-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {
  show = false;
  value = 0;
  timer = null;

  constructor(progressService: ProgressService) {
    progressService.showProgress$.subscribe(show => {
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
