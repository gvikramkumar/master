import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { EnvironmentService } from '../environments/environment.service';

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
    //Start watching for user inactivity.
    this.userIdle.startWatching();
    console.log("this.userIdle.startWatching() in ngOnit",this.userIdle.startWatching());

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(() => {
      console.log("seconds before onTimerStart",this.seconds);
       this.seconds = this.seconds - 1;
       console.log("seconds  after onTimerStart",this.seconds);

        this.timeStart = true; 
        console.log("   this.timeStart in ngOnInit",  this.timeStart);
        /* console.log(count) */ });

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() =>
      window.location.href = this.environmentService.GENERATE_AUTH_TOKEN_URL
    );
  }

  stop() {
    this.userIdle.stopTimer();
    console.log("seconds in  before stop method", this.seconds);
    this.seconds = 600;
    console.log("seconds in  after stop method", this.seconds);
    this.timeStart = false;
    console.log("this.timeStart in stop method",this.timeStart);
  }

  stopWatching() {
    this.userIdle.stopWatching();
    console.log("In stopWtching  this.userIdle.stopWatching()", this.userIdle.stopWatching());
  }

  startWatching() {
    this.userIdle.startWatching();
    console.log(" this.userIdle.startWatching()", this.userIdle.startWatching());
  }

  restart() {
    this.userIdle.resetTimer();
    console.log("this.userIdle.resetTimer()",this.userIdle.resetTimer());
  }

  coordinates(event: MouseEvent): void {
    this.clientX = event.clientX;
    console.log("this.clientX",this.clientX)
    this.clientY = event.clientY;
    console.log("this.clientY",this.clientY)

  }

  @HostListener('keypress') onKeyPress() {
    this.restart();
    console.log("this.stop() in HostListener", this.stop());
  }

  @HostListener('mouseover') onMouseOver() {
    console.log("in mouseover..................!")
    this.restart();
    console.log("this.stop() in HostListener", this.stop()); 
}

}