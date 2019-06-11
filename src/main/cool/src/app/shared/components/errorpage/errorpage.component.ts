import { Component, OnInit } from '@angular/core';
import { AccessManagementService } from '@app/services/access-management.service';

@Component({
  selector: 'app-errorpage',
  templateUrl: './errorpage.component.html',
  styleUrls: ['./errorpage.component.css']
})
export class ErrorpageComponent implements OnInit {

  public errMessage;
  constructor(private accessMgmtServ: AccessManagementService) { }

  ngOnInit() {
    this.accessMgmtServ.sendErrMsg.subscribe((msg)=> {
      this.errMessage = msg;
    })
  }

}