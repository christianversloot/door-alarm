import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccordComponent } from './accord.component';

const routes: Routes = [{ path: '', component: AccordComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccordRoutingModule { }
