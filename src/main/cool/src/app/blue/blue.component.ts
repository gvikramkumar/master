import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blue',
  templateUrl: './blue.component.html',
  styleUrls: ['./blue.component.css']
})
export class BlueComponent implements OnInit {
  @Input() currentOfferId: string;
  @Input() currentCaseId: string;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  offerConstruct() {
    this.router.navigate(['/offerConstruct', this.currentOfferId, this.currentCaseId]);
  }

}
