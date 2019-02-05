import { Component, OnInit,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-editfields',
  templateUrl: './editfields.component.html',
  styleUrls: ['./editfields.component.css']
})
export class EditfieldsComponent implements OnInit {
  @Output() onEdit = new EventEmitter();
  @Output() onDiscard = new EventEmitter();
  @Output() onSave = new EventEmitter();

  public showsave:boolean;
  public editbutton:boolean;

  constructor() { }

  ngOnInit() {
    this.showsave=false;
    this.editbutton =true;
  }

  editOffer(){
    this.showsave = true;
    this.onEdit.emit();
    this.editbutton =false;
  }

  DiscardChanges(){
    this.showsave = true;
    this.onDiscard.emit();

  }

  saveChanges(event){
    this.showsave = true;
    this.onSave.emit(event);
  }



}

