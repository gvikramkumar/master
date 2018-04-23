import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {CuiHeaderOptions} from '@cisco-ngx/cui-components';
import {ModuleService} from '../../../core/services/common/module.service';
import {Store} from '../../../store/store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit{

  //public modules: QueryRef<PostsInterface>;
  public modules: any[];
  public listPostFilter: string;
  private nameFilter: Subject<string> = new Subject<string>();
  public postControl = new FormControl();
  @ViewChild('myIdentifier') myIdentifier: ElementRef;

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


  constructor(private store: Store) {
   }

  ngOnInit() {
    this.modules = this.store.modules;
  }


  ngAfterViewInit() {
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
