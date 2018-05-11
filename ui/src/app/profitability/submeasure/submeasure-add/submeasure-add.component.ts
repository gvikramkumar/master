import { Component, OnInit } from '@angular/core';
import {RoutingComponentBase} from '../../../shared/routing-component-base';
import {ActivatedRoute} from '@angular/router';
import {Store} from '../../../store/store';

@Component({
  selector: 'fin-submeasure-add',
  templateUrl: './submeasure-add.component.html',
  styleUrls: ['./submeasure-add.component.scss']
})
export class SubmeasureAddComponent extends RoutingComponentBase implements OnInit {

  constructor(private store: Store, private route: ActivatedRoute) {
    super(store, route);
  }

  ngOnInit() {
  }

  subMeasureName: string;
  description: string;
  myModel: string;
  reportingLevel1: string;
  reportingLevel2: string;

  measureName: string;
  measureNames = [
    {
      "name": "Indirect Revenue Adjustments",
      "value": 1,
      "selected":null
    },
    {
      "name": "Manufacturing Overhead",
      "value": 2,
      "selected":null
    },
    {
      "name": "Manufacturing Supply Chain Expenses",
      "value": 3,
      "selected":null
    },
    {
      "name": "Manufacturing V&O",
      "value": 4,
      "selected":null
    },
    {
      "name": "Standard COGS Adjustments",
      "value": 5,
      "selected":null
    },
    {
      "name": "Warranty",
      "value": 6,
      "selected":null
    }
  ]

  categoriesHidden: boolean = true;
  categoryTypes = [
    {
      "name": "HW",
      "value": 1
    },
    {
      "name": "SW",
      "value": 2
    },
    {
      "name": "HMP",
      "value": 3
    },
    {
      "name": "Manual Mix",
      "value": 4
    }
  ]

  measureNameSelected() {
    //Make "Submeasure Category Type" field visible if "Standard Cogs" is chosen
    if (this.measureNames[4].selected==true) {
      this.categoriesHidden=false;
    }
    else {
      this.categoriesHidden=true;
    }
  }

  categoryTypeSelected() {
  }

  switch_ibe: boolean;
  ibe_items= [
    {
      "name": "Internal BE",
      "value": 1,
      "selected": null
    },
    {
      "name": "Internal Sub BE",
      "value": 2,
      "selected": null
    }
  ]
  switch_le: boolean;
  le_items= [
    {
      "name": "BE",
      "value": 1,
      "selected": null
    }
  ]
  switch_p: boolean;
  p_items= [
    {
      "name": "TG",
      "value": 1,
      "selected": null
    },
    {
      "name": "BU",
      "value": 2,
      "selected": null
    },
    {
      "name": "PF",
      "value": 3,
      "selected": null
    },
    {
      "name": "PID",
      "value": 4,
      "selected": null
    }
  ]
  switch_s: boolean;
  s_items= [
    {
      "name": "Level 1",
      "value": 1,
      "selected": null
    },
    {
      "name": "Level 2",
      "value": 2,
      "selected": null
    },
    {
      "name": "Level 3",
      "value": 3,
      "selected": null
    },
    {
      "name": "Level 4",
      "value": 4,
      "selected": null
    },
    {
      "name": "Level 5",
      "value": 5,
      "selected": null
    },
    {
      "name": "Level 6",
      "value": 6,
      "selected": null
    }
  ]
  switch_scms: boolean;
  scms_items= [
    {
      "name": "SCMS",
      "value": 1,
      "selected": null
    }
  ]

  ibe_hidden: boolean = true;
  le_hidden: boolean = true;
  p_hidden: boolean = true;
  s_hidden: boolean = true;
  scms_hidden: boolean = true;
  ibe_br_hidden: boolean = false;
  le_br_hidden: boolean = false;
  p_br_hidden: boolean = false;
  s_br_hidden: boolean = false;
  scms_br_hidden: boolean = false;

  months = [

  ]

  timings = [

  ]

  discountFlagOptions = [
    {
      "name": "Yes",
      "value": 1
    },
    {
      "name": "No",
      "value": 2
    }
  ]

