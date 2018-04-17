import {InjectionToken, NgModule} from '@angular/core';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatExpansionModule,
  MatInputModule,
  MatMenuModule, MatPaginatorModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule, MatSortModule, MatTable, MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDialogModule,
    MatInputModule,
    MatExpansionModule,
    MatToolbarModule,
    MatDialogModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
    MatMenuModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  exports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDialogModule,
    MatInputModule,
    MatExpansionModule,
    MatToolbarModule,
    MatDialogModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
    MatMenuModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: []
})
export class MaterialIndexModule {
}
