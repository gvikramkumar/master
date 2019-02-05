import { Component, OnInit,Input } from '@angular/core';
import { StrategyReviewService } from '../services/strategy-review.service';

@Component({
  selector: 'app-viewstrategy',
  templateUrl: './viewstrategy.component.html',
  styleUrls: ['./viewstrategy.component.css']
})
export class ViewstrategyComponent implements OnInit {

  @Input() caseId:string;
  @Input() comments:any;
  strategyReviewList: any;
  constructor( private strategyReviewService:StrategyReviewService) { }

  ngOnInit() {
   
  }
}