  groupings = [

  ]

  associatedRule: string;

  test() {
    //empty test function
  }

  groupingSelected() {
    //Actions for when grouping is selected
  }

  ibeChange() {
    //toggle visibility
    this.ibe_hidden = !this.ibe_hidden;
    this.ibe_br_hidden = !this.ibe_br_hidden;

    //If Internal Business Entity is selected, make sure Product is unselected
    if (this.switch_ibe && this.switch_p) {
        this.switch_p = false;
        this.pChange();
    }
  }

  leChange() {
    //toggle visibility
    this.le_hidden = !this.le_hidden;
    this.le_br_hidden = !this.le_br_hidden;
  }

  pChange() {
    //toggle visibility
    this.p_hidden = !this.p_hidden;
    this.p_br_hidden = !this.p_br_hidden;

    //If Product is selected, make sure Internal Business Entity is unselected
    if (this.switch_ibe && this.switch_p) {
        this.switch_ibe = false;
        this.ibeChange();
    }
  }

  sChange() {
    //toggle visibility
    this.s_hidden = !this.s_hidden;
    this.s_br_hidden = !this.s_br_hidden;
  }

  scmsChange() {
    //toggle visibility
    this.scms_hidden = !this.scms_hidden;
    this.scms_br_hidden = !this.scms_br_hidden;
  }

  monthSelected() {
    //Logic for when Effective Month is selected
  }

  timingSelected() {
    //Logic for when timing is selected
  }

  resetForm() {

    console.log("RESETTING FORM");

    this.subMeasureName = "";
    this.description = "";
    this.myModel = "";
    this.reportingLevel1 = "";
    this.reportingLevel2 = "";

    this.measureName = null;
    this.measureNames = [
      {
        "name": "Indirect Revenue Adjustments",
        "value": 1,
        "selected":false
      },
      {
        "name": "Manufacturing Overhead",
        "value": 2,
        "selected":false
      },
      {
        "name": "Manufacturing Supply Chain Expenses",
        "value": 3,
        "selected":false
      },
      {
        "name": "Manufacturing V&O",
        "value": 4,
        "selected":false
      },
      {
        "name": "Standard COGS Adjustments",
        "value": 5,
        "selected":false
      },
      {
        "name": "Warranty",
        "value": 6,
        "selected":false
      }
    ]

    this.switch_ibe = false;
    this.ibe_items= [
      {
        "name": "Internal BE",
        "value": 1,
        "selected": null
      },
      {
        "name": "Internal Sub BE",
        "value": 2,
        "selected": null
      }
    ]
    this.switch_le = false;
    this.le_items= [
      {
        "name": "BE",
        "value": 1,
        "selected": null
      }
    ]
    this.switch_p = false;
    this.p_items= [
      {
        "name": "TG",
        "value": 1,
        "selected": null
      },
      {
        "name": "BU",
        "value": 2,
        "selected": null
      },
      {
        "name": "PF",
        "value": 3,
        "selected": null
      },
      {
        "name": "PID",
        "value": 4,
        "selected": null
      }
    ]
    this.switch_s = false;
    this.s_items= [
      {
        "name": "Level 1",
        "value": 1,
        "selected": null
      },
      {
        "name": "Level 2",
        "value": 2,
        "selected": null
      },
      {
        "name": "Level 3",
        "value": 3,
        "selected": null
      },
      {
        "name": "Level 4",
        "value": 4,
        "selected": null
      },
      {
        "name": "Level 5",
        "value": 5,
        "selected": null
      },
      {
        "name": "Level 6",
        "value": 6,
        "selected": null
      }
    ]
    this.switch_scms = false;
    this.scms_items = [
      {
        "name": "SCMS",
        "value": 1,
        "selected": null
      }
    ]

    this.ibe_hidden = true;
    this.le_hidden = true;
    this.p_hidden = true;
    this.s_hidden = true;
    this.scms_hidden = true;
    this.ibe_br_hidden = false;
    this.le_br_hidden = false;
    this.p_br_hidden = false;
    this.s_br_hidden = false;
    this.scms_br_hidden = false;
  }


}

