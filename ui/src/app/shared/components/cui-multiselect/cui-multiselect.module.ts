import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuiMultiselectComponent } from './cui-multiselect.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
	],
	declarations: [
		CuiMultiselectComponent,
	],
	exports: [
		CuiMultiselectComponent,
	],
})

export class CuiMultiselectModule {}
