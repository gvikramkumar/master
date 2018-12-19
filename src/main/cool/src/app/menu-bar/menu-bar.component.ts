import { Component, OnInit } from '@angular/core';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
   
  items: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.items = [
      {
          label: 'Ideate',
          items: [{label: 'Offer Registration '},
              {label: 'Offer Model Evaluation'},
              {label: 'Stakeholder Identification'},
              {label: 'Strategy Review'}
          ]
      },
      {
          label: 'Plan',
          items: [
              {label: 'Offer Dimension Completion'},
              {label: 'Offer Solutioning'},
              {label: 'Offer Construct'},
              {label: 'Offer Construct Details'},
              {label: 'Design Review'}
          ]
      },
      {
        label: 'Execute',
        items: [
            {label: 'Modular Workflow Completion'},
            {label: 'PID & SKU Creation'},
            {label: 'Offer Set Up and Design'},
            {label: 'NPI Testing'},
            {label: 'Readiness Review'}
        ]
    },
    {
      label: 'Launch',
      items: [
          {label: 'Offer Launch'}
      ]
  },
  {
    label: 'On Hold / Cancel ',
    items: [
        {label: 'On Hold'},
        {label: 'Cancel'}
    ]
}
    ]
  }

}

