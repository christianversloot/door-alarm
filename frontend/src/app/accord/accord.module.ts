import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordRoutingModule } from './accord-routing.module';
import { AccordComponent } from './accord.component';
import { MaterialModule } from '../material/material.module';
import { AccordService } from './accord.service';
import { BrowserModule } from '@angular/platform-browser';;
import { HttpClientModule } from '@angular/common/http';


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
    HttpClientModule
  ]
})
export class AccordModule { }
