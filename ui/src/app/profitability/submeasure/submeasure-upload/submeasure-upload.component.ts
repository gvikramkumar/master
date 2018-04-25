import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '../../../store/store';
import {RoutingComponentBase} from '../../../shared/routing-component-base';

@Component({
  selector: 'fin-submeasure-upload',
  templateUrl: './submeasure-upload.component.html',
  styleUrls: ['./submeasure-upload.component.scss']
})
export class SubmeasureUploadComponent extends RoutingComponentBase implements OnInit {

  myModel:string = "";

  constructor(private store: Store, private route: ActivatedRoute) {
    super(store, route);
  }

  ngOnInit() {
  }

}
