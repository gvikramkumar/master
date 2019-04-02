import { LoaderService } from './../../loader.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoaderState } from './loader';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  isShow = false;
  private subscription: Subscription;
  constructor(private loaderService: LoaderService) {
    this.loaderService.loaderStatus.subscribe((value) => {
      this.isShow = value
      console.log("test");

    });
  }

  ngOnInit() {
    console.log("test");
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
