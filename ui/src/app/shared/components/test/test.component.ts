import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fin-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  items = ['one', 'two', 'three'];
  arr = [];


  constructor() { }

  ngOnInit() {
  }

}
