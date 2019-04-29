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

  getInitialChar(name) {
    if (name == null) {
      return '';
    }
    const names = name.split(' ');
    let initials = '';
    initials += names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
      initials += names[1].charAt(0).toUpperCase();
    }
    return initials;
  }

}
