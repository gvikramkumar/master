import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-sales-dimensions',
  templateUrl: './sales-dimensions.component.html',
  styleUrls: ['./sales-dimensions.component.css']
})
export class SalesDimensionsComponent implements OnInit {
  @Input() salesDimensionsGroup: Object;
  constructor() { }

  ngOnInit() {
  }

}
