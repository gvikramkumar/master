import { Component, OnInit } from '@angular/core';
import { Router,  NavigationEnd } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
} from '@angular/animations';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent{

  pageName:any;
  pageName_temp : any;
  constructor(private router: Router) {
    this.router.events.subscribe(NavigationEnd => {      
      this.pageName_temp = NavigationEnd;
      this.pageName = this.pageName_temp.url ;
    });
  }

  

}
