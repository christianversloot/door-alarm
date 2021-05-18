import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordRoutingModule } from './accord-routing.module';
import { AccordComponent } from './accord.component';
import { MaterialModule } from '../material/material.module';
import { AccordService } from './accord.service';


@NgModule({
  declarations: [
    AccordComponent
  ],
  providers: [
    AccordService
  ],
  imports: [
    CommonModule,
    AccordRoutingModule,
    MaterialModule,
  ]
})
export class AccordModule { }
