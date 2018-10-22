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
  MatSelectModule, MatSnackBarModule, MatSortModule, MatTable, MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    MatProgressBarModule,
    MatDialogModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
  ],
  exports: [
    MatProgressBarModule,
    MatDialogModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
  ]
})
export class MaterialIndexModule {
}
