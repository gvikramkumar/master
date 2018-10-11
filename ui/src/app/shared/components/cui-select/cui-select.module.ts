import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuiSelectComponent } from './cui-select.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
	],
	declarations: [
		CuiSelectComponent,
	],
	exports: [
		CuiSelectComponent,
	],
})

export class CuiSelectModule {}
