import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-delivery-dimensions',
  templateUrl: './delivery-dimensions.component.html',
  styleUrls: ['./delivery-dimensions.component.css']
})
export class DeliveryDimensionsComponent implements OnInit {
  @Input()  deliveryDimensionsGroup: Object;
  constructor() { }

  ngOnInit() {
  }

}
