import { Component, OnInit } from '@angular/core';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {AppStore} from '../../../../app/app-store';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'fin-processing-date-input',
  templateUrl: './processing-date-input.component.html',
  styleUrls: ['./processing-date-input.component.scss']
})
export class ProcessingDateInputComponent extends RoutingComponentBase implements OnInit {

  constructor(private store: AppStore,
    private router: Router,
    private route: ActivatedRoute) {
    super(store, route);
   }

  ngOnInit() {
  }

  hello(){
    console.log("hello");
  }

}
