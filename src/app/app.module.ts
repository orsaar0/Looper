import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PadComponent } from './pad/pad.component';
import { PadsComponent } from './pads/pads.component';

@NgModule({
  declarations: [
    AppComponent,
    PadComponent,
    PadsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
