import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import * as moment from 'moment';
import { UserService, ViewcommentService } from '@shared/services';
@Component({
  selector: 'app-viewcomment',
  templateUrl: './viewcomment.component.html',
  styleUrls: ['./viewcomment.component.css']
})
export class ViewcommentComponent implements OnInit, OnChanges {
  @Input() userName: string;
  @Input() taskId: string;
  @Input() popContent: OverlayPanel;
  @Input() event;

  public onDisable = true;
  public addcomment = true;
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
    // this.viewcomment = [];
    // this.getComments(this.taskId);
    this.viewCommentForm = new FormGroup({
      comment: new FormControl(null, Validators.required)
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    const taskId: SimpleChange = changes.taskId;
    this.newComment = '';
    this.onDisable = true;
    // this.viewcomment = [];
    this.getComments(taskId.currentValue);
    this.viewCommentForm = new FormGroup({
      comment: new FormControl(null, Validators.required)
    });
  }

  private getComments(taskId) {
    ;
    this.viewcommentService.getViewComment(taskId).subscribe(resComments => {
      this.viewcomment = resComments.map(comment => {
        //comment.date = moment(comment.date).format('MM-DD-YYYY');

        return comment;
      });
    });
  }

  updateComment() {
    let obj = {
      'comment': this.newComment,
      'commentOwner': this.userId
    }
    this.newComment = '';
    this.viewcommentService.postViewComment(obj, this.taskId).subscribe(res => {
      this.getComments(this.taskId);
    })
  }

  validateComment(event) {
    const value = event.target.value;
    if (value.toString().trim().length < 1) {
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
    this.popContent.toggle(this.event);
  }

}
