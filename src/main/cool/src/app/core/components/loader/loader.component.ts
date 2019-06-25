import { LoaderService } from '@app/core/services/loader.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loader', 
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  loading = false;
  loadingSubscription: Subscription;

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.loadingSubscription = this.loaderService.loadingStatus.subscribe((value) => {
      this.loading = value;
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}
