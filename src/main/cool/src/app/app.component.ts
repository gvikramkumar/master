import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { EnvironmentService } from '../environments/environment.service';
import {Subject} from 'rxjs';
import { AccessManagementService } from './services/access-management.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  pageName: any;
  pageName_temp: any;
  timeStart = false;
  seconds = 600;
  clientX = 0;

  clientY = 0;
  public toShow;
  public readOnlyFlag = false;
  constructor(private router: Router, private userIdle: UserIdleService,
    private environmentService: EnvironmentService,
    private accessMgServ: AccessManagementService) {
    this.router.events.subscribe(NavigationEnd => {
      this.pageName_temp = NavigationEnd;
      this.pageName = this.pageName_temp.url;
    });
  }

  ngOnInit() {

    // passing data to "ReadOnly" directive

    this.accessMgServ.onGetUserCEPM().subscribe((data: any) => {
      if (!data[0].error) {
        data.forEach((value, ind) => {
          if (Object.keys(value)[0].substring(0, 7) === "COOL - ") {
            Object.defineProperty(value, Object.keys(value)[0].substring(7),
              Object.getOwnPropertyDescriptor(value, Object.keys(value)[0]));
            delete value[Object.keys(value)[0]];
          }

        })

        this.accessMgServ.sendfunctionalRolRaw
          .subscribe((roleFromDb: any) => {
            for (let item of data) {
              console.log(item.hasOwnProperty(roleFromDb))
              if (item.hasOwnProperty(roleFromDb) === true) {
                this.accessMgServ.getRoleObj.next(item[roleFromDb]);
              }
            }
          });

        this.accessMgServ.sendFromUserRegistration
          .subscribe((roleFromUserReg: any) => {
            if (roleFromUserReg.length !== 0) {
              let selectedRole = roleFromUserReg.userMapping[0].functionalRole
              for (let item of data) {
                if (item.hasOwnProperty(selectedRole) === true) {
                  this.accessMgServ.getRoleObjFromUserRegistration.next(item[selectedRole]);
                }
              }
            }
          })
      }
      else {
        this.accessMgServ.sendErrMsg.next(data[0].error);
        this.readOnlyFlag = true;
      }
    }, (err) => {
      console.log("Error", err);
    });


    // Start watching for user inactivity.
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(() => {
       this.seconds = this.seconds - 1;

        this.timeStart = true;
        /* console.log(count) */ });

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() =>
      window.location.href = this.environmentService.REST_API_GENERATE_AUTH_TOKEN_URL
    );
  }

  stop() {
    this.userIdle.stopTimer();
    this.seconds = 600;
    this.timeStart = false;
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

  coordinates(event: MouseEvent): void {
    this.clientX = event.clientX;
    this.clientY = event.clientY;

  }

  @HostListener('keypress') onKeyPress() {
    this.restart();
  }

  @HostListener('mouseover') onMouseOver() {
    this.restart();
}



}
