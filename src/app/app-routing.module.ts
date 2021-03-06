import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';


const routes: Routes = [
 // { path: '', redirectTo: 'home', pathMatch: 'full' },
 // { path: '', pathMatch: 'full' },
 { path: 'map', component: MapComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
