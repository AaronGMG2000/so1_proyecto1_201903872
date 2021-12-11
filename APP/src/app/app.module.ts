import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RamComponent } from './Components/ram/ram.component';
import { CpuComponent } from './Components/cpu/cpu.component';

@NgModule({
  declarations: [
    AppComponent,
    RamComponent,
    CpuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
