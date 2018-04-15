import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../user';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'dk-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss']
})
export class UserListItemComponent {
  @Input() user: User;
  @Output() delete = new EventEmitter();

  constructor(public app: AppComponent) {
  }

  deleteUser(event) {
    event.preventDefault();
    this.delete.emit(this.user.id);
  }

}
