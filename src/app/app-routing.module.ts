import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { ResponsesComponent } from './responses/responses.component';
import { TeamComponent } from './team/team.component';
import { NeighborhoodsComponent } from './neighborhoods/neighborhoods.component';
import { StrategyComponent } from './strategy/strategy.component';
import { IndicesComponent } from './indices/indices.component';
import { EventsComponent } from './events/events.component';
import { AboutContainerComponent } from './about/about-container.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutContainerComponent },
  { path: 'team', component: TeamComponent },
  { path: 'map', component: MapComponent },
  { path: 'responses', component: ResponsesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'neighborhoods', component: NeighborhoodsComponent },
  { path: 'indices', component: IndicesComponent },
  { path: 'strategy', component: StrategyComponent },
  { path: 'events', component: EventsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
