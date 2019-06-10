import { Component, OnInit, Input } from '@angular/core';
import { SsoAto } from '../../models/sso-ato';

@Component({
  selector: 'app-sso-ato-summary',
  templateUrl: './sso-ato-summary.component.html',
  styleUrls: ['./sso-ato-summary.component.css']
})
export class SsoAtoSummaryComponent implements OnInit {

  @Input() sso: SsoAto;

  constructor() { }

  ngOnInit() {
  }



}
