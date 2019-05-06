import { Component, OnInit,Input } from '@angular/core';
import { StrategyReviewService } from '@app/services/strategy-review.service';

@Component({
  selector: 'app-view-strategy',
  templateUrl: './view-strategy.component.html',
  styleUrls: ['./view-strategy.component.css']
})
export class ViewStrategyComponent implements OnInit {

  @Input() comments:any;
  @Input() caseId:string;

  strategyReviewList: any;

  constructor( private strategyReviewService:StrategyReviewService) { }

  ngOnInit() {
  }

}

