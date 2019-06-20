import { Component, OnInit, Input, Output } from '@angular/core';
import { SsoAto } from '../../models/sso-ato';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sso-ato-list',
  templateUrl: './sso-ato-list.component.html',
  styleUrls: ['./sso-ato-list.component.css']
})
export class SsoAtoListComponent implements OnInit {

  @Input() ssoList: Array<SsoAto>;
  @Output() atoSelection = new Subject<string>();

  constructor() { }

  ngOnInit() {
  }

  onClick(selectedAto: string) {
    this.atoSelection.next(selectedAto);
  }

}
