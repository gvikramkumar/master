import { Component, OnInit, Input } from '@angular/core';
import { SsoAto } from '../../models/sso-ato';

@Component({
  selector: 'app-sso-ato-list',
  templateUrl: './sso-ato-list.component.html',
  styleUrls: ['./sso-ato-list.component.css']
})
export class SsoAtoListComponent implements OnInit {

  @Input() ssoList: Array<SsoAto>;

  constructor() { }

  ngOnInit() {
  }

}
