import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CpuComponent } from './Components/cpu/cpu.component';
import { RamComponent } from './Components/ram/ram.component';

const routes: Routes = [
  {path:'RAM', component: RamComponent},
  {path:'CPU', component: CpuComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
