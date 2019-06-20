import { Component, OnInit, Input } from '@angular/core';
import { SsoStatus } from '../../models/sso-status';
import * as _ from 'lodash';

@Component({
  selector: 'app-sso-status',
  templateUrl: './sso-status.component.html',
  styleUrls: ['./sso-status.component.css']
})
export class SsoStatusComponent implements OnInit {

  @Input() ssoStatus: SsoStatus;

  constructor() { }

  ngOnInit() {

  }

}
