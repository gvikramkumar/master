import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ViewcommentService } from '../services/viewcomment.service';
import * as moment from 'moment';
@Component({
  selector: 'app-viewcomment',
  templateUrl: './viewcomment.component.html',
  styleUrls: ['./viewcomment.component.css']
})
export class ViewcommentComponent implements OnInit {
  @Input() userName: string;
  @Input() taskId: string;
  @Input() popContent;

  public onDisable = true;
  public addcomment = false;
  public showError = false;
  public newComment: string;
  public viewcomment;
  public owner;
  public userId: string;
  public currentuserName: any;
  postdata: Object;
  viewCommentForm: FormGroup;

  constructor(
    private viewcommentService: ViewcommentService,
    private userService: UserService) {
    this.owner = this.userName;
    this.userId = this.userService.getUserId();
    this.currentuserName = this.userService.getName();

  }


  ngOnInit() {
    this.newComment = '';
    this.onDisable = true;
    this.getComments();
    this.viewCommentForm = new FormGroup({
      comment: new FormControl(null, Validators.required)
    });
  }


  private getComments() {
    this.viewcommentService.getViewComment(this.taskId).subscribe(resComments => {
      this.viewcomment = resComments.map(comment => {
        comment.date = moment(comment.date).format('MM-DD-YYYY');
        return comment;
      });
    });
  }

  updateComment() {
    let obj = {
      "comment": this.newComment,
      "commentOwner": this.userId
    }
    this.newComment = '';
    this.viewcommentService.postViewComment(obj, this.taskId).subscribe(res => {
      this.getComments();
    })
  }

  validateComment(event) {
    let value = event.target.value;
    if (value.toString().length < 1) {
      this.onDisable = true;
    } else {
      this.onDisable = false;
    }
    if (value.toString().length > 300) {
      this.showError = true;
    } else {
      this.showError = false;
    }
    this.newComment = value;
  }

  addComment() {
    this.addcomment = true;
  }

  removeComment() {
    this.newComment = '';
    this.onDisable = true;
    this.addcomment = false;
    this.popContent.close();
  }

}
