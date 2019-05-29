import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabelRoutingModule } from './label-routing.module';
import { LabelComponent } from './label.component';

@NgModule({
  declarations: [LabelComponent],
  imports: [
    CommonModule,
    LabelRoutingModule
  ]
})
export class LabelModule { }
