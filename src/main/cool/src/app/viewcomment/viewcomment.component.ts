import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HeaderService } from '../header/header.service';
import { ViewcommentService } from '../services/viewcomment.service';
import * as moment from 'moment';
@Component({
  selector: 'app-viewcomment',
  templateUrl: './viewcomment.component.html',
  styleUrls: ['./viewcomment.component.css']
})
export class ViewcommentComponent implements OnInit {
  @Input() userName:string;
  @Input() taskId:string;
  @Input() popContent;
   public onDisable =true;
   public addcomment =false;
   public showError = false;
   public newComment:string;
   public viewcomment;
   public owner;
   public userId:string;
   public currentuserName:any;
  postdata: Object;
  constructor(private viewcommentService:ViewcommentService,private headerService: HeaderService ) {
    this.owner= this.userName;
    console.log("the owner",this.owner);
    this.headerService.getCurrentUser().subscribe((user: any) => {
      this.userId = user;
      this.headerService.getUserInfo(user).subscribe((data: any) => {
        this.currentuserName = data[0].cn;
        console.log("currentuserName",this.currentuserName);
      });

    });
   }
  viewCommentForm: FormGroup;

  
// data=[
//   {
//   "comment":"Here will be the comment",
//   "date":"Dates will be here",
//   "owner":"who created this comment",
//   "commentId":"Comment ID will be here"
//   },
  
//   {
//   "comment":"Here will be the comment",
//   "date":"Dates will be here",
//   "owner":"who created this comment",
//   "commentId":"Comment ID will be here"
//   }
//   ]
  

  ngOnInit() { debugger;
    this.newComment  = '';
    this.onDisable =true;
    console.log("taskId in viewInit",this.taskId);
     this.viewcommentService.getviewComment(this.taskId).subscribe(data=>{
        this.viewcomment=data;
        console.log("getviewComment",this.viewcomment);
        for(let i=0;i<=this.viewcomment.length -1 ;i++ ){
          let newdate;
       newdate = this.dateFormat(this.viewcomment[i].date);
        this.viewcomment[i].date = newdate;
        }
   
     })

   
    
       
   

    this.viewCommentForm = new FormGroup({
      comment: new FormControl(null, Validators.required)
      
    });
  }

  dateFormat(inputDate: string) {
    return moment(inputDate).format('DD-MM-YYYY');
  }

  updateComment(){ debugger;
   
    console.log("hello");
    console.log("form values",this.viewCommentForm.value);
   let obj={
    "comment":this.newComment,
    "commentOwner":this.userId  
}
this.newComment  = '';
this.viewcommentService.postviewComment(obj,this.taskId).subscribe(res=>{
  console.log("postviewcomment",res);
  //this.postdata=res;
  console.log("postcall",this.postdata);
  this.viewcommentService.getviewComment(this.taskId).subscribe(data=>{
    this.viewcomment=data;
    console.log("getviewComment",this.viewcomment);
    for(let i=0;i<=this.viewcomment.length -1 ;i++ ){
      let newdate;
   newdate = this.dateFormat(this.viewcomment[i].date);
    this.viewcomment[i].date = newdate;
    }

 })
 // this.newComment.length=0;
  
})

console.log("postobj",obj);
//this.newComment.length=0;
   
  }

  onAddComment(event){
    let value = event.target.value;
    if(value.toString().length < 1){
      this.onDisable =true;
    }else{
      this.onDisable=false;
    }
    if(value.toString().length > 300){
     this.showError = true;
    }else{
      this.showError = false;
    }
    this.newComment = value;
    console.log("newcomment",this.newComment)

  }

  OnAddComment(){
    
    this.addcomment =true;
  }

  removeComment(){ 
    this.newComment  = '';
    this.onDisable= true;
    this.addcomment =false;

 this.popContent.close();
  }

}
