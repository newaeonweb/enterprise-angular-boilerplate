import { NgModule } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent
  ],
  imports: [],
  exports: [
    FooterComponent,
    NavbarComponent
  ]
})
export class UiLayoutModule { }
