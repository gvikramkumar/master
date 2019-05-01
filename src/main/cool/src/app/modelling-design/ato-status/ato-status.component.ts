import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ato-status',
  templateUrl: './ato-status.component.html',
  styleUrls: ['./ato-status.component.scss']
})
export class AtoStatusComponent implements OnInit {

  @Input() status: string;

  constructor() { }

  ngOnInit() {
  }

}
