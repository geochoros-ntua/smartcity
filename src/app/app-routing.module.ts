import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';


const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'map', component: MapComponent }
];

// --> scrollPositionRestoration, for text scrolling restore to top

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
