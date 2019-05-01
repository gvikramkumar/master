import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stakeholder-identification',
  templateUrl: './stakeholder-identification.component.html',
  styleUrls: ['./stakeholder-identification.component.css']
})
export class StakeholderIdentificationComponent implements OnInit {

  @Input() subgroupName: string;
  @Input() characteristics: string;

  constructor() { }

  ngOnInit() {
  }

}
