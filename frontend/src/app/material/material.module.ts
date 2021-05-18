import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const importsExports = [
  MatButtonModule,
  MatSnackBarModule,
];

@NgModule({
  declarations: [],
  imports: importsExports,
  exports: importsExports,
})
export class MaterialModule { }
