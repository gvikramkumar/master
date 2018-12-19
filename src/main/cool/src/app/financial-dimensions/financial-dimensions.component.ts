import { Component, OnInit,Input} from '@angular/core';

@Component({
  selector: 'app-financial-dimensions',
  templateUrl: './financial-dimensions.component.html',
  styleUrls: ['./financial-dimensions.component.css']
})
export class FinancialDimensionsComponent implements OnInit {
  @Input()  financialDimensionsGroup: Object;
  constructor() { }

  ngOnInit() {
  }

}
