import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { EnvironmentService } from '../environments/environment.service';
import {Subject} from 'rxjs';

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

  constructor(private router: Router, private userIdle: UserIdleService,
    private environmentService: EnvironmentService) {
    this.router.events.subscribe(NavigationEnd => {
      this.pageName_temp = NavigationEnd;
      this.pageName = this.pageName_temp.url;
    });
  }

  ngOnInit() {

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
