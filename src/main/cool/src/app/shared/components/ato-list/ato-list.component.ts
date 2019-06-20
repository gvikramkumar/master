import { Component, OnInit, Input } from '@angular/core';

import { Ato } from '@app/feature/pirate-ship/modules/modelling-design/model/ato';

@Component({
  selector: 'app-ato-list',
  templateUrl: './ato-list.component.html',
  styleUrls: ['./ato-list.component.scss']
})
export class AtoListComponent implements OnInit {

  @Input() atoList: Array<Ato>;

  constructor() { }

  ngOnInit() {
  }

}
