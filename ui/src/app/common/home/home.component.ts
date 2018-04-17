import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {CuiHeaderOptions} from '@cisco-ngx/cui-components';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit{

  //public modules: QueryRef<PostsInterface>;
  public modules: Observable<any[]>;
  public listPostFilter: string;
  private nameFilter: Subject<string> = new Subject<string>();
  public postControl = new FormControl();

  headerOptions = new CuiHeaderOptions({
    "showBrandingLogo": true,
    "brandingLink": "https://cisco.com",
    "brandingTitle": "",
    "showMobileNav": true,
    "title": "Digitized Financial Allocations",
    "breadcrumbs": [
      {
        "label": "Home",
        "url": "dfa"
      }
    ],
    "username": "Maryellen Oltman",
  });


  constructor() {
   }

  ngOnInit() {

    console.log("Modules are: " + this.modules);
  }

  @ViewChild('myIdentifier')
  myIdentifier: ElementRef;

  ngAfterViewInit() {
    //console.log(this.myIdentifier.nativeElement.offsetWidth);
    this.sidebarHeight = this.myIdentifier.nativeElement.offsetHeight;
  }



  public _opened: boolean = false;
  public _mode: string = 'push';
  //public width: Number;
  public sidebarHeight: Number;

  public _toggleSidebar() {
    this._opened = !this._opened;
  }



}
