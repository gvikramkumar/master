import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-new-action',
  templateUrl: './create-new-action.component.html',
  styleUrls: ['./create-new-action.component.css']
})
export class CreateNewActionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  cancel() {
 this.router.navigate(['/action']);
  }

  createAction() {
    this.router.navigate(['/action']);
     }
}
