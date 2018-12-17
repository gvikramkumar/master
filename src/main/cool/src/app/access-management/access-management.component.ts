import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-access-management',
  templateUrl: './access-management.component.html',
  styleUrls: ['./access-management.component.css']
})
export class AccessManagementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  registerNewUser() {
    document.getElementById('formSection').style.visibility = 'visible';
  }

  closeForm() {
    document.getElementById('formSection').style.visibility = 'hidden';
  }

}
