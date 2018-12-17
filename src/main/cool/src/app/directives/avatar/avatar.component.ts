import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
  @Input() stakeholderName: string;
  @Input() email: string;
  @Input() functionalRole: string;

  constructor() { }

  ngOnInit() {
  }

}
