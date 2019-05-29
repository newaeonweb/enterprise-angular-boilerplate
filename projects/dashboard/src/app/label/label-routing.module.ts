import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LabelComponent } from './label.component';

const routes: Routes = [
  {
    path: 'label',
      children: [
      {
        path: '',
        component: LabelComponent
      },
      // {
      //   path: 'bands',
      //   component: BandsComponent
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabelRoutingModule { }
