import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Store} from './store';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [Store]
})
export class StoreModule {

  constructor(store: Store) {
  }

}
